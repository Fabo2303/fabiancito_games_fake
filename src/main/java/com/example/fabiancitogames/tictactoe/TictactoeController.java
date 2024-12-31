package com.example.fabiancitogames.tictactoe;

import com.example.fabiancitogames.utils.GameSession;
import com.example.fabiancitogames.utils.Routes;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.concurrent.atomic.AtomicInteger;

@Controller
public class TictactoeController {

    private final AtomicInteger connectedPlayers = new AtomicInteger(0);
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final GameSession gameSession;

    public TictactoeController(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.gameSession = new GameSession();
    }

    @MessageMapping(Routes.TICTACTOE_JOIN)
    public void joinGame(SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        if (sessionId == null) {
            System.err.println("Session ID is null. Cannot assign role.");
            return;
        }

        int playerRole = gameSession.assignRole(sessionId);
        System.out.println("Player joined: " + sessionId + " as role " + playerRole);
        simpMessagingTemplate.convertAndSend(
                Routes.QUEUE_TICTACTOE_ROLE,
                playerRole
        );
    }

    @MessageMapping(Routes.TICTACTOE_READY)
    public void readyGame() {
        simpMessagingTemplate.convertAndSend(
                Routes.QUEUE_TICTACTOE_READY,
                connectedPlayers.incrementAndGet()
        );
    }

    @MessageMapping(Routes.TICTACTOE_MOVE)
    public void sendTokenMovement(TokenMovement tokenMovement) {
        simpMessagingTemplate.convertAndSend(Routes.GAME_TICTACTOE, tokenMovement);
    }
}
