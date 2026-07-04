package com.example.backend.list.dto;

import com.example.backend.card.dto.CardSummaryResponse;
import com.example.backend.list.entity.TaskList;
import lombok.Getter;

import java.util.List;

@Getter
public class TaskListWithCardsResponse {

    private final Long id;
    private final String title;
    private final int position;
    private final List<CardSummaryResponse> cards;

    public TaskListWithCardsResponse(TaskList taskList) {
        this.id = taskList.getId();
        this.title = taskList.getTitle();
        this.position = taskList.getPosition();
        this.cards = taskList.getCards().stream()
                .map(CardSummaryResponse::new)
                .toList();
    }
}
