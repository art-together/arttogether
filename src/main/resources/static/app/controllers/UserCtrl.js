(function() {
    'use strict';
    angular.module('eggsApp')
        .controller('UserCtrl', ['$scope', '$routeParams', 'UserService', '$location', UserCtrl]);

    function UserCtrl($scope, $routeParams, UserService, $location) {
        $scope.login = login;
        $scope.register = register;
        $scope.cleanErrors = cleanErrors;
        $scope.verifyMail = verifyMail;

        function verifyMail() {
            var hash = $routeParams.hashLink;
            var email = $routeParams.userEmail;

            UserService.verifyMail(hash, email);
        }

        function register() {
            UserService.register($scope.user).then(function (data) {
                if (data) {
                    $location.path("/confirm");
                }
            });
        }
        
        function login() {
            UserService.authenticate($scope.credentials).then(function(data) {
                $scope.errors = {};
                if (data.status == 401) {
                    $scope.errors.wrong = true;
                } else {
                    $location.path("/draw");
                }
            });
        }

        function cleanErrors() {
            $scope.errors = {};
        }
    }
}());
