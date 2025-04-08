const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "cse",
    database: "sheShines"
});

db.connect((err) => {
    if (err) {
        console.error(" Database connection failed:", err);
    } else {
        console.log(" Connected to MySQL Database");
    }
});

app.get("/", (req, res) => {
    res.send("Server is up and running!");
});

app.post("/register", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const checkUser = "SELECT * FROM users WHERE email = ?";
    db.query(checkUser, [email], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error: " + err.sqlMessage });
        if (results.length > 0) {
            return res.status(400).json({ error: "Email already registered." });
        }

        // No hashing here — plain password is stored
        const insertUser = "INSERT INTO users (email, password) VALUES (?, ?)";
        db.query(insertUser, [email, password], (err) => {
            if (err) return res.status(500).json({ error: "Database error: " + err.sqlMessage });
            res.status(201).json({ message: "User registered successfully!" });
        });
    });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error: " + err.sqlMessage });
        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        const user = results[0];
        // Plaintext password check (because we store plain password now)
        if (password !== user.password) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        res.status(200).json({ message: " Login successful!" });
    });
});

app.post("/donate", (req, res) => {
    const { name, email, clothing_type, clothing_condition, address } = req.body;

    const query = `INSERT INTO donations (name, email, clothing_type, clothing_condition, address)
                   VALUES (?, ?, ?, ?, ?)`;

    db.query(query, [name, email, clothing_type, clothing_condition, address], (err) => {
        if (err) {
            console.error(" Donation Insert Error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        console.log("Donation Data Stored");
        res.status(200).json({ message: "Donation recorded successfully!" });
    });
});

app.post("/request", (req, res) => {
    const { name, email, size, address, itemType } = req.body;

    const query = `INSERT INTO requests (name, email, size, address, itemType)
                   VALUES (?, ?, ?, ?, ?)`;

    db.query(query, [name, email, size, address, itemType], (err) => {
        if (err) {
            console.error(" Request Insert Error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        console.log(" Request Data Stored");
        res.status(200).json({ message: "Request recorded successfully!" });
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
});
