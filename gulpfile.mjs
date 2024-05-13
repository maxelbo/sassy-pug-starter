import gulp from 'gulp';
import pug from 'gulp-pug';
import sass from 'gulp-sass';
import dartSass from 'sass';
import cleanCSS from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import { deleteAsync as del } from 'del';
import browserSync from 'browser-sync';

const sassProcessor = sass(dartSass);
const bs = browserSync.create();

// Define paths
const paths = {
  pug: 'src/views/pages/**/*.pug',
  sass: 'src/styles/**/*.scss',
  js: 'src/scripts/**/*.js',
  img: 'src/assets/img/**',
  pdf: 'src/assets/pdf/**',
  dist: 'dist',
};

// Clean task using deleteAsync from del
export async function clean() {
  return del([
    `${paths.dist}/**`,
    `!${paths.dist}/img`,
    `!${paths.dist}/img/**/*`,
    `!${paths.dist}/pdf`,
    `!${paths.dist}/pdf/**/*`,
  ]);
}

// Compile Pug to HTML
export function pugTask() {
  console.log('Recompiling Pug files...');
  return gulp
    .src(paths.pug)
    .pipe(pug({ doctype: 'html', pretty: true, selfClosingTags: false }))
    .pipe(gulp.dest(`${paths.dist}`))
    .on('end', () => {
      console.log('Pug compilation complete. Triggering BrowserSync reload...');
      bs.reload();
    });
}

// Compile Sass to CSS
export function sassTask() {
  return gulp
    .src(paths.sass)
    .pipe(sassProcessor().on('error', sassProcessor.logError))
    .pipe(autoprefixer())
    .pipe(
      cleanCSS({ compatibility: 'ie8', debug: true }, (details) => {
        console.log(
          `${details.name}: Original size=${details.stats.originalSize} - Minified size=${details.stats.minifiedSize}`
        );
      })
    )
    .pipe(gulp.dest(`${paths.dist}/assets/css`))
    .pipe(bs.stream());
}

// Copy JS
export function jsTask() {
  return gulp
    .src(paths.js)
    .pipe(gulp.dest(`${paths.dist}/assets/js`))
    .pipe(bs.stream());
}

// Watch task
export function watchTask() {
  bs.init({
    server: {
      baseDir: paths.dist,
    },
  });
  gulp.watch(paths.pug, pugTask);
  gulp.watch(paths.sass, sassTask);
  gulp.watch(paths.js, jsTask);
}

// Default task
const build = gulp.series(clean, gulp.parallel(pugTask, sassTask, jsTask));
export const watch = gulp.series(build, watchTask);
export default build;
