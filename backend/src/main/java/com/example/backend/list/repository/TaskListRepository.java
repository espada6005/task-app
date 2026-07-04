package com.example.backend.list.repository;

import com.example.backend.board.entity.Board;
import com.example.backend.list.entity.TaskList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskListRepository extends JpaRepository<TaskList, Long> {

    List<TaskList> findByBoardOrderByPositionAsc(Board board);

    Optional<TaskList> findByIdAndBoard(Long id, Board board);

    // 並び替え時に最大positionを取得して末尾に追加するため
    int countByBoard(Board board);
}
