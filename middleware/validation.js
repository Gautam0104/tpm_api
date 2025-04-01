const validateCardId = (req, res, next) => {
    const { id } = req.params;
    
    if (!Number.isInteger(Number(id))) {
        return res.status(400).json({ error: 'Invalid card ID format' });
    }
    
    next();
};

const validateTicketId = (req, res, next) => {
    const { ticketId } = req.params;
    
    if (!Number.isInteger(Number(ticketId))) {
        return res.status(400).json({ error: 'Invalid ticket ID format' });
    }
    
    next();
};

module.exports = {
    validateCardId,
    validateTicketId
}; 