package com.example.backend.board.controller;

import com.example.backend.board.dto.BoardDetailResponse;
import com.example.backend.board.dto.BoardRequest;
import com.example.backend.board.dto.BoardResponse;
import com.example.backend.board.service.BoardService;
import com.example.backend.user.entity.User;
import com.example.backend.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    // TODO: Spring Security導入後に @AuthenticationPrincipal へ置き換える
    private final UserRepository userRepository;

    private User currentUser() {
        return userRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("テスト用ユーザーが存在しません"));
    }

    @GetMapping
    public List<BoardResponse> getBoards() {
        return boardService.getBoards(currentUser());
    }

    @GetMapping("/{id}")
    public BoardDetailResponse getBoard(@PathVariable Long id) {
        return boardService.getBoardDetail(currentUser(), id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BoardResponse createBoard(@RequestBody @Valid BoardRequest request) {
        return boardService.createBoard(currentUser(), request);
    }

    @PatchMapping("/{id}")
    public BoardResponse updateBoard(@PathVariable Long id,
                                     @RequestBody @Valid BoardRequest request) {
        return boardService.updateBoard(currentUser(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBoard(@PathVariable Long id) {
        boardService.deleteBoard(currentUser(), id);
    }
}
