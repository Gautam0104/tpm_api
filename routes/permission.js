const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Make sure db is a MySQL pool

// POST route to save permissions
router.post("/settings", (req, res) => {
    const {
      commenting,
      voting,
      memberControl,
      workspaceEditing,
      cardCovers,
      completeCard,
    } = req.body;
  
    // Validate input
    if (!commenting || !voting || !memberControl) {
      return res.status(400).json({ message: "Invalid input data" });
    }
  
    // Insert or update permissions in the database
    const query = `
      INSERT INTO permissions (commenting, voting, member_control, workspace_editing, card_covers, complete_card)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        commenting = VALUES(commenting),
        voting = VALUES(voting),
        member_control = VALUES(member_control),
        workspace_editing = VALUES(workspace_editing),
        card_covers = VALUES(card_covers),
        complete_card = VALUES(complete_card)
    `;
  
    const values = [
      commenting,
      voting,
      memberControl,
      workspaceEditing,
      cardCovers,
      completeCard,
    ];
  
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error saving permissions:", err);
        return res.status(500).json({ message: "Failed to save permissions" });
      }
  
      res.status(200).json({ message: "Permissions saved successfully" });
    });
  });
  
 

// Update permissions
router.put("/settings", async (req, res) => {
  const { commenting, voting, memberControl, workspaceEditing, cardCovers, completeCard } = req.body;

  if (!commenting || !voting || !memberControl) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  try {
    const query = `
      UPDATE permissions
      SET 
        commenting = ?,
        voting = ?,
        member_control = ?,
        workspace_editing = ?,
        card_covers = ?,
        complete_card = ?
      WHERE id = 1
    `;

    const values = [commenting, voting, memberControl, workspaceEditing, cardCovers, completeCard];
    const [result] = await db.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Permissions not found" });
    }

    res.status(200).json({ message: "Permissions updated successfully" });
  } catch (error) {
    console.error("Error updating permissions:", error);
    res.status(500).json({ message: "Failed to update permissions" });
  }
});

// GET route to fetch permissions
router.get("/settings", async (req, res) => {
    try {
      const query = "SELECT * FROM permissions"; 
      const [rows] = await db.execute(query);
  
      if (rows.length === 0) {
        return res.status(404).json({ message: "Permissions not found" });
      }
  
      res.status(200).json(rows[0]);
    } catch (error) {
      console.error("Error fetching permissions:", error);
      res.status(500).json({ message: "Failed to fetch permissions" });
    }
  });


module.exports = router;
