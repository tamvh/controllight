/* global API_URL, MQTT_HOST, MQTT_PATH, MQTT_PORT, MQTT_ID */

var theApp = angular.module('theApp', ['ngRoute', 'ngCookies', 'smart-table', 'ui.bootstrap']);
theApp.constant('API_URL', API_URL); 
theApp.constant('MQTT_HOST', MQTT_HOST); 
theApp.constant('MQTT_PORT', MQTT_PORT); 
theApp.constant('MQTT_PATH', MQTT_PATH); 
theApp.constant('MQTT_ID', MQTT_ID  ); 

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

    run.$inject = ['$rootScope'];
    function run($rootScope) {
	        
    }
})();
