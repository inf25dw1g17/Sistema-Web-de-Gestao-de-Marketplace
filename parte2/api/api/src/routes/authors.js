import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

/**
 * GET /api/authors
 * Lista todos os autores
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM authors ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno" });
  }
});

/**
 * GET /api/authors/:id
 * Obter autor por ID
 */
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "id inválido (tem de ser número)" });
    }

    const [rows] = await pool.query(
      "SELECT * FROM authors WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Author not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno" });
  }
});

/**
 * POST /api/authors
 * Criar novo autor
 */
router.post("/", async (req, res) => {
  try {
    const { name, bio } = req.body;
    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }

    const [result] = await pool.query(
      "INSERT INTO authors (name, bio) VALUES (?, ?)",
      [name, bio ?? null]
    );

    const [rows] = await pool.query(
      "SELECT * FROM authors WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno" });
  }
});

/**
 * PUT /api/authors/:id
 * Atualizar autor
 */
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "id inválido (tem de ser número)" });
    }

    const { name, bio } = req.body;
    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }

    const [result] = await pool.query(
      "UPDATE authors SET name = ?, bio = ? WHERE id = ?",
      [name, bio ?? null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Author not found" });
    }

    const [rows] = await pool.query(
      "SELECT * FROM authors WHERE id = ?",
      [id]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno" });
  }
});

/**
 * DELETE /api/authors/:id
 * Apagar autor
 */
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "id inválido (tem de ser número)" });
    }

    const [result] = await pool.query(
      "DELETE FROM authors WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Author not found" });
    }

    res.status(204).send();
 } catch (err) {
  if (err.code === "ER_ROW_IS_REFERENCED_2") {
    return res.status(409).json({
      message: "Não é possível apagar o autor porque existem livros associados"
    });
  }
  console.error(err);
  res.status(500).json({ message: "Erro interno" });
}

});

export default router;
