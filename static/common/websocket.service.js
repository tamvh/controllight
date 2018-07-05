/* global theApp, MSG_TYPE_PONG, MSG_TYPE_PING */

theApp.factory('WSService', function() {            
      //var ws = new WebSocket(WS_URL);
      var ws;      
      var isConnected = false;
      var mapCallBackFunc = {};
      var countPingConnectServer = 0;
      var sessionId = "";
      

      function genSessionID(){
        var current = Date.now();
        var tempNum = Math.floor(Math.random() * (1000 - 1 + 1) + 1);
        sessionId = current.toString() + "-" + tempNum.toString();  
      }
      genSessionID();
      var WS_URL = "ws://127.0.0.1:9998";
      var wsServerUrl = WS_URL + sessionId;
      function startNewWebsocket() {        
        ws = new WebSocket(wsServerUrl);
        //receive data from server
        ws.onmessage = function(message) { 
          var cbFunc;
          var jsonObj = JSON.parse(message.data);
          if(jsonObj.msg_type === MSG_TYPE_PONG){ //ping to server and received pong msg   
            countPingConnectServer = 0;
          } else if(mapCallBackFunc.hasOwnProperty(jsonObj.msg_type.toString())) {          
            cbFunc = mapCallBackFunc[jsonObj.msg_type.toString()];      
            cbFunc(jsonObj);
          }
        };

        ws.onopen = function() {   
          isConnected = true;
          countPingConnectServer = 0;
        };

        ws.onclose = function(event) {
          isConnected = false;
        };

        ws.onerror = function(event) {
          isConnected = false; 
        };
      };
      
      startNewWebsocket();

      function sendPingMsg() {
        var jsonObj = {};
        jsonObj.msg_type = MSG_TYPE_PING;
        jsonObj.session_id = sessionId;
        jsonObj.dt = "Ping from client";
        var message = JSON.stringify(jsonObj);
        ws.send(message); 
        countPingConnectServer++;
      }

      function addCallBack(msgType, func) {
        var name = msgType.toString();
        mapCallBackFunc[msgType.toString()] = func;
      }

      //send message to server
      function send(message) {
        if (angular.isString(message)) {
          ws.send(message);            
        }
        else if (angular.isObject(message)) {
          ws.send(JSON.stringify(message));
        }
      }
      
      setInterval(function(){
        if(isConnected) {
          if(countPingConnectServer >= 2) {
            isConnected = false;
            console.log("connect server after 4s");
            startNewWebsocket();
            
          } else {
           // sendPingMsg();
          }
        } else {
          startNewWebsocket();
        }
        
        console.log("socket status = " + ws.readyState);
      }, 2000);
     
      var methods = {
        //collection: collection        
      };

      methods.addCallBack = addCallBack;
      methods.send = send;     
      methods.sendPingMsg = sendPingMsg;

      return methods;
});