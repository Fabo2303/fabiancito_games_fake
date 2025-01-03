package com.example.fabiancitogames.utils;

import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;

@Component
public class GameSession {
    private final ConcurrentHashMap<String, Integer> sessionRoles = new ConcurrentHashMap<>();
    private int nextRole = 1;

    public int assignRole(String sessionId) {
        if (!sessionRoles.containsKey(sessionId)) {
            sessionRoles.put(sessionId, nextRole);
            nextRole = (nextRole % 2) + 1;
        }
        return sessionRoles.get(sessionId);
    }

    public int getPlayerRole(String sessionId){
        return sessionRoles.get(sessionId);
    }

    public void removeRole(String sessionId){
        sessionRoles.remove(sessionId);
        for (String key : sessionRoles.keySet()) {
            sessionRoles.put(key, nextRole);
            nextRole = (nextRole % 2) + 1;
        }
    }
}
