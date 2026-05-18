import { useState, useEffect } from "react";
import {
  Box, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Chip, Alert, Typography, LinearProgress,
} from "@mui/material";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { thSx, GameAvatar, SkeletonRow } from "./reportsHelpers.jsx";

export default function MostReviewedReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/reports/most-reviewed-games", { credentials: "include" });
        if (!res.ok) throw new Error("Error al cargar los datos");
        const json = await res.json();
        setData(json.games || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (error) return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  const maxInteractions = data[0]?.total_interactions || 1;

  return (
    <Box>
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "#f0f2f5" }}>
              <TableCell sx={thSx}>#</TableCell>
              <TableCell sx={thSx}>Juego</TableCell>
              <TableCell sx={{ ...thSx, textAlign: "center" }}>Reseñas</TableCell>
              <TableCell sx={{ ...thSx, textAlign: "center" }}>Calificaciones</TableCell>
              <TableCell sx={{ ...thSx, minWidth: 140 }}>Actividad</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} cols={5} />)
              : data.map((item, idx) => (
                  <TableRow key={item.game._id} hover sx={{ "&:last-child td": { border: 0 } }}>
                    <TableCell
                      sx={{
                        width: 40,
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 700,
                        color: "#888",
                        fontSize: "1rem",
                      }}
                    >
                      {idx + 1}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <GameAvatar image_url={item.game.image_url} title={item.game.title} />
                        <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: "#1a2233" }}>
                          {item.game.title}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Chip
                        icon={<RateReviewIcon sx={{ fontSize: "0.8rem !important" }} />}
                        label={item.total_reviews}
                        size="small"
                        sx={{ fontWeight: 700, bgcolor: "#e3f2fd", color: "#1565c0" }}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Chip
                        label={item.total_ratings}
                        size="small"
                        sx={{ fontWeight: 700, bgcolor: "#f3e5f5", color: "#6a1b9a" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={(item.total_interactions / maxInteractions) * 100}
                          sx={{
                            flex: 1,
                            height: 6,
                            borderRadius: 3,
                            "& .MuiLinearProgress-bar": { bgcolor: "#27ae60" },
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            color: "#555",
                            minWidth: 24,
                            textAlign: "right",
                          }}
                        >
                          {item.total_interactions}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      {!loading && data.length === 0 && (
        <Typography sx={{ textAlign: "center", color: "#888", mt: 3, py: 4 }}>
          Aún no hay reseñas registradas.
        </Typography>
      )}
    </Box>
  );
}
