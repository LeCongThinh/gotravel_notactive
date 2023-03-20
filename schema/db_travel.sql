create table users
(
    id              uuid                     default gen_random_uuid() not null
        constraint user_pk
            primary key,
    email           varchar(250),
    password        varchar(250),
    salt_key        varchar(250),
    activation_key  varchar(250),
    status          smallint,
    created_at      timestamp with time zone default now(),
    modification_at timestamp with time zone default now()
);

create table user_details
(
    user_id    uuid,
    first_name varchar(250),
    sur_name   varchar(250),
    gender     smallint,
    address    varchar(250),
    phone      varchar(16)
);