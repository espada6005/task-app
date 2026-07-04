package com.example.backend.card.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.util.List;

@Getter
public class ReorderCardRequest {

    @NotEmpty(message = "並び替え対象が空です")
    private List<CardOrderItem> cards;

    @Getter
    public static class CardOrderItem {

        @NotNull
        private Long id;

        @NotNull
        private Long listId;

        @NotNull
        private Integer position;
    }
}
