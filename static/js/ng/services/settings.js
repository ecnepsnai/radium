angular.module('radium').factory('settings', function() {
    return {
        get: function(key) {
            return JSON.parse(window.localStorage.getItem(key));
        },
        set: function(key, value) {
            window.localStorage.setItem(key, JSON.stringify(value));
        },
        remove: function(key) {
            window.localStorage.removeItem(key);
        },
        clear: function() {
            window.localStorage.clear();
        }
    };
});
