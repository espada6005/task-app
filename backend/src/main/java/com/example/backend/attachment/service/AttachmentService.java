package com.example.backend.attachment.service;

import com.example.backend.attachment.dto.AttachmentResponse;
import com.example.backend.attachment.entity.Attachment;
import com.example.backend.attachment.repository.AttachmentRepository;
import com.example.backend.board.repository.BoardRepository;
import com.example.backend.card.entity.Card;
import com.example.backend.card.repository.CardRepository;
import com.example.backend.common.config.AppProperties;
import com.example.backend.common.exception.ResourceNotFoundException;
import com.example.backend.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttachmentService {

    private static final int MAX_ATTACHMENTS_PER_CARD = 10;

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg", "image/png", "image/gif", "image/webp",
            "application/pdf",
            "text/plain",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    );

    private final AttachmentRepository attachmentRepository;
    private final CardRepository cardRepository;
    private final BoardRepository boardRepository;
    private final AppProperties appProperties;

    public List<AttachmentResponse> getAttachments(User user, Long cardId) {
        findCardOwnedByUser(user, cardId);
        return attachmentRepository.findByCardId(cardId).stream()
                .map(AttachmentResponse::new)
                .toList();
    }

    @Transactional
    public AttachmentResponse upload(User user, Long cardId, MultipartFile file) {
        Card card = findCardOwnedByUser(user, cardId);

        validateFile(file, cardId);

        String originalFilename = sanitizeFilename(file.getOriginalFilename());
        String storedFilename = UUID.randomUUID() + "_" + originalFilename;
        Path filePath = resolveUploadPath(cardId).resolve(storedFilename);

        try {
            Files.createDirectories(filePath.getParent());
            Files.copy(file.getInputStream(), filePath);
        } catch (IOException e) {
            throw new RuntimeException("ファイルの保存に失敗しました", e);
        }

        Attachment attachment = new Attachment();
        attachment.setCard(card);
        attachment.setFilename(originalFilename);
        attachment.setFilePath(filePath.toString());
        attachment.setContentType(file.getContentType());
        attachment.setSize(file.getSize());

        return new AttachmentResponse(attachmentRepository.save(attachment));
    }

    public byte[] download(User user, Long attachmentId) {
        Attachment attachment = findAttachmentOwnedByUser(user, attachmentId);
        try {
            return Files.readAllBytes(Paths.get(attachment.getFilePath()));
        } catch (IOException e) {
            throw new RuntimeException("ファイルの読み込みに失敗しました", e);
        }
    }

    @Transactional
    public void delete(User user, Long attachmentId) {
        Attachment attachment = findAttachmentOwnedByUser(user, attachmentId);
        try {
            Files.deleteIfExists(Paths.get(attachment.getFilePath()));
        } catch (IOException e) {
            throw new RuntimeException("ファイルの削除に失敗しました", e);
        }
        attachmentRepository.delete(attachment);
    }

    private void validateFile(MultipartFile file, Long cardId) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("ファイルが空です");
        }
        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException("許可されていないファイル形式です");
        }
        if (attachmentRepository.countByCardId(cardId) >= MAX_ATTACHMENTS_PER_CARD) {
            throw new IllegalArgumentException("添付ファイルは1カードにつき最大10件までです");
        }
    }

    private String sanitizeFilename(String filename) {
        if (filename == null || filename.isBlank()) {
            return "file";
        }
        // パストラバーサル対策：ディレクトリ区切り文字を除去
        return Paths.get(filename).getFileName().toString();
    }

    private Path resolveUploadPath(Long cardId) {
        return Paths.get(appProperties.getUpload().getDir(), "cards", cardId.toString());
    }

    private Card findCardOwnedByUser(User user, Long cardId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException("カードが見つかりません"));

        boardRepository.findByIdAndUser(card.getTaskList().getBoard().getId(), user)
                .orElseThrow(() -> new ResourceNotFoundException("カードが見つかりません"));

        return card;
    }

    private Attachment findAttachmentOwnedByUser(User user, Long attachmentId) {
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("添付ファイルが見つかりません"));

        boardRepository.findByIdAndUser(
                        attachment.getCard().getTaskList().getBoard().getId(), user)
                .orElseThrow(() -> new ResourceNotFoundException("添付ファイルが見つかりません"));

        return attachment;
    }
}
