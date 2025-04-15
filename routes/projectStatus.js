const express = require('express');
const router = express.Router();
const db = require('../config/db');
//get whole category data
router.get('/category',async(req,res)=>{
    try {
        const query = `
        SELECT 
              *
        FROM 
            card_categories;
    `;
        const [rows] = await db.execute(query);
        res.json(rows);
      } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
});



module.exports = router;