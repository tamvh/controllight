/* global API_URL */

var theApp = angular.module('theApp', ['ngRoute', 'ngCookies', 'smart-table', 'ui.bootstrap']);
theApp.constant('API_URL', API_URL); 

(function () {
    'use strict';
    theApp
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$httpProvider'];
    function config($routeProvider, $httpProvider) {
        $routeProvider
            .when('/', {
                controller: 'HomeController',
                templateUrl: 'home/home.view.html'
            })
            .otherwise({ redirectTo: '/' });
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    run.$inject = ['$rootScope', 'WSService'];
    function run($rootScope, WSService) {
	        
    }
})();
