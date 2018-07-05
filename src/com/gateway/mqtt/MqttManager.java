/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gateway.mqtt;

import com.gateway.common.Config;
import com.google.gson.Gson;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import org.apache.log4j.Logger;
import org.eclipse.paho.client.mqttv3.MqttException;

/**
 *
 * @author haint3
 */
public class MqttManager {
    
    private static final Logger logger = Logger.getLogger(MqttManager.class);
    private static final Lock   _createLock = new ReentrantLock();
    private static MqttManager  _instance = null;
    private static Gson         _gson = new Gson();
    
    private MqttSubscriber   _subscriber = null;
    private MqttPublisher    _publisher = null;
    
    public static MqttManager getInstance() {
        if (_instance == null) {
            _createLock.lock();
            try {
                if (_instance == null) {
                    _instance = new MqttManager();
                }
            } finally {
                _createLock.unlock();
            }
        }
        return _instance;
    }
    
    public void start() {
        try {
            String uri = Config.getParam("mqtt", "uri");
            logger.info("mqtt broker = " + uri);
            
            _publisher = new MqttPublisher();
            _subscriber = new MqttSubscriber();
            
            _publisher.start(uri);
            _subscriber.start(uri);
            
            initialize();
            
        } catch (MqttException ex) {
            logger.error("MqttManager.start: " + ex.getMessage(), ex);
        }
    }
    
    public void stop() {
        if (_subscriber != null) {
            _subscriber.stop();
        }
        
        if (_publisher != null) {
            _publisher.stop();
        }
    }
    
    public void initialize() {
        if (_subscriber == null) {
            return;
        }
    }
    
    public void publish(String topic, String data) {
        _publisher.publish(topic, data);
    }
}
