package com.example.backend.list.repository;

import com.example.backend.board.entity.Board;
import com.example.backend.list.entity.TaskList;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskListRepository extends JpaRepository<TaskList, Long> {

    // 並び替え時に最大positionを取得して末尾に追加するため
    int countByBoard(Board board);

}
