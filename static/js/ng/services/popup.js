angular.module("radium").factory("popup", function($window, $q, $compile, $rootScope, rand) {
    var newPopup = function(options) {
        return $q(function(resolve) {
            options.id = "popup-" + rand.ID();
            var cls = options.class || "";
            var popupHTML = '<div class="modal fade" id="' + options.id + '" tabindex="-1" role="dialog"><div class="modal-dialog ' + cls + '" role="document"><div class="modal-content">';
            popupHTML += options.template;
            popupHTML += "</div></div></div>";
            var modalData;
            $scope = $rootScope.$new(true);
            $scope.popupOptions = options;
            $scope.popupData = options.data;
            $scope.popupResolve = function(data) {
                modalData = data;
            };
            $("body").append($compile(popupHTML)($scope));
            var $modal = $("#" + options.id);
            $scope.popupElement = $modal;
            $modal.modal();
            $modal.on("hidden.bs.modal", function() {
                resolve(modalData);
            });
        });
    };
    return {
        /**
         * Create a new popup
         *
         * Options are:
         *  - class: string, extra class for the modal-dialog
         *  - template: string, the angularJS template
         *  - data: any, data to pass to the popup
         */
        new: newPopup,
        alert: function(title, body) {
            return newPopup({
                template: "<alert-popup></alert-popup>",
                data: {
                    title: title,
                    body: body
                }
            });
        },
        confirm: function(title, body, choices) {
            return newPopup({
                template: "<confirm-popup></confirm-popup>",
                data: {
                    title: title,
                    body: body,
                    choices: choices
                }
            });
        }
    };
});
