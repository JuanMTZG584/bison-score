import { useState } from "react";
import {
  Alert, Box, Button, CircularProgress, Paper, TextField, Typography,
} from "@mui/material";
import Navbar from "./Navbar";
import { labelSx, bgSx } from "./theme";
import { signup as apiSignup } from "./api/users";
import { validateRegister } from "./utils/authValidations";

// ── helpers ──────────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function calcAge(birth_date) {
  const today = new Date();
  const dob   = new Date(birth_date);
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

function validate({ name, email, password, birth_date }) {
  const errors = {};

  if (!name.trim())
    errors.name = "El nombre es obligatorio.";

  if (!email.trim())
    errors.email = "El correo es obligatorio.";
  else if (!EMAIL_REGEX.test(email.trim()))
    errors.email = "Formato de correo no válido.";

  if (!password)
    errors.password = "La contraseña es obligatoria.";
  else if (password.length < 6)
    errors.password = "La contraseña debe tener al menos 6 caracteres.";

  if (!birth_date)
    errors.birth_date = "La fecha de nacimiento es obligatoria.";
  else if (calcAge(birth_date) < 13)
    errors.birth_date = "Debes tener al menos 13 años para registrarte.";

  return errors;
}

// ── component ─────────────────────────────────────────────────────────────────

export default function Register({ onNavigate, user, onLogout }) {
  const [form, setForm] = useState({
    name: "", password: "", email: "", birth_date: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading,     setLoading]     = useState(false);
  const [apiError,    setApiError]    = useState("");

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    // clear the error for this field as the user types
    if (fieldErrors[field])
      setFieldErrors((fe) => ({ ...fe, [field]: "" }));
  };

  const handleSubmit = async () => {
    setApiError("");
    const errors = validateRegister(form);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await apiSignup(form);
      alert("¡Cuenta creada exitosamente!");
      onNavigate("login");
    } catch (e) {
      setApiError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fe = fieldErrors; // shorthand

  return (
    <Box sx={{ minHeight: "100vh", position: "relative" }}>
      <Box sx={bgSx} />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Navbar onNavigate={onNavigate} user={user} onLogout={onLogout} />

        <Box sx={{
          minHeight: "calc(100vh - 64px)", display: "flex",
          alignItems: "center", justifyContent: "center", p: 3,
        }}>
          <Paper elevation={2} sx={{
            bgcolor: "background.paper", borderRadius: 3,
            border: "1.5px solid #b0b8c1", p: "36px 40px 30px",
            width: "100%", maxWidth: 500,
          }}>
            <Typography sx={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800, fontSize: "1.5rem", letterSpacing: 3,
              color: "#1a2233", textTransform: "uppercase", mb: 2,
            }}>
              Registro
            </Typography>

            {apiError && (
              <Alert severity="error" sx={{ mb: 2, py: 0 }}>{apiError}</Alert>
            )}

            {/* Nombre */}
            <Typography sx={labelSx}>USERNAME</Typography>
            <TextField
              value={form.name}
              onChange={set("name")}
              autoComplete="username"
              error={Boolean(fe.name)}
              helperText={fe.name || " "}
            />

            {/* Contraseña */}
            <Typography sx={{ ...labelSx, mt: 1 }}>CONTRASEÑA</Typography>
            <TextField
              type="password"
              value={form.password}
              onChange={set("password")}
              autoComplete="new-password"
              error={Boolean(fe.password)}
              helperText={fe.password || "Mínimo 6 caracteres"}
            />

            {/* Correo */}
            <Typography sx={{ ...labelSx, mt: 1, color: "#e53935" }}>CORREO</Typography>
            <TextField
              type="email"
              value={form.email}
              onChange={set("email")}
              autoComplete="email"
              error={Boolean(fe.email)}
              helperText={fe.email || " "}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: fe.email ? undefined : "#e57373",
                },
              }}
            />

            {/* Fecha de nacimiento */}
            <Typography sx={{ ...labelSx, mt: 1 }}>FECHA DE NACIMIENTO</Typography>
            <TextField
              type="date"
              value={form.birth_date}
              onChange={set("birth_date")}
              error={Boolean(fe.birth_date)}
              helperText={fe.birth_date || "Debes tener al menos 13 años"}
              InputLabelProps={{ shrink: true }}
            />

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button
                fullWidth variant="contained" color="secondary"
                disabled={loading}
                onClick={handleSubmit}
                sx={{ py: 1.2, color: "#fff" }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : "REGISTRAR"}
              </Button>
              <Button
                fullWidth variant="contained"
                onClick={() => onNavigate("home")}
                sx={{ py: 1.2, bgcolor: "#e53935", "&:hover": { bgcolor: "#c62828" } }}
              >
                CANCELAR
              </Button>
            </Box>

            <Typography align="center" sx={{ mt: 2.5, fontSize: "0.88rem", color: "#444" }}>
              ¿Ya tienes cuenta?{" "}
              <Box
                component="span"
                onClick={() => onNavigate("login")}
                sx={{ textDecoration: "underline", cursor: "pointer", fontWeight: 600, color: "#1a2233" }}
              >
                Inicia sesión
              </Box>
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}