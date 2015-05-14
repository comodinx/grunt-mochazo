/*
 * grunt-mochazo
 * https://github.com/comodinx/grunt-mochazo
 *
 * Copyright (c) 2015 Nicolas Molina
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var async = require('async');
var hooker = require('hooker');
var Mocha = require('mocha');
var Browser = require('zombie');
var isHookedUp = false;

module.exports = function(grunt) {

    grunt.registerMultiTask('mochazo', 'Run Zombie JS and Mocha with Grunt', function mochazoTask() {
        var done = this.async();
        var base = process.cwd();
        var options = this.options({
            reporter: 'spec',
            ui: 'bdd',
            slow: 75,
            bail: false,
            grep: null,
            timeout: 1000000,
            output: null
        });
        var capabilities = this.data.capabilities;
        var isLastTask = grunt.task._queue.length - 2 === 0;
        var uncaughtExceptionHandlers;
        var mocha;
        var fd;

        if (!this.data.tests) {
            grunt.fail.warn('You must specify a test files.');
        }

        mocha = new Mocha(options);
        grunt.file.setBase(base);
        grunt.file.expand(this.data.tests).forEach(mocha.addFile.bind(mocha));

        if (!isHookedUp) {
            if (options.output) {
                fs.mkdirsSync(path.dirname(options.output));
                fd = fs.openSync(options.output, 'w');
            }

            hooker.hook(process.stdout, 'write', {
                pre: function(result) {
                    if (fd) {
                        fs.writeSync(fd, result);
                    }
                    if (options.quiet) {
                        return hooker.preempt();
                    }
                }
            });
            isHookedUp = true;
        }

        uncaughtExceptionHandlers = process.listeners('uncaughtException');
        process.removeAllListeners('uncaughtException');

        function unmanageExceptions() {
            uncaughtExceptionHandlers.forEach(process.on.bind(process, 'uncaughtException'));
        }

        function wrapperNext(callback, args) {
            return function next() {
                this.call(null, null, Array.prototype.slice.call(arguments)[0]);
            }.bind(callback, args);
        }

        async.waterfall([
            function start(callback) {
                grunt.log.debug('Init ZombieJS instance');
                GLOBAL.browser = new Browser(capabilities);
                wrapperNext(callback)();
            },

            function run(args, callback) {
                grunt.log.debug('Run Mocha tests');
                mocha.run(wrapperNext(callback));
            },

            function success(args, callback) {
                grunt.log.debug('Handle test results');
                unmanageExceptions();
                GLOBAL.browser.destroy();
                GLOBAL.browser = null;
                wrapperNext(callback, args)();
            },

            function finish(args, callback){
                grunt.log.debug('Finish grunt task', args);
                done(args);
                callback();
                if (isLastTask) {
                    if (fd) {
                        fs.closeSync(fd);
                    }
                    hooker.unhook(process.stdout, 'write');
                }
            }
        ]);
    });
};
