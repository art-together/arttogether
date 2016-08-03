
(function() {
    angular.module("eggsApp")
        .factory("UserService", ['$http', '$location', '$rootScope', UserService]);

    function UserService($http, $location, $rootScope) {
        return {
            authenticate: authenticate,
            logout: logout,
            register: register,
            verifyMail: verifyMail,
            testImg: testImg,
            checkSession: checkSession
        };

        function checkSession() {
            return $http({
                url: "/eggs/rest/user/check",
                responseType: "json"
            }).then(function (response) {
                console.log(response);
                return response.data;
            });
        }

        function testImg(str) {
            return $http({
                method: 'POST',
                url: "/eggs/rest/user/aws",
                responseType: "json",
                data: {image: str}
            }).then(function (response) {
                console.log(response);
                return response.data;
            });
        }

        function verifyMail(hash, email) {
            return $http({
                url: "/eggs/rest/user/verify",
                responseType: "json",
                params: {hash: hash, email: email}
            }).then(function (response) {
                console.log(response);
                return response.data;
            });
        }

        function register(user) {
            return $http({
                method: 'POST',
                url: "/eggs/rest/user/register",
                responseType: "json",
                data: {firstname: user.firstname, lastname: user.lastname, email: user.email, password: user.password}
            }).then(function (response) {
                console.log(response);
                return response.data;
            });
        }

        function authenticate(data) {
            return $http.post("/login", "email=" + data.email +
                "&password=" + data.password, {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            } ).then(function(data) {
                //localStorage.setItem("session", {});
                $rootScope.authenticated = true;
                return data;
            }, function(data) {
                return data;
            });
        }

        function logout() {
            return $http({
                method: 'POST',
                url: "/logout",
                responseType: "json"
            }).then(function (response) {
                $rootScope.authenticated = false;
                $rootScope.account = {};
                $location.path("/");
               // window.location.reload();
                return response;
            });
        }

    }
}());