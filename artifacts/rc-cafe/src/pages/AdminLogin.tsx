import { useState, FormEvent, useEffect } from "react";
import { useLocation } from "wouter";

export default function AdminLogin() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    if (localStorage.getItem("rc_admin_token")) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${base}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });
      if (res.ok) {
        const { token } = await res.json() as { token: string };
        localStorage.setItem("rc_admin_token", token);
        navigate("/admin");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "hsl(0 0% 4%)",
      fontFamily: "'Inter', sans-serif", padding: "24px",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo + Brand */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{
            width: 96, height: 96, borderRadius: "50%", overflow: "hidden",
            border: "2px solid hsl(0 84% 60%)", margin: "0 auto 20px",
            boxShadow: "0 0 32px rgba(239,68,68,0.25)",
          }}>
            <img src="/logo.jpeg" alt="LA RC Hub & Cafe"
              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 28,
            color: "hsl(0 0% 98%)", marginBottom: 6, fontWeight: 400,
          }}>Admin Access</h1>
          <p style={{ fontSize: 12, color: "hsl(0 0% 50%)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            LA RC Hub & Cafe
          </p>
        </div>

        {/* Login Card */}
        <div style={{
          background: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 14%)", padding: "40px 36px",
        }}>
          {/* Top accent line */}
          <div style={{ height: 2, background: "hsl(0 84% 60%)", margin: "-40px -36px 36px" }} />

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: "block", fontSize: 10, fontWeight: 600,
                letterSpacing: "0.2em", textTransform: "uppercase",
                color: "hsl(0 0% 55%)", marginBottom: 8,
              }}>User ID</label>
              <input
                type="text" value={userId} onChange={e => setUserId(e.target.value)}
                placeholder="Enter your User ID" required
                style={{
                  width: "100%", background: "hsl(0 0% 4%)",
                  border: `1px solid ${error ? "hsl(0 84% 60%)" : "hsl(0 0% 18%)"}`,
                  color: "hsl(0 0% 98%)", fontFamily: "'Inter', sans-serif",
                  fontSize: 14, padding: "13px 16px", outline: "none",
                  transition: "border-color .2s", boxSizing: "border-box",
                }}
                onFocus={e => { e.target.style.borderColor = "hsl(0 84% 60%)"; }}
                onBlur={e => { e.target.style.borderColor = error ? "hsl(0 84% 60%)" : "hsl(0 0% 18%)"; }}
              />
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{
                display: "block", fontSize: 10, fontWeight: 600,
                letterSpacing: "0.2em", textTransform: "uppercase",
                color: "hsl(0 0% 55%)", marginBottom: 8,
              }}>Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password" required
                style={{
                  width: "100%", background: "hsl(0 0% 4%)",
                  border: `1px solid ${error ? "hsl(0 84% 60%)" : "hsl(0 0% 18%)"}`,
                  color: "hsl(0 0% 98%)", fontFamily: "'Inter', sans-serif",
                  fontSize: 14, padding: "13px 16px", outline: "none",
                  transition: "border-color .2s", boxSizing: "border-box",
                }}
                onFocus={e => { e.target.style.borderColor = "hsl(0 84% 60%)"; }}
                onBlur={e => { e.target.style.borderColor = error ? "hsl(0 84% 60%)" : "hsl(0 0% 18%)"; }}
              />
            </div>

            {error && (
              <div style={{
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                padding: "12px 16px", marginBottom: 24,
                fontSize: 13, color: "hsl(0 84% 70%)", letterSpacing: "0.03em",
              }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: "100%", height: 52,
              background: loading ? "hsl(0 60% 45%)" : "hsl(0 84% 60%)",
              color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600,
              letterSpacing: "0.2em", textTransform: "uppercase",
              transition: "background .2s",
            }}>
              {loading ? "Verifying..." : "Access Panel"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: "hsl(0 0% 35%)", letterSpacing: "0.1em" }}>
          RESTRICTED ACCESS — AUTHORIZED PERSONNEL ONLY
        </p>
      </div>
    </div>
  );
}
