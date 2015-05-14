/*
 * grunt-mochazo
 * https://github.com/comodinx/grunt-mochazo
 *
 * Copyright (c) 2015 Nicolas Molina
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
        all: [
            'Gruntfile.js',
            'tasks/*.js'
        ],
        options: {
            jshintrc: '.jshintrc'
        }
    },

    // Configuration to be run (and then tested).
    mochazo: {
        olx: {
            tests: ['test/search_test.js'],
            capabilities: {
                userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_0 like Mac OS X; en-us) AppleWebKit/528.18 (KHTML, like Gecko) Version/4.0 Mobile/7A341 Safari/528.16'
            }
        }
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['mochazo']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);
};
