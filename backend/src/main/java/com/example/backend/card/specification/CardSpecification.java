package com.example.backend.card.specification;

import com.example.backend.card.entity.Card;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class CardSpecification {

    private CardSpecification() {
    }

    public static Specification<Card> belongsToBoard(Long boardId) {
        return (root, query, cb) ->
                cb.equal(root.get("taskList").get("board").get("id"), boardId);
    }

    public static Specification<Card> titleContains(String title) {
        return (root, query, cb) ->
                cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%");
    }

    public static Specification<Card> dueDateBefore(LocalDate date) {
        return (root, query, cb) ->
                cb.lessThanOrEqualTo(root.get("dueDate"), date);
    }

    public static Specification<Card> overdue() {
        return (root, query, cb) ->
                cb.lessThan(root.get("dueDate"), LocalDate.now());
    }
}
