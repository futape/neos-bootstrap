var path = require('path'),
	gulp = require('gulp'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	concat = require('gulp-concat-util'),
	babel = require('gulp-babel'),
	uglify = require('gulp-uglify'),
	del = require('del'),
	pump = require('pump');

var config = {
	dir: {
		bootstrap: {
			js: '../../../../../Libraries/twbs/bootstrap/js/src/'
		}
	},
	src: {
		scss: [
			'../Styles/main.scss'
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
config.src.js = [
	'../Javascript/jQuery/jquery-3.2.1.js',
	'../Javascript/Popper/popper.js',
	'../Javascript/Futape/bootstrapHeader.js',
	path.join(config.dir.bootstrap.js, 'util.js'),
	path.join(config.dir.bootstrap.js, 'alert.js'),
	path.join(config.dir.bootstrap.js, 'button.js'),
	path.join(config.dir.bootstrap.js, 'carousel.js'),
	path.join(config.dir.bootstrap.js, 'collapse.js'),
	path.join(config.dir.bootstrap.js, 'dropdown.js'),
	path.join(config.dir.bootstrap.js, 'modal.js'),
	path.join(config.dir.bootstrap.js, 'scrollspy.js'),
	path.join(config.dir.bootstrap.js, 'tab.js'),
	path.join(config.dir.bootstrap.js, 'tooltip.js'),
	path.join(config.dir.bootstrap.js, 'popover.js'),
	'../Javascript/Futape/bootstrapFooter.js',
	'../Javascript/Futape/onLoaded.js',
	'../Fusion/Alert/alert.js',
	'../Fusion/Card/card.js'
];

// CSS tasks

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

gulp.task('build:css:prod', ['sass:prod', 'autoprefix:prod']);
gulp.task('build:css:dev', ['sass:dev', 'autoprefix:dev'], function() {
	gulp.watch(config.watch.scss, ['sass:dev', 'autoprefix:dev']);
});

// JavaScript tasks

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
		sourcemaps.init(),
		concat(config.dest.js.file, {
			process: function(src) {
				return src.replace(/^(export|import).*/gm, '');
			}
		}),
		sourcemaps.write('.'),
		gulp.dest(config.dest.js.dir)
	], cb);
});

gulp.task('babel:prod', ['concat:prod'], function(cb) {
	pump([
		gulp.src(path.join(config.dest.js.dir, '*.js')),
		babel({
			presets: [
				[
					require.resolve('babel-preset-es2015'),
					{
						loose: true,
						modules: false
					}
				]
			],
			plugins: [
				require.resolve('babel-plugin-transform-es2015-modules-strip')
			]
		}),
		gulp.dest(config.dest.js.dir)
	], cb);
});
gulp.task('babel:dev', ['concat:dev'], function(cb) {
	pump([
		gulp.src(path.join(config.dest.js.dir, '*.js')),
		sourcemaps.init({
			loadMaps: true
		}),
		babel({
			presets: [
				[
					require.resolve('babel-preset-es2015'),
					{
						loose: true,
						modules: false
					}
				]
			],
			plugins: [
				require.resolve('babel-plugin-transform-es2015-modules-strip')
			]
		}),
		sourcemaps.write('.'),
		gulp.dest(config.dest.js.dir)
	], cb);
});

gulp.task('uglify:prod', ['babel:prod'], function(cb) {
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

gulp.task('build:js:prod', ['concat:prod', 'babel:prod', 'uglify:prod']);
gulp.task('build:js:dev', ['concat:dev', 'babel:dev'], function() {
	gulp.watch(config.watch.js, ['concat:dev', 'babel:dev']);
});

// Compound tasks

gulp.task('build:prod', ['build:css:prod', 'build:js:prod']);
gulp.task('build:dev', ['build:css:dev', 'build:js:dev']);

gulp.task('default', ['build:dev']);
