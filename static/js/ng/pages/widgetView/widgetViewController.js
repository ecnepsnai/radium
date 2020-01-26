angular.module('radium').controller('widgetView', function($http, $route, title) {
    var $ctrl = this;
    title.set('View Widget');
    var id = $route.current.params.id;
    var getWidget = $http.get('/api/widgets/widget/' + id).then(function(response) {
        return response.data.data;
    });

    $ctrl.loading = true;
    getWidget.then(function(widget) {
        $ctrl.widget = widget;
        $ctrl.title = widget.Name;
        title.set('View Widget: ' + widget.Name);
        $ctrl.loading = false;
    });
});
