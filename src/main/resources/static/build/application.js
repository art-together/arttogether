'use strict';

angular.module("eggsApp", ['pascalprecht.translate', 'ngRoute', 'ngCookies', 'ngStorage', 'ngAnimate'])
    .config(['$translateProvider', '$httpProvider', '$routeProvider', function ($translateProvider, $httpProvider, $routeProvider) {
        'use strict';

        $routeProvider.
            when('/', {
                templateUrl: './templates/main.html',
                controller: 'MainCtrl',
                isMain: true
            }).
            when('/draw', {
                templateUrl: './templates/canvas.html',
                controller: 'DrawCtrl'
            }).
            when('/user', {
                templateUrl: './templates/user/cabinet.html',
                controller: 'UserCtrl'
            }).
            when('/signin', {
                templateUrl: './templates/login.html',
                controller: 'UserCtrl'
            }).
            when('/register', {
                templateUrl: './templates/register.html',
                controller: 'UserCtrl'
            }).
            when('/confirm', {
                templateUrl: './templates/confirm.html',
                controller: 'UserCtrl'
            }).
            when('/verify/:userEmail/:hashLink', {
                templateUrl: './templates/verify.html',
                controller: 'UserCtrl'
            }).
            when('/test', {
                templateUrl: './templates/test-lc.html',
                controller: 'MainCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });

        $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
    }])
    .run(function ($rootScope, $location) {

        $rootScope.$on('$routeChangeSuccess', function (event, next, current) {
            
        });
    });


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
