import { useState } from "react";
import {
  Box, Card, CardContent, CardMedia, Chip, Container,
  FormControl, IconButton, MenuItem, Select, Typography, Avatar,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Navbar from "./Navbar";
import { GAMES, GENRES, PLATFORMS, scoreColor, bgSx } from "./theme";

export default function GameList({ onNavigate, user, onLogout }) {
  const [search,   setSearch]   = useState("");
  const [platform, setPlatform] = useState("Todas");
  const [genre,    setGenre]    = useState("Todos");

  const filtered = GAMES.filter((g) =>
    g.title.toLowerCase().includes(search.toLowerCase()) &&
    (platform === "Todas" || g.platform === platform) &&
    (genre    === "Todos" || g.genre    === genre)
  );

  return (
    <Box sx={{ minHeight: "100vh", position: "relative" }}>
      {/* Fondo difuminado */}
      <Box sx={bgSx} />

      {/* Contenido */}
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Navbar
          searchValue={search}
          onSearchChange={(e) => setSearch(e.target.value)}
          onNavigate={onNavigate}
          user={user}
          onLogout={onLogout}
        />

        {/* Filtros */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1.5, pt: 2.5, pb: 1, px: 3 }}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select value={platform} onChange={(e) => setPlatform(e.target.value)}
              sx={{ bgcolor: "white", borderRadius: 1.5 }}>
              {PLATFORMS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select value={genre} onChange={(e) => setGenre(e.target.value)}
              sx={{ bgcolor: "white", borderRadius: 1.5 }}>
              {GENRES.map((g) => <MenuItem key={g} value={g}>{g}</MenuItem>)}
            </Select>
          </FormControl>
          <IconButton sx={{ bgcolor: "secondary.main", color: "#fff", borderRadius: 1.5, px: 1.5,
            "&:hover": { bgcolor: "#219150" } }}>
            <FilterAltIcon />
          </IconButton>
        </Box>

        {/* Lista de juegos */}
        <Container maxWidth="md" sx={{ pb: 6 }}>
          {filtered.map((game) => (
            <Card
              key={game.id}
              onClick={() => onNavigate("game", game)}
              sx={{ display: "flex", mb: 2, cursor: "pointer",
                "&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.14)" } }}
            >
              <CardMedia
                component="img"
                image={game.image}
                alt={game.title}
                sx={{ width: 90, height: 110, objectFit: "cover", flexShrink: 0 }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column",
                justifyContent: "center", gap: 1 }}>
                <Typography variant="h6" sx={{ fontSize: "1.15rem", color: "#1a2233" }}>
                  {game.title}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Chip label={game.platform} variant="outlined" size="small" />
                  <Chip label={game.genre}    variant="outlined" size="small" />
                </Box>
              </CardContent>
              <Box sx={{ display: "flex", alignItems: "center", pr: 2.5, pl: 1 }}>
                <Avatar sx={{
                  width: 64, height: 64, borderRadius: 2,
                  bgcolor: scoreColor(game.score),
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: "1.8rem", fontWeight: 800,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                }}>
                  {game.score}
                </Avatar>
              </Box>
            </Card>
          ))}

          {filtered.length === 0 && (
            <Typography align="center" color="text.secondary" sx={{ mt: 5 }}>
              No se encontraron juegos
            </Typography>
          )}
        </Container>
      </Box>
    </Box>
  );
}