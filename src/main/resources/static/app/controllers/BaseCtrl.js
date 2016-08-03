
(function() {
    'use strict';
    angular.module('eggsApp')
        .controller('BaseCtrl', ['$scope', '$location', 'UserService', BaseCtrl]);

    function BaseCtrl($scope, $location, UserService) {
        $scope.logout = logout;
        $scope.openLogin = openLogin;
        $scope.login = login;
        $scope.closeModal = closeModal;

        function closeModal(id) {
            angular.element("#" + id).modal('hide');
        }

        function openLogin() {
            angular.element("#loginModal").modal();
        }

        function login() {
            UserService.authenticate($scope.credentials).then(function(data) {
                $scope.errors = {};
                if (data.status == 401) {
                    $scope.errors.wrong = true;
                } else {
                    closeModal("loginModal");
                    $location.path("/draw");
                }
            });
        }

        function logout() {
            UserService.logout();
        }
    }
}());
