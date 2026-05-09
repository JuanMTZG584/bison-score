import { useState } from "react";
import {
  Alert, Avatar, Box, Button, CircularProgress, Paper, TextField, Typography,
} from "@mui/material";
import EditIcon      from "@mui/icons-material/Edit";
import LandscapeIcon from "@mui/icons-material/Landscape";
import Navbar from "./Navbar";
import { labelSx, bgSx } from "./theme";

export default function Register({ onNavigate, user, onLogout }) {
  const [form,    setForm]    = useState({ name: "", password: "", email: "", birth_date: "" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async () => {
    setError("");
    if (!form.name || !form.password || !form.email || !form.birth_date) {
      setError("Debes completar todos los campos."); return;
    }
    setLoading(true);
    try {
      const res  = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al registrarse");
      alert("¡Cuenta creada exitosamente!");
      onNavigate("login");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", position: "relative" }}>
      {/* Fondo difuminado */}
      <Box sx={bgSx} />

      {/* Contenido */}
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Navbar onNavigate={onNavigate} user={user} onLogout={onLogout} />
        <Box sx={{ minHeight: "calc(100vh - 64px)", display: "flex",
          alignItems: "center", justifyContent: "center", p: 3 }}>
          <Paper elevation={2} sx={{
            bgcolor: "background.paper", borderRadius: 3,
            border: "1.5px solid #b0b8c1", p: "36px 40px 30px",
            width: "100%", maxWidth: 500,
          }}>
            <Box sx={{ display: "flex", gap: 3, mb: 0.5 }}>
              <Box sx={{ position: "relative", flexShrink: 0 }}>
                <Avatar sx={{
                  width: 100, height: 100, borderRadius: 3, cursor: "pointer",
                  background: "linear-gradient(135deg, #a8d8a8 0%, #7ec8a0 50%, #4da06a 100%)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}>
                  <LandscapeIcon sx={{ fontSize: 44, color: "#2c5f2e" }} />
                </Avatar>
                <Avatar sx={{
                  width: 24, height: 24, position: "absolute", bottom: -6, right: -6,
                  bgcolor: "#fff", border: "1.5px solid #b0b8c1", cursor: "pointer",
                }}>
                  <EditIcon sx={{ fontSize: 14, color: "#444" }} />
                </Avatar>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography sx={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 800, fontSize: "1.5rem", letterSpacing: 3,
                  color: "#1a2233", textTransform: "uppercase", mb: 1.5,
                }}>
                  Registro
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 1.5, py: 0 }}>{error}</Alert>}
                <Typography sx={labelSx}>USERNAME</Typography>
                <TextField value={form.name} onChange={set("name")} autoComplete="username" />
              </Box>
            </Box>

            <Typography sx={{ ...labelSx, mt: 2 }}>CONTRASEÑA</Typography>
            <TextField type="password" value={form.password} onChange={set("password")}
              autoComplete="new-password" />

            <Typography sx={{ ...labelSx, mt: 2, color: "#e53935" }}>CORREO</Typography>
            <TextField type="email" value={form.email} onChange={set("email")} autoComplete="email"
              sx={{ "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e57373" } }} />

            <Typography sx={{ ...labelSx, mt: 2 }}>FECHA DE NACIMIENTO</Typography>
            <TextField type="date" value={form.birth_date} onChange={set("birth_date")} />

            <Box sx={{ display: "flex", gap: 2, mt: 3.5 }}>
              <Button fullWidth variant="contained" color="secondary"
                disabled={loading} onClick={handleSubmit} sx={{ py: 1.2, color: "#fff" }}>
                {loading ? <CircularProgress size={20} color="inherit" /> : "REGISTRAR"}
              </Button>
              <Button fullWidth variant="contained" onClick={() => onNavigate("home")}
                sx={{ py: 1.2, bgcolor: "#e53935", "&:hover": { bgcolor: "#c62828" } }}>
                CANCELAR
              </Button>
            </Box>

            <Typography align="center" sx={{ mt: 2.5, fontSize: "0.88rem", color: "#444" }}>
              ¿Ya tienes cuenta?{" "}
              <Box component="span" onClick={() => onNavigate("login")}
                sx={{ textDecoration: "underline", cursor: "pointer", fontWeight: 600, color: "#1a2233" }}>
                Inicia sesión
              </Box>
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}