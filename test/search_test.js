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
