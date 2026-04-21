import { useState } from "react";
import {
  Alert, Box, Button, CircularProgress, Paper, TextField, Typography,
} from "@mui/material";
import Navbar from "./Navbar";
import { labelSx } from "./theme";

export default function Login({ onNavigate, onLogin, user, onLogout }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!email || !password) { setError("Completa todos los campos."); return; }
    setLoading(true);
    try {
      const res  = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al iniciar sesión");
      onLogin({ name: data.name || email });
      onNavigate("home");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar onNavigate={onNavigate} user={user} onLogout={onLogout} />
      <Box sx={{ minHeight: "calc(100vh - 64px)", display: "flex",
        alignItems: "center", justifyContent: "center", p: 3 }}>
        <Paper elevation={2} sx={{
          bgcolor: "background.paper", borderRadius: 3,
          border: "1.5px solid #b0b8c1", p: "36px 40px 30px",
          width: "100%", maxWidth: 420,
        }}>
          <Typography sx={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800, fontSize: "1.5rem", letterSpacing: 3,
            textAlign: "center", color: "#1a2233", mb: 3, textTransform: "uppercase",
          }}>
            Inicio de Sesión
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Typography sx={labelSx}>CORREO</Typography>
          <TextField
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            sx={{ mb: 0.5 }}
          />

          <Typography sx={{ ...labelSx, mt: 1.5 }}>CONTRASEÑA</Typography>
          <TextField
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />

          <Box sx={{ display: "flex", gap: 2, mt: 3.5 }}>
            <Button fullWidth variant="contained" color="secondary"
              disabled={loading} onClick={handleSubmit} sx={{ py: 1.2, color: "#fff" }}>
              {loading ? <CircularProgress size={20} color="inherit" /> : "INICIAR SESIÓN"}
            </Button>
            <Button fullWidth variant="contained" onClick={() => onNavigate("home")}
              sx={{ py: 1.2, bgcolor: "#e53935", "&:hover": { bgcolor: "#c62828" } }}>
              CANCELAR
            </Button>
          </Box>

          <Typography align="center" sx={{ mt: 2.5, fontSize: "0.88rem", color: "#444" }}>
            ¿No tienes cuenta?{" "}
            <Box component="span" onClick={() => onNavigate("register")}
              sx={{ textDecoration: "underline", cursor: "pointer", fontWeight: 600, color: "#1a2233" }}>
              Regístrate
            </Box>
          </Typography>
        </Paper>
      </Box>
    </>
  );
}