import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { country } = req.query;
    const [rows] = country
      ? await pool.query("SELECT * FROM publishers WHERE country = ? ORDER BY id DESC", [country])
      : await pool.query("SELECT * FROM publishers ORDER BY id DESC");
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

    const [rows] = await pool.query("SELECT * FROM publishers WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Publisher not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, country } = req.body;
    if (!name) return res.status(400).json({ message: "name is required" });

    const [result] = await pool.query(
      "INSERT INTO publishers (name, country) VALUES (?, ?)",
      [name, country ?? null]
    );

    const [rows] = await pool.query("SELECT * FROM publishers WHERE id = ?", [result.insertId]);
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

    const { name, country } = req.body;
    if (!name) return res.status(400).json({ message: "name is required" });

    const [result] = await pool.query(
      "UPDATE publishers SET name = ?, country = ? WHERE id = ?",
      [name, country ?? null, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Publisher not found" });

    const [rows] = await pool.query("SELECT * FROM publishers WHERE id = ?", [id]);
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

    const [result] = await pool.query("DELETE FROM publishers WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Publisher not found" });

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno" });
  }
});

export default router;
