package com.example.fabiancitogames;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/pong")
    public String index() {
        return "pong";
    }

    @GetMapping("/tictactoe")
    public String tictactoe() {
        return "tictactoe";
    }
}
