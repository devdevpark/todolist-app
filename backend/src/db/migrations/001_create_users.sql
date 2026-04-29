-- 001_create_users.sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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
