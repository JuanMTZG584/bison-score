import { useState, useEffect, useCallback } from "react";
import {
  Box, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Chip, Alert, Typography, Pagination, Skeleton,
} from "@mui/material";
import { thSx, ScoreBadge, GameAvatar, SkeletonRow } from "./reportsHelpers.jsx";

export default function TopRatedReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 10;

  const fetchData = useCallback(async (p) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/reports/top-rated-games?page=${p}&limit=${LIMIT}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error al cargar los datos");
      const json = await res.json();
      setData(json.games || []);
      setTotalPages(json.totalPages || 1);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(page);
  }, [fetchData, page]);

  if (error) return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;

  return (
    <Box>
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "#f0f2f5" }}>
              <TableCell sx={thSx}>#</TableCell>
              <TableCell sx={thSx}>Juego</TableCell>
              <TableCell sx={{ ...thSx, textAlign: "center" }}>Puntuación</TableCell>
              <TableCell sx={{ ...thSx, textAlign: "center" }}>Calificaciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: LIMIT }).map((_, i) => <SkeletonRow key={i} cols={4} />)
              : data.map((g, idx) => {
                  const rank = (page - 1) * LIMIT + idx + 1;
                  return (
                    <TableRow key={g._id} hover sx={{ "&:last-child td": { border: 0 } }}>
                      <TableCell
                        sx={{
                          width: 40,
                          color: rank <= 3 ? "#e67e00" : "#888",
                          fontWeight: rank <= 3 ? 800 : 400,
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontSize: "1rem",
                        }}
                      >
                        {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <GameAvatar image_url={g.image_url} title={g.title} />
                          <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: "#1a2233" }}>
                            {g.title}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <ScoreBadge score={g.rating_average} />
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Chip
                          label={g.rating_count}
                          size="small"
                          sx={{ fontWeight: 700, bgcolor: "#e8f5e9", color: "#1a7a3c" }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>

      {!loading && data.length === 0 && (
        <Typography sx={{ textAlign: "center", color: "#888", mt: 3, py: 4 }}>
          Aún no hay juegos calificados.
        </Typography>
      )}

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, v) => setPage(v)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
}
