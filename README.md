# grunt-mochazo

> grunt-mochazo is a grunt plugin to run [Zombie](http://zombie.js.org) tests with [Mocha](http://mochajs.org)

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out
the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains
how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as
install and use Grunt plugins. Once you're familiar with that process, you may
install this plugin with this command:

```shell
npm install grunt-mochazo --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile
with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-mochazo');
```

## The "mochazo" task

### Overview
In your project's Gruntfile, add a section named `mochazo` to the data
object passed into `grunt.initConfig()`.

_Run this task with the `grunt mochazo` command._

```js
grunt.initConfig({
    mochazo: {
        olx: {
            // (Optional) Your options for mocha.
            options: {...},

            // (Optional) Your options for zombie browser. Using when `new Browser(capabilities)`
            capabilities: {...},

            // (Required) Your test files.
            tests: ['test/search_test.js']
        }
    }
});
```

### Options

#### output
Type: `String`
Default: *null*

If set grunt-mochazo will pipe reporter output into given file path

For more options see [Mocha options](http://mochajs.org#usage)

### Usage Examples

#### Required Options
In this example, the minimum required options are used to execute a simple
test script.

```js
grunt.initConfig({
    mochazo: {
        olx: {
            tests: ['test/search_test.js'],
            capabilities: {
                userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_0 like Mac OS X; en-us) AppleWebKit/528.18 (KHTML, like Gecko) Version/4.0 Mobile/7A341 Safari/528.16'
            }
        }
    }
});
```

The corresponding *Hello World* test script is using Mochazo to search the
keyword _auto_ on OLX. The global `browser` variable lets you access
your client instance.

```js
'use strict';

describe('OLX search test', function () {
    it('checks if title contains the search query', function(done) {
        browser.visit('http://www.olx.com.ar', {
                duration: 100000
            })
            .then(stepFill)
            .catch(done);

        function stepFill() {
            browser.fill('[name=search]', 'auto');
            browser.pressButton('#search [type=submit]')
                .then(stepCheck)
                .catch(done);
        }

        function stepCheck() {
            browser.assert.text('title', /.*auto.*/);
            done();
        }
    });
});
```

## Contributing
Please fork, add specs, and send pull requests! In lieu of a formal styleguide, take care to
maintain the existing coding style.
