-- =============================================================
-- TodoList Database Schema
-- 기반 문서: docs/6-erd.md v1.0.0
-- =============================================================

-- UUID 생성 확장 활성화
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================
-- 1. users
-- =============================================================
CREATE TABLE IF NOT EXISTS users (
    id          UUID        NOT NULL DEFAULT gen_random_uuid(),
    username    VARCHAR(20) NOT NULL,
    password    TEXT        NOT NULL,
    role        VARCHAR(10) NOT NULL DEFAULT 'USER',
    is_active   BOOLEAN     NOT NULL DEFAULT true,
    created_at  TIMESTAMP   NOT NULL DEFAULT now(),

    CONSTRAINT pk_users            PRIMARY KEY (id),
    CONSTRAINT uq_users_username   UNIQUE (username),
    CONSTRAINT ck_users_role       CHECK (role IN ('ADMIN', 'USER'))
);

-- =============================================================
-- 2. categories
-- =============================================================
CREATE TABLE IF NOT EXISTS categories (
    id          UUID        NOT NULL DEFAULT gen_random_uuid(),
    user_id     UUID        NOT NULL,
    name        VARCHAR(50) NOT NULL,
    color_code  VARCHAR(7)  NOT NULL,
    created_at  TIMESTAMP   NOT NULL DEFAULT now(),

    CONSTRAINT pk_categories                PRIMARY KEY (id),
    CONSTRAINT fk_categories_user           FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT uq_categories_user_name      UNIQUE (user_id, name)
);

-- =============================================================
-- 3. todos
-- =============================================================
CREATE TABLE IF NOT EXISTS todos (
    id              UUID         NOT NULL DEFAULT gen_random_uuid(),
    user_id         UUID         NOT NULL,
    category_id     UUID,
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    due_date        TIMESTAMP,
    status          VARCHAR(10)  NOT NULL DEFAULT 'PENDING',
    created_at      TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP    NOT NULL DEFAULT now(),
    completed_at    TIMESTAMP,

    CONSTRAINT pk_todos             PRIMARY KEY (id),
    CONSTRAINT fk_todos_user        FOREIGN KEY (user_id)     REFERENCES users (id)      ON DELETE CASCADE,
    CONSTRAINT fk_todos_category    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL,
    CONSTRAINT ck_todos_status      CHECK (status IN ('PENDING', 'COMPLETED'))
);

-- =============================================================
-- 4. updated_at 자동 갱신 트리거
-- =============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_todos_updated_at
    BEFORE UPDATE ON todos
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- =============================================================
-- 5. 인덱스
-- =============================================================

-- 할일 목록 조회 (user_id 기준 필터링이 가장 빈번)
CREATE INDEX IF NOT EXISTS idx_todos_user_id       ON todos (user_id);
CREATE INDEX IF NOT EXISTS idx_todos_category_id   ON todos (category_id);
-- 상태 + 종료일 조합 조회 (OVERDUE 판별 쿼리 최적화)
CREATE INDEX IF NOT EXISTS idx_todos_status_due    ON todos (user_id, status, due_date);

-- 카테고리 목록 조회
CREATE INDEX IF NOT EXISTS idx_categories_user_id  ON categories (user_id);
