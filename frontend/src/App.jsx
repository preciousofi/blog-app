import { useState } from "react";

function App() {
  const [page, setPage] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const signup = async () => {
    const res = await fetch("http://localhost:3000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  const login = async () => {
    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.token) {
      setToken(data.token);
      setPage("blog");
      fetchPosts();
    } else {
      setMessage(data.message);
    }
  };

  const fetchPosts = async () => {
    const res = await fetch("http://localhost:3000/posts");
    const data = await res.json();
    setPosts(data);
  };

  const createPost = async () => {
    if (!title || !content) return;
    await fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, author: email }),
    });
    setTitle("");
    setContent("");
    fetchPosts();
  };

  const deletePost = async (id) => {
    await fetch(`http://localhost:3000/posts/${id}`, { method: "DELETE" });
    fetchPosts();
  };

  if (page === "login") return (
    <div style={{ padding: 30, maxWidth: 400, margin: "auto" }}>
      <h1>Blog App</h1>
      <h2>Login</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }} />
      <button onClick={login} style={{ marginRight: 10, padding: "8px 16px" }}>Login</button>
      <button onClick={() => setPage("signup")} style={{ padding: "8px 16px" }}>Sign Up</button>
      <p>{message}</p>
    </div>
  );

  if (page === "signup") return (
    <div style={{ padding: 30, maxWidth: 400, margin: "auto" }}>
      <h1>Blog App</h1>
      <h2>Sign Up</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }} />
      <button onClick={signup} style={{ marginRight: 10, padding: "8px 16px" }}>Sign Up</button>
      <button onClick={() => setPage("login")} style={{ padding: "8px 16px" }}>Back to Login</button>
      <p>{message}</p>
    </div>
  );

  return (
    <div style={{ padding: 30, maxWidth: 600, margin: "auto" }}>
      <h1>My Blog</h1>
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }} />
      <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} style={{ display: "block", width: "100%", marginBottom: 10, padding: 8, height: 100 }} />
      <button onClick={createPost} style={{ padding: "8px 16px" }}>Post</button>
      <hr />
      {posts.map(post => (
        <div key={post.id} style={{ border: "1px solid #ddd", padding: 15, marginTop: 15, borderRadius: 8 }}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <small>By {post.author}</small>
          <br />
          <button onClick={() => deletePost(post.id)} style={{ marginTop: 8, background: "red", color: "white", border: "none", padding: "6px 12px", borderRadius: 4 }}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;