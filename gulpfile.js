// yarn add --dev gulp gulp-sass gulp-rename gulp-replace
const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const replace = require('gulp-replace');

const scssFiles = [
  '**/*.scss',
  '!node_modules/**/*',
  '!miniprogram_npm/**/*',
];

function sassToWxss(src) {
  let dest = './';
  if (typeof src === 'string' && src.includes('/')) {
    dest = src.substring(0, src.lastIndexOf('/'));
  }

  return gulp.src(src)
    .pipe(sass())
    .on('error',function (e){
      console.error(e.message);
      this.end();
    })
    .pipe(rename({ extname: '.wxss' }))
    .pipe(replace(/(?<=\d{1})px/g, 'rpx'))
    .pipe(replace(/url\((["'])(.+?).(wxss|scss)(["'])\)/g, '$1$2.wxss$4'))
    .pipe(gulp.dest(dest));
}

gulp.task('sass', () => sassToWxss(scssFiles));

gulp.task('sass:watch', () => {
  // 粗粒度，整体全局编译
  // gulp.watch(scssFiles, gulp.series('sass'));
  // 细粒度, 仅编译改变的 scss， 不会编译相关的其他 scss
  const watcher = gulp.watch(scssFiles);
  watcher.on('change', (path) => sassToWxss(path));
  watcher.on('add', (path) => sassToWxss(path));
});