package com.example.backend.attachment.controller;

import com.example.backend.attachment.dto.AttachmentResponse;
import com.example.backend.attachment.entity.Attachment;
import com.example.backend.attachment.repository.AttachmentRepository;
import com.example.backend.attachment.service.AttachmentService;
import com.example.backend.common.exception.ResourceNotFoundException;
import com.example.backend.user.entity.User;
import com.example.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class AttachmentController {

    private final AttachmentService attachmentService;
    private final AttachmentRepository attachmentRepository;

    // TODO: Spring Security導入後に @AuthenticationPrincipal へ置き換える
    private final UserRepository userRepository;

    private User currentUser() {
        return userRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("テスト用ユーザーが存在しません"));
    }

    @GetMapping("/api/cards/{cardId}/attachments")
    public List<AttachmentResponse> getAttachments(@PathVariable Long cardId) {
        return attachmentService.getAttachments(currentUser(), cardId);
    }

    @PostMapping("/api/cards/{cardId}/attachments")
    @ResponseStatus(HttpStatus.CREATED)
    public AttachmentResponse upload(@PathVariable Long cardId,
                                     @RequestParam("file") MultipartFile file) {
        return attachmentService.upload(currentUser(), cardId, file);
    }

    @GetMapping("/api/attachments/{id}/download")
    public ResponseEntity<byte[]> download(@PathVariable Long id) {
        Attachment attachment = attachmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("添付ファイルが見つかりません"));

        byte[] data = attachmentService.download(currentUser(), id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(attachment.getContentType()));
        headers.setContentDisposition(
                ContentDisposition.attachment()
                        .filename(attachment.getFilename(), StandardCharsets.UTF_8)
                        .build()
        );

        return ResponseEntity.ok().headers(headers).body(data);
    }

    @DeleteMapping("/api/attachments/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        attachmentService.delete(currentUser(), id);
    }
}
