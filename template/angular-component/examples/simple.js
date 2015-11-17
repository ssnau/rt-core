import angular from 'angular';

require('<$$& appName $$>/assets/index.css');

// demo module dependencies
angular.module('ng.ui.demos', [require('<$$& appName $$>')]);

// demo.html
const tpl = `
<div class="ng-cloak">
    <div data-directive></div>
</div>
`;

// demo.js
angular.module('ng.ui.demos')
.controller('ctrl', function() {

});

function render() {
  const root = document.getElementById('__component-content');
  root.innerHTML = tpl;
  angular.bootstrap(root, ['ng.ui.demos']);
}

render();