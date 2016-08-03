(function() {
    'use strict';
    angular.module('eggsApp').directive('showTab', showTab);

    angular.module('eggsApp').directive('fileModel', [ '$parse', function($parse) {
        return {
            restrict : 'A',
            link : function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function() {
                    scope.$apply(function() {
                        console.log(model);
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    } ]);


    function showTab() {
        return {
            link: function (scope, element, attrs) {
                element.click(function (e) {
                    e.preventDefault();
                    $(element).tab('show');
                });
            }
        };
    }

}());