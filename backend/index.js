import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

async function sendVerificationEmail(email, token) {
  try {
    console.log("🔥 EMAIL FUNCTION CALLED");
    console.log("📧 TO:", email);

    const link = `${FRONTEND_URL}/auth/callback?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.SMTP_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      },
    });

    console.log("📨 Sending email...");

    await transporter.sendMail({
      from: `"Internship Tracker" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify your email",
      html: `<a href="${link}">${link}</a>`,
    });

    console.log("✅ EMAIL SENT SUCCESSFULLY");
  } catch (err) {
    console.error("❌ EMAIL ERROR:", err);
  }
}

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));


function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email, isAdmin: payload.email === ADMIN_EMAIL };
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}


app.post("/auth/signup", async (req, res) => {
  const { email, password } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ error: "Email already in use" });

  const passwordHash = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomBytes(32).toString("hex");
  await prisma.user.create({ data: { email, passwordHash, verificationToken } });

  sendVerificationEmail(email, verificationToken);
  res.json({ message: "Check your email to verify your account." });
});


app.get("/auth/verify", async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ error: "Missing token" });

  const user = await prisma.user.findFirst({ where: { verificationToken: token } });
  if (!user) return res.status(400).json({ error: "Invalid or expired token" });

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true, verificationToken: null },
  });

  const jwtToken = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token: jwtToken, user: { id: user.id, email: user.email } });
});


app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: "Invalid email or password" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(400).json({ error: "Invalid email or password" });

  if (!user.emailVerified) return res.status(403).json({ error: "Please verify your email before logging in." });

  const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user: { id: user.id, email: user.email } });
});


app.get("/internships/stats", requireAuth, async (req, res) => {
  const where = req.user.isAdmin ? {} : { userId: req.user.id };

  const [total, applied, interview, accepted, rejected] = await Promise.all([
    prisma.internship.count({ where }),
    prisma.internship.count({ where: { ...where, status: "applied" } }),
    prisma.internship.count({ where: { ...where, status: "interview" } }),
    prisma.internship.count({ where: { ...where, status: "accepted" } }),
    prisma.internship.count({ where: { ...where, status: "rejected" } }),
  ]);

  res.json({ total, applied, interview, accepted, rejected });
});


app.get("/internships", requireAuth, async (req, res) => {
  const where = (!req.user.isAdmin || req.query.mine === "true") ? { userId: req.user.id } : {};

  const data = await prisma.internship.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  res.json(data);
});


app.post("/internships", requireAuth, upload.single("cv"), async (req, res) => {
  const { company, position, location, status } = req.body;
  const cvUrl = req.file
    ? `http://localhost:5000/uploads/${req.file.filename}`
    : null;

  const data = await prisma.internship.create({
    data: { company, position, location, status, userId: req.user.id, cvUrl },
  });

  res.json(data);
});


app.patch("/internships/:id/status", requireAuth, async (req, res) => {
  const { status } = req.body;

  const internship = await prisma.internship.findUnique({ where: { id: req.params.id } });
  if (!internship) return res.status(404).json({ error: "Not found" });
  if (!req.user.isAdmin && internship.userId !== req.user.id) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const data = await prisma.internship.update({
    where: { id: req.params.id },
    data: { status },
  });
  res.json(data);
});


app.delete("/internships/:id", requireAuth, async (req, res) => {
  const internship = await prisma.internship.findUnique({ where: { id: req.params.id } });
  if (!internship) return res.status(404).json({ error: "Not found" });
  if (!req.user.isAdmin && internship.userId !== req.user.id) {
    return res.status(403).json({ error: "Forbidden" });
  }

  await prisma.internship.delete({ where: { id: req.params.id } });
  res.json({ message: "deleted" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

const PORT= process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
