angular.module("radium").filter("sanitize", function(sanitize) {
    return function(input, uppercase) {
        if (input != undefined) {
            return sanitize.html(input);
        }
    };
});
