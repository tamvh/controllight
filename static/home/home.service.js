/* global theApp */

(function () {
    'use strict';

    theApp
        .factory('HomeService', HomeService);

    HomeService.$inject = ['$http', '$q', 'API_URL'];
    function HomeService($http, $q, API_URL) {
        var service = {};
        var url = API_URL + "iot-demo/v1/api";
        
        service.onoff = onoff;
        service.getlist = getlist;
        
        return service;
        
        function onoff(id, stt) {
            var cmd = "onoff";
            var dtJson = {id: id, stt: stt};
            var dt = JSON.stringify(dtJson);
            var data = $.param({
                cm: cmd,
                dt: dt
            });
            return $http.post(url, data).then(handleSuccess, handleError('onoff error'));
        }
        
        function getlist() {
            var cmd = "getlist";
            var dtJson = {};
            var dt = JSON.stringify(dtJson);
            var data = $.param({
                cm: cmd,
                dt: dt
            });
            return $http.post(url, data).then(handleSuccess, handleError('onoff error'));
        }

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { err: -2, msg: error };
            };
        }
    }
})();
