package com.example.backend.board.dto;

import com.example.backend.board.entity.Board;
import com.example.backend.list.dto.TaskListWithCardsResponse;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class BoardDetailResponse {

    private final Long id;
    private final String title;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;
    private final List<TaskListWithCardsResponse> lists;

    public BoardDetailResponse(Board board) {
        this.id = board.getId();
        this.title = board.getTitle();
        this.createdAt = board.getCreatedAt();
        this.updatedAt = board.getUpdatedAt();
        this.lists = board.getLists().stream()
                .map(TaskListWithCardsResponse::new)
                .toList();
    }
}
