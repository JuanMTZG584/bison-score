import { useState, useEffect, useCallback } from "react";
import {
  Avatar, Box, Card, CardContent, CardMedia, Chip, CircularProgress,
  Container, FormControl, IconButton, MenuItem, Select,
  Typography, InputBase, Pagination, Alert,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Navbar from "./Navbar";
import { scoreColor, bgSx } from "./theme";

export default function GameList({ onNavigate, user, onLogout }) {
  const [games,       setGames]       = useState([]);
  const [page,        setPage]        = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const [search,      setSearch]      = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [platform,    setPlatform]    = useState("");
  const [genre,       setGenre]       = useState("");
  const [platforms,   setPlatforms]   = useState([]);
  const [genres,      setGenres]      = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");

  // Cargar opciones de combos al montar
  useEffect(() => {
    async function loadOptions() {
      try {
        const [pRes, gRes] = await Promise.all([
          fetch("/api/platforms/options", { credentials: "include" }),
          fetch("/api/genres/options",    { credentials: "include" }),
        ]);
        const pData = await pRes.json();
        const gData = await gRes.json();
        setPlatforms(pData.platforms || []);
        setGenres(gData.genres       || []);
      } catch {
        // silencioso
      }
    }
    loadOptions();
  }, []);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (search)   params.set("search",      search);
      if (platform) params.set("platform_id", platform);
      if (genre)    params.set("genre_id",    genre);

      const res  = await fetch(`/api/videogames/options?${params}`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setGames(data.videoGames);
      setTotalPages(data.totalPages);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, platform, genre]);

  useEffect(() => { fetchGames(); }, [fetchGames]);

  const applySearch = () => { setPage(1); setSearch(searchInput); };

  return (
    <Box sx={{ minHeight: "100vh", position: "relative" }}>
      <Box sx={bgSx} />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Navbar
          searchValue={searchInput}
          onSearchChange={(e) => setSearchInput(e.target.value)}
          onSearchSubmit={applySearch}
          onNavigate={onNavigate}
          user={user}
          onLogout={onLogout}
        />

        {/* Filtros */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1.5, pt: 2.5, pb: 1, px: 3, flexWrap: "wrap" }}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              value={platform}
              onChange={(e) => { setPlatform(e.target.value); setPage(1); }}
              displayEmpty
              sx={{ bgcolor: "white", borderRadius: 1.5 }}
            >
              <MenuItem value="">Todas las plataformas</MenuItem>
              {platforms.map((p) => (
                <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              value={genre}
              onChange={(e) => { setGenre(e.target.value); setPage(1); }}
              displayEmpty
              sx={{ bgcolor: "white", borderRadius: 1.5 }}
            >
              <MenuItem value="">Todos los géneros</MenuItem>
              {genres.map((g) => (
                <MenuItem key={g._id} value={g._id}>{g.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <IconButton
            onClick={applySearch}
            sx={{
              bgcolor: "secondary.main", color: "#fff", borderRadius: 1.5, px: 1.5,
              "&:hover": { bgcolor: "#219150" },
            }}
          >
            <FilterAltIcon />
          </IconButton>
        </Box>

        {/* Lista */}
        <Container maxWidth="md" sx={{ pb: 6 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {games.map((game) => (
                <Card
                  key={game._id}
                  onClick={() => onNavigate("game", game)}
                  sx={{
                    display: "flex", mb: 2, cursor: "pointer",
                    "&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.14)" },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={game.image_url}
                    alt={game.title}
                    sx={{ width: 90, height: 110, objectFit: "cover", flexShrink: 0 }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                  <CardContent sx={{
                    flex: 1, display: "flex", flexDirection: "column",
                    justifyContent: "center", gap: 1,
                  }}>
                    <Typography variant="h6" sx={{ fontSize: "1.15rem", color: "#1a2233" }}>
                      {game.title}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {game.platform_id && (
                        <Chip label={game.platform_id.name} variant="outlined" size="small" />
                      )}
                      {game.genre_id && (
                        <Chip label={game.genre_id.name} variant="outlined" size="small" />
                      )}
                    </Box>
                  </CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", pr: 2.5, pl: 1 }}>
                    <Avatar sx={{
                      width: 64, height: 64, borderRadius: 2,
                      bgcolor: scoreColor(game.rating_average),
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: "1.8rem", fontWeight: 800,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                    }}>
                      {game.rating_count > 0
                        ? Math.round(game.rating_average)
                        : "—"}
                    </Avatar>
                  </Box>
                </Card>
              ))}

              {games.length === 0 && !loading && (
                <Typography align="center" color="text.secondary" sx={{ mt: 5 }}>
                  No se encontraron juegos
                </Typography>
              )}

              {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, v) => setPage(v)}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>
    </Box>
  );
}