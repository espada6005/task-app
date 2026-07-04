package com.example.backend.list.dto;

import com.example.backend.list.entity.TaskList;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class TaskListResponse {

    private final Long id;
    private final Long boardId;
    private final String title;
    private final int position;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public TaskListResponse(TaskList taskList) {
        this.id = taskList.getId();
        this.boardId = taskList.getBoard().getId();
        this.title = taskList.getTitle();
        this.position = taskList.getPosition();
        this.createdAt = taskList.getCreatedAt();
        this.updatedAt = taskList.getUpdatedAt();
    }
}
