package com.example.backend.card.dto;

import com.example.backend.card.entity.Card;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class CardSearchResponse {

    private final Long id;
    private final Long listId;
    private final String listTitle;
    private final String title;
    private final String description;
    private final int position;
    private final LocalDate dueDate;

    public CardSearchResponse(Card card) {
        this.id = card.getId();
        this.listId = card.getTaskList().getId();
        this.listTitle = card.getTaskList().getTitle();
        this.title = card.getTitle();
        this.description = card.getDescription();
        this.position = card.getPosition();
        this.dueDate = card.getDueDate();
    }
}
