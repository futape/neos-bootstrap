var path = require('path'),
	gulp = require('gulp'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	concat = require('gulp-concat-util'),
	composer = require('gulp-uglify/composer'),
	uglifyjs = require('uglify-es'),
	uglify = composer(uglifyjs, console),
	del = require('del'),
	pump = require('pump');

var config = {
		src: {
			scss: [
				'../Styles/main.scss'
			],
			js: [
				'../Javascript/jQuery/jquery-3.2.1.js',
				'../Javascript/Popper/popper.js',
				'../Javascript/Futape/bootstrapHeader.js',
				'../Javascript/Bootstrap/util.js',
				'../Javascript/Bootstrap/alert.js',
				'../Javascript/Bootstrap/button.js',
				'../Javascript/Bootstrap/carousel.js',
				'../Javascript/Bootstrap/collapse.js',
				'../Javascript/Bootstrap/dropdown.js',
				'../Javascript/Bootstrap/modal.js',
				'../Javascript/Bootstrap/scrollspy.js',
				'../Javascript/Bootstrap/tab.js',
				'../Javascript/Bootstrap/tooltip.js',
				'../Javascript/Bootstrap/popover.js',
				'../Javascript/Futape/bootstrapFooter.js',
			]
		},
		dest: {
			css: '../../Public/Styles/',
			js: {
				dir: '../../Public/Javascript/',
				file: 'main.js'
			}
		},
		watch: {
			scss: [
				'../Styles/**/*.scss'
			],
			js: [
				'../Javascript/**/*.js'
			]
		}
	};

gulp.task('clean:css', function() {
	return del(path.join(config.dest.css, '*'), {
		force: true
	});
});

gulp.task('sass:prod', ['clean:css'], function(cb) {
	pump([
		gulp.src(config.src.scss),
		sass({
			outputStyle: 'compressed'
		}),
		gulp.dest(config.dest.css)
	], cb);
});

gulp.task('sass:dev', ['clean:css'], function(cb) {
	pump([
		gulp.src(config.src.scss),
		sourcemaps.init(),
		sass(),
		sourcemaps.write('.'),
		gulp.dest(config.dest.css)
	], cb);
});

gulp.task('autoprefix:prod', ['sass:prod'], function(cb) {
	pump([
		gulp.src(path.join(config.dest.css, '*.css')),
		autoprefixer(),
		gulp.dest(config.dest.css)
	], cb);
});

gulp.task('autoprefix:dev', ['sass:dev'], function(cb) {
	pump([
		gulp.src(path.join(config.dest.css, '*.css')),
		sourcemaps.init({
			loadMaps: true
		}),
		autoprefixer(),
		sourcemaps.write('.'),
		gulp.dest(config.dest.css)
	], cb);
});

gulp.task('clean:js', function() {
	return del(path.join(config.dest.js.dir, '*'), {
		force: true
	});
});

gulp.task('concat:prod', ['clean:js'], function(cb) {
	pump([
		gulp.src(config.src.js),
		concat(config.dest.js.file, {
			process: function(src) {
				return src.replace(/^(export|import).*/gm, '');
			}
		}),
		gulp.dest(config.dest.js.dir)
	], cb);
});

gulp.task('concat:dev', ['clean:js'], function(cb) {
	pump([
		gulp.src(config.src.js),
		sourcemaps.init({
			loadMaps: true
		}),
		concat(config.dest.js.file, {
			process: function(src) {
				return src.replace(/^(export|import).*/gm, '');
			}
		}),
		sourcemaps.write('.'),
		gulp.dest(config.dest.js.dir)
	], cb);
});

gulp.task('uglify:prod', ['concat:prod'], function(cb) {
	pump([
		gulp.src(path.join(config.dest.js.dir, '*.js')),
		uglify({
			mangle: false,
			output: {
				comments: '/^!/'
			}
		}),
		gulp.dest(config.dest.js.dir)
	], cb);
});

gulp.task('build:css:prod', ['sass:prod', 'autoprefix:prod']);
gulp.task('build:css:dev', ['sass:dev', 'autoprefix:dev'], function() {
	gulp.watch(config.watch.scss, ['sass:dev', 'autoprefix:dev']);
});

gulp.task('build:js:prod', ['concat:prod', 'uglify:prod']);
gulp.task('build:js:dev', ['concat:dev'], function() {
	gulp.watch(config.watch.js, ['concat:dev']);
});

gulp.task('build:prod', ['build:css:prod', 'build:js:prod']);
gulp.task('build:dev', ['build:css:dev', 'build:js:dev']);

gulp.task('default', ['build:dev']);
