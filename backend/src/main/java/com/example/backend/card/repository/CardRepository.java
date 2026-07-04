package com.example.backend.card.repository;

import com.example.backend.card.entity.Card;
import com.example.backend.list.entity.TaskList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface CardRepository extends JpaRepository<Card, Long>, JpaSpecificationExecutor<Card> {

    List<Card> findByTaskListOrderByPositionAsc(TaskList taskList);

    // 並び替え・移動時に対象リストの全カードを取得
    List<Card> findByTaskListIdOrderByPositionAsc(Long listId);
}
