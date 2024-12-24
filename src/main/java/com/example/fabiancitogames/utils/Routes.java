package com.example.fabiancitogames.utils;

public class Routes {
    public static final String BASE_GAME = "/game";
    public static final String BASE_QUEUE = "/queue";
    public static final String JOIN = "/join";
    public static final String READY = "/ready";
    public static final String EXIT = "/exit";
    public static final String ROLE = "/role";

    // Only Pong
    public static final String PONG = "/pong";
    public static final String BALL = "/ball";
    public static final String PADDLE = "/paddle";
    public static final String MOVE_BALL = "/moveBall";
    public static final String MOVE_PADDLE = "/movePaddle";
    public static final String PONG_READY = PONG + READY;
    public static final String PONG_JOIN = PONG + JOIN;
    public static final String PONG_EXIT = PONG + EXIT;
    public static final String QUEUE_PONG_ROLE = BASE_QUEUE + PONG + ROLE;
    public static final String QUEUE_PONG_READY = BASE_QUEUE + PONG + READY;
    public static final String GAME_PONG_BALL = BASE_GAME + PONG + BALL;
    public static final String GAME_PONG_PADDLE = BASE_GAME + PONG + PADDLE;
    public static final String PONG_MOVE_BALL =  PONG + MOVE_BALL;
    public static final String PONG_MOVE_PADDLE = PONG + MOVE_PADDLE;

}