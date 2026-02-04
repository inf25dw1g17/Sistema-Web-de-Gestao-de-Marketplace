CREATE DATABASE IF NOT EXISTS dw2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dw2;

CREATE TABLE IF NOT EXISTS authors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  bio TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS publishers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  country VARCHAR(80) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  isbn VARCHAR(20) UNIQUE NULL,
  published_year INT NULL,
  author_id INT NOT NULL,
  publisher_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_books_author FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE RESTRICT,
  CONSTRAINT fk_books_publisher FOREIGN KEY (publisher_id) REFERENCES publishers(id) ON DELETE RESTRICT
);

-- Seeds
INSERT INTO authors (name, bio) VALUES
('José Saramago', NULL),
('Sophia de Mello Breyner', NULL);

INSERT INTO publishers (name, country) VALUES
('Porto Editora', 'Portugal'),
('Penguin', 'UK');

INSERT INTO categories (name) VALUES
('Romance'),
('Poesia'),
('Ficção');

INSERT INTO books (title, isbn, published_year, author_id, publisher_id) VALUES
('Ensaio sobre a Cegueira', '9789722115820', 1995, 1, 1);
