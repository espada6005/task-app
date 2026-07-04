package com.example.backend.list.controller;

import com.example.backend.list.dto.ReorderListRequest;
import com.example.backend.list.dto.TaskListRequest;
import com.example.backend.list.dto.TaskListResponse;
import com.example.backend.list.service.TaskListService;
import com.example.backend.user.entity.User;
import com.example.backend.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class TaskListController {

    private final TaskListService taskListService;

    // TODO: Spring Security導入後に @AuthenticationPrincipal へ置き換える
    private final UserRepository userRepository;

    private User currentUser() {
        return userRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("テスト用ユーザーが存在しません"));
    }

    @PostMapping("/api/boards/{boardId}/lists")
    @ResponseStatus(HttpStatus.CREATED)
    public TaskListResponse createList(@PathVariable Long boardId,
                                       @RequestBody @Valid TaskListRequest request) {
        return taskListService.createList(currentUser(), boardId, request);
    }

    @PatchMapping("/api/lists/{id}")
    public TaskListResponse updateList(@PathVariable Long id,
                                       @RequestBody @Valid TaskListRequest request) {
        return taskListService.updateList(currentUser(), id, request);
    }

    @DeleteMapping("/api/lists/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteList(@PathVariable Long id) {
        taskListService.deleteList(currentUser(), id);
    }

    @PatchMapping("/api/lists/reorder")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void reorderLists(@RequestBody @Valid ReorderListRequest request) {
        taskListService.reorderLists(currentUser(), request);
    }
}
