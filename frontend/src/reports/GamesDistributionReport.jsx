import { useState, useEffect } from "react";
import {
  Box, Paper, Typography, Chip, Grid, Skeleton, Alert,
} from "@mui/material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import DevicesIcon from "@mui/icons-material/Devices";

function DistributionBar({ name, total, max, barColor, chipBg, chipFg }) {
  const pct = max > 0 ? (total / max) * 100 : 0;
  return (
    <Box sx={{ mb: 1.8 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
        <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#1a2233" }}>
          {name}
        </Typography>
        <Chip
          label={`${total} juego${total !== 1 ? "s" : ""}`}
          size="small"
          sx={{ fontWeight: 700, fontSize: "0.72rem", bgcolor: chipBg, color: chipFg }}
        />
      </Box>
      <Box sx={{ position: "relative", height: 10, bgcolor: "#e8eaed", borderRadius: 5, overflow: "hidden" }}>
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${pct}%`,
            bgcolor: barColor,
            borderRadius: 5,
            transition: "width 0.6s ease",
          }}
        />
      </Box>
    </Box>
  );
}

export default function GamesDistributionReport() {
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/reports/games-distribution", { credentials: "include" });
        if (!res.ok) throw new Error("Error al cargar los datos");
        const json = await res.json();
        setGenres(json.genres_distribution || []);
        setPlatforms(json.platforms_distribution || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (error) return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;

  const maxGenre = genres[0]?.total_games || 1;
  const maxPlatform = platforms[0]?.total_games || 1;
  const totalG = genres.reduce((s, g) => s + g.total_games, 0);
  const totalP = platforms.reduce((s, p) => s + p.total_games, 0);

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[0, 1].map((col) => (
          <Grid item xs={12} md={6} key={col}>
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
              <Skeleton width="45%" height={28} sx={{ mb: 2 }} />
              {Array.from({ length: 5 }).map((_, i) => (
                <Box key={i} sx={{ mb: 2 }}>
                  <Skeleton width="60%" height={18} />
                  <Skeleton height={10} sx={{ borderRadius: 5, mt: 0.5 }} />
                </Box>
              ))}
            </Paper>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* ── Géneros ── */}
      <Grid item xs={12} md={6}>
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, height: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
            <SportsEsportsIcon sx={{ color: "#27ae60", fontSize: "1.25rem" }} />
            <Typography
              sx={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800,
                fontSize: "1rem",
                letterSpacing: 1,
                color: "#1a2233",
                textTransform: "uppercase",
              }}
            >
              Por Género
            </Typography>
            <Chip
              label={`${totalG} total`}
              size="small"
              sx={{
                ml: "auto",
                fontWeight: 700,
                bgcolor: "#e8f5e9",
                color: "#1a7a3c",
                fontSize: "0.72rem",
              }}
            />
          </Box>

          {genres.length === 0 ? (
            <Typography sx={{ color: "#888", fontSize: "0.85rem" }}>Sin datos disponibles.</Typography>
          ) : (
            genres.map((g) => (
              <DistributionBar
                key={g.genre._id}
                name={g.genre.name}
                total={g.total_games}
                max={maxGenre}
                barColor="#27ae60"
                chipBg="#e8f5e9"
                chipFg="#1a7a3c"
              />
            ))
          )}
        </Paper>
      </Grid>

      {/* ── Plataformas ── */}
      <Grid item xs={12} md={6}>
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, height: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
            <DevicesIcon sx={{ color: "#2c3e50", fontSize: "1.25rem" }} />
            <Typography
              sx={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800,
                fontSize: "1rem",
                letterSpacing: 1,
                color: "#1a2233",
                textTransform: "uppercase",
              }}
            >
              Por Plataforma
            </Typography>
            <Chip
              label={`${totalP} total`}
              size="small"
              sx={{
                ml: "auto",
                fontWeight: 700,
                bgcolor: "#e8eaf6",
                color: "#283593",
                fontSize: "0.72rem",
              }}
            />
          </Box>

          {platforms.length === 0 ? (
            <Typography sx={{ color: "#888", fontSize: "0.85rem" }}>Sin datos disponibles.</Typography>
          ) : (
            platforms.map((p) => (
              <DistributionBar
                key={p.platform._id}
                name={p.platform.name}
                total={p.total_games}
                max={maxPlatform}
                barColor="#2c3e50"
                chipBg="#e8eaf6"
                chipFg="#283593"
              />
            ))
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}
