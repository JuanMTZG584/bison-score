import { useState, useEffect } from "react";
import {
  Alert, Avatar, Box, Button, CircularProgress, Container,
  Divider, Paper, TextField, Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import StarIcon   from "@mui/icons-material/Star";
import Navbar from "./Navbar";
import { labelSx, bgSx, scoreColor } from "./theme";
import { updateProfile, uploadImage } from "./api/users";
import { getUserReviews } from "./api/reviews";

export default function MyAccount({ onNavigate, user, onLogout, onUserUpdate }) {
  const [form, setForm] = useState({
    name:            user?.name        || "",
    email:           user?.email       || "",
    birth_date:      user?.birth_date  ? user.birth_date.slice(0, 10) : "",
    currentPassword: "",
    password:        "",
  });
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState("");
  const [imgFile,    setImgFile]    = useState(null);
  const [imgPreview, setImgPreview] = useState(user?.image_url || null);

  // Reseñas
  const [feedback,    setFeedback]    = useState([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [feedError,   setFeedError]   = useState("");

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name:       user.name       || "",
        email:      user.email      || "",
        birth_date: user.birth_date ? user.birth_date.slice(0, 10) : "",
      }));
      setImgPreview(user.image_url || null);
    }
  }, [user]);

  // Cargar reseñas reales del usuario
  useEffect(() => {
    if (!user) return;
    setFeedLoading(true);
    setFeedError("");
    getUserReviews({ limit: 50 })
      .then((data) => setFeedback(data.feedback || []))
      .catch((e)   => setFeedError(e.message))
      .finally(()  => setFeedLoading(false));
  }, [user]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const payload = {};

      if (imgFile) {
        const { url } = await uploadImage(imgFile);
        payload.image_url = url;
      }

      if (form.name.trim())  payload.name       = form.name.trim();
      if (form.birth_date)   payload.birth_date = form.birth_date;
      if (form.password) {
        payload.password        = form.password;
        payload.currentPassword = form.currentPassword;
      }

      if (Object.keys(payload).length === 0) {
        setError("No hay datos para actualizar.");
        return;
      }

      const { user: updated } = await updateProfile(payload);
      onUserUpdate(updated);
      setSuccess("Perfil actualizado correctamente.");
      setForm((f) => ({ ...f, currentPassword: "", password: "" }));
      setImgFile(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", position: "relative" }}>
      <Box sx={bgSx} />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Navbar onNavigate={onNavigate} user={user} onLogout={onLogout} />
        <Container maxWidth="md" sx={{ pt: 4, pb: 6 }}>

          <Typography sx={{
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
            fontSize: "1.4rem", letterSpacing: 2, color: "#1a2233", mb: 2, textTransform: "uppercase",
          }}>
            Mi Cuenta
          </Typography>

          {/* ── Formulario de perfil (sin cambios respecto al original) ── */}
          <Paper elevation={1} sx={{ p: 3, bgcolor: "white", borderRadius: 3, mb: 3 }}>
            {error   && <Alert severity="error"   sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start", flexWrap: "wrap" }}>
              <Box sx={{ position: "relative", flexShrink: 0 }}>
                <Avatar
                  src={imgPreview || undefined}
                  sx={{
                    width: 100, height: 100, borderRadius: "50%",
                    bgcolor: "#bbb", boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                >
                  {!imgPreview && <PersonIcon sx={{ fontSize: 54, color: "#fff" }} />}
                </Avatar>
                <Box
                  component="label"
                  htmlFor="avatar-upload"
                  sx={{
                    position: "absolute", bottom: 0, right: 0,
                    bgcolor: "secondary.main", color: "#fff",
                    borderRadius: "50%", width: 28, height: 28,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", fontSize: "0.75rem", fontWeight: 700,
                    border: "2px solid white",
                  }}
                  title="Cambiar foto"
                >
                  ✎
                </Box>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
              </Box>

              <Box sx={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, minWidth: 260 }}>
                <Box>
                  <Typography sx={labelSx}>USERNAME</Typography>
                  <TextField value={form.name} onChange={set("name")} />
                </Box>
                <Box>
                  <Typography sx={labelSx}>CORREO (solo lectura)</Typography>
                  <TextField value={form.email} disabled />
                </Box>
                <Box>
                  <Typography sx={labelSx}>CONTRASEÑA ACTUAL</Typography>
                  <TextField
                    type="password"
                    value={form.currentPassword}
                    onChange={set("currentPassword")}
                    placeholder="Requerida para cambiar contraseña"
                  />
                </Box>
                <Box>
                  <Typography sx={labelSx}>NUEVA CONTRASEÑA</Typography>
                  <TextField
                    type="password"
                    value={form.password}
                    onChange={set("password")}
                    placeholder="Dejar vacío para no cambiar"
                  />
                </Box>
                <Box>
                  <Typography sx={labelSx}>FECHA DE NACIMIENTO</Typography>
                  <TextField type="date" value={form.birth_date} onChange={set("birth_date")} />
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                disabled={loading}
                onClick={handleSave}
                sx={{ bgcolor: "#444", color: "#fff", "&:hover": { bgcolor: "#222" } }}
              >
                {loading ? <CircularProgress size={18} color="inherit" /> : "GUARDAR"}
              </Button>
              <Button variant="contained" onClick={onLogout}
                sx={{ bgcolor: "#e53935", "&:hover": { bgcolor: "#c62828" } }}>
                CERRAR SESIÓN
              </Button>
            </Box>
          </Paper>

          <Divider sx={{ mb: 3 }} />

          {/* ── Mis Reseñas (conectado al backend) ───────────────────── */}
          <Typography sx={{
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
            fontSize: "1.4rem", letterSpacing: 2, color: "#1a2233", mb: 2, textTransform: "uppercase",
          }}>
            Mis Reseñas
          </Typography>

          {feedError && <Alert severity="error" sx={{ mb: 2 }}>{feedError}</Alert>}

          {feedLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : feedback.length === 0 ? (
            <Typography sx={{ color: "#777", fontSize: "0.9rem" }}>
              Aún no has dejado ninguna reseña o calificación.
            </Typography>
          ) : (
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              {feedback.map((item, i) => (
                <Paper
                  key={i}
                  elevation={1}
                  onClick={() => onNavigate("game", item.video_game)}
                  sx={{
                    p: 2, bgcolor: "#e8eaed", borderRadius: 3,
                    border: "1.5px solid #c5c9d0", cursor: "pointer",
                    "&:hover": { boxShadow: "0 4px 14px rgba(0,0,0,0.1)" },
                  }}
                >
                  {/* Imagen + título + rating */}
                  <Box sx={{ display: "flex", gap: 1.5, mb: 1 }}>
                    <Box
                      component="img"
                      src={item.video_game?.image_url}
                      alt={item.video_game?.title}
                      sx={{
                        width: 60, height: 60, objectFit: "cover",
                        borderRadius: 1.5, flexShrink: 0,
                      }}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 800, fontSize: "0.95rem",
                        letterSpacing: 1, color: "#1a2233",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {item.video_game?.title}
                      </Typography>

                      {item.rating && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mt: 0.4 }}>
                          <StarIcon sx={{ fontSize: "0.85rem", color: "#f59e0b" }} />
                          <Avatar sx={{
                            width: 24, height: 24, borderRadius: 1,
                            bgcolor: scoreColor(item.rating.score),
                            fontFamily: "'Barlow Condensed', sans-serif",
                            fontSize: "0.72rem", fontWeight: 800,
                          }}>
                            {item.rating.score}
                          </Avatar>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {/* Comentario */}
                  {item.review ? (
                    <Typography sx={{
                      fontSize: "0.82rem", color: "#555", lineHeight: 1.55,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}>
                      {item.review.comment}
                    </Typography>
                  ) : (
                    <Typography sx={{ fontSize: "0.8rem", color: "#aaa", fontStyle: "italic" }}>
                      Solo calificación, sin reseña escrita
                    </Typography>
                  )}
                </Paper>
              ))}
            </Box>
          )}

        </Container>
      </Box>
    </Box>
  );
}