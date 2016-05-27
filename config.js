
// 前端项目编译配置文件Deploy版本

var path = require('path');
var gulp = require('gulp');
var revReplace = require('gulp-rev-replace');
var revAppend = require('gulp-rev-append');
var useref = require('gulp-useref');
var rev = require('gulp-rev');
var gulpIf = require('gulp-if');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');

//构建工具配置文件

//前端项目根目录
var ROOT_DIR = 'E:\\cgp\\cgpboss\\cgpboss-web\\cgpboss-mobile-web\\src\\main';
//前端项目源文件目录
var SRC_DIR = 'develop'
//前端项目开发版本目标目录
var DEV_DEST = 'dev';
//前端项目发布版本目标目录
var DEP_DEST = 'webapp';


// 前端构建流程

// 清理目标文件夹

// 编译压缩合并CSS

// 编译压缩合并js

// 压缩合并相关图片

// 拷贝相关资源文件

// 替换相关html内容

// 完成编译
var  develop=(function(){
	var src = path.join(ROOT_DIR, SRC_DIR);
	var dest = path.join(ROOT_DIR, DEV_DEST);
	var obj = {
			src: src,
			dest: dest,
			server: {
				name: 'webserver',
				root: src,
				proxyHost: 'portal.cloudguarder.com',
				rules: [
					/^\/api/
				]
			}
	}
    return obj;

})()


var deploy = (function() {

	var src = path.join(ROOT_DIR, SRC_DIR);
	var dest = path.join(ROOT_DIR, DEP_DEST);

	var obj = {
		src: src,
		dest: dest,

		clean: {
			name: 'cleanup',
			dest: dest
		},

		image: {
				name: 'images',
				src: [src+'/module/**/img/*.*', src+'/common/img/*.*'],
				dest: dest,
				base: src,
				plugins: {
				 	'imagemin': []
				}
			},
		javascript: [

			// {
			// 	name: 'common lib',
			// 	src: src + '/common/lib/**/*.*',
			// 	dest: dest,
			// 	base: src
			// },

			// //编译common模块js文件
			// {
			// 	name: 'common',
			// 	src: src + '/common/js/*.js',
			// 	dest: dest,
			// 	base: src,
			// 	plugins: {
			// 	 	'uglify': []
			// 	}
			// },

			//编译module模块js文件
			{
				name: 'module',
				src: src + '/module/**/js/*.js',
				dest: dest,
				base: src,
				plugins: {
					'uglify': [],
					'rev': [],
					'concat': ['all.js', {manifestFile: 'js-rev-manifest.json'}]
				}
			}
		],

		style: [

			//编译module模块css文件
			{
				name: 'module',
				src: src + '/module/**/less/*.css',
				dest: dest,
				base: src,
				plugins: {
					minify: [{compatibility: 'ie8'}],
					autoprefix: [],
					rev: []
				}
			}
		],

		html: [

			{
				name: 'views',
				src: [src + '/module/**/view/*.html', src + '/common/view/*.html'],
				dest: dest,
				base: src
			},

			{
				name: 'index.html',
				src: src + '/index.html',
				dest: dest,
				base: src,
				plugins: {
					useref: []
				}	
			}
		],

		// server: {
		// 	name: 'webserver',
		// 	root: dest,
		// 	proxyHost: 'portal.cloudguarder.com',
		// 	rules: [
		// 		/^\/api/
		// 	]
		// },

		//针对项目特殊的task定义
		custom: function() {

			// gulp.task('custom1', function() {
			// 	return gulp.src(src + '/index.html')
			// 		.pipe(revReplace({manifest: gulp.src(dest + '/css-rev-manifest.json')}))
			// 		.pipe(gulp.dest(dest));
			// });

			gulp.task('custom2', function() {
				return gulp.src(dest + '/common/js/*.js', {base: dest})
					.pipe(revReplace({manifest: gulp.src(dest + '/css-rev-manifest.json')}))
					.pipe(revReplace({manifest: gulp.src(dest + '/js-rev-manifest.json')}))
					.pipe(gulp.dest(dest));
			});

			// gulp.task('custom3', function() {
			// 	return gulp.src(src + '/index.html')
			// 		.pipe(revAppend())
			// 		.pipe(gulp.dest(dest));
			// });

			//index里面的依赖
			gulp.task('index-depend', function() {
				return gulp.src([dest+'/common/*/*.js',dest+'/common/*/*.css'])
				  	   .pipe(clean({force: true}))
					   .pipe(rev())
					   .pipe(gulpIf('*.js', uglify()))
					   .pipe(gulp.dest(dest+"/common"))
					   .pipe(rev.manifest('html-rev-manifest.json'))
					   .pipe(gulp.dest(dest)); 
			});
			gulp.task('index-dependdeal',['index-depend'], function() {
				return gulp.src(dest + '/index.html')
						.pipe(revReplace({manifest: gulp.src(dest + '/html-rev-manifest.json')}))
						.pipe(gulp.dest(dest));
					  	  
			});

			//转移dist文件夹内容到src文件夹中

			gulp.task('project-step1', function() {
				return gulp.src([src+'/WEB-INF/*'])
					  .pipe(gulp.dest(dest+'/WEB-INF')); 
			});
			gulp.task('project-step2', ['project-step1'],function() {
				return gulp.src([src+'/error.html',,src+'/README.md',src+'/test.jsp',src+'/test2.jsp',src+'/favicon.ico'])
					  .pipe(gulp.dest(dest)); 
			});


			return ['custom2','index-dependdeal','project-step2'];
		}
	}

	return obj
})();


module.exports = {
	deploy: deploy,
	develop: develop
}