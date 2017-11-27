
// Gulp Setup file
var autoprefixer 	= require('gulp-autoprefixer'),
		cache         = require('gulp-cache'),
    cssnano       = require('gulp-cssnano'),
		concat        = require('gulp-concat'),
		connect 			= require('gulp-connect'),
		gulp 					= require('gulp'),
    html          = require('gulp-minify-html'),
		imagemin      = require('gulp-imagemin'),
		minifycss 		= require('gulp-minify-css'),
		notify        = require('gulp-notify'),
		rename 				= require('gulp-rename'),
    sass          = require('gulp-sass'),
		uglify        = require('gulp-uglify'),
    browserSync   = require('browser-sync').create();

var currentdate = new Date();
var datetime = currentdate.getDate() + "/"
               + (currentdate.getMonth()+1)  + "/"
               + currentdate.getFullYear() + " @ "
               + currentdate.getHours() + ":"
               + currentdate.getMinutes() + ":"
               + currentdate.getSeconds();

// Basic Gulp task syntax
gulp.task('hello', function() {
  console.log('\n######################################################################## \n Hello Thomas! You started this gulpfile at: ' + datetime + ' \n########################################################################');
})

// Process & Minify HTML
gulp.task('html', function(){
  return gulp.src('src/**/*.html')
    .pipe(html({
      collapseWhitespace: true,
    }))
    .pipe(gulp.dest('dist'))
    .pipe(notify({ message: '\n_______________________________________________________\n %%% HTML COMPILED %%%' + '\n_______________________________________________________' }))
    .pipe(browserSync.reload({
      stream: true
    }));
})

// Compile SASS & Minify CSS
gulp.task('sass', function(){
  return gulp.src(['src/sass/**/*.scss'])
    .pipe(sass())
    .pipe(gulp.dest('dist/css'))
		.pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
		.pipe(gulp.dest('dist/css'))
    .pipe(notify({ message: '\n_______________________________________________________\n %%% SASS COMPILED %%%\n_______________________________________________________' }))
    .pipe(browserSync.reload({ // Reloading with Browser Sync
      stream: true
    }));
});

// Compile Javascript & Minify
gulp.task('javascript', function() {
	return gulp.src('src/javascript/application.js')
		.pipe(concat('application.js'))
		.pipe(gulp.dest('dist/js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify().on('error', function(e){
				console.log(e);
		 }))
		 .pipe(gulp.dest('dist/js'))
     .pipe(notify({ message: '\n_______________________________________________________\n %%% JAVASCRIPT  COMPILED %%%\n_______________________________________________________' }))
     .pipe(browserSync.reload({ // Reloading with Browser Sync
       stream: true
     }));
})

// Compress Images
gulp.task('images', function(){
  return gulp.src('src/images/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin({
        interlaced: true
      })))
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'))
    .pipe(notify({ message: '\n_______________________________________________________\n %%% IMAGES MINFIED %%%\n_______________________________________________________' }))
})

// Livereload to browser
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: './dist'
    },
  })
})

// Watch & Rerun Gulp
gulp.task('watch', ['browserSync', 'sass', 'html', 'images', 'javascript'], function() {
  gulp.watch('src/sass/**/*.scss', ['sass']);
  gulp.watch('src/javascript/application.js', ['javascript']);
  gulp.watch('src/index.html', ['html']);
  gulp.watch('src/images/**/*.+(png|jpg|gif|svg)', ['images']);
});

// Initalize
gulp.task('default', ['watch'], function() {
	gulp.start('hello','html', 'sass', 'javascript', 'images');
});
