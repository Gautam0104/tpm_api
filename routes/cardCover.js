const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/workspace-settings", (req, res) => {
  let { cardCovers, commenting, memberControl, voting, workspaceEditing } =
    req.body;

  // Convert to booleans from string/number
  cardCovers = cardCovers === "true" || cardCovers === "1" || cardCovers === 1;
  workspaceEditing =
    workspaceEditing === "true" ||
    workspaceEditing === "1" ||
    workspaceEditing === 1;

  // Validation
  if (
    typeof cardCovers !== "boolean" ||
    typeof workspaceEditing !== "boolean" ||
    typeof commenting !== "string" ||
    typeof memberControl !== "string" ||
    typeof voting !== "string"
  ) {
    return res.status(400).json({ error: "Invalid payload format" });
  }

  const cardCoversValue = cardCovers ? 1 : 0;
  const workspaceEditingValue = workspaceEditing ? 1 : 0;

  const query = `
    INSERT INTO settings (cardCovers, commenting, memberControl, voting, workspaceEditing)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.execute(
    query,
    [cardCoversValue, commenting, memberControl, voting, workspaceEditingValue],
    (err, results) => {
      if (err) {
        console.error("Error inserting data into MySQL:", err);
        return res.status(500).json({ error: "Database error" });
      }

      return res.status(201).json({
        message: "Settings created successfully!",
        data: {
          cardCovers: cardCoversValue,
          commenting,
          memberControl,
          voting,
          workspaceEditing: workspaceEditingValue
        }
      });
    }
  );
});

module.exports = router;
