// Algemene variabelen.
var app = "movie_night"; // Naam van de app.

// Alle paden naar de stijlsheets.
var standaardStijlsheetBron = "./sass/stylesheet.scss";
var stijlsheetBestemming = "./assets/css";

// De paden naar de Javascript bestanden.
var javascriptBron = "./assets/javascript/source/app.js";
var javascriptBestemming = "./assets/javascript/";

// Alles rondom membership pagina's
var uitsluitenBouwBestanden = [
  "./**",
  "!_distributie",
  "!_distributie/**",
  "!documentatie",
  "!documentatie/**",
  "!inc",
  "!inc/**",
  "!node_modules/**",
  "!*.json",
  "!gulpfile.js",
  "!*.DS_Store",
  "!*.gitignore",
  "!*.git",
  "!*.DS_Store",
  "!package.lock",
  "!README.md",
  "!.prettierignore",
  "!sass",
  "!sass/**",
  "!assets/javascript/source",
  "!assets/javascript/source/**",
];

var distributieProductieBestemming = "./_distributie/" + app + "/";
var distributieProductieVerwijderBestanden = [
  "./_distributie/" + app + "/",
  "./_distributie/" + app + "-package/",
  "./_distributie/" + app + ".zip",
  "./_distributie/" + app + "-package.zip",
];

/**
 * Laad alle noodzakelijke plugins.
 */
var webpack = require("webpack-stream");
var gulp = require("gulp");
var sass = require("gulp-sass")(require("sass"));
var verwijderen = require("del");
var berichtgeving = require("gulp-notify");
var kopieeren = require("gulp-copy");

/**
 * Hier beginnen de taken.
 */

// Verwijder alle cache bestanden
function verwijderCache(done) {
  cache.clearAll();
  done();
}
gulp.task(verwijderCache);


// Verwijder oude Productie bestanden
gulp.task("verwijderOudeProductieBestanden", function (done) {
  return verwijderen(distributieProductieVerwijderBestanden);
  done();
});

// Kopieeer Productie bestanden naar bestemming
gulp.task("kopieerenNaarProductie", function (done) {
  return gulp
    .src(uitsluitenBouwBestanden)
    .pipe(kopieeren(distributieProductieBestemming));
  done();
});

// Kopieeer Volledige kopie bestanden naar bestemming
gulp.task(
  "kopieerenProductieBestandenNaarUiteindelijkeBestemming",
  function (done) {
    return gulp
      .src(uitsluitenBouwBestanden)
      .pipe(kopieeren(distributieVolledigekopieUiteindelijkeBestemming));
    done();
  },
);

// Compileer de SASS bestanden naar een standaard stijlsheet.
gulp.task("compileerStandaardStijlsheet", function (done) {
  gulp
    .src(standaardStijlsheetBron)
    .pipe(
      sass({
        outputStyle: "compressed",
      }),
    )
    .pipe(gulp.dest(stijlsheetBestemming));
  done();
});

// Compileer de javascript bestanden en modules.
gulp.task("compileerJavascript", function () {
  return gulp
    .src(javascriptBron)

    .pipe(
      webpack({
        output: {
          filename: "app.js",
        },
      }),
    )
    .pipe(gulp.dest(javascriptBestemming));
});

// Voer alle acties uit en zet een kant-en-klaar thema in de distributie folder.
gulp.task(
  "compileer-javascript",
  gulp.series("compileerJavascript", function (done) {
    done();
  }),
);

gulp.task(
  "compileer-css",
  gulp.series(
    "compileerStandaardStijlsheet",
    function (done) {
      done();
    },
  ),
);

// Geef een seintje als alles klaar is.
gulp.task("bouwen-notitie", function (done) {
  return gulp.src("./").pipe(
    berichtgeving({
      message: "Het bouwen van de app is gelukt.",
      onLast: true,
    }),
  );
  done();
});

// Activeer alle acties voor de Prodcutie en maak 1 opdracht van.
gulp.task(
  "productie",
  gulp.series(
    "verwijderOudeProductieBestanden",
    "compileer-css",
    "compileer-javascript",
    "kopieerenNaarProductie",
    "bouwen-notitie",
    function (done) {
      done();
    },
  ),
);