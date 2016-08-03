(function() {
    'use strict';
    angular.module('eggsApp')
        .controller('MainCtrl', ['$scope', '$localStorage', 'UserService', MainCtrl]);

    function MainCtrl($scope, $localStorage, UserService) {
        $scope.download = download;
        $scope.upload = upload;
        $scope.testUp = testUp;

        function testUp() {
            console.log($scope.test);
            console.log($scope.file1);
        }

        function upload() {
            angular.element()
        }

        function download() {
            console.log("before");
           // var str = $localStorage.drawing-board-custom-board; //get("drawing-board-custom-board");
            $scope.str = window.localStorage.getItem("drawing-board-custom-board");
            UserService.testImg($scope.str);
        }
    }
}());


