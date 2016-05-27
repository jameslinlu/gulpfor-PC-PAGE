'use strict';

var gulp = require('gulp');
var gulpIf = require('gulp-if');
var less = require('gulp-less');
var rev = require('gulp-rev');
var minify = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var util = require('gulp-util');
var concat = require('gulp-concat');

class StyleTask {

	constructor (name, cfg) {
		this.name = name;
		this.cfg = cfg;
		this.init();
	}

	init () {
		var name = this.name;
		var cfg = this.cfg;
		var plugins = cfg.plugins || [];
		gulp.task(name, function () {
			return gulp.src(cfg.src, {base: cfg.base})
				.pipe(gulpIf(plugins.hasOwnProperty('less'), less.apply(this, plugins['less'])))
				.pipe(gulpIf(plugins.hasOwnProperty('minify'), minify.apply(this, plugins['minify'])))
				.pipe(gulpIf(plugins.hasOwnProperty('autoprefix'), autoprefixer.apply(this, plugins['autoprefix'])))
				.pipe(gulpIf(plugins.hasOwnProperty('concat'), concat.apply(this, plugins['concat'] || ['bugfix'])))
				.pipe(gulpIf(plugins.hasOwnProperty('rev'), rev.apply(this, plugins['rev'])))
				.pipe(gulp.dest(cfg.dest))
				.pipe(gulpIf(plugins.hasOwnProperty('rev'), rev.manifest('css-rev-manifest.json')))
				.pipe(gulp.dest(cfg.dest));
		});
	}
}

module.exports = StyleTask;