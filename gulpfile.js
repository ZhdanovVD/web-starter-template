// Универсальный Gulpfile с обработкой ESM/CommonJS совместимости
const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();

// Динамический импорт для ESM-пакетов
let sass, imagemin;

// Асинхронная инициализация ESM-модулей
async function loadESMModules() {
  try {
    if (!sass) {
      const sassModule = await import('gulp-sass');
      const dartSass = await import('sass');
      sass = sassModule.default(dartSass.default);
    }
    
    if (!imagemin) {
      const imageminModule = await import('gulp-imagemin');
      imagemin = imageminModule.default;
    }
  } catch (error) {
    console.error('Error loading ESM modules:', error);
    throw error;
  }
}

// Пути к файлам
const paths = {
  styles: {
    src: 'src/scss/**/*.scss',
    dest: 'dist/css/'
  },
  scripts: {
    src: 'src/js/**/*.js',
    dest: 'dist/js/'
  },
  images: {
    src: 'src/images/**/*',
    dest: 'dist/images/'
  },
  html: {
    src: 'src/*.html',
    dest: 'dist/'
  },
  fonts: {
    src: 'src/fonts/**/*',
    dest: 'dist/fonts/'
  }
};

// Обработка SCSS в CSS
async function styles() {
  await loadESMModules();
  
  return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

// Обработка JavaScript
function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

// Оптимизация изображений
async function images() {
  await loadESMModules();
  
  return gulp.src(paths.images.src)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.images.dest))
    .pipe(browserSync.stream());
}

// Копирование HTML
function html() {
  return gulp.src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
}

// Копирование шрифтов
function fonts() {
  return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
    .pipe(browserSync.stream());
}

// Сервер для разработки
function serve() {
  browserSync.init({
    server: {
      baseDir: './dist'
    },
    port: 3000,
    open: true
  });

  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.html.src, html);
  gulp.watch(paths.fonts.src, fonts);
}

// Сборка проекта
const build = gulp.parallel(styles, scripts, images, html, fonts);

// Экспорт задач
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.html = html;
exports.fonts = fonts;
exports.serve = serve;
exports.build = build;
exports.default = gulp.series(build, serve);