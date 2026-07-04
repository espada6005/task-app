package com.example.backend.board.repository;

import com.example.backend.board.entity.Board;
import com.example.backend.list.entity.TaskList;
import com.example.backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BoardRepository extends JpaRepository<Board, Long> {

    List<Board> findByUserOrderByCreatedAtDesc(User user);

    Optional<Board> findByIdAndUser(Long id, User user);

    // Hibernateは1クエリで複数のList（bag）コレクションを同時にJOIN FETCHできないため、
    // リストとカードを2クエリに分けて取得する（同一トランザクション内なので永続化コンテキストで自動的にマージされる）
    @Query("""
            SELECT DISTINCT b FROM Board b
            LEFT JOIN FETCH b.lists
            WHERE b.id = :id AND b.user = :user
            """)
    Optional<Board> findDetailByIdAndUser(@Param("id") Long id, @Param("user") User user);

    @Query("""
            SELECT DISTINCT l FROM TaskList l
            LEFT JOIN FETCH l.cards
            WHERE l.board.id = :boardId
            """)
    List<TaskList> fetchListsWithCards(@Param("boardId") Long boardId);
}
