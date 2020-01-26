angular.module('radium').factory('sanitize', function() {
    return {
        html: function(v) {
            return $('<div/>').text(v).html();
        },
        fileName: function(v) {
            var ret = v
                .replace(' ', '_')
                .replace('/', '')
                .replace('\\', '')
                .replace(':', '')
                .replace('*', '')
                .replace('?', '')
                .replace('"', '')
                .replace('<', '')
                .replace('>', '')
                .replace('|', '');
            if (ret.lastIndexOf('.', 0) === 0) {
                ret = ret.substr(1);
            }
            return ret;
        }
    };
});
