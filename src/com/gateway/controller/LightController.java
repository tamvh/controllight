/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gateway.controller;

import com.gateway.common.AppConst;
import com.gateway.common.CommonFunction;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.log4j.Logger;
import com.gateway.common.CommonModel;
import com.gateway.common.JsonParserUtil;
import com.gateway.common.MessageType;
import com.google.gson.JsonObject;

import com.gateway.controller.NotifyController;
import com.gateway.mqtt.MqttManager;
import com.google.gson.Gson;
/**
 *
 * @author tamvh
 */
    public class LightController extends HttpServlet {
    protected final Logger logger = Logger.getLogger(this.getClass());
     private static final Gson _gson = new Gson();
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        handle(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        handle(req, resp);
    }
    
    private void handle(HttpServletRequest req, HttpServletResponse resp) {
        try {
            processs(req, resp);
        } catch (Exception ex) {
            logger.error(getClass().getSimpleName() + ".handle: " + ex.getMessage(), ex);
        }
    }

    private void processs(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String cmd = req.getParameter("cm") != null ? req.getParameter("cm") : "";
        String data = req.getParameter("dt") != null ? req.getParameter("dt") : "";
        String content = "";
            
        CommonModel.prepareHeader(resp, CommonModel.HEADER_JS);
        logger.info("data: " + data + ", cm: " + cmd);
        switch (cmd) {            
            case "onoff":
                content = onoff(req, data);
                break;
        }
        
        CommonModel.out(content, resp);
    }

    private String onoff(HttpServletRequest req, String data) {
        String content = null;
        int ret = AppConst.ERROR_GENERIC;
        
        try {
            JsonObject jsonObject = JsonParserUtil.parseJsonObject(data);
            if (jsonObject == null) {
                content = CommonModel.FormatResponse(ret, "Invalid parameter");
            } else {
                int id = jsonObject.get("id").getAsInt();
                int stt = jsonObject.get("stt").getAsInt();
                JsonObject dt = new JsonObject();
                dt.addProperty("id", id);
                dt.addProperty("stt", stt);
                JsonObject jsonMain = new JsonObject();                
                jsonMain.addProperty("msg_type", MessageType.MSG_LIGHT_ONOFF);
                jsonMain.add("dt", dt);
                String sendData = _gson.toJson(jsonMain);
                
                NotifyController.sendMessageToClient(sendData);
                String topic = "light/" + String.valueOf(id);
                logger.info("topic: " + topic);
                MqttManager.getInstance().publish(topic, _gson.toJson(dt));
                content = CommonModel.FormatResponse(0, "Success");
            }
        } catch (Exception ex) {
            logger.error(getClass().getSimpleName() + ".onoff: " + ex.getMessage(), ex);
            content = CommonModel.FormatResponse(ret, ex.getMessage());
        }
        
        return content;
    }
}
