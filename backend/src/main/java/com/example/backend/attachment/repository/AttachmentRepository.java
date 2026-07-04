package com.example.backend.attachment.repository;

import com.example.backend.attachment.entity.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {

    List<Attachment> findByCardId(Long cardId);

    // 1カードあたり最大10件の制約チェック用
    int countByCardId(Long cardId);
}
