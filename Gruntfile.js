/**
 * @file
 * Grunt tasks.
 *
 * Run `grunt` for to process with dev settings.
 * Run `grunt prod` to process with prod settings.
 * Run `grunt watch` to start watching with dev settings.
 * phpcs:ignoreFile
 */

/* global module */

module.exports = function (grunt) {
  'use strict';
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    eslint: {
      src: [
        'js/**/*.js',
        '!js/**/*.min.js',
      ],
      options: {
        config: '.eslintrc.json'
      }
    },
    sasslint: {
      options: {
        configFile: '.sass-lint.yml',
        warningsAreErrors: true
      },
      target: [
        'scss/**/*.scss',
      ]
    },
    clean: ['.build'],
    concat: {
      options: {
        separator: '\n\n'
      },
      dist: {
        src: [
          'js/**/*.js',
        ],
        dest: '.build/js/scripts.min.js'
      }
    },
    sass: {
      dev: {
        files: {
          ['.build/css/styles.min.css']: 'scss/styles.scss'
        },
        options: {
          implementation: require('sass'),
          sourceMap: true,
          outputStyle: 'expanded'
        }
      },
      prod: {
        files: {
          ['.build/css/styles.min.css']: 'scss/styles.scss'
        },
        options: {
          implementation: require('sass'),
          sourceMap: false,
          outputStyle: 'compressed'
        }
      }
    },
    postcss: {
      options: {
        processors: [
          require('autoprefixer')()
        ]
      },
      dev: {
        map: true,
        src: '.build/css/styles.min.css'
      },
      prod: {
        map: false,
        src: '.build/css/styles.min.css'
      }
    },
    copy: {
      images: {
        expand: true,
        cwd: 'images/',
        src: '**',
        dest: '.build/images'
      },
      fonts: {
        expand: true,
        cwd: 'fonts/',
        src: '**',
        dest: '.build/fonts'
      }
    },
    watch: {
      scripts: {
        files: ['js/**/*.js'],
        tasks: ['concat'],
        options: {
          spawn: false
        }
      },
      styles: {
        files: [
          'scss/**/*.scss'
        ],
        tasks: ['sass:dev', 'postcss:dev'],
        options: {
          spawn: false
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('gruntify-eslint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-sass-lint');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('lint', ['eslint', 'sasslint']);
  grunt.registerTask('prod', ['clean', 'concat', 'sass:prod', 'postcss:prod', 'copy']);
  grunt.registerTask('dev', ['clean', 'concat', 'sass:dev', 'postcss:dev', 'copy']);
  grunt.registerTask('watch_message', function() {
    grunt.log.writeln('If using Chrome, make sure that "Disable cache (while DevTools is open)" setting is selected and DevTools are opened or browser will cache assets.');
  });
  grunt.registerTask('watch-dev', ['dev', 'watch_message', 'watch']);
  // By default, run grunt with prod settings.
  grunt.registerTask('default', ['prod']);
};
