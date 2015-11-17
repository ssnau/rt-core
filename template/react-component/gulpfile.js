var gulp = require('gulp');
var shelljs = require('shelljs');
var babel = require('gulp-babel');
var pkg = require('./package.json');
var cwd = __dirname;
var path = require('path');

function clean() {
  shelljs.rm('-rf', path.join(cwd, 'build'));
  shelljs.rm('-rf', path.join(cwd, 'lib'));
  shelljs.rm('-rf', path.join(cwd, 'assets/*.css'));
}

gulp.task('clean', clean);

// copy all the files except js/jsx/less/sass/scss/css to lib folder
gulp.task('copy', function () {
  return gulp.src([
    './src/**/*',
    '!./src/**/*.js',
    '!./src/**/*.jsx',
    '!./src/**/*.less',
    '!./src/**/*.scss',
    '!./src/**/*.sass',
    '!./src/**/*.css',
    ]).pipe(gulp.dest('./lib/'));
});

gulp.task('copy_assets', function() {
  var base = "./src/assets/";
  return gulp.src(base + '*.{eot,woff,woff2,ttf,svg,png,jpg,gif}')
    .pipe(gulp.dest('./assets/'));
});

gulp.task('css', function() {
  var through2 = require('through2');
  var base = "./src/assets/"
  var postcss = require('gulp-postcss');
  var autoprefixer = require('autoprefixer-core');
  var combiner = require('stream-combiner2');

<$$# less $$>
  var less = require('gulp-less');
  var combined = combiner.obj([
    gulp.src(base + '*.less'),
    less(),
    postcss([autoprefixer]),
    gulp.dest('./assets/')
  ]);
<$$/ less $$>

<$$# scss $$>
  var rename = require('gulp-rename');
  var combined = combiner.obj([
    gulp.src(base + '*.scss'),
    postcss([ require('precss')() ]),
    rename(function(p) {
      p.extname = ".css";
    }),
    gulp.dest('./assets/'),
  ]);
<$$/ scss $$>

<$$# postcss $$>
  var combined = combiner.obj([
    gulp.src(base + '*.css'),
    postcss([ require('cssnext')(), require('postcss-nested') ]),
    gulp.dest('./assets/'),
  ]);
<$$/ postcss $$>

<$$# css $$>
  var combined = combiner.obj([
    gulp.src(base + '*.css'),
    postcss([autoprefixer]),
    gulp.dest('./assets/'),
  ]);
<$$/ css $$>

  combined.on('error', console.error.bind(console));
  return combined;
});

gulp.task('css:watch', function () {
      gulp.watch('./src/assets/**', ['css']);
});

gulp.task('babel', ['clean'], function () {
  return gulp.src(['src/**.js',  'src/**/*.js', 'src/**.jsx', 'src/**/*.jsx'])
    .pipe(babel())
    .pipe(gulp.dest('lib'));
});

gulp.task('compile', ['copy', 'copy_assets', 'babel', 'css', 'build']);

gulp.task('publish', ['compile'], function (done) {
  var npm = 'npm ';
  // have to include $HOME path
  if (pkg.name.indexOf('@mtfe') > -1) npm = 'npm --registry=http://r.npm.sankuai.com --cache=$HOME/.npm/.cache/mnpm --userconfig=$HOME/.mnpmrc ';
  shelljs.exec(npm + ' publish', function () {
    clean();
    done();
  });
});

gulp.task('tag', function () {
  var version = pkg.version;
  shelljs.cd(cwd);
  shelljs.exec('git tag ' + version);
  shelljs.exec('git push origin ' + version + ':' + version);
  shelljs.exec('git push origin master:master');
});

gulp.task('server', function () {
    var child = require('child_process').exec('node_modules/.bin/rt serve -p 3001 --devport 9987');
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    return;
});

gulp.task('build', ['css'] , function() {
    // make sure it do not utilize babel transform
    shelljs.exec('NODE_ENV=production ./node_modules/.bin/rt build');
});

gulp.task('start', ['server', 'css', 'css:watch']);

gulp.task('pub', ['publish', 'tag']);
