'use strict';

var gulp = require('gulp');
var gulpIf = require('gulp-if');
var rev = require('gulp-rev');
var concat = require('../plugins/concat');
var uglify = require('gulp-uglify');
var util = require('gulp-util');

class javascriptTask {

	constructor (name, cfg) {
		this.name = name;
		this.cfg = cfg;
		this.init();
	}

	init () {
		var name = this.name;
		var cfg = this.cfg;
		var plugins = cfg.plugins || {};
		gulp.task(name, function() {
			return gulp.src(cfg.src, {base: cfg.base})
				.pipe(gulpIf(plugins.hasOwnProperty('uglify'), uglify.apply(this, plugins['uglify'])))
				.pipe(gulpIf(plugins.hasOwnProperty('rev'), rev.apply(this, plugins['rev'])))
				.pipe(gulpIf(plugins.hasOwnProperty('concat'), concat.apply(this, plugins['concat'] || ['bugfix'])))
				.pipe(gulp.dest(cfg.dest));
		});
	}
}

module.exports = javascriptTask;