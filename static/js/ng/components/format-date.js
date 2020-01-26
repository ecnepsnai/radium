angular.module('radium').component('formatDate', {
    bindings: {
        date: '<'
    },
    controller: function($scope, $element, $attrs) {
        var that = this;
        this.$onInit = function() {
            var date = new Date(that.date);

            $element.html(date.toLocaleString('en-US'));
        };
    }
});
