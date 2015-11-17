var tpl = require('../lib/template');
var assert = require('assert');

describe('key to value', function () {
    it('template should replace simple ', function () {
        var t = "my name is <$$name$$>, i am <$$age$$> years old";
        assert.equal(
            'my name is jack, i am 12 years old', 
            tpl(t, {name: 'jack', age: 12})
        );
    });

    it('template should replace multi-occurrence ', function () {
        var t = "my name is <$$name$$>, my name is <$$name$$> again";
        assert.equal(
            'my name is jack, my name is jack again', 
            tpl(t, {name: 'jack', age: 12})
        );
    });
});

describe('condition', function () {
    it('template should deal with condition', function () {
        var t = `<$$#css$$>hello css<$$/css$$><$$#less$$>hello less<$$/less$$>`;
        assert.equal(
            'hello css', 
            tpl(t, {css: true})
        );

        assert.equal(
            'hello less', 
            tpl(t, {less: true})
        );

    });
});

describe('edge case', function () {
    it('test @mtfe', function() {
        var t = '{name: "<$$& name $$>"}';
        assert.equal(
            '{name: "@mtfe/react-abc"}',
            tpl(t, {name: '@mtfe/react-abc'})
        );
    

    });
});
