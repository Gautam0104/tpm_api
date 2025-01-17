const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

// Set up Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer configuration must come before usage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads'));  // Correct destination
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Unique filename
    }
});

// Initialize multer with the storage configuration
const upload = multer({ storage });

// API Route to update image
app.post('/update-image', upload.single('image'), (req, res) => {
    const { ticket_id } = req.body;
    const newImagePath = `../uploads/ticketImage/${req.file.filename}`;  // Correct relative path
  
    // Query to fetch the old image path from the database
    const getOldImageSql = 'SELECT image FROM tickets WHERE ticket_id = ?';
    db.execute(getOldImageSql, [ticket_id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error fetching old image' });
        if (results.length === 0) return res.status(404).json({ error: 'Record not found' });

        const oldImagePath = path.join(__dirname, results[0].image);  // Old image path

        // Query to update the image path in the database
        const updateSql = 'UPDATE tickets SET image = ? WHERE ticket_id = ?';
        db.execute(updateSql, [newImagePath, ticket_id], (err) => {
            if (err) return res.status(500).json({ error: 'Error updating image' });

            // Delete the old image file
            fs.unlink(oldImagePath, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting old image:', unlinkErr);
            });

            // Respond with the success message and new image path
            res.status(200).json({ message: 'Image updated successfully', newImagePath });
        });
    });
});

module.exports = router;
