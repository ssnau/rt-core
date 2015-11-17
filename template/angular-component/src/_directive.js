(function(window, angular) {
  const component = angular.module('component-name', []);

  component.filter('myfilter', function() {
    return function() {
      return 'myfilter';
    };
  });

  component.factory('thingService', function() {
    return {
      sayHello: function() {
        return 'Hello!';
      },
    };
  });

  component.run(['$templateCache', function($templateCache) {
    $templateCache.put('templates/component.html', `
            "templateCache component"
        `);
  }]);

  component.directive('directive', function() {
    // Runs during compile
    return {
      // name: '',
      // priority: 1,
      // terminal: true,
      // scope: {}, // {} = isolate, true = child, false/undefined = no change
      // controller: function($scope, $element, $attrs, $transclude) {},
      // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
      // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
      // template: '',
      templateUrl: 'templates/component.html',
      // replace: true,
      // transclude: true,
      // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
      link: function($scope, iElm, iAttrs, controller) {
        $scope;
        iElm;
        iAttrs;
        controller;
      },
    };
  });
})(window, window.angular);