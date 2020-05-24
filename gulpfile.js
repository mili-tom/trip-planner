const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
//const babel = require('gulp-babel');
//const uglify = require('gulp-uglify');

function minifyCSS() {
  return gulp.src('src/css/*.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css'));
}
