"use strict";
// підключення модулів
const {src, dest} = require("gulp");
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cssbeautify = require("gulp-cssbeautify");
const removeComments = require('gulp-strip-css-comments');
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const cssnano = require("gulp-cssnano");
const rigger = require("gulp-rigger");
const uglify = require("gulp-uglify");
const plumber = require("gulp-plumber");
const imagemin = require("gulp-imagemin");
const del = require("del");
const panini = require("panini");
const browsersync = require("browser-sync").create();


/* Paths */
var path = {
    //папки куди все готове звалюється
    build: {
        html: "dist/",
        js: "dist/assets/js/",
        css: "dist/assets/css/",
        images: "dist/assets/img/",
        fonts: "dist/assets/fonts/"
    },
    //папки з вихідними файлами
    src: {
        html: "src/*.html",
        js: "src/assets/js/*.js",
        jsMin: "dist/assets/js/*.js",
        css: "src/assets/sass/style.sass",
        cssMin: "dist/assets/css/style.css",
        images: "src/assets/img/**/*.{jpg,png,svg,gif,ico}",
        fonts: "src/assets/fonts/**/*.*"
    },
    //папки за якими стежить галп
    watch: {
        html: "src/**/*.html",
        js: "src/assets/js/**/*.js",
        css: "src/assets/sass/**/*.sass",
        images: "src/assets/img/**/*.{jpg,png,svg,gif,ico}",
        fonts: "src/assets/fonts/**/*.*"
    },
    //папка в якій все стреться при перезбірці
    clean: "./dist"
}



/* Tasks */
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./dist/"
        },
        port: 3000
    });
}

function browserSyncReload(done) {
    browsersync.reload();
}

function html() {
    return src(path.src.html, { base: "src/" })
        .pipe(plumber())
        .pipe(rigger())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream());
}

function css() {
    return src(path.src.css, { base: "src/assets/sass/" })
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer({
            Browserslist: ['last 8 versions'],
            cascade: false
        }))
        .pipe(cssbeautify())
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream());
}

function cssMin() {
 return src(path.src.cssMin, { base: "dist/assets/css/" })
        .pipe(plumber())
        .pipe(cssnano({
            zindex: false,
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(removeComments())
        .pipe(rename({
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream());
}

function js() {
    return src(path.src.js, {base: "src/assets/js/"})
        .pipe(plumber())
        .pipe(rigger())
        .pipe(gulp.dest(path.build.js))
        .pipe(browsersync.stream());
}
function jsMin(){
    return src(path.src.jsMin, {base: "dist/assets/js/"})
        .pipe(plumber())
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min",
            extname: ".js"
        }))
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream());
}

function images() {
    return src(path.src.images)
        .pipe(imagemin())
        .pipe(dest(path.build.images));
}

function fonts() {
    return src(path.src.fonts)
        .pipe(dest(path.build.fonts));
}

function clean() {
    return del(path.clean);
}

function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.images], images);
    gulp.watch([path.watch.fonts], fonts);
}

//const build = gulp.series(clean, gulp.parallel(html, css, js, images));

const build = gulp.parallel(html, css, js);

//команда для повної перезбірки проекта(мімінізує файли зтискання картинок, копіювання шрифтів)
const buildAll = gulp.series(clean, html, css, cssMin, js, jsMin, images, fonts);
//команда для звичайної збірки (обновлення html css js автооновлення бравзера)
const watch = gulp.parallel(build, watchFiles, browserSync);





/* Exports Tasks */
exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.clean = clean;
exports.build = build;
exports.buildAll = buildAll;
exports.watch = watch;
exports.default = watch;
