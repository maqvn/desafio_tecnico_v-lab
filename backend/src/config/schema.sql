CREATE TABLE users (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    email      VARCHAR(255) UNIQUE NOT NULL,
    password   VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL CHECK (char_length(name) >= 3),
    description TEXT,
    start_date  DATE NOT NULL,
    end_date    DATE NOT NULL,
    creator_id  INTEGER NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_creator
        FOREIGN KEY(creator_id) 
        REFERENCES users(id)
        ON DELETE CASCADE,
    
    CONSTRAINT check_dates 
        CHECK (end_date >= start_date)
);

CREATE TABLE lessons (
    id         SERIAL PRIMARY KEY,
    title      VARCHAR(255) NOT NULL CHECK (char_length(title) >= 3),
    status     VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    video_url  VARCHAR(500),
    course_id  INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_course
        FOREIGN KEY(course_id) 
        REFERENCES courses(id)
        ON DELETE CASCADE
);
