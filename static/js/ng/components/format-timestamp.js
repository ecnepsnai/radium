angular.module('radium').component('formatTimestamp', {
    bindings: {
        ts: '<'
    },
    controller: function($scope, $element, $attrs) {
        var that = this;
        this.$onInit = function() {
            var date = new Date(parseInt(that.ts) * 1000);


            $element.html(date.toLocaleString('en-US'));
        };
    }
});
