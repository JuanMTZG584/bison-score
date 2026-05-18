import { useState, useEffect, useCallback } from "react";
import {
  Alert, Avatar, Box, Button, Chip, CircularProgress, Container,
  Dialog, DialogContent, Divider, Paper, Slider, TextField, Typography,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Navbar from "./Navbar";
import { scoreColor, bgSx } from "./theme";
import {
  getGameReviews,
  createReview,
  updateReview,
  deleteReview,
  upsertRating,
  deleteRating,
} from "./api/reviews";

export default function GameDetail({ game: gameFromList, onNavigate, user, onLogout }) {
  // Datos del juego (se recarga desde el backend para tener todos los campos)
  const [game,    setGame]    = useState(gameFromList);
  const [gameErr, setGameErr] = useState("");

  // Feedback list
  const [feedback,    setFeedback]    = useState([]);
  const [feedPage,    setFeedPage]    = useState(1);
  const [feedTotal,   setFeedTotal]   = useState(0);
  const [feedLoading, setFeedLoading] = useState(false);

  // Estado del propio usuario en este juego
  const [myReview,   setMyReview]   = useState(null); // { _id, comment }
  const [myRating,   setMyRating]   = useState(null); // { _id, score }

  // Modal
  const [modalOpen,  setModalOpen]  = useState(false);
  const [modalMode,  setModalMode]  = useState("create"); // "create" | "edit"
  const [comment,    setComment]    = useState("");
  const [score,      setScore]      = useState(50);
  const [modalErr,   setModalErr]   = useState("");
  const [modalLoad,  setModalLoad]  = useState(false);

  const [showFull, setShowFull] = useState({});

  const gameId = game?._id;

  // Recargar detalle del juego
  useEffect(() => {
    if (!gameId) return;
    fetch(`/api/videogames/${gameId}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => { if (d.videoGame) setGame(d.videoGame); })
      .catch(() => setGameErr("No se pudo cargar el detalle del juego"));
  }, [gameId]);

  // Cargar reviews/ratings del juego
  const fetchFeedback = useCallback(async () => {
    if (!gameId) return;
    setFeedLoading(true);
    try {
      const data = await getGameReviews(gameId, { page: feedPage, limit: 6 });
      setFeedback(data.feedback || []);
      setFeedTotal(data.totalFeedback || 0);

      // Detectar si el usuario ya tiene review o rating en este juego
      if (user) {
        // getUserReviews devuelve el feedback agrupado por juego;
        // lo más simple: buscamos en el feedback actual si hay entrada del usuario.
        // El backend popula user_id; aquí lo verificamos por nombre como fallback.
        // Para mayor precisión guardamos lo que venga de /api/reviews/user.
      }
    } catch {
      // silencioso
    } finally {
      setFeedLoading(false);
    }
  }, [gameId, feedPage, user]);

  useEffect(() => { fetchFeedback(); }, [fetchFeedback]);

  // Cargar el feedback propio del usuario para este juego
  useEffect(() => {
    if (!user || !gameId) return;
    fetch("/api/reviews/user", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        const entry = (data.feedback || []).find(
          (f) => f.video_game?._id === gameId || f.video_game?._id?.toString() === gameId
        );
        if (entry) {
          setMyReview(entry.review || null);
          setMyRating(entry.rating || null);
        }
      })
      .catch(() => {});
  }, [user, gameId]);

  /* ── Modal helpers ──────────────────────────────────────────────────────── */
  const openCreate = () => {
    setComment("");
    setScore(myRating?.score ?? 50);
    setModalErr("");
    setModalMode("create");
    setModalOpen(true);
  };

  const openEdit = () => {
    setComment(myReview?.comment || "");
    setScore(myRating?.score ?? 50);
    setModalErr("");
    setModalMode("edit");
    setModalOpen(true);
  };

const handleSend = async () => {
  setModalLoad(true);
  setModalErr("");

  try {
    // rating
    await upsertRating(gameId, score);

    // review
    if (comment.trim()) {
      if (myReview) {
        await updateReview(myReview._id, comment.trim());
      } else {
        await createReview({
          video_game_id: gameId,
          comment: comment.trim(),
        });
      }
    }

    setModalOpen(false);

    fetchFeedback();

    const res = await fetch(`/api/videogames/${gameId}`, {
      credentials: "include",
    });

    const d = await res.json();

    if (d.videoGame) setGame(d.videoGame);

    const rUser = await fetch("/api/reviews/user", {
      credentials: "include",
    });

    const dUser = await rUser.json();

    const entry = (dUser.feedback || []).find(
      (f) =>
        f.video_game?._id === gameId ||
        f.video_game?._id?.toString() === gameId
    );

    setMyReview(entry?.review || null);
    setMyRating(entry?.rating || null);

  } catch (e) {
    setModalErr(e.message);
  } finally {
    setModalLoad(false);
  }
};

  const handleDeleteReview = async () => {
    if (!myReview) return;
    try {
      await deleteReview(myReview._id);
      setMyReview(null);
      fetchFeedback();
    } catch (e) {
      setGameErr(e.message);
    }
  };

const handleDeleteRating = async () => {
  if (!myRating) return;

  try {
    // borrar review si existe
    if (myReview) {
      await deleteReview(myReview._id);
      setMyReview(null);
    }

    // borrar rating
    await deleteRating(myRating._id);
    setMyRating(null);

    const res = await fetch(`/api/videogames/${gameId}`, {
      credentials: "include",
    });

    const d = await res.json();

    if (d.videoGame) setGame(d.videoGame);

    fetchFeedback();
  } catch (e) {
    setGameErr(e.message);
  }
};

  if (!game) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const hasMyFeedback = myReview || myRating;
  const FEED_LIMIT    = 6;
  const totalPages    = Math.ceil(feedTotal / FEED_LIMIT);

  return (
    <Box sx={{ minHeight: "100vh", position: "relative" }}>
      <Box sx={bgSx} />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Navbar onNavigate={onNavigate} user={user} onLogout={onLogout} />
        <Container maxWidth="md" sx={{ pt: 4, pb: 6 }}>

          {gameErr && <Alert severity="error" sx={{ mb: 2 }}>{gameErr}</Alert>}

          {/* ── Header del juego ──────────────────────────────────────── */}
          <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: "white", borderRadius: 3 }}>
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              <Box
                component="img"
                src={game.image_url}
                alt={game.title}
                sx={{ width: 240, height: 180, objectFit: "cover", borderRadius: 2, flexShrink: 0 }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", mb: 1.5 }}>
                  <Typography variant="h5" sx={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 800, color: "#1a2233",
                  }}>
                    {game.title}
                  </Typography>
                  {game.platform_id && (
                    <Chip label={game.platform_id.name} variant="outlined" size="small" />
                  )}
                  {game.genre_id && (
                    <Chip label={game.genre_id.name} variant="outlined" size="small" />
                  )}
                </Box>

                {game.developer && (
                  <Typography sx={{ fontSize: "0.82rem", color: "#888", mb: 0.5 }}>
                    {game.developer}
                    {game.release_date && (
                      <> · {new Date(game.release_date).getFullYear()}</>
                    )}
                  </Typography>
                )}

                <Typography sx={{ color: "#555", mb: 2.5, fontSize: "0.95rem", lineHeight: 1.6 }}>
                  {game.description}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                  <Avatar sx={{
                    width: 56, height: 56, borderRadius: 2,
                    bgcolor: scoreColor(game.rating_average),
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: "1.6rem", fontWeight: 800,
                  }}>
                    {game.rating_count > 0 ? Math.round(game.rating_average) : "—"}
                  </Avatar>
                  <Typography sx={{ fontSize: "0.8rem", color: "#888" }}>
                    {game.rating_count > 0
                      ? `${game.rating_count} calificación${game.rating_count !== 1 ? "es" : ""}`
                      : "Sin calificaciones"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* ── Mi reseña / calificación ───────────────────────────────── */}
          {user && (
            <Box sx={{ mb: 3 }}>
              {hasMyFeedback ? (
                <Paper elevation={1} sx={{
                  p: 2.5, bgcolor: "#e0f2e9", borderRadius: 3,
                  border: "1.5px solid #a5d6a7",
                }}>
                  <Typography sx={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 800, fontSize: "0.9rem", letterSpacing: 1,
                    color: "#2e7d32", mb: 1,
                  }}>
                    MI RESEÑA Y CALIFICACIÓN
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", flexWrap: "wrap" }}>
                    {myRating && (
                      <Avatar sx={{
                        width: 40, height: 40, borderRadius: 1.5, flexShrink: 0,
                        bgcolor: scoreColor(myRating.score),
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: "1.1rem", fontWeight: 800,
                      }}>
                        {myRating.score}
                      </Avatar>
                    )}
                    {myReview && (
                      <Typography sx={{ flex: 1, fontSize: "0.88rem", color: "#333" }}>
                        {myReview.comment}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
                    <Button
                      size="small" variant="contained" startIcon={<EditIcon />}
                      onClick={openEdit}
                      sx={{ bgcolor: "#27ae60", "&:hover": { bgcolor: "#219150" }, color: "#fff", fontSize: "0.78rem" }}
                    >
                      Editar
                    </Button>
                    {myReview && (
                      <Button
                        size="small" variant="contained" startIcon={<DeleteIcon />}
                        onClick={handleDeleteReview}
                        sx={{ bgcolor: "#e53935", "&:hover": { bgcolor: "#c62828" }, fontSize: "0.78rem" }}
                      >
                        Borrar reseña
                      </Button>
                    )}
                    {myRating && (
                      <Button
                        size="small" variant="outlined" startIcon={<DeleteIcon />}
                        onClick={handleDeleteRating}
                        sx={{ borderColor: "#e53935", color: "#e53935", fontSize: "0.78rem" }}
                      >
                        Borrar reseña y calificación.
                      </Button>
                    )}
                  </Box>
                </Paper>
              ) : (
                <Button
                  variant="contained" color="secondary" startIcon={<StarIcon />}
                  onClick={openCreate}
                  sx={{ color: "#fff" }}
                >
                  Agregar mi reseña y calificación
                </Button>
              )}
            </Box>
          )}

          <Divider sx={{ mb: 3 }} />

          {/* ── Reseñas y calificaciones ───────────────────────────────── */}
          <Typography sx={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800, fontSize: "1.3rem", letterSpacing: 2,
            color: "#1a2233", mb: 2, textTransform: "uppercase",
          }}>
            Reseñas y Calificaciones
          </Typography>

          {feedLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : feedback.length === 0 ? (
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Aún no hay reseñas. ¡Sé el primero!
            </Typography>
          ) : (
            <>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 3 }}>
                {feedback.map((item, i) => (
                  <Paper key={i} elevation={1} sx={{
                    p: 2.5, bgcolor: "#e8eaed", borderRadius: 3, border: "1.5px solid #c5c9d0",
                  }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar
                          src={item.user?.image_url}
                          sx={{ width: 28, height: 28, fontSize: "0.8rem" }}
                        >
                          {item.user?.name?.[0]?.toUpperCase()}
                        </Avatar>
                        <Typography sx={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontWeight: 800, fontSize: "1rem", letterSpacing: 1, color: "#1a2233",
                        }}>
                          {item.user?.name}
                        </Typography>
                      </Box>
                      {item.rating && (
                        <Avatar sx={{
                          width: 34, height: 34, borderRadius: 1.5,
                          bgcolor: scoreColor(item.rating.score),
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontSize: "1rem", fontWeight: 800,
                        }}>
                          {item.rating.score}
                        </Avatar>
                      )}
                    </Box>
                    {item.review && (
                      <>
                        <Typography sx={{
                          fontSize: "0.85rem", color: "#444", lineHeight: 1.6,
                          display: "-webkit-box",
                          WebkitLineClamp: showFull[i] ? "unset" : 4,
                          WebkitBoxOrient: "vertical",
                          overflow: showFull[i] ? "visible" : "hidden",
                        }}>
                          {item.review.comment}
                        </Typography>
                        {item.review.comment.length > 200 && (
                          <Button
                            size="small"
                            onClick={() => setShowFull((f) => ({ ...f, [i]: !f[i] }))}
                            sx={{
                              mt: 0.5, p: 0, fontSize: "0.78rem", color: "#1a2233",
                              textTransform: "none", minWidth: 0, fontWeight: 600,
                            }}
                          >
                            {showFull[i] ? "Ver menos" : "Leer más"}
                          </Button>
                        )}
                      </>
                    )}
                  </Paper>
                ))}
              </Box>

              {/* Paginación del feedback */}
              {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Button
                      key={p}
                      size="small"
                      variant={feedPage === p ? "contained" : "outlined"}
                      onClick={() => setFeedPage(p)}
                      sx={{ mx: 0.5, minWidth: 36 }}
                    >
                      {p}
                    </Button>
                  ))}
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>

      {/* ── Modal reseña + calificación ─────────────────────────────────── */}
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
              src={game.image_url}
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
                {game.platform_id && (
                  <Chip label={game.platform_id.name} variant="outlined" size="small" />
                )}
                {game.genre_id && (
                  <Chip label={game.genre_id.name} variant="outlined" size="small" />
                )}
              </Box>
            </Box>
          </Box>

          {modalErr && <Alert severity="error" sx={{ mb: 2 }}>{modalErr}</Alert>}

          {/* Calificación con slider */}
          <Typography sx={{
            fontSize: "0.75rem", fontWeight: 700, letterSpacing: 1.5,
            color: "#1a2233", mb: 0.5,
          }}>
            CALIFICACIÓN: {score}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Slider
              value={score}
              onChange={(_, v) => setScore(v)}
              min={0}
              max={100}
              sx={{ color: scoreColor(score), flex: 1 }}
            />
            <Avatar sx={{
              width: 40, height: 40, borderRadius: 1.5,
              bgcolor: scoreColor(score),
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "1rem", fontWeight: 800, flexShrink: 0,
            }}>
              {score}
            </Avatar>
          </Box>

          <TextField
            multiline
            rows={5}
            placeholder="Escribe tu reseña (opcional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
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
              disabled={modalLoad} onClick={handleSend}
              sx={{ color: "#fff" }}
            >
              {modalLoad ? <CircularProgress size={18} color="inherit" /> : "GUARDAR"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}