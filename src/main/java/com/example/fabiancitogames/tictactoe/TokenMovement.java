package com.example.fabiancitogames.tictactoe;

public class TokenMovement {
    private int playerID;
    private int positionX;
    private int positionY;

    public TokenMovement() {
    }

    public TokenMovement(int playerID, int positionX, int positionY) {
        this.playerID = playerID;
        this.positionX = positionX;
        this.positionY = positionY;
    }

    public int getPlayerID() {
        return playerID;
    }

    public void setPlayerID(int playerID) {
        this.playerID = playerID;
    }

    public int getPositionX() {
        return positionX;
    }

    public void setPositionX(int positionX) {
        this.positionX = positionX;
    }

    public int getPositionY() {
        return positionY;
    }

    public void setPositionY(int positionY) {
        this.positionY = positionY;
    }
}
