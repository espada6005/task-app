package com.example.backend.list.dto;

import com.example.backend.board.entity.Board;
import com.example.backend.list.entity.TaskList;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class TaskListRequest {

    @NotBlank(message = "タイトルは必須です")
    @Size(max = 255, message = "タイトルは255文字以内で入力してください")
    private String title;

    public TaskList toEntity(Board board, int position) {
        TaskList taskList = new TaskList();
        taskList.setBoard(board);
        taskList.setTitle(this.title);
        taskList.setPosition(position);
        return taskList;
    }
}
