package com.example.backend.card.service;

import com.example.backend.board.repository.BoardRepository;
import com.example.backend.card.dto.CardRequest;
import com.example.backend.card.dto.CardResponse;
import com.example.backend.card.dto.CardSearchResponse;
import com.example.backend.card.dto.ReorderCardRequest;
import com.example.backend.card.entity.Card;
import com.example.backend.card.repository.CardRepository;
import com.example.backend.card.specification.CardSpecification;
import com.example.backend.common.exception.ResourceNotFoundException;
import com.example.backend.list.entity.TaskList;
import com.example.backend.list.repository.TaskListRepository;
import com.example.backend.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CardService {

    private final CardRepository cardRepository;
    private final TaskListRepository taskListRepository;
    private final BoardRepository boardRepository;

    public CardResponse getCard(User user, Long cardId) {
        Card card = findCardOwnedByUser(user, cardId);
        return new CardResponse(card);
    }

    @Transactional
    public CardResponse createCard(User user, Long listId, CardRequest request) {
        TaskList taskList = findListOwnedByUser(user, listId);
        int nextPosition = taskList.getCards().size();

        return new CardResponse(cardRepository.save(request.toEntity(taskList, nextPosition)));
    }

    @Transactional
    public CardResponse updateCard(User user, Long cardId, CardRequest request) {
        Card card = findCardOwnedByUser(user, cardId);

        if (request.getTitle() != null) {
            card.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            card.setDescription(request.getDescription());
        }
        if (request.getDueDate() != null) {
            card.setDueDate(request.getDueDate());
        }

        return new CardResponse(card);
    }

    @Transactional
    public void deleteCard(User user, Long cardId) {
        Card card = findCardOwnedByUser(user, cardId);
        cardRepository.delete(card);
    }

    @Transactional
    public void reorderCards(User user, ReorderCardRequest request) {
        Map<Long, ReorderCardRequest.CardOrderItem> itemMap = request.getCards().stream()
                .collect(Collectors.toMap(
                        ReorderCardRequest.CardOrderItem::getId,
                        item -> item
                ));

        List<Card> cards = cardRepository.findAllById(itemMap.keySet());

        cards.forEach(card -> {
            ReorderCardRequest.CardOrderItem item = itemMap.get(card.getId());

            // 別リストへの移動
            if (!card.getTaskList().getId().equals(item.getListId())) {
                TaskList destinationList = findListOwnedByUser(user, item.getListId());
                card.setTaskList(destinationList);
            }

            card.setPosition(item.getPosition());
        });
    }

    public List<CardSearchResponse> searchCards(User user, Long boardId, String title,
                                                 LocalDate dueDateBefore, Boolean overdue) {
        boardRepository.findByIdAndUser(boardId, user)
                .orElseThrow(() -> new ResourceNotFoundException("ボードが見つかりません"));

        Specification<Card> spec = CardSpecification.belongsToBoard(boardId);
        if (title != null && !title.isBlank()) {
            spec = spec.and(CardSpecification.titleContains(title));
        }
        if (dueDateBefore != null) {
            spec = spec.and(CardSpecification.dueDateBefore(dueDateBefore));
        }
        if (Boolean.TRUE.equals(overdue)) {
            spec = spec.and(CardSpecification.overdue());
        }

        return cardRepository.findAll(spec).stream()
                .map(CardSearchResponse::new)
                .toList();
    }

    private Card findCardOwnedByUser(User user, Long cardId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException("カードが見つかりません"));

        Long boardId = card.getTaskList().getBoard().getId();
        boardRepository.findByIdAndUser(boardId, user)
                .orElseThrow(() -> new ResourceNotFoundException("カードが見つかりません"));

        return card;
    }

    private TaskList findListOwnedByUser(User user, Long listId) {
        TaskList taskList = taskListRepository.findById(listId)
                .orElseThrow(() -> new ResourceNotFoundException("リストが見つかりません"));

        boardRepository.findByIdAndUser(taskList.getBoard().getId(), user)
                .orElseThrow(() -> new ResourceNotFoundException("リストが見つかりません"));

        return taskList;
    }
}
