// generated on 2016-08-25 using generator-webapp 2.1.0
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const $ = gulpLoadPlugins();
const gutil = require('gulp-util');

gulp.task('scripts', ['templates'] ,(done) => {
	return gulp.src(['.tmp/templates.js', 'src/js/**/*.js'])
		.pipe($.babel()).on('error', (err) => {
      		gutil.log(gutil.colors.red('[Compilation Error]'));
      		gutil.log(gutil.colors.red(err.message));
      		done();
    	})
		.pipe($.concat('chicken-semantic-ui.js'))
		.pipe(gulp.dest('build'));
});

gulp.task('styles', [], () => {

	return gulp.src('src/sass/*.scss')
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.sass.sync({
			outputStyle: 'expanded',
			precision: 10,
			includePaths: ['.']
		}).on('error', $.sass.logError))
		.pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
		.pipe($.sourcemaps.write())
		.pipe(gulp.dest('build'));		

});

function lint(files, options) {
	return gulp.src(files)
		.pipe($.eslint(options))
		.pipe($.eslint.format());
}

gulp.task('lint', () => {
	return lint('src/**/js/*.js', {
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

	gulp.watch(['src/js/**/*.js', 'templates/**/*.hbs'], ['templates', 'scripts']);
	gulp.watch(['src/sass/*.scss'], ['styles']);
	
	
});

	





gulp.task('build', ['lint', 'scripts', 'styles']);

gulp.task('default', [], () => {
	gulp.start('build');
});
