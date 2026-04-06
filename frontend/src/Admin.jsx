import { useState } from "react";
import {
  Avatar, Box, Button, Container, IconButton, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon   from "@mui/icons-material/Edit";
import Navbar from "./Navbar";
import { GAMES, MOCK_USERS, scoreColor } from "./theme";

const TABS        = ["USUARIOS", "PLATAFORMAS", "VIDEOJUEGOS", "GÉNEROS"];
const PLATFORMS   = ["Playstation 5", "Xbox", "Nintendo Switch", "PC"];
const GENRES_LIST = ["Acción", "Simulador", "Carreras", "RPG", "Aventura"];

const headSx = {
  color: "#fff",
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 700, letterSpacing: 1, py: 1.5,
};

const ActionBtn = ({ color, children }) => (
  <IconButton size="small" sx={{
    bgcolor: color, color: "#fff", borderRadius: 1, p: 0.6,
    "&:hover": { bgcolor: color, filter: "brightness(0.85)" },
  }}>
    {children}
  </IconButton>
);

export default function Admin({ onNavigate, user, onLogout }) {
  const [tab, setTab] = useState(0);

  return (
    <>
      <Navbar onNavigate={onNavigate} user={user} onLogout={onLogout} />
      <Container maxWidth="md" sx={{ pt: 4, pb: 6 }}>
        <Paper elevation={2} sx={{ bgcolor: "#d8dce2", borderRadius: 3, border: "1.5px solid #b0b8c1", p: 3 }}>
          <Typography sx={{
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
            fontSize: "1.4rem", letterSpacing: 3, color: "#1a2233",
            textAlign: "center", mb: 3, textTransform: "uppercase",
          }}>
            Página de Administrador
          </Typography>

          {/* Botones de tabs */}
          <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center", mb: 3, flexWrap: "wrap" }}>
            {TABS.map((t, i) => (
              <Button key={t} variant="contained" onClick={() => setTab(i)}
                sx={{
                  bgcolor: tab === i ? "#3a4a5a" : "#555",
                  "&:hover": { bgcolor: "#3a4a5a" },
                  fontSize: "0.85rem", py: 0.8, px: 2,
                }}>
                {t}
              </Button>
            ))}
          </Box>

          {/* Tab: Usuarios */}
          {tab === 0 && (
            <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#3a4a5a" }}>
                    {["USUARIO", "CORREO", "FECHA DE NACIMIENTO", "CONTRASEÑA", "", ""].map((h, i) => (
                      <TableCell key={i} sx={headSx}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {MOCK_USERS.map((u, i) => (
                    <TableRow key={u.id} sx={{ bgcolor: i % 2 === 0 ? "white" : "#f5f6f7" }}>
                      <TableCell sx={{ fontWeight: 600 }}>{u.username}</TableCell>
                      <TableCell sx={{ fontSize: "0.8rem" }}>{u.email}</TableCell>
                      <TableCell>{u.birth_date}</TableCell>
                      <TableCell>{u.password}</TableCell>
                      <TableCell><ActionBtn color="#e53935"><DeleteIcon fontSize="small" /></ActionBtn></TableCell>
                      <TableCell><ActionBtn color="#27ae60"><EditIcon fontSize="small" /></ActionBtn></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Tab: Plataformas */}
          {tab === 1 && (
            <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#3a4a5a" }}>
                    <TableCell sx={headSx}>PLATAFORMA</TableCell>
                    <TableCell /><TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {PLATFORMS.map((p, i) => (
                    <TableRow key={i} sx={{ bgcolor: i % 2 === 0 ? "white" : "#f5f6f7" }}>
                      <TableCell sx={{ fontWeight: 600 }}>{p}</TableCell>
                      <TableCell><ActionBtn color="#e53935"><DeleteIcon fontSize="small" /></ActionBtn></TableCell>
                      <TableCell><ActionBtn color="#27ae60"><EditIcon fontSize="small" /></ActionBtn></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Tab: Videojuegos */}
          {tab === 2 && (
            <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#3a4a5a" }}>
                    {["TÍTULO", "PLATAFORMA", "GÉNERO", "SCORE", "", ""].map((h, i) => (
                      <TableCell key={i} sx={headSx}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {GAMES.map((g, i) => (
                    <TableRow key={g.id} sx={{ bgcolor: i % 2 === 0 ? "white" : "#f5f6f7" }}>
                      <TableCell sx={{ fontWeight: 600 }}>{g.title}</TableCell>
                      <TableCell>{g.platform}</TableCell>
                      <TableCell>{g.genre}</TableCell>
                      <TableCell>
                        <Avatar sx={{
                          width: 28, height: 28, borderRadius: 1, bgcolor: scoreColor(g.score),
                          fontFamily: "'Barlow Condensed', sans-serif", fontSize: "0.85rem", fontWeight: 800,
                        }}>
                          {g.score}
                        </Avatar>
                      </TableCell>
                      <TableCell><ActionBtn color="#e53935"><DeleteIcon fontSize="small" /></ActionBtn></TableCell>
                      <TableCell><ActionBtn color="#27ae60"><EditIcon fontSize="small" /></ActionBtn></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Tab: Géneros */}
          {tab === 3 && (
            <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#3a4a5a" }}>
                    <TableCell sx={headSx}>GÉNERO</TableCell>
                    <TableCell /><TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {GENRES_LIST.map((g, i) => (
                    <TableRow key={i} sx={{ bgcolor: i % 2 === 0 ? "white" : "#f5f6f7" }}>
                      <TableCell sx={{ fontWeight: 600 }}>{g}</TableCell>
                      <TableCell><ActionBtn color="#e53935"><DeleteIcon fontSize="small" /></ActionBtn></TableCell>
                      <TableCell><ActionBtn color="#27ae60"><EditIcon fontSize="small" /></ActionBtn></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
    </>
  );
}