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
    public static final String MOVE_PADDLE_LEFT = "/movePaddleLeft";
    public static final String MOVE_PADDLE_RIGHT = "/movePaddleRight";
    public static final String PONG_READY = PONG + READY;
    public static final String PONG_JOIN = PONG + JOIN;
    public static final String PONG_EXIT = PONG + EXIT;
    public static final String QUEUE_PONG_ROLE = BASE_QUEUE + PONG + ROLE;
    public static final String QUEUE_PONG_READY = BASE_QUEUE + PONG + READY;
    public static final String GAME_PONG_BALL = BASE_GAME + PONG + BALL;
    public static final String GAME_PONG_PADDLE_LEFT = BASE_GAME + PONG + PADDLE + "/left";
    public static final String GAME_PONG_PADDLE_RIGHT = BASE_GAME + PONG + PADDLE + "/right";
    public static final String PONG_MOVE_BALL =  PONG + MOVE_BALL;
    public static final String PONG_MOVE_PADDLE_LEFT = PONG + MOVE_PADDLE_LEFT;
    public static final String PONG_MOVE_PADDLE_RIGHT = PONG + MOVE_PADDLE_RIGHT;

    // Only TicTacToe
    public static final String TICTACTOE = "/tictactoe";
    public static final String TICTACTOE_READY = TICTACTOE + READY;
    public static final String TICTACTOE_JOIN = TICTACTOE + JOIN;
    public static final String TICTACTOE_EXIT = TICTACTOE + EXIT;
    public static final String QUEUE_TICTACTOE_ROLE = BASE_QUEUE + TICTACTOE + ROLE;
    public static final String QUEUE_TICTACTOE_READY = BASE_QUEUE + TICTACTOE + READY;
    public static final String GAME_TICTACTOE = BASE_GAME + TICTACTOE;
    public static final String TICTACTOE_MOVE = TICTACTOE + "/move";

}