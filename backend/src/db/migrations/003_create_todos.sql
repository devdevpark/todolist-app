-- 003_create_todos.sql
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

CREATE INDEX IF NOT EXISTS idx_todos_user_id       ON todos (user_id);
CREATE INDEX IF NOT EXISTS idx_todos_category_id   ON todos (category_id);
CREATE INDEX IF NOT EXISTS idx_todos_status_due    ON todos (user_id, status, due_date);
