/* global theApp, MSG_TYPE_LIGHT_ONOFF, Paho */

(function () {
    'use strict';
    theApp
        .controller('HomeController', HomeController);
    HomeController.$inject = ['$scope', 'HomeService'];
    function HomeController($scope, HomeService) {
        var data = [
            {
                id: 1,
                stt: 0,
                img:"lightOff.png",
                name:"Đèn 1"
            },
            {
                id: 2,
                stt: 0,
                img:"lightOff.png",
                name:"Đèn 2"
            },
            {
                id: 3,
                stt: 0,
                img:"lightOff.png",
                name:"Đèn 3"
            },
            {
                id: 4,
                stt: 0,
                img:"lightOff.png",
                name:"Đèn 4"
            },
            {
                id: 5,
                stt: 0,
                img:"lightOff.png",
                name:"Đèn 5"
            },
            {
                id: 6,
                stt: 0,
                img:"lightOff.png",
                name:"Đèn 6"
            },
            {
                id: 7,
                stt: 0,
                img:"lightOff.png",
                name:"Đèn 7"
            },
            {
                id: 8,
                stt: 0,
                img:"lightOff.png",
                name:"Đèn 8"
            },
            {
                id: 9,
                stt: 0,
                img:"lightOff.png",
                name:"Đèn 9"
            },
            {
                id: 10,
                stt: 0,
                img:"lightOff.png",
                name:"Đèn 10"
            }
        ];
        
        $scope.init = function () {
            $scope.listlight = data;
        };
        $scope.init();
        
        $scope.updateLightStt = function (mess) {
            var jsonData = mess.dt;
            for (var i = 0; i < $scope.listlight.length; i++) {
                if($scope.listlight[i].id === jsonData.id) {
                    var light_stt = 1 - jsonData.stt;
                    $scope.listlight[i].stt = light_stt;
                    if(light_stt === 0) {
                        $scope.listlight[i].img = "lightOff.png";
                    } else {
                        $scope.listlight[i].img = "lightOn.png";
                    }
                }
            }
        };
        
        $scope.control = function (light) {
            for (var i = 0; i < $scope.listlight.length; i++) {
                if($scope.listlight[i].id === light.id) {
                    var light_stt = 1 - light.stt;
                    HomeService.onoff(light.id, light_stt).then(function (response) {
                        if (response.err === 0) {
                            $scope.listlight[i].stt = light_stt;
                            if(light_stt === 0) {
                                $scope.listlight[i].img = "lightOff.png";
                            } else {
                                $scope.listlight[i].img = "lightOn.png";
                            }
                        } else {
                        }
//                        WSService.addCallBack(MSG_TYPE_LIGHT_ONOFF, $scope.updateLightStt);
                    });
                    break;
                }
            }
        };
    }
})();
