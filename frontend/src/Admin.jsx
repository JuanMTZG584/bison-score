import { useState } from "react";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import Navbar from "./Navbar";
import UsersTab from "./tabs/UsersTab";
import PlatformsTab from "./tabs/PlatformsTab";
import VideoGamesTab from "./tabs/VideoGamesTab";
import GenresTab from "./tabs/GenresTab";

/* ─── Constantes ─────────────────────────────────────────── */
const TABS = ["USUARIOS", "PLATAFORMAS", "VIDEOJUEGOS", "GÉNEROS"];



/* ─── Componente principal Admin ─────────────────────────── */
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

          {tab === 0 && <UsersTab currentUserId={user?._id} />}
          {tab === 1 && <PlatformsTab />}
          {tab === 2 && <VideoGamesTab />}
          {tab === 3 && <GenresTab />}
        </Paper>
      </Container>
    </>
  );
}