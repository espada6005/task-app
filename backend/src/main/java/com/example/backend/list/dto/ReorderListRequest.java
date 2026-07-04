package com.example.backend.list.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.util.List;

@Getter
public class ReorderListRequest {

    @NotNull(message = "ボードIDは必須です")
    private Long boardId;

    @NotEmpty(message = "並び替え対象が空です")
    private List<ListOrderItem> lists;

    @Getter
    public static class ListOrderItem {

        @NotNull
        private Long id;

        @NotNull
        private Integer position;
    }
}
