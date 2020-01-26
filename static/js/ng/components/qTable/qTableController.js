/**
 * qTable is a angularJS enabled table
 *
 * Usage:
 * <q-table model="model" data="data"></q-table>
 *
 * Model:
 * {
 *    columns: [
 *        {
 *            // Column title
 *            title: 'Title',
 *
 *            // Property from the object. Only required if you're not supplying a format function
 *            property: 'Name',
 *
 *            // Format function, return html (uncompiled) for the row.
 *            // $rowScope will have
 *            // - `item`: The row object
 *            // - `index`: The index of the row
 *            format: function(item, $rowScope) {
 *                return '';
 *            }
 *
 *            // Value function to return an unformatted value. Used for filtering and/or sorting.
 *            value: function(item) {
 *                return '';
 *            }
 *
 *            // If this column can be filtered. If set to true, requres 'property' or 'value' to be defined
 *            filterable: true,
 *
 *            // If this column can be sorted. If set to true, requires 'property' or 'value' to be defined
 *            sortable: true,
 *        }
 *    ],
 *    menu: [
 *        {
 *            title: 'Edit', // Menu item title
 *            icon: 'fas fa-edit', // Menu item icon class
 *            link: function(row) { // Href if the menu item is a link
 *                return '';
 *            },
 *            show: function(row) { // Optional method to determine if the row should be shown or not
 *                return true;
 *            },
 *            action: function(row) { // Function to call on click, alternative to link
 *                foo(row);
 *            }
 *        }
 *    ],
 *    options: { // Optional options for the table
 *        disabledRow: function(row) { // Optional method to mark a row as disabled
 *            return !row.Enabled;
 *        },
 *        notResponsive: true // Disable responsive tables
 *    }
 * }
 *
 * Data: Must be an array of objects
 */
