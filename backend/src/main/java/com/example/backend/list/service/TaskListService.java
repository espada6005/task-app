package com.example.backend.list.service;

import com.example.backend.board.entity.Board;
import com.example.backend.board.repository.BoardRepository;
import com.example.backend.common.exception.ResourceNotFoundException;
import com.example.backend.list.dto.ReorderListRequest;
import com.example.backend.list.dto.TaskListRequest;
import com.example.backend.list.dto.TaskListResponse;
import com.example.backend.list.entity.TaskList;
import com.example.backend.list.repository.TaskListRepository;
import com.example.backend.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TaskListService {

    private final TaskListRepository taskListRepository;
    private final BoardRepository boardRepository;

    @Transactional
    public TaskListResponse createList(User user, Long boardId, TaskListRequest request) {
        Board board = findBoardOwnedByUser(user, boardId);
        int nextPosition = taskListRepository.countByBoard(board);

        return new TaskListResponse(taskListRepository.save(request.toEntity(board, nextPosition)));
    }

    @Transactional
    public TaskListResponse updateList(User user, Long listId, TaskListRequest request) {
        TaskList taskList = findListOwnedByUser(user, listId);
        taskList.setTitle(request.getTitle());
        return new TaskListResponse(taskList);
    }

    @Transactional
    public void deleteList(User user, Long listId) {
        TaskList taskList = findListOwnedByUser(user, listId);
        taskListRepository.delete(taskList);
    }

    @Transactional
    public void reorderLists(User user, ReorderListRequest request) {
        findBoardOwnedByUser(user, request.getBoardId());

        // リクエストのID→positionマップを構築
        Map<Long, Integer> positionMap = request.getLists().stream()
                .collect(Collectors.toMap(
                        ReorderListRequest.ListOrderItem::getId,
                        ReorderListRequest.ListOrderItem::getPosition
                ));

        List<TaskList> lists = taskListRepository.findAllById(positionMap.keySet());
        lists.forEach(list -> list.setPosition(positionMap.get(list.getId())));
    }

    private Board findBoardOwnedByUser(User user, Long boardId) {
        return boardRepository.findByIdAndUser(boardId, user)
                .orElseThrow(() -> new ResourceNotFoundException("ボードが見つかりません"));
    }

    private TaskList findListOwnedByUser(User user, Long listId) {
        TaskList taskList = taskListRepository.findById(listId)
                .orElseThrow(() -> new ResourceNotFoundException("リストが見つかりません"));

        // リストが属するボードがログインユーザーのものか確認
        boardRepository.findByIdAndUser(taskList.getBoard().getId(), user)
                .orElseThrow(() -> new ResourceNotFoundException("リストが見つかりません"));

        return taskList;
    }
}
