angular.module('radium').factory('state', function($window, $q, $http) {
    var currentState;

    var statePromise = function() {
        return $http({ method: 'GET', url: '/api/state' }).then(function(response) {
            currentState = response.data.data;
            return response.data.data;
        }, function() {
            location.href = '/login?unauthorized';
        });
    };

    return {
        current: function() {
            return currentState;
        },
        start: statePromise,
        invalidate: function() {
            currentState = undefined;
            return statePromise();
        },
    };
});
