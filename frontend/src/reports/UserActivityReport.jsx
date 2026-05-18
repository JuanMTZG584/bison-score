import { useState, useEffect, useCallback } from "react";
import {
  Box, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Chip, Alert, Typography, LinearProgress, Pagination,
} from "@mui/material";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { thSx, UserAvatar, SkeletonRow } from "./reportsHelpers.jsx";

export default function UserActivityReport() {
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
      const res = await fetch(`/api/reports/user-activity?page=${p}&limit=${LIMIT}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error al cargar los datos");
      const json = await res.json();
      setData(json.users || []);
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
  const maxActivity = data[0]?.total_activity || 1;

  return (
    <Box>
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "#f0f2f5" }}>
              <TableCell sx={thSx}>#</TableCell>
              <TableCell sx={thSx}>Usuario</TableCell>
              <TableCell sx={{ ...thSx, textAlign: "center" }}>Reseñas</TableCell>
              <TableCell sx={{ ...thSx, textAlign: "center" }}>Calificaciones</TableCell>
              <TableCell sx={{ ...thSx, minWidth: 140 }}>Actividad total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: LIMIT }).map((_, i) => <SkeletonRow key={i} cols={5} />)
              : data.map((item, idx) => {
                  const rank = (page - 1) * LIMIT + idx + 1;
                  return (
                    <TableRow key={item.user._id} hover sx={{ "&:last-child td": { border: 0 } }}>
                      <TableCell
                        sx={{
                          width: 40,
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontWeight: 700,
                          color: rank <= 3 ? "#e67e00" : "#888",
                          fontSize: "1rem",
                        }}
                      >
                        {rank}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <UserAvatar image_url={item.user.image_url} name={item.user.name} />
                          <Box>
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: "0.9rem",
                                color: "#1a2233",
                                lineHeight: 1.2,
                              }}
                            >
                              {item.user.name}
                            </Typography>
                            <Typography sx={{ fontSize: "0.75rem", color: "#888" }}>
                              {item.user.email}
                            </Typography>
                          </Box>
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
                            value={maxActivity > 0 ? (item.total_activity / maxActivity) * 100 : 0}
                            sx={{
                              flex: 1,
                              height: 6,
                              borderRadius: 3,
                              "& .MuiLinearProgress-bar": { bgcolor: "#2c3e50" },
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
                            {item.total_activity}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>

      {!loading && data.length === 0 && (
        <Typography sx={{ textAlign: "center", color: "#888", mt: 3, py: 4 }}>
          Aún no hay actividad registrada.
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
