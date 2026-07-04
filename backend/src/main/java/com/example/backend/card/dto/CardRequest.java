package com.example.backend.card.dto;

import com.example.backend.card.entity.Card;
import com.example.backend.list.entity.TaskList;
import jakarta.validation.constraints.Size;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class CardRequest {

    @Size(max = 255, message = "タイトルは255文字以内で入力してください")
    private String title;

    private String description;

    private LocalDate dueDate;

    public Card toEntity(TaskList taskList, int position) {
        Card card = new Card();
        card.setTaskList(taskList);
        card.setTitle(this.title);
        card.setDescription(this.description);
        card.setDueDate(this.dueDate);
        card.setPosition(position);
        return card;
    }
}
