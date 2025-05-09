const express = require("express");
const router = express.Router();
const db = require("../config/db"); // Make sure db is a MySQL pool

// Archive a single card
router.post("/archive-card", async (req, res) => {
  const { cardId } = req.body;
  if (!cardId) return res.status(400).json({ message: "Missing cardId" });

  try {
    const query = "INSERT INTO archived_cards (card_id) VALUES (?)";
    await db.execute(query, [cardId]);
    res.status(200).json({ message: "Card archived successfully" });
  } catch (error) {
    console.error("Error archiving card:", error);
    res.status(500).json({ message: "Failed to archive card" });
  }
});

// Archive multiple cards
router.post("/archive-cards", async (req, res) => {
  const { archivedCards } = req.body;
  if (!Array.isArray(archivedCards) || archivedCards.length === 0) {
    return res
      .status(400)
      .json({ message: "archivedCards must be a non-empty array" });
  }

  try {
    const query = "INSERT INTO archived_cards (card_id) VALUES ?";
    const values = archivedCards.map((cardId) => [cardId]);
    await db.query(query, [values]);
    res.status(200).json({ message: "Cards archived successfully" });
  } catch (error) {
    console.error("Error archiving cards:", error);
    res.status(500).json({ message: "Failed to archive cards" });
  }
});

// Archive a board
router.post("/archive-board", async (req, res) => {
  const { boardId, projectId } = req.body;
  if (!boardId) return res.status(400).json({ message: "Missing boardId" });

  try {
    const query =
      "INSERT INTO archived_boards (board_id, project_id) VALUES (?,?)";
    await db.execute(query, [boardId, projectId]);
    res.status(200).json({ message: "Board archived successfully" });
  } catch (error) {
    console.error("Error archiving board:", error);
    res.status(500).json({ message: "Failed to archive board" });
  }
});

router.get("/archive-board", async (req, res) => {
  try {
    const query = `
      SELECT 
        archived_boards.board_id, 
        archived_boards.project_id, 
        projects.project_name
      FROM archived_boards
      INNER JOIN projects ON archived_boards.project_id = projects.project_id
    `;
    const [archivedBoards] = await db.query(query);
    res.status(200).json(archivedBoards);
  } catch (error) {
    console.error("Error fetching archived boards:", error);
    res.status(500).json({ message: "Failed to fetch archived boards" });
  }
});

router.get("/archive-cards", async (req, res) => {
  try {
    const query = `
        SELECT archived_cards.card_id, tickets.*
        FROM archived_cards
        INNER JOIN tickets ON archived_cards.card_id = tickets.ticket_id
      `;
    const [archivedCards] = await db.query(query);
    res.status(200).json(archivedCards);
  } catch (error) {
    console.error("Error fetching archived cards:", error);
    res.status(500).json({ message: "Failed to fetch archived cards" });
  }
});

// Restore a card
router.post("/restore-card", async (req, res) => {
  const { cardId } = req.body;
  if (!cardId) {
    return res.status(400).json({ message: "Missing cardId" });
  }

  try {
    const [result] = await db.execute(
      "DELETE FROM archived_cards WHERE card_id = ?",
      [cardId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Card not found in archive" });
    }
    res.status(200).json({ message: "Card restored successfully" });
  } catch (error) {
    console.error("Error restoring card:", error);
    res.status(500).json({ message: "Failed to restore card" });
  }
});

// Restore a board
router.post("/restore-board", async (req, res) => {
  const { boardId, projectId } = req.body;

  if (!boardId || !projectId) {
    return res.status(400).json({ message: "Missing boardId or projectId" });
  }

  try {
    const [result] = await db.execute(
      "DELETE FROM archived_boards WHERE board_id = ? AND project_id = ?",
      [boardId, projectId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Board not found in archive" });
    }

    res.status(200).json({ message: "Board restored successfully" });
  } catch (error) {
    console.error("Error restoring board:", error);
    res.status(500).json({ message: "Failed to restore board" });
  }
});

module.exports = router;
