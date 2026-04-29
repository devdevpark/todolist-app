-- 002_create_categories.sql
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

CREATE INDEX IF NOT EXISTS idx_categories_user_id  ON categories (user_id);
