const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/votes", async (req, res) => {
  const { ticket_id, user_id, candidate } = req.body;

  if (!ticket_id || !user_id || !candidate) {
    return res
      .status(400)
      .json({ error: "ticket_id, user_id, and candidate are required" });
  }

  try {
    const query = `INSERT INTO votes (ticket_id, user_id, candidate) VALUES (?, ?, ?)`;
    const [result] = await db.execute(query, [ticket_id, user_id, candidate]);

    res.status(201).json({ message: "Vote added", vote_id: result.insertId });
  } catch (err) {
    console.error("Vote insert error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/votes/:ticket_id", async (req, res) => {
  const { ticket_id } = req.params;

  try {
    const query = `
        SELECT vote.*, user.username AS voted_by
        FROM votes AS vote
        LEFT JOIN users AS user ON vote.user_id = user.user_id
        WHERE vote.ticket_id = ?
      `;
    const [rows] = await db.execute(query, [ticket_id]);

    res.json(rows);
  } catch (error) {
    console.error("Error fetching votes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/votes", async (req, res) => {
  const { ticket_id, user_id } = req.body;

  if (!ticket_id || !user_id) {
    return res
      .status(400)
      .json({ error: "ticket_id and user_id are required" });
  }

  try {
    const query = `DELETE FROM votes WHERE ticket_id = ? AND user_id = ?`;
    const [result] = await db.execute(query, [ticket_id, user_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Vote not found" });
    }

    res.json({ message: "Vote removed successfully" });
  } catch (error) {
    console.error("Error removing vote:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
