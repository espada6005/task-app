package com.example.backend.board.service;

import com.example.backend.board.dto.BoardDetailResponse;
import com.example.backend.board.dto.BoardRequest;
import com.example.backend.board.dto.BoardResponse;
import com.example.backend.board.entity.Board;
import com.example.backend.board.repository.BoardRepository;
import com.example.backend.common.exception.ResourceNotFoundException;
import com.example.backend.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BoardService {

    private final BoardRepository boardRepository;

    public List<BoardResponse> getBoards(User user) {
        return boardRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(BoardResponse::new)
                .toList();
    }

    public BoardResponse getBoard(User user, Long boardId) {
        Board board = findBoardOwnedByUser(user, boardId);
        return new BoardResponse(board);
    }

    public BoardDetailResponse getBoardDetail(User user, Long boardId) {
        Board board = boardRepository.findDetailByIdAndUser(boardId, user)
                .orElseThrow(() -> new ResourceNotFoundException("ボードが見つかりません"));
        // 永続化コンテキスト内でboard.getLists()の各TaskListにcardsを充填する
        boardRepository.fetchListsWithCards(boardId);
        return new BoardDetailResponse(board);
    }

    @Transactional
    public BoardResponse createBoard(User user, BoardRequest request) {
        return new BoardResponse(boardRepository.save(request.toEntity(user)));
    }

    @Transactional
    public BoardResponse updateBoard(User user, Long boardId, BoardRequest request) {
        Board board = findBoardOwnedByUser(user, boardId);
        board.setTitle(request.getTitle());
        return new BoardResponse(board);
    }

    @Transactional
    public void deleteBoard(User user, Long boardId) {
        Board board = findBoardOwnedByUser(user, boardId);
        boardRepository.delete(board);
    }

    private Board findBoardOwnedByUser(User user, Long boardId) {
        return boardRepository.findByIdAndUser(boardId, user)
                .orElseThrow(() -> new ResourceNotFoundException("ボードが見つかりません"));
    }
}
