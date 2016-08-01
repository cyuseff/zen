'use strict';

const watchify = require('watchify');
const browserify = require('browserify');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const gutil = require('gulp-util');
const sourcemaps = require('gulp-sourcemaps');
const assign = require('lodash.assign');

const server = require('gulp-server-livereload');
const babelify = require('babelify');
const uglify = require('gulp-uglify');
const iife = require("gulp-iife");

const sass = require('gulp-sass');
const concat = require('gulp-concat');
const watch = require('gulp-watch');

// add custom browserify options here
const customOpts = {
  entries: ['./src/index.js'],
  debug: true,
  fullPaths: true,
  extensions: ['.jsx']
};
const opts = assign({}, watchify.args, customOpts);
const b = watchify(browserify(opts));

// add transformations here
b.transform(babelify);

gulp.task('js', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('zen-demo.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
    // Add transformation tasks to the pipeline here.
    .pipe(iife())
    .pipe(uglify())
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./public/js/'));
}


gulp.task('serve', () => {
  gulp.src('./public/')
    .pipe(server({
      livereload: {
        enable: true,
        filter(filePath, cb) {
          if(/zen-demo.js/.test(filePath)) {
            cb(true);
          } else if(/zen-demo.css/.test(filePath)) {
            cb(true);
          }
        }
      },
      open: true,
      defaultFile: 'index.html'
    }));
});

gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('zen-demo.css'))
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('watch', function () {
  gulp.watch('./sass/**', ['sass']);
});

gulp.task('default', ['js', 'serve', 'sass', 'watch']);
