angular.module('radium').component('checkbox', {
    bindings: {
        label: '@',
        model: '='
    },
    controllerAs: '',
    template: '<input type="checkbox" class="form-check-input" id="{{ $ctrl.id }}" ng-model="$ctrl.model"><label class="form-check-label" for="{{ $ctrl.id }}">{{ $ctrl.label }}</label>',
    controller: function(rand) {
        var $ctrl = this;
        this.$onInit = function() {
            $ctrl.id = rand.ID();
        };
    }
});
