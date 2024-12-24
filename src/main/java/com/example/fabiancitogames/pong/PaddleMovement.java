package com.example.fabiancitogames.pong;

public class PaddleMovement {
    private int playerId;
    private int positionY;

    public PaddleMovement() {
    }

    public PaddleMovement(int playerId, int positionY) {
        this.playerId = playerId;
        this.positionY = positionY;
    }

    public int getPlayerId() {
        return playerId;
    }

    public void setPlayerId(int playerId) {
        this.playerId = playerId;
    }

    public int getPositionY() {
        return positionY;
    }

    public void setPositionY(int positionY) {
        this.positionY = positionY;
    }
}
