import { Box, Container, Paper, Typography } from "@mui/material";
import Navbar from "./Navbar";
import { REPORTS } from "./theme";

export default function Reports({ onNavigate, user, onLogout }) {
  return (
    <>
      <Navbar onNavigate={onNavigate} user={user} onLogout={onLogout} />
      <Container maxWidth="md" sx={{ pt: 4, pb: 6 }}>
        <Typography sx={{
          fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
          fontSize: "1.4rem", letterSpacing: 2, color: "#1a2233", mb: 3, textTransform: "uppercase",
        }}>
          Reportes
        </Typography>

        {REPORTS.map((r) => (
          <Paper key={r.id} elevation={1} sx={{
            display: "flex", gap: 2.5, p: 2, mb: 2.5,
            bgcolor: "white", borderRadius: 3, alignItems: "flex-start",
            "&:hover": { boxShadow: "0 4px 14px rgba(0,0,0,0.1)", cursor: "pointer" },
          }}>
            <Box
              component="img"
              src={r.image}
              alt={r.title}
              sx={{ width: 100, height: 80, objectFit: "cover", borderRadius: 2, flexShrink: 0 }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography sx={{
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
                fontSize: "1.05rem", letterSpacing: 1, color: "#1a2233", mb: 1,
              }}>
                {r.title}
              </Typography>
              <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2, bgcolor: "#f5f6f7" }}>
                <Typography sx={{ fontSize: "0.85rem", color: "#555", lineHeight: 1.6 }}>
                  {r.desc}
                </Typography>
              </Paper>
            </Box>
          </Paper>
        ))}
      </Container>
    </>
  );
}