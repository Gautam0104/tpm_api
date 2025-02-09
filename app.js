const express = require('express');
const session = require('express-session');
const sessionMiddleware = require('./middleware/sessionMiddleware');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const userRoutes = require('./routes/userData');
const projectRoutes = require('./routes/projectData');
const createProject = require('./routes/createProject');
const singleProjectRoutes = require('./routes/singleProject');
const deleteProjectRoutes = require('./routes/deleteProject');
const createTicketRoutes =  require('./routes/createTicket');
const updateTicketRoutes =  require('./routes/updateTicket');
const getTicketRoutes    =  require('./routes/getTicket');
const singleTicketRoutes = require('./routes/singleTicket');
const deleteTicketRoutes = require('./routes/deleteTicket');
const getticketbyidRoutes = require('./routes/getticketbyID');
const updateticketstatusRoutes = require('./routes/updateticketStatus');
const updateTaskRoutes = require('./routes/updateTask');


const app = express();
app.use(express.json());

// Session configuration
app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 15 * 60 * 1000 }, // 15 minutes session
    })
);
const cors = require('cors');
app.use(cors());

// simple hello world massege
app.get('/',(req,res)=>{
    res.json({
            message:"Hello World!"
    });
})

// Routes
app.use('/auth', authRoutes);
app.use('/dashboard', sessionMiddleware, dashboardRoutes);
app.use('/', userRoutes);
app.use('/', projectRoutes);
app.use('/', createProject);
app.use('/', singleProjectRoutes);
app.use('/', deleteProjectRoutes);
app.use('/', createTicketRoutes);
app.use('/', updateTicketRoutes);
app.use('/', getTicketRoutes);
app.use('/', singleTicketRoutes);
app.use('/', deleteTicketRoutes);
app.use('/', getticketbyidRoutes);
app.use('/', updateticketstatusRoutes);
app.use('/', updateTaskRoutes)

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
