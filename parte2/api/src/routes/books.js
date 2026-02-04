import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// GET /api/books?authorId=1&publisherId=2&title=ensaio
router.get("/", async (req, res) => {
  try {
    const { authorId, publisherId, title } = req.query;

    const where = [];
    const params = [];

    if (authorId) { where.push("b.author_id = ?"); params.push(Number(authorId)); }
    if (publisherId) { where.push("b.publisher_id = ?"); params.push(Number(publisherId)); }
    if (title) { where.push("b.title LIKE ?"); params.push(`%${title}%`); }

    const sql = `
      SELECT b.*,
             a.name AS author_name,
             p.name AS publisher_name
      FROM books b
      JOIN authors a ON a.id = b.author_id
      JOIN publishers p ON p.id = b.publisher_id
      ${where.length ? "WHERE " + where.join(" AND ") : ""}
      ORDER BY b.id DESC
    `;

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: "id inválido" });

    const [rows] = await pool.query(
      `SELECT b.*,
              a.name AS author_name,
              p.name AS publisher_name
       FROM books b
       JOIN authors a ON a.id = b.author_id
       JOIN publishers p ON p.id = b.publisher_id
       WHERE b.id = ?`,
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Book not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, isbn, published_year, author_id, publisher_id } = req.body;
    if (!title) return res.status(400).json({ message: "title is required" });

    const authorId = Number(author_id);
    const publisherId = Number(publisher_id);
    if (!Number.isInteger(authorId)) return res.status(400).json({ message: "author_id inválido" });
    if (!Number.isInteger(publisherId)) return res.status(400).json({ message: "publisher_id inválido" });

    const [result] = await pool.query(
      "INSERT INTO books (title, isbn, published_year, author_id, publisher_id) VALUES (?, ?, ?, ?, ?)",
      [title, isbn ?? null, published_year ?? null, authorId, publisherId]
    );

    const [rows] = await pool.query("SELECT * FROM books WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: "id inválido" });

    const { title, isbn, published_year, author_id, publisher_id } = req.body;
    if (!title) return res.status(400).json({ message: "title is required" });

    const authorId = Number(author_id);
    const publisherId = Number(publisher_id);
    if (!Number.isInteger(authorId)) return res.status(400).json({ message: "author_id inválido" });
    if (!Number.isInteger(publisherId)) return res.status(400).json({ message: "publisher_id inválido" });

    const [result] = await pool.query(
      "UPDATE books SET title = ?, isbn = ?, published_year = ?, author_id = ?, publisher_id = ? WHERE id = ?",
      [title, isbn ?? null, published_year ?? null, authorId, publisherId, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Book not found" });

    const [rows] = await pool.query("SELECT * FROM books WHERE id = ?", [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: "id inválido" });

    const [result] = await pool.query("DELETE FROM books WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Book not found" });

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno" });
  }
});

export default router;
