     document.addEventListener('DOMContentLoaded', () => {
            // --- DATA ---
            const genres = ["Action", "Comedy", "Drama", "Sci-Fi", "Horror", "Thriller", "Romance", "Fantasy", "Animation", "Documentary", "Crime", "Mystery"];
            const streamingServices = ["Netflix", "Disney+", "Prime Video", "HBO Max", "Hulu", "Apple TV+"];

            // --- STATE ---
            let selectedGenres = [];
            let likedMovies = [];
            let selectedServices = [];

            // --- UI ELEMENTS ---
            const genreTagsContainer = document.getElementById('genre-tags');
            const serviceTagsContainer = document.getElementById('service-tags');
            const likedMovieInput = document.getElementById('liked-movie-input');
            const addLikedMovieBtn = document.getElementById('add-liked-movie-btn');
            const likedMoviesList = document.getElementById('liked-movies-list');
            const suggestBtn = document.getElementById('suggest-btn');
            const suggestionsContainer = document.getElementById('suggestions-container');
            const placeholder = document.getElementById('placeholder');
            const loading = document.getElementById('loading');

            // --- RENDER FUNCTIONS ---
            function renderGenreTags() {
                genreTagsContainer.innerHTML = '';
                genres.forEach(genre => {
                    const isSelected = selectedGenres.includes(genre);
                    const tag = document.createElement('span');
                    tag.textContent = genre;
                    tag.className = `tag cursor-pointer px-3 py-1 rounded-full text-sm font-medium ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`;
                    tag.addEventListener('click', () => toggleGenre(genre));
                    genreTagsContainer.appendChild(tag);
                });
            }

            function renderServiceTags() {
                serviceTagsContainer.innerHTML = '';
                streamingServices.forEach(service => {
                    const isSelected = selectedServices.includes(service);
                    const tag = document.createElement('span');
                    tag.textContent = service;
                    tag.className = `tag cursor-pointer px-3 py-1 rounded-full text-sm font-medium ${isSelected ? 'bg-teal-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`;
                    tag.addEventListener('click', () => toggleService(service));
                    serviceTagsContainer.appendChild(tag);
                });
            }
            
            function renderLikedMovies() {
                likedMoviesList.innerHTML = '';
                likedMovies.forEach(movie => {
                    const likedMovieTag = document.createElement('div');
                    likedMovieTag.className = 'bg-gray-600 text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm';
                    likedMovieTag.innerHTML = `
                        <span>${movie}</span>
                        <button data-movie="${movie}" class="remove-liked-movie-btn text-gray-400 hover:text-white">&times;</button>
                    `;
                    likedMoviesList.appendChild(likedMovieTag);
                });
                document.querySelectorAll('.remove-liked-movie-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => removeLikedMovie(e.target.dataset.movie));
                });
            }

            function renderSuggestions(suggestions) {
                suggestionsContainer.innerHTML = '';
                if (!suggestions || suggestions.length === 0) {
                    suggestionsContainer.innerHTML = `<div class="text-gray-500 col-span-full text-center py-16">
                        <h3 class="text-lg font-medium text-gray-400">No Matches Found</h3>
                        <p class="mt-1 text-sm text-gray-500">Couldn't find suggestions for that criteria. Try being less specific!</p>
                    </div>`;
                    return;
                }

                suggestions.forEach(movie => {
                    const card = document.createElement('div');
                    card.className = 'movie-card bg-gray-700 rounded-lg overflow-hidden shadow-md p-4 flex flex-col';
                    
                    const typeColor = movie.type === 'Movie' ? 'bg-blue-500' : 'bg-purple-500';
                    const servicePill = movie.streamingService ? `<span class="text-xs bg-teal-500 text-white px-2 py-1 rounded-full">${movie.streamingService}</span>` : '';

                    card.innerHTML = `
                        <div class="flex-grow">
                            <h3 class="text-xl font-bold text-white">${movie.title}</h3>
                            <div class="flex items-center justify-between mt-2 mb-3 gap-2">
                                <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${typeColor} text-white">
                                    ${movie.type}
                                </span>
                                ${servicePill}
                            </div>
                            <div class="flex flex-wrap gap-1 mt-2">
                                ${movie.genre.map(g => `<span class="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded-full">${g}</span>`).join('')}
                            </div>
                        </div>
                    `;
                    suggestionsContainer.appendChild(card);
                });
            }

            // --- LOGIC ---
            function toggleGenre(genre) {
                const index = selectedGenres.indexOf(genre);
                if (index > -1) selectedGenres.splice(index, 1);
                else selectedGenres.push(genre);
                renderGenreTags();
            }

            function toggleService(service) {
                const index = selectedServices.indexOf(service);
                if (index > -1) selectedServices.splice(index, 1);
                else selectedServices.push(service);
                renderServiceTags();
            }

            function addLikedMovie() {
                const movieTitle = likedMovieInput.value.trim();
                if (movieTitle && !likedMovies.includes(movieTitle)) {
                    likedMovies.push(movieTitle);
                    renderLikedMovies();
                    likedMovieInput.value = '';
                }
            }
            
            function removeLikedMovie(movieTitle) {
                likedMovies = likedMovies.filter(m => m !== movieTitle);
                renderLikedMovies();
            }

            async function getAISuggestions() {
                if (selectedGenres.length === 0 && likedMovies.length === 0 && selectedServices.length === 0) {
                    suggestionsContainer.innerHTML = `<div class="text-yellow-400 bg-yellow-900/50 border border-yellow-600 p-4 rounded-md col-span-full text-center">Please select at least one genre, liked movie, or service to get suggestions.</div>`;
                    return;
                }

                placeholder.classList.add('hidden');
                loading.classList.remove('hidden');
                suggestionsContainer.innerHTML = '';

                const prompt = `
                    Based on the following preferences, suggest 6 movies or TV series.
                    - Do not suggest any of the movies/series the user already likes.
                    - If streaming services are specified, only suggest titles available on one of those services.
                    - For each suggestion, specify which streaming service it is on if one was requested.
                    
                    Preferences:
                    - Preferred Genres: ${selectedGenres.join(', ') || 'Any'}
                    - Liked Movies/Series: ${likedMovies.join(', ') || 'None'}
                    - Available on Streaming Services: ${selectedServices.join(', ') || 'Any'}
                    
                    Provide the response as a JSON array of objects. Each object must have "title", "type" ('Movie' or 'Series'), and "genre" (an array of strings). If a streaming service is relevant, also include a "streamingService" field (e.g., "Netflix", "Prime Video").
                    Example: [{"title": "Inception", "type": "Movie", "genre": ["Sci-Fi", "Action", "Thriller"], "streamingService": "HBO Max"}]
                `;

                try {
                    let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
                    const payload = { 
                        contents: chatHistory,
                        generationConfig: {
                            responseMimeType: "application/json",
                            responseSchema: {
                                type: "ARRAY",
                                items: {
                                    type: "OBJECT",
                                    properties: {
                                        "title": { "type": "STRING" },
                                        "type": { "type": "STRING", enum: ["Movie", "Series"] },
                                        "genre": {
                                            "type": "ARRAY",
                                            "items": { "type": "STRING" }
                                        },
                                        "streamingService": { "type": "STRING" }
                                    },
                                    required: ["title", "type", "genre"]
                                }
                            }
                        }
                    };
                    const apiKey = ""; // API key is managed by the environment
                    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
                    
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

                    const result = await response.json();
                    
                    if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts[0]) {
                        const jsonText = result.candidates[0].content.parts[0].text;
                        const suggestions = JSON.parse(jsonText);
                        renderSuggestions(suggestions);
                    } else {
                        throw new Error("Invalid response structure from API.");
                    }
                } catch (error) {
                    console.error("Error fetching AI suggestions:", error);
                    suggestionsContainer.innerHTML = `<p class="text-red-400 col-span-full text-center py-16">Sorry, an error occurred while fetching suggestions. The AI might be busy. Please try again.</p>`;
                } finally {
                    loading.classList.add('hidden');
                }
            }

            // --- EVENT LISTENERS ---
            addLikedMovieBtn.addEventListener('click', addLikedMovie);
            likedMovieInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') addLikedMovie();
            });
            suggestBtn.addEventListener('click', getAISuggestions);

            // --- INITIALIZATION ---
            renderGenreTags();
            renderServiceTags();
        });