package com.example.fabiancitogames.pong;

import com.example.fabiancitogames.GameSession;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.concurrent.atomic.AtomicInteger;

@Controller
public class PongController {

    private AtomicInteger connectedPlayers = new AtomicInteger(0);
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final GameSession gameSession;

    public PongController(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.gameSession = new GameSession();
    }

    @MessageMapping("/pong/join")
    public void joinGame(SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        if (sessionId == null) {
            System.err.println("Session ID is null. Cannot assign role.");
            return;
        }

        int playerRole = gameSession.assignRole(sessionId);
        System.out.println("Player joined: " + sessionId + " as role " + playerRole);
        simpMessagingTemplate.convertAndSend(
                "/queue/role",
                playerRole
        );
    }

    @MessageMapping("/pong/ready")
    public void readyGame() {
        simpMessagingTemplate.convertAndSend(
                "/game/ready",
                connectedPlayers.incrementAndGet()
        );
    }

    @MessageMapping("/pong/moveBall")
    public void sendBallMovement(BallMovement ballMovement) {
        System.out.println("Ball movement received: " + ballMovement);
        simpMessagingTemplate.convertAndSend("/game/ball", ballMovement);
    }

    @MessageMapping("/pong/movePaddle")
    public void sendPaddleMovement(PaddleMovement paddleMovement) {
        System.out.println("Paddle movement received: " + paddleMovement);
        simpMessagingTemplate.convertAndSend("/game/paddle", paddleMovement);
    }
}
