require("dotenv").config();
const express = require("express");
const session = require("express-session");
const sessionMiddleware = require("./middleware/sessionMiddleware");
const authMiddleware = require("./middleware/authMiddleware");
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const userRoutes = require("./routes/userData");
const projectRoutes = require("./routes/projectData");
const createProject = require("./routes/createProject");
const singleProjectRoutes = require("./routes/singleProject");
const deleteProjectRoutes = require("./routes/deleteProject");
const createTicketRoutes = require("./routes/createTicket");
const updateTicketRoutes = require("./routes/updateTicket");
const getTicketRoutes = require("./routes/getTicket");
const singleTicketRoutes = require("./routes/singleTicket");
const deleteTicketRoutes = require("./routes/deleteTicket");
const getticketbyidRoutes = require("./routes/getticketbyID");
const updateticketstatusRoutes = require("./routes/updateticketStatus");
const path = require("path");
const calendarUpdateRoutes = require("./routes/ticketcalendarUpdate");
const createticketCalendarRoutes = require("./routes/createticketCaledar");
const createRoleRoutes = require("./routes/createRoles");
const getRoleRoutes = require("./routes/getrole");
const tickerHist = require("./routes/ticketHistory");
const clearHistory = require("./routes/clearticketHistory");
const deleteUserRoutes = require("./routes/deleteUser");
const updateUserRoutes = require("./routes/updateUser");
const getUserRoutes = require("./routes/getUser");
const updateProjectRoutes = require("./routes/updateProject");
const updateRoleRoutes = require("./routes/updateRole");
const getrolehistoryRoutes = require("./routes/getrolehistory");
const deleteRoleRoutes = require("./routes/deleteRole");
const clearroleHistoryRoutes = require("./routes/clearRolehistory");
const getuserHistoryRoutes = require("./routes/getuserHistory");
const createticketfromcalendar = require("./routes/createticketfromcalendar");
const featureComparisonRoutes = require("./routes/trello-vs-tpm");
const getusernameRoutes = require("./routes/getusername");
const getticketbystatusRoutes = require("./routes/updateticketStatusbycurrentstatus");
const kanbanOrderRoutes = require("./routes/kanbanOrder");
const getKanbanOrderRoutes = require("./routes/getKanbanOrder");
const kanbanBoardsRoutes = require("./routes/kanbanBoard");
const copyKanbanBoardRoutes = require("./routes/copyKanbanBoard");
const createcheckListRoutes = require("./routes/createChecklist");
const getcheckListRoutes = require("./routes/getChecklist");
const copyCardRoutes = require("./routes/copyCard");
const joinCardRoutes = require("./routes/joinCard");
const automationRoutes = require("./routes/automation");
const getTicketCommentsRoutes = require("./routes/getTicketComments");
const getProjectStatusRoutes = require("./routes/projectStatus");
const archiveRoutes = require("./routes/archive");
const permissionRoutes = require("./routes/permission");
const filterRoutes = require("./routes/filter");
const customfieldRoutes = require("./routes/customField");
const cardCovers = require("./routes/cardCover");
const votesRoutes = require("./routes/vote");
const watchRoutes = require("./routes/watch");
const mirrorCardRoutes = require("./routes/mirrorCard");

const app = express();
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Session configuration
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 15 * 60 * 1000 } // 15 minutes session
  })
);
const cors = require("cors");
app.use(cors());

// simple hello world massege
app.get("/", (req, res) => {
  res.json({
    message: "Hello World!"
  });
});

// Public routes (no authentication required)
app.use("/auth", authRoutes);

// Protected routes (authentication required)
app.use("/dashboard", authMiddleware, dashboardRoutes);
app.use("/", userRoutes);
app.use("/", projectRoutes);
app.use("/", createProject);
app.use("/", singleProjectRoutes);
app.use("/", deleteProjectRoutes);
app.use("/", createTicketRoutes);
app.use("/", updateTicketRoutes);
app.use("/", getTicketRoutes);
app.use("/", singleTicketRoutes);
app.use("/", deleteTicketRoutes);
app.use("/", getticketbyidRoutes);
app.use("/", updateticketstatusRoutes);
app.use("/", getUserRoutes);
app.use("/", calendarUpdateRoutes);
app.use("/", createticketCalendarRoutes);
app.use("/", createRoleRoutes);
app.use("/", getRoleRoutes);
app.use("/", tickerHist);
app.use("/", clearHistory);
app.use("/", deleteUserRoutes);
app.use("/", updateUserRoutes);
app.use("/", updateProjectRoutes);
app.use("/", updateRoleRoutes);
app.use("/", getrolehistoryRoutes);
app.use("/", deleteRoleRoutes);
app.use("/", clearroleHistoryRoutes);
app.use("/", getuserHistoryRoutes);
app.use("/", createticketfromcalendar);
app.use("/", featureComparisonRoutes);
app.use("/", getusernameRoutes);
app.use("/", getticketbystatusRoutes);
app.use("/", kanbanOrderRoutes);
app.use("/", getKanbanOrderRoutes);
app.use("/", kanbanBoardsRoutes);
app.use("/", copyKanbanBoardRoutes);
app.use("/", createcheckListRoutes);
app.use("/", getcheckListRoutes);
app.use("/", copyCardRoutes);
app.use("/", joinCardRoutes);
app.use("/", automationRoutes);
app.use("/", getTicketCommentsRoutes);
app.use("/", getProjectStatusRoutes);
app.use("/", archiveRoutes);
app.use("/", permissionRoutes);
app.use("/", customfieldRoutes);
app.use("/", filterRoutes);
app.use("/", cardCovers);
app.use("/", watchRoutes);
app.use("/", votesRoutes);
app.use("/", mirrorCardRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
