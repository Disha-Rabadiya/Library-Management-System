CREATE TABLE role (
    id VARCHAR(40) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,

    is_active BOOLEAN DEFAULT TRUE,
    created_at BIGINT NOT NULL,
    created_by VARCHAR(40),
    updated_at BIGINT,
    updated_by VARCHAR(40),
    deleted_at BIGINT,
    deleted_by VARCHAR(40),
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE media (
    id VARCHAR(40) PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255),
    original_name VARCHAR(255) NOT NULL,
    content_type VARCHAR(128) NOT NULL,
    size INTEGER NOT NULL,
    key VARCHAR(255),
    status VARCHAR(15) NOT NULL,
    media_type VARCHAR(15) NOT NULL,
    is_converted BOOLEAN DEFAULT FALSE,
    converted_size INTEGER,
    is_public BOOLEAN DEFAULT TRUE,

    is_active BOOLEAN DEFAULT TRUE,
    created_at BIGINT NOT NULL,
    created_by VARCHAR(40),
    updated_at BIGINT,
    updated_by VARCHAR(40),
    deleted_at BIGINT,
    deleted_by VARCHAR(40),
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE "user" (
    id VARCHAR(40) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    phone VARCHAR(15),
    country_code VARCHAR(5),
    registration_type VARCHAR(20) DEFAULT 'email',
    forgot_password_token VARCHAR(255),
    forgot_password_token_expiry BIGINT,
    last_login_at BIGINT,
    role_id VARCHAR(40) NOT NULL,
    profile_pic_id VARCHAR(40),
    token VARCHAR(500),

    is_active BOOLEAN DEFAULT TRUE,
    created_at BIGINT NOT NULL,
    created_by VARCHAR(40),
    updated_at BIGINT,
    updated_by VARCHAR(40),
    deleted_at BIGINT,
    deleted_by VARCHAR(40),
    is_deleted BOOLEAN DEFAULT FALSE,

    CONSTRAINT fk_user_role
        FOREIGN KEY(role_id)
        REFERENCES role(id),

    CONSTRAINT fk_user_profile_pic
        FOREIGN KEY(profile_pic_id)
        REFERENCES media(id)
);