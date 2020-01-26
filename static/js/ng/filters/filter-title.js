angular.module('radium').filter('filterTitle', function() {
    return function(input, uppercase) {
        if (input != undefined) {
            if (input.AndQuery) {
                return input.Query + ' & ' + input.AndQuery.join(' & ');
            }
            return input.Query;
        }
    };
});
