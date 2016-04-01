'use strict';
module.exports = function(grunt) {

  grunt.initConfig({

    connect: {
      server: {
        options: {
          port: 8000,
          base: '',
          livereload: true
        }
      }
    },

    watch: {
      'src': {
        options: {
          livereload: true
        },
        files: ['src/**/*.js'],
        tasks: ['exec:build', 'exec:package']
      },
      'sass': {
        files: ['themes/**/*.scss'],
        tasks: ['sass'],
      },
      'css': {
        files: ['dist/css/*.css'],
        tasks: ['postcss', 'dataUri'],
      },
      'tests': {
        options: {
          livereload: true
        },
        files: ['test/**/*.js'],
        tasks: [],
      }
    },

    exec: {
      build: {
        command: 'browserify -s moobile -r ./src/main.js -o ./dist/js/moobile.js'
      },
      package: {
        command: 'browserify -s moobile -g uglifyify -r ./src/main.js -o ./dist/js/moobile.min.js'
      }
    },

    sass: {
      dist: {
        options: {
          trace: true,
          //style: 'compressed'
        },
        files: {
          'dist/css/moobile.css' : 'themes/moobile.scss',
          'dist/css/moobile.ios.css' : 'themes/moobile.ios.scss',
          'dist/css/moobile.android.css' : 'themes/moobile.android.scss'
        }
      }
    },

    postcss: {
      options: {
        map: true, // inline sourcemaps

        processors: [
          require('autoprefixer')({browsers: 'ios >= 7, android >= 4'}), // add vendor prefixes
        ]
      },
      dist: {
        src: ['dist/css/moobile.css', 'dist/css/moobile.ios.css', 'dist/css/moobile.android.css']
      }
    },

    dataUri: {
      dist: {
        src: ['dist/css/moobile.ios.css', 'dist/css/moobile.android.css'],
        dest: 'dist/css/',
        options: {
          target: ['dist/images/**/*.*'],
          // Do not inline any images larger 
          // than this size. 2048 is a size 
          // recommended by Google's mod_pagespeed. 
          maxBytes : 2048
   
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-data-uri');

  grunt.registerTask('default', ['connect','watch']);
  grunt.registerTask('build', ['sass', 'postcss', 'dataUri', 'exec:build', 'exec:package']);
};