package com.example.backend.attachment.dto;

import com.example.backend.attachment.entity.Attachment;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class AttachmentResponse {

    private final Long id;
    private final Long cardId;
    private final String filename;
    private final String contentType;
    private final long size;
    private final LocalDateTime createdAt;

    public AttachmentResponse(Attachment attachment) {
        this.id = attachment.getId();
        this.cardId = attachment.getCard().getId();
        this.filename = attachment.getFilename();
        this.contentType = attachment.getContentType();
        this.size = attachment.getSize();
        this.createdAt = attachment.getCreatedAt();
    }
}
