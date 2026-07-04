package com.example.backend.card.controller;

import com.example.backend.card.dto.CardRequest;
import com.example.backend.card.dto.CardResponse;
import com.example.backend.card.dto.CardSearchResponse;
import com.example.backend.card.dto.ReorderCardRequest;
import com.example.backend.card.service.CardService;
import com.example.backend.user.entity.User;
import com.example.backend.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    // TODO: Spring Security導入後に @AuthenticationPrincipal へ置き換える
    private final UserRepository userRepository;

    private User currentUser() {
        return userRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("テスト用ユーザーが存在しません"));
    }

    @GetMapping("/api/cards/{id}")
    public CardResponse getCard(@PathVariable Long id) {
        return cardService.getCard(currentUser(), id);
    }

    @PostMapping("/api/lists/{listId}/cards")
    @ResponseStatus(HttpStatus.CREATED)
    public CardResponse createCard(@PathVariable Long listId,
                                   @RequestBody @Valid CardRequest request) {
        return cardService.createCard(currentUser(), listId, request);
    }

    @PatchMapping("/api/cards/{id}")
    public CardResponse updateCard(@PathVariable Long id,
                                   @RequestBody CardRequest request) {
        return cardService.updateCard(currentUser(), id, request);
    }

    @DeleteMapping("/api/cards/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCard(@PathVariable Long id) {
        cardService.deleteCard(currentUser(), id);
    }

    @PatchMapping("/api/cards/reorder")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void reorderCards(@RequestBody @Valid ReorderCardRequest request) {
        cardService.reorderCards(currentUser(), request);
    }

    @GetMapping("/api/boards/{boardId}/cards/search")
    public List<CardSearchResponse> searchCards(
            @PathVariable Long boardId,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dueDateBefore,
            @RequestParam(required = false) Boolean overdue) {
        return cardService.searchCards(currentUser(), boardId, title, dueDateBefore, overdue);
    }
}
