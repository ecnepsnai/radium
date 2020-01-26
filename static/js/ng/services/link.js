angular.module('radium').factory('link', function() {
    return {
        openInNewTab: function(url) {
            var a = $('<a href="' + url + '" target="_blank">View</a>');
            $('body').append(a);
            a[0].click();
            a.remove();
        }
    };
});
