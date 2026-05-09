import { useState } from "react";
import {
  Avatar, Box, Button, Chip, Container, Dialog, DialogContent,
  Divider, Paper, TextField, Typography,
} from "@mui/material";
import StarIcon  from "@mui/icons-material/Star";
import Navbar from "./Navbar";
import { scoreColor, bgSx } from "./theme";

export default function GameDetail({ game, onNavigate, user, onLogout }) {
  const [showFull,    setShowFull]    = useState({});
  const [modalOpen,   setModalOpen]   = useState(false);
  const [reviewText,  setReviewText]  = useState("");
  const [rating,      setRating]      = useState("");

  const handleSend = () => {
    // TODO: conectar al backend
    setModalOpen(false);
    setReviewText("");
    setRating("");
  };

  return (
    <Box sx={{ minHeight: "100vh", position: "relative" }}>
      {/* Fondo difuminado */}
      <Box sx={bgSx} />

      {/* Contenido */}
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Navbar onNavigate={onNavigate} user={user} onLogout={onLogout} />
        <Container maxWidth="md" sx={{ pt: 4, pb: 6 }}>

          {/* Header del juego */}
          <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: "white", borderRadius: 3 }}>
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              <Box
                component="img"
                src={game.image}
                alt={game.title}
                sx={{ width: 240, height: 180, objectFit: "cover", borderRadius: 2, flexShrink: 0 }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", mb: 1.5 }}>
                  <Typography variant="h5" sx={{
                    fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, color: "#1a2233",
                  }}>
                    {game.title}
                  </Typography>
                  <Chip label={game.platform} variant="outlined" size="small" />
                  <Chip label={game.genre}    variant="outlined" size="small" />
                </Box>

                <Typography sx={{ color: "#555", mb: 2.5, fontSize: "0.95rem", lineHeight: 1.6 }}>
                  {game.description}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Button variant="outlined" size="small" startIcon={<StarIcon />}
                    sx={{ borderColor: "#b0b8c1", color: "#1a2233" }}>
                    Calificación
                  </Button>
                  <Avatar sx={{
                    width: 56, height: 56, borderRadius: 2,
                    bgcolor: scoreColor(game.score),
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: "1.6rem", fontWeight: 800,
                  }}>
                    {game.score}
                  </Avatar>
                </Box>
              </Box>
            </Box>
          </Paper>

          <Divider sx={{ mb: 3 }} />

          {/* Reseñas */}
          <Typography sx={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800, fontSize: "1.3rem", letterSpacing: 2,
            color: "#1a2233", mb: 2, textTransform: "uppercase",
          }}>
            Reseñas y Calificaciones
          </Typography>

          {user && (
            <Button
              variant="contained" color="secondary" size="small"
              onClick={() => setModalOpen(true)}
              sx={{ mb: 3, color: "#fff" }}
            >
              Agregar mi reseña
            </Button>
          )}

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            {game.reviews.map((r, i) => (
              <Paper key={i} elevation={1} sx={{
                p: 2.5, bgcolor: "#e8eaed", borderRadius: 3, border: "1.5px solid #c5c9d0",
              }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography sx={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 800, fontSize: "1rem", letterSpacing: 1, color: "#1a2233",
                  }}>
                    {r.user}
                  </Typography>
                  <Avatar sx={{
                    width: 34, height: 34, borderRadius: 1.5,
                    bgcolor: scoreColor(r.score),
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: "1rem", fontWeight: 800,
                  }}>
                    {r.score}
                  </Avatar>
                </Box>
                <Typography sx={{
                  fontSize: "0.85rem", color: "#444", lineHeight: 1.6,
                  display: "-webkit-box",
                  WebkitLineClamp: showFull[i] ? "unset" : 4,
                  WebkitBoxOrient: "vertical",
                  overflow: showFull[i] ? "visible" : "hidden",
                }}>
                  {r.text}
                </Typography>
                {r.text.length > 200 && (
                  <Button size="small" onClick={() => setShowFull((f) => ({ ...f, [i]: !f[i] }))}
                    sx={{ mt: 0.5, p: 0, fontSize: "0.78rem", color: "#1a2233",
                      textTransform: "none", minWidth: 0, fontWeight: 600 }}>
                    {showFull[i] ? "Ver menos" : "Leer más"}
                  </Button>
                )}
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Modal agregar reseña */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, bgcolor: "#d8dce2", border: "1.5px solid #b0b8c1" } }}
      >
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", gap: 2, mb: 2.5, alignItems: "flex-start" }}>
            <Box
              component="img"
              src={game.image}
              alt={game.title}
              sx={{ width: 80, height: 80, objectFit: "cover", borderRadius: 2, flexShrink: 0 }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <Box>
              <Typography sx={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800, fontSize: "1.2rem", color: "#1a2233", mb: 0.8,
              }}>
                {game.title}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip label={game.platform} variant="outlined" size="small" />
                <Chip label={game.genre}    variant="outlined" size="small" />
              </Box>
            </Box>
          </Box>

          <TextField
            multiline
            rows={5}
            placeholder="Escribe tu reseña"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            sx={{ mb: 2, "& .MuiOutlinedInput-root": { bgcolor: "white", borderRadius: 2 } }}
          />

          <TextField
            placeholder="Agrega calificación"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            inputProps={{ min: 1, max: 10, type: "number" }}
            sx={{ mb: 2.5, "& .MuiOutlinedInput-root": { bgcolor: "white", borderRadius: 2 } }}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              fullWidth variant="contained"
              onClick={() => setModalOpen(false)}
              sx={{ bgcolor: "#e53935", "&:hover": { bgcolor: "#c62828" } }}
            >
              CANCELAR
            </Button>
            <Button
              fullWidth variant="contained" color="secondary"
              onClick={handleSend}
              sx={{ color: "#fff" }}
            >
              ENVIAR
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}