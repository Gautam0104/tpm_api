const express = require("express");
const router = express.Router();
const db = require("../config/db");

// POST API to add a new filter item

router.post("/add-new-filter", async (req, res) => {
  try {
    // Extract values from request body
    const { filterTitle, filterName } = req.body;

    // Validate input
    if (!filterTitle) {
      return res.status(400).json({ error: "filterTitle is required" });
    }
    if (!filterName) {
      return res.status(400).json({ error: "filterName is required" });
    }

    // Get the max order value (default to 0 if no records exist)
    const [rows] = await db.query(
      "SELECT MAX(`order`) AS maxOrder FROM kanban_filter"
    );
    const lastOrder = rows[0]?.maxOrder || 0;

    // Insert new filter with the incremented order value
    const [result] = await db.query(
      "INSERT INTO kanban_filter (filter_title, filter_name, `order`) VALUES (?, ?, ?)",
      [filterTitle, filterName, lastOrder + 1]
    );

    // Respond with success message
    res.status(201).json({
      message: "Filter item added",
      data: {
        id: result.insertId,
        filterTitle,
        filterName,
        order: lastOrder + 1
      }
    });
  } catch (error) {
    console.error("Error in /add-new-filter:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

// GET API to fetch all filter items
router.get("/get-filters", async (req, res) => {
  const { filter_name } = req.query;

  if (!filter_name) {
    return res.status(400).json({ error: "Missing filter_name parameter" });
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM kanban_filter WHERE filter_name = ?",
      [filter_name]
    );
    res.json(rows);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT API to update a filter item
router.put("/update-filter", async (req, res) => {
  const { id, filterTitle, filterName } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Missing id parameter" });
  }

  try {
    const [result] = await db.query(
      "UPDATE kanban_filter SET filter_title = ?, filter_name = ? WHERE id = ?",
      [filterTitle, filterName, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Filter item not found" });
    }

    res.json({ message: "Filter item updated successfully" });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE API to delete a filter item
router.delete("/delete-filter/:id", async (req, res) => {
  try {
    const filterId = req.params.id;

    if (!filterId) {
      return res.status(400).json({ error: "Filter ID is required" });
    }

    // Check if the filter exists
    const [rows] = await db.query("SELECT * FROM kanban_filter WHERE id = ?", [
      filterId
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Filter not found" });
    }

    // Delete the filter
    await db.query("DELETE FROM kanban_filter WHERE id = ?", [filterId]);

    res
      .status(200)
      .json({ message: "Filter deleted successfully", id: filterId });
  } catch (error) {
    console.error("Error in /delete-filter:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
