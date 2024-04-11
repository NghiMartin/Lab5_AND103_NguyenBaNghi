package com.example.lab5_and103.model;

public class Response <T>{
    private int status;
    private String messenger;
    private String token;
    private String refreshToken;
    private T data;

    public Response(int status, String messenger, String token, String refreshToken, T data) {
        this.status = status;
        this.messenger = messenger;
        this.token = token;
        this.refreshToken = refreshToken;
        this.data = data;
    }

    public Response() {
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessenger() {
        return messenger;
    }

    public void setMessenger(String messenger) {
        this.messenger = messenger;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}

