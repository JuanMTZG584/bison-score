import { useState } from "react";
import {
  Avatar, Box, Button, Container, Divider, Paper, TextField, Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import Navbar from "./Navbar";
import { GAMES, labelSx } from "./theme";

export default function MyAccount({ onNavigate, user, onLogout }) {
  const [form, setForm] = useState({
    username:   user?.name || "",
    password:   "",
    email:      "",
    birth_date: "",
  });

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  // Reseñas del usuario logueado (mock: PLAYER843)
  const myReviews = GAMES.flatMap((g) =>
    g.reviews
      .filter((r) => r.user === "PLAYER843")
      .map((r) => ({ ...r, game: g }))
  );

  return (
    <>
      <Navbar onNavigate={onNavigate} user={user} onLogout={onLogout} />
      <Container maxWidth="md" sx={{ pt: 4, pb: 6 }}>

        {/* Mi Cuenta */}
        <Typography sx={{
          fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
          fontSize: "1.4rem", letterSpacing: 2, color: "#1a2233", mb: 2, textTransform: "uppercase",
        }}>
          Mi Cuenta
        </Typography>

        <Paper elevation={1} sx={{ p: 3, bgcolor: "white", borderRadius: 3, mb: 3 }}>
          <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start", flexWrap: "wrap" }}>
            <Avatar sx={{
              width: 100, height: 100, borderRadius: "50%", flexShrink: 0,
              bgcolor: "#bbb", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}>
              <PersonIcon sx={{ fontSize: 54, color: "#fff" }} />
            </Avatar>

            <Box sx={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, minWidth: 260 }}>
              <Box>
                <Typography sx={labelSx}>USERNAME</Typography>
                <TextField value={form.username} onChange={set("username")} />
              </Box>
              <Box>
                <Typography sx={labelSx}>CORREO</Typography>
                <TextField type="email" value={form.email} onChange={set("email")} />
              </Box>
              <Box>
                <Typography sx={labelSx}>CONTRASEÑA</Typography>
                <TextField type="password" value={form.password} onChange={set("password")} />
              </Box>
              <Box>
                <Typography sx={labelSx}>FECHA DE NACIMIENTO</Typography>
                <TextField type="date" value={form.birth_date} onChange={set("birth_date")} />
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button variant="contained"
              sx={{ bgcolor: "#444", color: "#fff", "&:hover": { bgcolor: "#222" } }}>
              GUARDAR
            </Button>
            <Button variant="contained" onClick={onLogout}
              sx={{ bgcolor: "#e53935", "&:hover": { bgcolor: "#c62828" } }}>
              CERRAR SESION
            </Button>
          </Box>
        </Paper>

        <Divider sx={{ mb: 3 }} />

        {/* Mis Reseñas */}
        <Typography sx={{
          fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
          fontSize: "1.4rem", letterSpacing: 2, color: "#1a2233", mb: 2, textTransform: "uppercase",
        }}>
          Mis Reseñas
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          {myReviews.map((r, i) => (
            <Paper key={i} elevation={1} sx={{
              p: 2, bgcolor: "#e8eaed", borderRadius: 3, border: "1.5px solid #c5c9d0",
            }}>
              <Box sx={{ display: "flex", gap: 1.5, mb: 1 }}>
                <Box
                  component="img"
                  src={r.game.image}
                  alt={r.game.title}
                  sx={{ width: 60, height: 60, objectFit: "cover", borderRadius: 1.5, flexShrink: 0 }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
                <Box>
                  <Typography sx={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 800, fontSize: "0.95rem", letterSpacing: 1, color: "#1a2233",
                  }}>
                    {r.user}
                  </Typography>
                  <Typography sx={{
                    fontSize: "0.8rem", color: "#555", mt: 0.3,
                    display: "-webkit-box", WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical", overflow: "hidden",
                  }}>
                    {r.text}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button size="small" variant="contained"
                  sx={{ bgcolor: "#444", fontSize: "0.75rem", py: 0.3, color: "#fff",
                    "&:hover": { bgcolor: "#222" } }}>
                  Editar
                </Button>
                <Button size="small" variant="contained"
                  sx={{ bgcolor: "#e53935", fontSize: "0.75rem", py: 0.3,
                    "&:hover": { bgcolor: "#c62828" } }}>
                  ELIMINAR
                </Button>
              </Box>
            </Paper>
          ))}
        </Box>
      </Container>
    </>
  );
}