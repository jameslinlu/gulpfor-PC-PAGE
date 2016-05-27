'use strict'

var gulp = require('gulp');
var util = require('gulp-util');
var revReplace = require('gulp-rev-replace');
var runSequence = require('run-sequence');
var TaskFactory = require('./task-factory');

var cfg = require('./config');

// 创建task集
var createTask = function(name, cfg) {

	gulp.task(name, function(callback) {
		runSequence.apply(this, [].concat(
				TaskFactory.create('clean', cfg.clean),
				TaskFactory.create('image', cfg.image),
				TaskFactory.create('html', cfg.html),
				TaskFactory.create('javascript', cfg.javascript),
				TaskFactory.create('style', cfg.style),
				cfg.custom ? cfg.custom() : [],
				TaskFactory.create('server', cfg.server),
				() => callback()
			));
	});
}

for (var env in cfg) {
	createTask(env, cfg[env]);
}

gulp.task('default', function() {
	util.log('gulp [deploy|develop] -- build the project with specified configuration');
});