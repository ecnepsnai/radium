angular.module('radium').factory('title', function() {
    return {
        set: function(val) {
            document.title = val + ' - Radium';
        }
    };
});
