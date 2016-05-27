'use strict';

var gulp = require('gulp');
var gulpIf = require('gulp-if');
var uglify = require('gulp-uglify');
var minify = require('gulp-clean-css');
var useref = require('gulp-useref');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');


class HtmlTask {

	constructor (name, cfg) {
		this.name = name;
		this.cfg = cfg;
		this.init();
	}

	init () {
		var name = this.name;
		var cfg = this.cfg;
		var plugins = cfg.plugins || [];
		gulp.task(name, function() {
			return gulp.src(cfg.src, {base: cfg.base})
				.pipe(gulpIf(plugins.hasOwnProperty('useref'), useref.apply(this, plugins['useref'])))
				.pipe(gulp.dest(cfg.dest));
		});
	}
}

module.exports = HtmlTask;