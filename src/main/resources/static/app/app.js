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
