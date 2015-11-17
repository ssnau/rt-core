import angular from 'angular';

require('<$$& appName $$>/assets/index.css');

// demo module dependencies
angular.module('ng.ui.demos', [require('<$$& appName $$>')]);

// demo.js
angular.module('ng.ui.demos')
.controller('ctrl', function() {

});

const root = document.getElementById('__component-content');
angular.bootstrap(root, ['ng.ui.demos']);
