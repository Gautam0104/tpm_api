const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../config/db');
const path = require('path');

// Configure multer storage options
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Set the directory where images will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Set a unique filename
    }
});

const upload = multer({ storage: storage });

// Update ticket route to handle image upload
router.put('/updateticket', upload.single('image'), (req, res) => {
    const { ticket_id, title, description, status, priority, ticket_status } = req.body;

    // Log the uploaded file and other fields for debugging
    console.log('File uploaded:', req.file); // This should show file details if the upload is successful
    console.log('Request body:', req.body);

    const image = req.file ? req.file.filename : null; // Check if an image was uploaded

    // Check if any required field is undefined
    if (ticket_id === undefined || title === undefined || description === undefined || status === undefined || priority === undefined || ticket_status === undefined) {
        return res.status(400).json({ error: 'Ticket ID, title, description, status, priority, and ticket status are required.' });
    }

    const query = 'UPDATE tickets SET title = ?, description = ?, status = ?, priority = ?, ticket_status = ?, image = ? WHERE ticket_id = ?';

    // Log the values for debugging
    console.log({ ticket_id, title, description, status, priority, ticket_status, image });

    db.execute(query, [title, description, status, priority, ticket_status, image, ticket_id])
        .then((results) => {
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Ticket not found.' });
            }
            res.status(200).json({ message: 'Ticket updated successfully.' });
        })
        .catch((err) => {
            console.error('Database error:', err);
            res.status(500).json({ error: 'Database error' });
        });
});


module.exports = router;
