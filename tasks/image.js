'use strict';

var gulp = require('gulp');
var gulpIf = require('gulp-if');
var util = require('gulp-util');
var imagemin = require('gulp-imagemin');


class ImageTask {

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
			return  gulp.src(cfg.src,{base: cfg.base})
					// .pipe(gulpIf(plugins.hasOwnProperty('imagemin'), imagemin.apply(this, plugins['imagemin'])))
					.pipe(gulp.dest(cfg.dest));
		});
	}
}

module.exports = ImageTask;