<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Movie Night - persoonlijke aanbevelingen voor de beste films en series</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <meta name="apple-mobile-web-app-title" content="Movie Night" />
    <link rel="manifest" href="/site.webmanifest" />
    <link rel="stylesheet" href="bijgevoegd/css/stylesheet.css">

</head>
<body class="bg-gray-900 text-white">

    <div class="container mx-auto p-4 md:p-8">
        <!-- Header -->
        <header class="text-center mb-8 md:mb-12">
            <h1 class="text-4xl md:text-5xl font-bold text-white tracking-tight">Movie Night</h1>
            <p class="text-gray-400 mt-2 text-lg">Persoonlijke aanbevelingen voor de beste films en series</p>
        </header>

        <main class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Input Section -->
            <div class="md:col-span-1 bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 class="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Voorkeuren</h2>
                
                <!-- Genre Selection -->
                <div>
                    <h3 class="text-lg font-medium mb-3">1. Kies je favoriete genre:</h3>
                    <div id="genre-tags" class="flex flex-wrap gap-2">
                        <!-- Genre tags will be dynamically inserted here -->
                    </div>
                </div>

                <!-- Liked Movies/Series Input -->
                <div class="mt-6">
                    <h3 class="text-lg font-medium mb-3">2. Films/series die je leuk vindt:</h3>
                    <div class="flex gap-2">
                        <input type="text" id="liked-movie-input" class="flex-grow bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Inception, Breaking Bad">
                        <button id="add-liked-movie-btn" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition-colors">Voeg toe</button>
                    </div>
                    <div id="liked-movies-list" class="mt-3 flex flex-wrap gap-2"></div>
                </div>
                
                <!-- Streaming Service Selection -->
                <div class="mt-6">
                    <h3 class="text-lg font-medium mb-3">3. Kies je streaming dienst:</h3>
                    <div id="service-tags" class="flex flex-wrap gap-2">
                        <!-- Service tags will be dynamically inserted here -->
                    </div>
                </div>

                <!-- Suggest Button -->
                <div class="mt-8">
                     <button id="suggest-btn" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md text-lg transition-transform transform hover:scale-105">
                        <i class="fa-duotone fa-regular fa-popcorn"></i> Ik wil tips
                    </button>
                </div>
            </div>

            <!-- Suggestions Section -->
            <div class="md:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 class="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Alle suggesties voor jou</h2>
                <div id="suggestions-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                     <div id="placeholder" class="text-gray-500 col-span-full text-center py-16">
                        <svg class="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.55a2 2 0 01.35 3.55l-6.8 6.8a2 2 0 01-2.83 0l-6.8-6.8a2 2 0 01.35-3.55L9 10m0 0v10m0-10L6 7m3 3L9 4m6 6l3-3m-3 3l-3-3" />
                        </svg>
                        <h3 class="mt-2 text-sm font-medium text-gray-400">Er zijn nog geen aanbevelingen</h3>
                        <p class="mt-1 text-sm text-gray-500">Hier verschijnen de films/series.</p>
                      </div>
                </div>
                 <div id="loading" class="hidden col-span-full text-center py-16">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                    <p class="mt-4 text-gray-400">Op zoek naar aanbevelingen...</p>
                </div>
            </div>
        </main>

        <!-- Footer -->
        <footer class="text-center mt-8 md:mt-12 text-gray-500 text-sm">
            <p>&copy; 2025 Thijs Moens. Alle rechten voorbehouden.</p>
        </footer>
    </div>

    <script src="bijgevoegd/javascript/app.js"></script>
</body>
</html>
