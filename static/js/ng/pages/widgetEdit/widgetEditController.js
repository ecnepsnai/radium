angular.module('radium').controller('widgetEdit', function($route, $http, $location, title, notify) {
    var $ctrl = this;
    $ctrl.loading = false;

    if ($location.path() === '/widgets/widget/') {
        $ctrl.isNew = true;
        $ctrl.title = 'New Widget';
        title.set($ctrl.title);
        $ctrl.widget = {
            Query: [],
            Filters: [],
        };

        $ctrl.loaded = true;
    } else {
        $ctrl.title = 'Edit Widget';
        title.set($ctrl.title);
        var id = $route.current.params.id;
        var getWidget = $http.get('/api/widgets/widget/' + id);
        getWidget.then(function(response) {
            $ctrl.widget = response.data.data;
            if ($ctrl.widget.Filters === null) {
                $ctrl.widget.Filters = [];
            }
            $ctrl.loaded = true;
        });
        $ctrl.isNew = false;
    }

    $ctrl.save = function(isValid) {
        if (!isValid) {
            return;
        }

        var savePromise;
        if ($ctrl.isNew) {
            savePromise = $http.put('/api/widgets/widget', $ctrl.widget).then(function(response) {
                return response.data.data;
            });
        } else {
            savePromise = $http.post('/api/widgets/widget/' + $ctrl.widget.ID, $ctrl.widget).then(function(response) {
                return response.data.data;
            });
        }
        $ctrl.loading = true;
        savePromise.then(function(widget) {
            $ctrl.loading = false;
            $location.url('/widgets/widget/' + widget.ID);
            notify.success('Widget Saved');
        }, function() {
            $ctrl.loading = false;
        });
    };
});
