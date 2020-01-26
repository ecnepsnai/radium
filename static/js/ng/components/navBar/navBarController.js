angular.module('radium').controller('navBar', function($route, $location, $timeout) {
    var $ctrl = this;

    $ctrl.navClass = function(tab) {
        var matches = $location.path().startsWith(tab);
        return { active: matches };
    };

    function doNavigate(href) {
        if ($location.path() === href) {
            $route.reload();
        } else {
            $location.url(href);
        }
    }

    $ctrl.navigate = function(href) {
        if (document.documentElement.clientWidth > 990) {
            doNavigate(href);
            return;
        }

        $ctrl.isLoading = true;
        $timeout(function() {
            $ctrl.isLoading = false;
            doNavigate(href);
        }, 300);
    };
});
