var radium = angular.module('radium', ['ngRoute', 'angularMoment']);

radium.controller('radium', RadiumController);
function RadiumController($scope, state) {
    state.start().then(function(state) {
        $scope.ready = true;
        $scope.state = state;
    });
}

radium.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push(function() {
        return {
            responseError: function(err) {
                window.postMessage('notify:error:Error:' + (err.data.message || err.data.error.message), location.origin);
                throw err;
            }
        };
    });
}]);

radium.config(function($routeProvider, $locationProvider) {
    // Widgets
    $routeProvider.when('/widgets/', {
        template: '<widget-list></widget-list>'
    });
    $routeProvider.when('/widgets/widget/', {
        template: '<widget-edit></widget-edit>'
    });
    $routeProvider.when('/widgets/widget/:id/', {
        template: '<widget-view></widget-view>'
    });
    $routeProvider.when('/widgets/widget/:id/edit/', {
        template: '<widget-edit></widget-edit>'
    });

    // Options
    $routeProvider.when('/options/', {
        template: '<options-edit></options-edit>'
    });

    $locationProvider.html5Mode(true);
});
