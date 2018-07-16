/* global theApp, MSG_TYPE_LIGHT_ONOFF, Paho */

(function () {
    'use strict';
    theApp
            .controller('HomeController', HomeController);
    HomeController.$inject = ['$scope', 'HomeService', 'MQTT_HOST', 'MQTT_PORT', 'MQTT_PATH', 'MQTT_ID'];
    function HomeController($scope, HomeService, MQTT_HOST, MQTT_PORT, MQTT_PATH, MQTT_ID) {
        var data = [
            {
                id: 1,
                stt: 0,
                img: "lightOff.png",
                name: "Đèn 1"
            },
            {
                id: 2,
                stt: 0,
                img: "lightOff.png",
                name: "Đèn 2"
            },
            {
                id: 3,
                stt: 0,
                img: "lightOff.png",
                name: "Đèn 3"
            },
            {
                id: 4,
                stt: 0,
                img: "lightOff.png",
                name: "Đèn 4"
            },
            {
                id: 5,
                stt: 0,
                img: "lightOff.png",
                name: "Đèn 5"
            },
            {
                id: 6,
                stt: 0,
                img: "lightOff.png",
                name: "Đèn 6"
            },
            {
                id: 7,
                stt: 0,
                img: "lightOff.png",
                name: "Đèn 7"
            },
            {
                id: 8,
                stt: 0,
                img: "lightOff.png",
                name: "Đèn 8"
            },
            {
                id: 9,
                stt: 0,
                img: "lightOff.png",
                name: "Đèn 9"
            },
            {
                id: 10,
                stt: 0,
                img: "lightOff.png",
                name: "Đèn 10"
            }
        ];
        $scope.listlight = data;
        var mqtt_client;
        $scope.mqtt = function () {
            console.log("init mqtt");
            // Create a client instance
            mqtt_client = new Paho.MQTT.Client(MQTT_HOST, MQTT_PORT, MQTT_PATH, MQTT_ID);

            // set callback handlers
            mqtt_client.onConnectionLost = onConnectionLost;
            mqtt_client.onMessageArrived = $scope.onMessageArrived;

            // connect the client
            mqtt_client.connect({onSuccess: onConnect}); 
        };
        
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
            var jpayload = JSON.parse(message.payloadString);
            console.log("jpayload.id:   " + jpayload.id);
            console.log("jpayload.stt:  " + jpayload.stt);
            for (var i = 0; i < $scope.listlight.length; i++) {
                console.log('$scope.listlight[' + i + '].id: ' + $scope.listlight[i].id);
                if ($scope.listlight[i].id === jpayload.id) {
                    console.log('OK');
                    $scope.listlight[i].stt = jpayload.stt;
                    if ($scope.listlight[i].stt === 0) {
                        $scope.listlight[i].img = "lightOff.png";
                    } else {
                        $scope.listlight[i].img = "lightOn.png";
                    }
                }
            }
            
            console.log('dt: ' + JSON.stringify($scope.listlight));
        };

        $scope.init = function () {
            $scope.mqtt();
        };
        $scope.init();

        $scope.updateLightStt = function (mess) {
            var jsonData = mess.dt;
            for (var i = 0; i < $scope.listlight.length; i++) {
                if ($scope.listlight[i].id === jsonData.id) {
                    var light_stt = 1 - jsonData.stt;
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
                            
                        }
                        
                        console.log('$scope.listlight: ' + JSON.stringify($scope.listlight));
                        console.log("MSG_TYPE_LIGHT_ONOFF: " + MSG_TYPE_LIGHT_ONOFF);
//                        WSService.addCallBack(MSG_TYPE_LIGHT_ONOFF, $scope.updateLightStt);
                    });
                    
                    break;
                }
            }
        };
    }
})();
