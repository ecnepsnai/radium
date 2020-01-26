angular.module('radium').component('renderHtml', {
    bindings: {
        input: '<',
    },
    controllerAs: '',
    controller: function($element) {
        var $ctrl = this;
        this.$onInit = function() {
            $element.append(angular.element($ctrl.input));
        };
    }
});
