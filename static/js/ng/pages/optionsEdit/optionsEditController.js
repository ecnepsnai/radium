angular.module('radium').controller('optionsEdit', function($http, notify, state, title) {
    var $ctrl = this;
    title.set('Options');
    $ctrl.loading = false;

    function getOptions() {
        return $http({
            method: 'GET',
            url: '/api/options'
        }).then(function successCallback(response) {
            return response.data.data;
        });
    }

    getOptions().then(function(options) {
        $ctrl.options = options;
        $ctrl.loaded = true;
    });

    $ctrl.save = function(valid) {
        if (!valid) {
            return;
        }

        $ctrl.loading = true;
        $http.post('/api/options', $ctrl.options).then(function() {
            $ctrl.loading = false;
            state.invalidate().then(function() {
                notify.success('Options Updated');
            });
        }, function() {
            $ctrl.loading = false;
        });
    };
});
