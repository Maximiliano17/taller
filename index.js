// Modules

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import "./src/database/db.js";

// Import Routes

import appRoutes from "./src/routes/app.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import formRoutes from "./src/routes/form.routes.js";
import toolsRoutes from "./src/routes/tools.routes.js";
import stockRoutes from "./src/routes/stock.routes.js";

// Global

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Settings

const sessionMiddleware = session({
  secret: "secret",
  resave: false, // true
  saveUninitialized: false, // true
});

app.use(sessionMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

app.use("/", appRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/form", formRoutes);
app.use("/api/tools", toolsRoutes);
app.use("/api/stock", stockRoutes);

// Views

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Static Files

app.use(express.static(path.join(__dirname, "public")));

// Starting Server

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor a la espera de conexiones");
});
