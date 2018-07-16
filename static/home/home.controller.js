/* global theApp, MSG_TYPE_LIGHT_ONOFF, Paho */

(function () {
    'use strict';
    theApp
            .controller('HomeController', HomeController);
    HomeController.$inject = ['$scope', 'HomeService', 'MQTT_HOST', 'MQTT_PORT', 'MQTT_PATH', 'MQTT_ID'];
    function HomeController($scope, HomeService, MQTT_HOST, MQTT_PORT, MQTT_PATH, MQTT_ID) {
        var mqtt_client;
        var sessionId = "";
        $scope.mqtt = function () {
            console.log("init mqtt");
            // Create a client instance
            mqtt_client = new Paho.MQTT.Client(MQTT_HOST, MQTT_PORT, MQTT_PATH, sessionId);

            // set callback handlers
            mqtt_client.onConnectionLost = onConnectionLost;
            mqtt_client.onMessageArrived = $scope.onMessageArrived;

            // connect the client
            mqtt_client.connect({onSuccess: onConnect}); 
        };

        function genSessionID(){
          var current = Date.now();
          var tempNum = Math.floor(Math.random() * (1000 - 1 + 1) + 1);
          sessionId = current.toString() + "-" + tempNum.toString();  
        }
        
        // called when the client connects
        function onConnect() {
            // Once a connection has been made, make a subscription and send a message.
            console.log("onConnect");
            mqtt_client.subscribe("light");
        }

        // called when the client loses its connection
        function onConnectionLost(responseObject) {
            if (responseObject.errorCode !== 0) {
                console.log("onConnectionLost:" + responseObject.errorMessage);
            }
        }

        // called when a message arrives
        $scope.onMessageArrived = function(message) {
            console.log("onMessageArrived:" + message.payloadString);
            $scope.getlist();
        };

        $scope.init = function () {
            genSessionID();
            $scope.mqtt();
            $scope.getlist();
        };
        
        $scope.getlist = function() {
            HomeService.getlist().then(function (response) {
                if (response.err === 0) {
                    $scope.listlight = response.dt;
                }
            });
        };
        
        $scope.init();

        $scope.updateLightStt = function (mess) {
            var jsonData = mess.dt;
            for (var i = 0; i < $scope.listlight.length; i++) {
                if ($scope.listlight[i].id === jsonData.id) {
                    var light_stt = jsonData.stt;
                    $scope.listlight[i].stt = light_stt;
                    if (light_stt === 0) {
                        $scope.listlight[i].img = "lightOff.png";
                    } else {
                        $scope.listlight[i].img = "lightOn.png";
                    }
                }
            }
        };

        $scope.control = function (light) {
            for (var i = 0; i < $scope.listlight.length; i++) {
                if ($scope.listlight[i].id === light.id) {
                    var light_stt = 1 - light.stt;
                    HomeService.onoff(light.id, light_stt).then(function (response) {
                        if (response.err === 0) {
                            $scope.listlight[i].stt = light_stt;
                            if (light_stt === 0) {
                                $scope.listlight[i].img = "lightOff.png";
                            } else {
                                $scope.listlight[i].img = "lightOn.png";
                            }
                        } else {
                            console.log('control light err, dt: ' + JSON.stringify(light));
                        }
                        
                        console.log("MSG_TYPE_LIGHT_ONOFF: " + MSG_TYPE_LIGHT_ONOFF);
//                        WSService.addCallBack(MSG_TYPE_LIGHT_ONOFF, $scope.updateLightStt);
                    });
                    
                    break;
                }
            }
        };
    }
})();
