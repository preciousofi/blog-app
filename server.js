const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const supabase = require("./supabase");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// SIGNUP
app.post("/auth/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const { data, error } = await supabase
    .from("users")
    .insert([{ username, email, password: hashed }]);
  if (error) return res.status(400).json({ message: error.message });
  res.json({ message: "Signup successful!" });
});

// LOGIN
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const { data: users } = await supabase
    .from("users")
    .select("*")
    .eq("email", email);
  const user = users?.[0];
  if (!user) return res.status(400).json({ message: "User not found" });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Wrong password" });
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// GET all posts
app.get("/posts", async (req, res) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return res.status(400).json({ message: error.message });
  res.json(data);
});

// CREATE a post
app.post("/posts", async (req, res) => {
  const { title, content } = req.body;
  const { data, error } = await supabase
    .from("posts")
    .insert([{ title, content }]);
  if (error) return res.status(400).json({ message: error.message });
  res.json(data);
});

// DELETE a post
app.delete("/posts/:id", async (req, res) => {
  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", req.params.id);
  if (error) return res.status(400).json({ message: error.message });
  res.json({ message: "Post deleted" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Blog backend running on port 3000");
});