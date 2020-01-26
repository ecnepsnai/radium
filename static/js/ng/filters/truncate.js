angular.module('radium').filter('truncate', function() {
    return function(input, uppercase) {
        if (input != undefined) {
            if (input.length > 100) {
                return input.substring(0, 100) + '...';
            }
            return input;
        }
    };
});
