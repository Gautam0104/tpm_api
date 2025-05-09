const express = require("express");
const router = express.Router();
const db = require("../config/db"); // Make sure db is using mysql2/promise

// List all watch boards
router.get("/watch-boards", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM watch_boards");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get boards by ticket_id
router.get("/watch-boards-ticket/:ticket_id", async (req, res) => {
  const ticket_id = req.params.ticket_id;
  const sql = `SELECT * FROM watch_boards WHERE ticket_id = ?`;
  try {
    const [result] = await db.query(sql, [ticket_id]);
    if (result.length === 0) {
      return res.status(404).json({ message: "Board not found" });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get boards by project_id
router.get("/watch-boards-project/:project_id", async (req, res) => {
  const project_id = req.params.project_id;
  const sql = `SELECT * FROM watch_boards WHERE project_id = ?`;
  try {
    const [result] = await db.query(sql, [project_id]);
    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No boards found for this project" });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single board with ticket and project info
router.get("/watch-boards/:id", async (req, res) => {
  const id = req.params.id;
  const sql = `
    SELECT wb.*, t.title AS ticket_title, p.project_title AS project_name
    FROM watch_boards wb
    LEFT JOIN tickets t ON wb.ticket_id = t.ticket_id
    LEFT JOIN projects p ON wb.project_id = p.project_id
    WHERE wb.id = ?
  `;
  try {
    const [result] = await db.query(sql, [id]);
    if (result.length === 0) {
      return res.status(404).json({ message: "Board not found" });
    }
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new watch board
router.post("/watch-boards", async (req, res) => {
  const { name, ticket_id, project_id } = req.body;
  const sql =
    "INSERT INTO watch_boards (name, ticket_id, project_id) VALUES (?, ?, ?)";
  try {
    const [result] = await db.query(sql, [
      name,
      ticket_id || null,
      project_id || null
    ]);
    res.status(201).json({ id: result.insertId, name, ticket_id, project_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a watch board
router.put("/watch-boards/:id", async (req, res) => {
  const { name, ticket_id, project_id } = req.body;
  const id = req.params.id;
  const sql = `
    UPDATE watch_boards SET name = ?, ticket_id = ?, project_id = ? WHERE id = ?
  `;
  try {
    await db.query(sql, [name, ticket_id || null, project_id || null, id]);
    res.json({ message: "Board updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a watch board
router.delete("/watch-boards-ticket/:ticket_id", async (req, res) => {
  const ticket_id = req.params.ticket_id;
  try {
    await db.query("DELETE FROM watch_boards WHERE ticket_id = ?", [ticket_id]);
    res.json({ message: "Board deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.delete("/watch-boards-project/:project_id", async (req, res) => {
  const project_id = req.params.project_id;
  try {
    await db.query("DELETE FROM watch_boards WHERE project_id = ?", [
      project_id
    ]);
    res.json({ message: "Board deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
