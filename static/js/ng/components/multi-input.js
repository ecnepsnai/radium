angular.module('radium').component('multiInput', {
    bindings: {
        model: '=',
        isRequired: '<',
        placeholder: '<',
        maximum: '<'
    },
    controller: function($scope, $element, $attrs, $compile, rand) {
        var that = this;
        this.$onInit = function() {
            var id = rand.ID();
            var $ctrl = $scope.$new(true);
            if (that.maximum) {
                $ctrl.maximum = that.maximum;
            }
            if (that.model !== undefined && that.model !== null && that.model.length > 0) {
                $ctrl.items = that.model.map(function(v) {
                    return {
                        value: v
                    };
                });
            } else {
                $ctrl.items = [{
                    value: ''
                }];
            }
            $ctrl.$watch('items', function(newVal, oldVal) {
                if (newVal && newVal != oldVal) {
                    var values = newVal.map(function(item) {
                        return item.value;
                    });
                    values = values.filter(function(value) {
                        if (value == undefined) {
                            return false;
                        }
                        return value.length > 0;
                    });
                    that.model = values;
                }
            }, true);
            $ctrl.addRow = function(idxAt) {
                $ctrl.items.splice(idxAt + 1, 0, {
                    value: ''
                });
            };
            $ctrl.removeRow = function(idx) {
                $ctrl.items.splice(idx, 1);
            };
            $ctrl.canAddNew = function(idx) {
                if ($ctrl.maximum === undefined) {
                    return true;
                }

                return $ctrl.items.length < $ctrl.maximum;
            };
            var html = '<div ng-repeat="item in items">' +
                '<div class="input-group mb-3 mult_' + id + '">' +
                '<input type="text" class="form-control" placeholder="' + (that.placeholder || '') + '"';
            if (that.isRequired) {
                html += ' ng-required="$first" ';
            }
            html += ' ng-model="item.value">' +
                '<div class="input-group-append">' +
                '<button class="btn btn-outline-secondary" type="button" ng-if="canAddNew($index)" ng-click="addRow($index)"><i class="fas fa-plus"></i></button>' +
                '<button class="btn btn-outline-secondary" type="button" ng-if="!$first" ng-click="removeRow($index)"><i class="fas fa-times"></i></button></div></div></div>';
            $element.append($compile(html)($ctrl));
        };
    }
});
