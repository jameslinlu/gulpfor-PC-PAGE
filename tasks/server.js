'use strict';

var gulp = require('gulp');
var url = require('url');
var fs = require('fs');
var connect = require('gulp-connect');
var httpProxy = require('http-proxy');

class ServerTask {

	constructor (name, cfg) {
		this.name = name;
		this.cfg = cfg;
		this.init();
	}

	init () {

		var self = this;
		var name = this.name;
		var cfg = this.cfg;
		
		//用于接口转发的proxy middleware
		var proxy = function(req, res, next) {

			var parsedUrl = url.parse(req.url);
			var pathname = parsedUrl.pathname;
			var protocol = parsedUrl.protocol;
			var host = cfg.proxyHost || parsedUrl.host;

			if (self.match(pathname, cfg.rules)) {

				var httpProxyServer = httpProxy.createProxyServer({});
				httpProxyServer.on('proxyReq', function(proxyReq, req, res, options) {
					proxyReq.setHeader('host', host);
				});

				httpProxyServer.on('proxyRes', function(proxyRes, req, res, options) {
					//通过设置特定的返回头部，解决调用线上接口的跨域问题
					proxyRes.headers['access-control-allow-origin'] = "*";
					proxyRes.headers['x-designed-by'] = "HarryShu";
				});

				httpProxyServer.on('error', function(e) {
					console.error(e);
				});

				httpProxyServer.web(req, res, {
					target: protocol + '://' + host
				});
				return;
			}

			next();
		}

		//server 的默认配置
		var defaults = {

			port: 8100,
			liveload: true,
			middleware: function(connect, opt) {
				return [
					proxy
				];
			}
		};

		gulp.task(name, function() {
			return connect.server(Object.assign(cfg, defaults));
		});
	}

	match (url, rules) {
		for (let i=0,len=rules.length; i<len; i++) {
			if (url.match(rules[i])) {
				return true
			}
		}
		return false;
	}
}

module.exports = ServerTask;