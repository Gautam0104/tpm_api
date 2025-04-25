const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/get-comments/:ticket_id", async (req, res) => {
  const { ticket_id } = req.params;

  if (!ticket_id) {
    return res.status(400).json({ error: "Ticket ID is required" });
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM ticket_changes WHERE ticket_id = ?",
      [ticket_id]
    );
    res.json(rows);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/get-comments", async (req, res) => {
  try {
    const query = `
      SELECT 
        ticket_changes.*, 
        tickets.title AS title
      FROM ticket_changes
      INNER JOIN tickets ON ticket_changes.ticket_id = tickets.ticket_id
      ORDER BY ticket_changes.changed_at DESC
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
