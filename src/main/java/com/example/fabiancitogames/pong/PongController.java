package com.example.fabiancitogames.pong;

import com.example.fabiancitogames.utils.GameSession;
import com.example.fabiancitogames.utils.Routes;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.concurrent.atomic.AtomicInteger;

@Controller
public class PongController {

    private final AtomicInteger connectedPlayers = new AtomicInteger(0);
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final GameSession gameSession;

    public PongController(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.gameSession = new GameSession();
    }

    @MessageMapping(Routes.PONG_JOIN)
    public void joinGame(SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        if (sessionId == null) {
            System.err.println("Session ID is null. Cannot assign role.");
            return;
        }

        int playerRole = gameSession.assignRole(sessionId);
        System.out.println("Player joined: " + sessionId + " as role " + playerRole);
        simpMessagingTemplate.convertAndSend(
                Routes.QUEUE_PONG_ROLE,
                playerRole
        );
    }

    @MessageMapping(Routes.PONG_READY)
    public void readyGame() {
        simpMessagingTemplate.convertAndSend(
                Routes.QUEUE_PONG_READY,
                connectedPlayers.incrementAndGet()
        );
    }

    @MessageMapping(Routes.PONG_MOVE_BALL)
    public void sendBallMovement(BallMovement ballMovement) {
        simpMessagingTemplate.convertAndSend(Routes.GAME_PONG_BALL, ballMovement);
    }

    @MessageMapping(Routes.PONG_MOVE_PADDLE)
    public void sendPaddleMovement(PaddleMovement paddleMovement) {
        simpMessagingTemplate.convertAndSend(Routes.GAME_PONG_PADDLE, paddleMovement);
    }
}
