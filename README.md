fluxでの開発を見据えて、gulpを使った開発環境を作ってみた。

## 前提知識

- gulp
- ES6(ES2015)

## 材料

- [gulp](http://gulpjs.com/)...自動タスク管理ツール
- [Browsersync](https://www.browsersync.io/)...ブラウザの自動リロード
- [browserify](http://browserify.org/)...依存物をバンドル
    - [babelify](https://github.com/babel/babelify)...browserifyのプラグイン。ES6やReactの変換に使う
    - [watchify](https://github.com/substack/watchify)...同じくbrowserifyのプラグイン。gulpのwatchタスクとの似ているが、コードの差分を監視する。
- [source-vinyl-stream](https://www.npmjs.com/package/vinyl-source-stream)...与えたファイルの形式をgulpが扱うことのできるvinyl形式にしてくれる。

## 各レシピ

#### Browsersync
``baseDir``で対象のディレクトリ、``index``でエントリーのファイルを指定する。
```js
gulp.task('browserSync', () => {
  browserSync({
    server: {
      baseDir: './',
      index: 'index.html'
    }
  });
});
```

``reload``を定義する。
```js
gulp.task('reload', () => {
  browserSync.reload();
});
```

``watch``で監視し、ファイルに変更があれば``reload``タスクを実行。
```js
gulp.watch('./index.html',  ['reload']);
```

#### browserify
``compile``関数の定義。babelifyのプリセットでReact、ES6をコンバート指定。
watchifyで監視するファイルを指定。
```js
function compile(isWatch) {
  var bundler = watchify(browserify('./scripts/main.js', { debug: true }).transform(babelify, {presets: ["es2015", "react"]}));

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('build.js'))
      .pipe(gulp.dest('./build'));
  }

  if (isWatch) {
    bundler.on('update', function() {
      console.log('bundling js...');
      rebundle();
    });
  }

  rebundle();
}
```
``watch``関数で``compile``を呼び出す。
```js
function watch() {
  return compile(true);
};
```
``gulp``タスクの定義。
```js
gulp.task('build', function() { return compile(); });
gulp.task('watch', function() { return watch(); });
```

## できたもの
``gulpfile.babel.js``
```js
import gulp from 'gulp';
import browserSync from 'browser-sync';
import browserify from 'browserify';
import babelify from 'babelify';
import watchify from 'watchify';
import source from 'vinyl-source-stream';

function compile(watch) {
  var bundler = watchify(browserify('./scripts/main.js', { debug: true }).transform(babelify, {presets: ["es2015", "react"]}));

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('build.js'))
      .pipe(gulp.dest('./build'));
  }

  if (watch) {
    bundler.on('update', function() {
      console.log('bundling js...');
      rebundle();
    });
  }

  rebundle();
}

function watch() {
  return compile(true);
};

gulp.task('build', function() { return compile(); });
gulp.task('watch', function() { return watch(); });

gulp.task('browserSync', () => {
  browserSync({
    server: {
      baseDir: './',
      index: 'index.html'
    }
  });
});

gulp.task('reload', () => {
  browserSync.reload();
});

gulp.task('default', ['browserSync','watch'], () => {
  gulp.watch('./index.html',  ['reload']);
  gulp.watch('./scripts/*.*', ['reload']);
  gulp.watch('./build/build.js', ['reload']);
  gulp.watch('./styles/*.*', ['reload']);
});
```
