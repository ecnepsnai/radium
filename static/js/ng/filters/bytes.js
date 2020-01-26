angular.module('radium').filter('bytes', function() {
    var KB = 1024;
    var MB = 1024 * 1024;
    var GB = 1024 * 1024 * 1024;
    var TB = 1024 * 1024 * 1024 * 1024;

    function round(value, decimals) {
        return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }

    return function(input, uppercase) {
        if (input != undefined) {
            if (input > TB) {
                return round(input / TB, 2) + ' TiB';
            } else if (input == TB) {
                return '1 TiB';
            } else if (input > GB) {
                return round(input / GB, 2) + ' GiB';
            } else if (input == GB) {
                return '1 GiB';
            } else if (input > GB) {
                return round(input / GB, 2) + ' GiB';
            } else if (input == GB) {
                return '1 GiB';
            } else if (input > MB) {
                return round(input / MB, 2) + ' MiB';
            } else if (input == MB) {
                return '1 MiB';
            } else if (input > KB) {
                return round(input / KB, 2) + ' KiB';
            } else if (input == KB) {
                return '1 KiB';
            }

            return input + ' B';
        }
    };
});
