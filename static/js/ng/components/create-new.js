angular.module('radium').component('createNew', {
    bindings: {
        link: '<'
    },
    template: '<a ng-href="{{$ctrl.link}}" class="btn btn-sm btn-outline-primary"><i class="fas fa-plus"></i> Create New</a>'
});
