const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const cache = require('gulp-cache');
const cp = require('child_process');
const browserSync = require('browser-sync').create();

const jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';

// Build the Jekyll Site
function jekyllBuild(done) {
  return cp.spawn(jekyll, ['build'], { stdio: 'inherit' }).on('close', done);
}

// Rebuild Jekyll and page reload
function jekyllRebuild(done) {
  browserSync.reload();
  done();
}

// Wait for jekyll-build, then launch the Server
function serve(done) {
  browserSync.init({
    server: {
      baseDir: '_site'
    },
    notify: false
  });
  done();
}

// Compile files
function compileSass() {
  return gulp.src('assets/css/scss/main.scss')
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(gulp.dest('_site/assets/css'))
    .pipe(browserSync.stream())
    .pipe(gulp.dest('assets/css'));
}

// Compression images
function compressImages() {
  return gulp.src('assets/img/**/*')
    .pipe(cache(imagemin({
      interlaced: true,
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngquant()]
    })))
    .pipe(gulp.dest('_site/assets/img'))
    .pipe(browserSync.stream());
}

// Watch scss, html, img files
function watchFiles() {
  gulp.watch('assets/css/scss/**/*.scss', compileSass);
  gulp.watch('assets/js/**/*.js', gulp.series(jekyllBuild, jekyllRebuild));
  gulp.watch('assets/img/**/*', compressImages);
  gulp.watch(['*.html', '_layouts/*.html', '_includes/*.html', '_pages/*.html', '_posts/*'], gulp.series(jekyllBuild, jekyllRebuild));
}

// Define complex tasks
const build = gulp.series(jekyllBuild, gulp.parallel(compileSass, compressImages));
const watch = gulp.parallel(watchFiles, serve);

// Export tasks
exports.sass = compileSass;
exports.img = compressImages;
exports.jekyllBuild = jekyllBuild;
exports.jekyllRebuild = jekyllRebuild;
exports.build = build;
exports.watch = watch;
exports.default = watch;
