-- ユーザー
CREATE TABLE users (
    id            BIGSERIAL    PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    totp_enabled  BOOLEAN      NOT NULL DEFAULT FALSE,
    totp_secret   VARCHAR(255),
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- バックアップコード（2FA）
CREATE TABLE backup_codes (
    id         BIGSERIAL    PRIMARY KEY,
    user_id    BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code_hash  VARCHAR(255) NOT NULL,
    used       BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- パスキー認証情報（WebAuthn）
CREATE TABLE passkey_credentials (
    id            BIGSERIAL    PRIMARY KEY,
    user_id       BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    credential_id VARCHAR(255) NOT NULL UNIQUE,
    public_key    TEXT         NOT NULL,
    user_handle   VARCHAR(255) NOT NULL,
    sign_count    BIGINT       NOT NULL DEFAULT 0,
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ボード
CREATE TABLE boards (
    id         BIGSERIAL    PRIMARY KEY,
    user_id    BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title      VARCHAR(255) NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- リスト（カラム）
CREATE TABLE lists (
    id         BIGSERIAL    PRIMARY KEY,
    board_id   BIGINT       NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    title      VARCHAR(255) NOT NULL,
    position   INT          NOT NULL DEFAULT 0,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- カード（タスク）
CREATE TABLE cards (
    id          BIGSERIAL    PRIMARY KEY,
    list_id     BIGINT       NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    position    INT          NOT NULL DEFAULT 0,
    due_date    DATE,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- 添付ファイル
CREATE TABLE attachments (
    id           BIGSERIAL     PRIMARY KEY,
    card_id      BIGINT        NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    filename     VARCHAR(255)  NOT NULL,
    file_path    VARCHAR(1000) NOT NULL,
    content_type VARCHAR(255)  NOT NULL,
    size         BIGINT        NOT NULL,
    created_at   TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_boards_user_id       ON boards(user_id);
CREATE INDEX idx_lists_board_id       ON lists(board_id);
CREATE INDEX idx_cards_list_id        ON cards(list_id);
CREATE INDEX idx_attachments_card_id  ON attachments(card_id);
CREATE INDEX idx_backup_codes_user_id ON backup_codes(user_id);
