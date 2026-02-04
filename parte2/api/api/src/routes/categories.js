import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categories ORDER BY id DESC");
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

    const [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Category not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "name is required" });

    const [result] = await pool.query("INSERT INTO categories (name) VALUES (?)", [name]);
    const [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    // nome duplicado -> 409
    if (err?.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "Category already exists" });
    console.error(err);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: "id inválido" });

    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "name is required" });

    const [result] = await pool.query("UPDATE categories SET name = ? WHERE id = ?", [name, id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Category not found" });

    const [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [id]);
    res.json(rows[0]);
  } catch (err) {
    if (err?.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "Category already exists" });
    console.error(err);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: "id inválido" });

    const [result] = await pool.query("DELETE FROM categories WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Category not found" });

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno" });
  }
});

export default router;
