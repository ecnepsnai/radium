angular.module('radium').component('hoverTooltip', {
    bindings: {
        tooltipData: '<'
    },
    controller: function($scope, $element, $attrs, $timeout) {
        var that = this;
        var id = 'hover' + Math.round(Math.random() * 10000);
        this.$onInit = function() {
            $element.addClass('hover');
            $element.attr('data-toggle', 'tooltip');
            $element.attr('title', that.tooltipData);
            $element.attr('id', id);
        };
        this.$postLink = function() {
            $timeout(function() {
                $('#' + id).tooltip();
            });
        };
    }
});
