
'use strict';

var gulp = require('gulp');
var util = require('gulp-util');
var del = require('del');

class CleanTask {

	constructor (name, cfg) {
		this.name = name;
		this.cfg = cfg;
		this.init();
	}

	init () {
		var name = this.name;
		var cfg = this.cfg;
		gulp.task(name, function () {
			return del.sync(cfg.dest, {force: true});
		});
	}
}

module.exports = CleanTask;