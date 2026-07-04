package com.example.backend.board.dto;

import com.example.backend.board.entity.Board;
import com.example.backend.user.entity.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class BoardRequest {

    @NotBlank(message = "タイトルは必須です")
    @Size(max = 255, message = "タイトルは255文字以内で入力してください")
    private String title;

    public Board toEntity(User user) {
        Board board = new Board();
        board.setUser(user);
        board.setTitle(this.title);
        return board;
    }
}
