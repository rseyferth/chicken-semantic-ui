// generated on 2016-08-25 using generator-webapp 2.1.0
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const $ = gulpLoadPlugins();
const gutil = require('gulp-util');

gulp.task('scripts', ['templates'] ,(done) => {
	return gulp.src(['.tmp/templates.js', 'src/**/*.js'])
		.pipe($.babel()).on('error', (err) => {
      		gutil.log(gutil.colors.red('[Compilation Error]'));
      		gutil.log(gutil.colors.red(err.message));
      		done();
    	})
		.pipe($.concat('chicken-semantic-ui.js'))
		.pipe(gulp.dest('build'));
});

function lint(files, options) {
	return gulp.src(files)
		.pipe($.eslint(options))
		.pipe($.eslint.format());
}

gulp.task('lint', () => {
	return lint('src/**/*.js', {
		fix: true
	})
	.pipe(gulp.dest('src/'));
});


gulp.task('templates', () => {

	return gulp.src(['templates/**/*.hbs'], { dot: false })
	    .pipe($.angularTemplatecache({
	      templateHeader: '/** START TEMPLATES **/\n',
	      templateFooter: '\n/** END TEMPLATES **/',
	      templateBody: 'Chicken.Dom.View.TemplateCache.set(\'<%= url %>\', \'<%= contents.split(/\\n/).join(\'\') %>\');',
	      transformUrl: (url) => {
	      	return 'semantic-ui:' + url.split('/').join('.').replace(/\.hbs$/, '');
	      },
	      filename: 'templates.js'      
	    }))
	    .pipe(gulp.dest('.tmp'));


});


gulp.task('watch', () => {

	gulp.watch(['src/**/*.js', 'templates/**/*.hbs'], ['templates', 'scripts']);
	
	
});

	





gulp.task('build', ['lint', 'scripts']);

gulp.task('default', [], () => {
	gulp.start('build');
});
