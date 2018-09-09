const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('babel', () =>
	gulp.src('script.js')
	.pipe(babel({
		presets: ['@babel/env']
	}))
	.pipe(gulp.dest('compiled/'))
);

gulp.task('watch', () => {
	gulp.watch('script.js', ['babel']);
});