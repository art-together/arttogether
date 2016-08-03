(function() {
    'use strict';
    angular.module('eggsApp')
        .controller('DrawCtrl', ['$scope','UserService', DrawCtrl]);

    function DrawCtrl($scope, UserService) {
        $scope.upload = upload;
        $scope.initCanvas = initCanvas;
        var lc;

        function initCanvas() {
            lc = LC.init(document.getElementsByClassName('root-board')[0], {
                imageURLPrefix: './img/lc/img',
                tools: [LC.tools.Pencil],
                strokeWidths: [5]
            });

            lc.setImageSize('3200', '800');
            lc.setZoom(0.3);
            lc.setColor('background', 'white');
            lc.setColor('primary', 'blue');
            
        }
        

        function upload() {
            var svgString = lc.getSVGString();
            UserService.testImg(btoa(svgString)).then(function () {
                location.reload();
            });
        }

    }
}());


