angular.module('radium').controller('qTableFilterPopup', function($scope) {
    var $ctrl = this;
    var $popupScope = $scope.$parent;
    $ctrl.columnTitle = $popupScope.popupData.columnTitle;
    $ctrl.filter = $popupScope.popupData.filter;

    $ctrl.response = function(apply) {
        if (apply) {
            $popupScope.popupResolve($ctrl.filter);
        } else {
            $popupScope.popupResolve(false);
        }
        $popupScope.popupElement.modal('hide');
    };
});
