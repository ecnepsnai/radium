angular.module('radium').filter('duration', function() {
    function round(value, decimals) {
        return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }

    return function(input, uppercase) {
        if (input != undefined) {
            if (input < 10000000000) {
                return 'Less than 1 minute';
            }

            if (input > 600000000000) {
                nHours = round(input/600000000000, 2);
                return nHours + ' hours';
            }

            nSeconds = round(input/10000000000, 2);
            return nSeconds + ' minutes';
        }
    };
});
