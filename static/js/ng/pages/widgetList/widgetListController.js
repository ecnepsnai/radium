angular.module('radium').controller('widgetList', function($http, popup, notify, title) {
    var $ctrl = this;
    title.set('Widgets');

    $ctrl.tableModel = {
        columns: [
            {
                title: 'Name',
                property: 'Name',
                format: function(widget) {
                    return '<a href="/widgets/widget/' + widget.ID + '">' + widget.Name + '</a>';
                },
                sortable: true,
                filterable: true,
            }
        ],
        menu: [
            {
                title: 'Edit',
                icon: 'fas fa-edit',
                link: function(widget) {
                    return '/widgets/widget/' + widget.ID;
                }
            },
            {
                title: 'Delete',
                icon: 'fas fa-trash',
                action: function(widget) {
                    $ctrl.deleteWidget(widget);
                }
            }
        ]
    };

    function getWidgets() {
        $ctrl.loading = true;
        return $http({
            method: 'GET',
            url: '/api/widgets'
        }).then(function successCallback(response) {
            $ctrl.loading = false;
            return response.data.data;
        });
    }

    $ctrl.loadData = function() {
        getWidgets().then(function(widgets) {
            if (widgets) {
                $ctrl.widgets = widgets;
            } else {
                $ctrl.widgets = [];
            }

            $ctrl.widgets.forEach(function(widget) {
                widget.Queries = (widget.Query || []).join(', ');
            });
        });
    };
    $ctrl.loadData();

    $ctrl.deleteWidget = function(widget) {
        popup.confirm('Delete Widget', 'Are you sure you want to delete this widget?', ['Delete', 'Cancel']).then(function(result) {
            if (result) {
                $http.delete('/api/widgets/widget/' + widget.Name).then(function(response) {
                    $ctrl.loadData();
                    notify.success('Widget Deleted');
                });
            }
        });
    };
});
