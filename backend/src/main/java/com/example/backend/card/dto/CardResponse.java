package com.example.backend.card.dto;

import com.example.backend.card.entity.Card;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
public class CardResponse {

    private final Long id;
    private final Long listId;
    private final String title;
    private final String description;
    private final int position;
    private final LocalDate dueDate;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public CardResponse(Card card) {
        this.id = card.getId();
        this.listId = card.getTaskList().getId();
        this.title = card.getTitle();
        this.description = card.getDescription();
        this.position = card.getPosition();
        this.dueDate = card.getDueDate();
        this.createdAt = card.getCreatedAt();
        this.updatedAt = card.getUpdatedAt();
    }
}
