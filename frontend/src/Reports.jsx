import { useState } from "react";
import {
  Box, Container, Typography, Divider, Tabs, Tab, Paper,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import RateReviewIcon from "@mui/icons-material/RateReview";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import Navbar from "./Navbar";
import TopRatedReport from "./reports/TopRatedReport";
import MostReviewedReport from "./reports/MostReviewedReport";
import UserActivityReport from "./reports/UserActivityReport";
import GamesDistributionReport from "./reports/GamesDistributionReport";

// ── report config ─────────────────────────────────────────────────────────────

const REPORT_TABS = [
  {
    id: "top-rated", label: "Top Calificados",
    icon: <EmojiEventsIcon fontSize="small" />,
    title: "TOP 10 VIDEOJUEGOS MEJOR CALIFICADOS",
    desc: "Juegos ordenados por puntuación promedio entre todos los usuarios.",
    component: <TopRatedReport />,
  },
  {
    id: "most-reviewed", label: "Más Reseñados",
    icon: <RateReviewIcon fontSize="small" />,
    title: "VIDEOJUEGOS CON MAYOR NÚMERO DE RESEÑAS",
    desc: "Juegos ordenados por total de interacciones (reseñas + calificaciones).",
    component: <MostReviewedReport />,
  },
  {
    id: "user-activity", label: "Actividad",
    icon: <PeopleIcon fontSize="small" />,
    title: "ACTIVIDAD DE USUARIOS",
    desc: "Usuarios ordenados por su nivel de participación en la plataforma.",
    component: <UserActivityReport />,
  },
  {
    id: "distribution", label: "Distribución",
    icon: <BarChartIcon fontSize="small" />,
    title: "DISTRIBUCIÓN DE VIDEOJUEGOS",
    desc: "Número de juegos activos agrupados por género y por plataforma.",
    component: <GamesDistributionReport />,
  },
];

// ── main component ────────────────────────────────────────────────────────────

export default function Reports({ onNavigate, user, onLogout }) {
  const [tab, setTab] = useState(0);
  const current = REPORT_TABS[tab];

  return (
    <>
      <Navbar onNavigate={onNavigate} user={user} onLogout={onLogout} />
      <Container maxWidth="lg" sx={{ pt: 4, pb: 6 }}>

        <Typography sx={{
          fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
          fontSize: "1.4rem", letterSpacing: 2, color: "#1a2233",
          mb: 1, textTransform: "uppercase",
        }}>
          Reportes
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{
          mb: 3,
          "& .MuiTab-root": {
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", fontSize: "0.9rem",
          },
          "& .MuiTabs-indicator": { bgcolor: "#2c3e50", height: 3, borderRadius: 2 },
        }}>
          {REPORT_TABS.map((r) => (
            <Tab key={r.id} label={r.label} icon={r.icon} iconPosition="start" />
          ))}
        </Tabs>

        <Paper elevation={0} variant="outlined" sx={{ borderRadius: 3, p: 3, bgcolor: "white" }}>
          <Box sx={{ mb: 2.5 }}>
            <Typography sx={{
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
              fontSize: "1.1rem", letterSpacing: 1.5, color: "#1a2233",
              textTransform: "uppercase", mb: 0.5,
            }}>
              {current.title}
            </Typography>
            <Typography sx={{ fontSize: "0.85rem", color: "#666" }}>
              {current.desc}
            </Typography>
          </Box>

          {current.component}
        </Paper>
      </Container>
    </>
  );
}