angular.module('radium').controller('qTable', function($scope, $element, $compile, $location, popup, rand, settings, state) {
    var $ctrl = this;

    // <URL path (stripped of slashes)>.<position of table in page>.<system version>
    // Version is used to reset sort/filter settings between updates, should a columns settings change
    var tableID = location.pathname.replace(/\//g, '') + '.' + $($element[0]).index() + '.' + state.current().Version;

    var $tableScope = $scope.$new(true);
    $tableScope.tableID = tableID;
    $tableScope.filters = {};

    var $table = angular.element('<table class="table table-sm q-table" data-qtable-id="' + tableID + '">');
    var $thead = angular.element('<thead>');
    var $tbody = angular.element('<tbody id="' + tableID + '_body">');

    function buildTableHeader() {
        $thead.empty();
        var $headRow = angular.element('<tr>');

        $ctrl.model.columns.forEach(function(column, idx) {
            var html = '<th class="q-table-th">';
            if (column.sortable) {
                html += '<div class="q-table-th-wrap" ng-click="headerClick(' + idx + ')">';
            } else {
                html += '<div class="q-table-th-wrap"">';
            }
            html += '<span>' + column.title + '</span>';
            html += '<span>';
            if (column.sortable) {
                html += '<i class="q-table-sort-icon" ng-class="headerSortButtonClass(' + idx + ')"></i>';
            }
            if (column.filterable) {
                html += '<i class="fas fa-filter" ng-class="headerFilterButtonClass(' + idx + ')" ng-if="!activeFilter(' + idx + ')" ng-click="headerOptionsClick(' + idx + '); $event.stopPropagation();"></i>';
            }
            html += '</span>';
            html += '</div></th>';
            var elm = $compile(html)($tableScope);
            if (column.sortable) {
                elm.toggleClass('sortable', true);
            }
            $headRow.append(elm);
        });
        if ($ctrl.model.menu) {
            $headRow.append(angular.element('<th></th>'));
        }
        $thead.append($headRow);
        $table.append($thead);
    }

    function buildTableBody() {
        $tbody.empty();
        $ctrl.data.forEach(function(row, idx) {
            var $rowScope = $tableScope.$new(true);
            $rowScope.item = row;
            $rowScope.index = idx;

            var $row = $compile('<tr ng-class="rowClass(' + idx + ')" ng-show="rowFilter(' + idx + ')"></tr>')($tableScope);
            $ctrl.model.columns.forEach(function(column) {
                var $td = angular.element('<td>');

                if (column.format) {
                    $td.append($compile(column.format(row, $rowScope))($rowScope));
                } else {
                    $td.text(row[column.property]);
                }

                $row.append($td);
            });

            //
            // Build the menu
            //
            if ($ctrl.model.menu) {
                var html = '<td class="q-table-menu-td"><div class="dropdown">';

                var id = 'menu' + rand.ID();
                html += '<button class="btn btn-outline-secondary btn-xsm" type="button" id="' + id + '" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fas fa-ellipsis-h"></i></button>';
                html += '<div class="dropdown-menu dropdown-menu-right" aria-labelledby="' + id + '">';

                $ctrl.model.menu.forEach(function(menu, menuIdx) {
                    if (menu.show && !menu.show(row)) {
                        return;
                    }
                    html += '<a class="dropdown-item" ng-click="menuClick(' + menuIdx + ', ' + idx + ')"><i class="' + menu.icon + '"></i> ' + menu.title + '</a>';
                });

                html += '</div></div></td>';
                $row.append($compile(html)($tableScope));
            }

            $tbody.append($row);
        });

        $table.append($tbody);
    }

    function drawTable() {
        if (!$ctrl.model.options) {
            $ctrl.model.options = {
                notResponsive: false,
            };
        }

        if ($ctrl.data === undefined || $ctrl.data.length === 0) {
            $thead.remove();
            $tbody.remove();
            angular.element('.q-table-wrapper[data-qtable-id="' + tableID + '"]').remove();
            $element.append(angular.element('<div class="empty-table" data-qtable-id="' + tableID + '"><i class="fas fa-empty-set"></i><span>Nothing here</span></div>'));
            return;
        } else {
            angular.element('.empty-table[data-qtable-id="' + tableID + '"]').remove();
        }

        // 1. Build the header
        buildTableHeader();
        // 2. Build the body
        buildTableBody();
        // 3. Append it to the element
        var cls = 'q-table-wrapper';
        if (!$ctrl.model.options.notResponsive) {
            cls += ' table-responsive';
        }
        var $div = angular.element('<div class="' + cls + '" data-qtable-id="' + tableID + '">');
        $div.append($table);
        $element.append($div);
        // 4. Load any saved sorting/filters
        $tableScope.loadOptions();
    }

    // Row filter
    $tableScope.rowFilter = function(rowIdx) {
        var matches = true;
        Object.keys($tableScope.filters).forEach(function(columnIdx) {
            var filter = $tableScope.filters[columnIdx];
            var column = $ctrl.model.columns[columnIdx];
            var value;
            if (column.value !== undefined) {
                value = column.value($ctrl.data[rowIdx]);
            } else if (column.property !== undefined) {
                value = $ctrl.data[rowIdx][column.property];
            } else {
                console.warn('Filterable column without property key or value function');
                return;
            }

            var regexp = new RegExp(filter.pattern);
            var matchesFilter = value.match(regexp) !== null;
            if (!matchesFilter && !filter.not) {
                matches = false;
                return;
            } else if (matchesFilter && filter.not) {
                matches = false;
                return;
            }
        });
        return matches;
    };

    // Class for the filter button
    $tableScope.headerFilterButtonClass = function(columnIdx) {
        return {
            'q-table-filter-button': !$tableScope.filters[columnIdx],
            'q-table-filter-button-active': $tableScope.filters[columnIdx]
        };
    };

    $tableScope.headerSortButtonClass = function(columnIdx) {
        if (!$tableScope.sort || $tableScope.sort.columnIdx !== columnIdx) {
            return {};
        }

        var cls = {
            fas: true,
            'fa-sort-down': false,
            'fa-sort-up': false
        };
        if ($tableScope.sort.descending) {
            cls['fa-sort-up'] = true;
        } else {
            cls['fa-sort-down'] = true;
        }
        return cls;
    };

    // Table Header click handler
    $tableScope.headerClick = function(columnIdx) {
        if ($tableScope.sort !== undefined && $tableScope.sort.columnIdx === columnIdx) {
            $tableScope.sort.descending = !$tableScope.sort.descending;
            return;
        }
        $tableScope.sort = {
            columnIdx: columnIdx,
            descending: true,
        };
    };

    // Sort watch
    $tableScope.$watch('sort', function(v) {
        if (!v) {
            return;
        }

        $tableScope.saveOptions();

        var column = $ctrl.model.columns[v.columnIdx];
        $ctrl.data = $ctrl.data.sort(function(a, b) {
            var aVal = column.value !== undefined ? column.value(a) : a[column.property];
            var bVal = column.value !== undefined ? column.value(b) : b[column.property];

            if (v.descending) {
                return aVal > bVal;
            }
            return aVal < bVal;
        });
        buildTableBody();
    }, true);

    // Table Header Options click handler
    $tableScope.headerOptionsClick = function(columnIdx) {
        var filter = angular.copy($tableScope.filters[columnIdx] || {
            pattern: '',
            not: false,
        });
        var column = $ctrl.model.columns[columnIdx];
        popup.new({
            template: '<q-table-filter-popup></q-table-filter-popup>',
            data: {
                columnTitle: column.title,
                filter: filter,
            }
        }).then(function(filter) {
            $tableScope.filters[columnIdx] = filter;
            $tableScope.saveOptions();
        }, function() {
            delete $tableScope.filters[columnIdx];
            $tableScope.saveOptions();
        });
    };

    // Menu click handler
    $tableScope.menuClick = function(menuIdx, rowIdx) {
        var menu = $ctrl.model.menu[menuIdx];
        var row = $ctrl.data[rowIdx];

        if (menu.link) {
            var path = menu.link(row);
            $location.url(path);
        } else if (menu.action) {
            menu.action(row);
        } else {
            console.warn('No action or link for menu ' + menu.title);
        }
    };

    // Row class (for disabled rows)
    $tableScope.rowClass = function(rowIdx) {
        if ($ctrl.model.options && $ctrl.model.options.disabledRow) {
            return {'disabled': $ctrl.model.options.disabledRow( $ctrl.data[rowIdx])};
        }
    };

    // Save user options to local storage
    $tableScope.saveOptions = function() {
        var data = {
            filters: $tableScope.filters,
            sort: $tableScope.sort
        };
        settings.set('table_settings_' + tableID, data);
    };

    // Load user options from local storage
    $tableScope.loadOptions = function() {
        var options = settings.get('table_settings_' + tableID);
        if (!options) {
            return;
        }

        $tableScope.filters = options.filters;
        $tableScope.sort = options.sort;
    };

    $scope.$watch('$ctrl.data', function(nv) {
        if (nv) {
            try {
                drawTable();
            } catch (error) {
                angular.element('.table-error[data-qtable-id="' + tableID + '"]').remove();
                $element.append(angular.element('<div class="table-error" data-qtable-id="' + tableID + '"><i class="fas fa-exclamation-triangle"></i><span>Error Loading Table</span></div>'));
                console.error('Error drawing table', error);
            }
        }
    }, true);
});
