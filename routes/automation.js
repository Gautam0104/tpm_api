const express = require("express");
const router = express.Router();
const db = require("../config/db");
//const authMiddleware = require("../middleware/auth");
const { validateCardId, validateTicketId } = require("../middleware/validation");
const { logger, obfuscateSensitiveData } = require("../utils/logger");

// Apply authentication middleware to all routes
// router.use(authMiddleware);

router.get("/automation-data", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM automation");
    res.json(rows);
  } catch (error) {
    logger.error("Database query error", { error: error.message });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/automation-data/:ticketId", validateTicketId, async (req, res) => {
  const ticketId = req.params.ticketId;
  try {
    const [rows] = await db.query(
      "SELECT * FROM automation WHERE ticket_id = ?",
      [ticketId]
    );
    res.json(rows);
  } catch (error) {
    logger.error("Database query error", { error: error.message });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/automation-data", async (req, res) => {
  const { ticketId, buttonTitle, buttonAction } = req.body;

  if (!ticketId || !buttonTitle || !buttonAction) {
    return res
      .status(400)
      .json({ error: "Ticket ID, Title, and Action are required" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO automation (ticket_id, button_title, button_action) VALUES (?, ?, ?)",
      [ticketId, buttonTitle, buttonAction]
    );

    logger.info("Automation data inserted", { ticketId });
    res.status(201).json({
      message: "Data inserted successfully",
      insertedId: result.insertId
    });
  } catch (error) {
    logger.error("Database insert error", { error: error.message });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/update-ticket-status-automation", async (req, res) => {
  const { ticketId, ticketStatus } = req.body;

  if (!ticketId || !ticketStatus) {
    return res
      .status(400)
      .json({ error: "Ticket ID and Ticket Status are required" });
  }

  try {
    const [result] = await db.query(
      "UPDATE tickets SET ticket_status = ? WHERE ticket_id = ?",
      [ticketStatus, ticketId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    logger.info("Ticket status updated", { ticketId, ticketStatus });
    res.status(200).json({
      message: "Ticket status updated successfully",
      ticketId,
      ticketStatus
    });
  } catch (error) {
    logger.error("Database update error", { error: error.message });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/update-ticket-by-status", async (req, res) => {
  const { currentStatus, newStatus } = req.body;

  if (!currentStatus || !newStatus) {
    return res
      .status(400)
      .json({ error: "Current Status and New Status are required" });
  }

  try {
    const [result] = await db.query(
      "UPDATE tickets SET ticket_status = ? WHERE ticket_status = ?",
      [newStatus, currentStatus]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "No tickets found with the given status" });
    }

    logger.info("Bulk ticket status update", { currentStatus, newStatus, count: result.affectedRows });
    res.status(200).json({
      message: "Ticket status updated successfully",
      updatedCount: result.affectedRows,
      currentStatus,
      newStatus
    });
  } catch (error) {
    logger.error("Database update error", { error: error.message });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/copy-row-automation/:id", validateCardId, async (req, res) => {
  const { id } = req.params;
  const { ticketStatus } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM tickets WHERE ticket_id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Row not found" });
    }

    const { project_id, title, created_by, description, images, card_image } = rows[0];

    const [result] = await db.query(
      "INSERT INTO tickets (project_id, title, description, created_by, ticket_status, images, card_image) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [project_id, title, description, created_by, ticketStatus, images, card_image]
    );

    logger.info("Row copied successfully", { sourceId: id, newId: result.insertId });
    res.json({
      message: "Row copied successfully",
      insertedId: result.insertId
    });
  } catch (error) {
    logger.error("Database copy error", { error: error.message, id });
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/automation-data/:id", validateCardId, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM automation WHERE id = ?", [id]);
    if (result.affectedRows > 0) {
      logger.info("Automation record deleted", { id });
      res.status(200).json({ message: "Record deleted successfully" });
    } else {
      res.status(404).json({ error: "Record not found" });
    }
  } catch (error) {
    logger.error("Database delete error", { error: error.message, id });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/automation-ticket-eta", async (req, res) => {
  const { ticket_id, ticket_eta } = req.body;

  if (ticket_id === undefined || ticket_eta === undefined) {
    return res.status(400).json({ error: "Ticket ID and eta are required." });
  }

  try {
    const [result] = await db.query(
      "UPDATE tickets SET ticket_eta = ? WHERE ticket_id = ?",
      [ticket_eta, ticket_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Ticket not found." });
    }

    logger.info("Ticket ETA updated", { ticket_id, ticket_eta });
    res.status(200).json({ message: "Ticket eta updated successfully." });
  } catch (error) {
    logger.error("Database update error", { error: error.message, ticket_id });
    res.status(500).json({ error: "Database error" });
  }
});

// remove all checklist
router.delete("/remove-checklist/:id", async (req, res) => {
  const { id } = req.params;
  console.log("Received DELETE request for ID:", id); // Debugging line

  try {
    const result = await db.query("DELETE FROM checklist WHERE ticket_id = ?", [
      id
    ]);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Record deleted successfully" });
    } else {
      res.status(404).json({ error: "Record not found" });
    }
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
