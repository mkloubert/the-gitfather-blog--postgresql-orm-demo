CREATE TABLE IF NOT EXISTS public.migrations
(
    "id" bigserial NOT NULL,
    "timestamp" bigint NOT NULL,
    "name" character varying NOT NULL,

    CONSTRAINT pk_migrations_id PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
);
