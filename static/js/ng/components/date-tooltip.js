angular.module('radium').component('dateTooltip', {
    bindings: {
        date: '<',
        timestamp: '<'
    },
    controller: function($scope, $element, $attrs, $compile) {
        var that = this;
        this.$onInit = function() {
            var html;
            if (that.timestamp === undefined && that.date === undefined) {
                console.warn('Use of date-tooltip with no timestamp or date');
                html = '<span>Never</span>';
            } else {
                if (that.timestamp !== undefined) {
                    if (that.timestamp === 0) {
                        that.date = '0001-01-01T00:00:00Z';
                    } else {
                        var timestamp = that.timestamp;
                        if (timestamp < 1000000000000) {
                            timestamp = timestamp * 1000;
                        }
                        that.date = (new Date(parseInt(timestamp))).toISOString();
                    }
                }

                if (that.date === '0001-01-01T00:00:00Z') {
                    html = '<span>Never</span>';
                } else {
                    html = '<hover-tooltip class="a-little-to-the-left" tooltip-data="\'' + that.date + '\' | amDateFormat: \'dddd, MMMM Do YYYY, h:mm a\'">';
                    html += '<span am-time-ago="\'' + that.date + '\'"></span>';
                    html += '</hover-tooltip>';
                }
            }

            $element.html($compile(html)($scope));
        };
    }
});
