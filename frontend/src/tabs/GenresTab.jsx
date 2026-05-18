import { useState, useEffect, useCallback } from "react";
import {
  Alert, Box, Button, CircularProgress, Dialog,
  DialogContent, DialogTitle, IconButton, InputAdornment, MenuItem,
  Paper, Select, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Pagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { getGenres, createGenre, updateGenre, toggleGenreStatus } from "../api/genres";
import { validateGenre } from "../utils/authValidations";

const headSx = {
  color: "#fff",
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 700, letterSpacing: 1, py: 1.5,
};

const ActionBtn = ({ color, onClick, children, disabled }) => (
  <IconButton
    size="small"
    disabled={disabled}
    onClick={onClick}
    sx={{
      bgcolor: color, color: "#fff", borderRadius: 1, p: 0.6,
      "&:hover": { bgcolor: color, filter: "brightness(0.85)" },
      "&.Mui-disabled": { bgcolor: "#ccc", color: "#999" },
    }}
  >
    {children}
  </IconButton>
);

const StatusBadge = ({ active }) => (
  <Box sx={{
    display: "inline-block", px: 1, py: 0.2, borderRadius: 1,
    bgcolor: active ? "#e8f5e9" : "#fce4ec",
    color: active ? "#2e7d32" : "#c62828",
    fontSize: "0.75rem", fontWeight: 700,
  }}>
    {active ? "Activo" : "Inactivo"}
  </Box>
);

export default function GenresTab() {
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isActive, setIsActive] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [formError, setFormError] = useState("");
  const [formLoad, setFormLoad] = useState(false);

  const fetchGenres = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, limit: 10, search: search || undefined };
      if (isActive !== "") params.is_active = isActive;
      const data = await getGenres(params);
      setGenres(data.genres);
      setTotalPages(data.totalPages);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, isActive]);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  const handleToggle = async (id) => {
    try {
      await toggleGenreStatus(id);
      fetchGenres();
    } catch (e) {
      setError(e.message);
    }
  };

  const openCreate = () => {
    setForm({ name: "", description: "" });
    setFormError("");
    setModal("create");
  };

  const openEdit = (g) => {
    setSelected(g);
    setForm({ name: g.name, description: g.description });
    setFormError("");
    setModal("edit");
  };

  const handleSave = async () => {
    setFormError("");

    const errors = validateGenre(form);

    if (Object.keys(errors).length > 0) {
      setFormError(Object.values(errors)[0]);
      return;
    }

    setFormLoad(true);
    try {
      if (modal === "create") await createGenre(form);
      else await updateGenre(selected._id, form);
      setModal(null);
      fetchGenres();
    } catch (e) {
      setFormError(e.message);
    } finally {
      setFormLoad(false);
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", gap: 1.5, mb: 2, flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          size="small"
          placeholder="Buscar género"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (setPage(1), setSearch(searchInput))}
          sx={{ bgcolor: "white", borderRadius: 1, flex: 1, minWidth: 180 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => { setPage(1); setSearch(searchInput); }}
                >
                  <SearchIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Select
          size="small"
          value={isActive}
          onChange={(e) => { setIsActive(e.target.value); setPage(1); }}
          displayEmpty
          sx={{ bgcolor: "white", borderRadius: 1, minWidth: 130 }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="true">Activos</MenuItem>
          <MenuItem value="false">Inactivos</MenuItem>
        </Select>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={openCreate}
          sx={{ color: "#fff", whiteSpace: "nowrap" }}
        >
          Nuevo
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#3a4a5a" }}>
                  {["NOMBRE", "DESCRIPCIÓN", "ESTADO", "EDITAR", "TOGGLE"].map((h, i) => (
                    <TableCell key={i} sx={headSx}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {genres.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3, color: "#888" }}>
                      No se encontraron géneros
                    </TableCell>
                  </TableRow>
                ) : (
                  genres.map((g, i) => (
                    <TableRow key={g._id} sx={{ bgcolor: i % 2 === 0 ? "white" : "#f5f6f7" }}>
                      <TableCell sx={{ fontWeight: 600 }}>{g.name}</TableCell>
                      <TableCell
                        sx={{
                          fontSize: "0.8rem",
                          color: "#555",
                          maxWidth: 220,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {g.description}
                      </TableCell>
                      <TableCell>
                        <StatusBadge active={g.is_active} />
                      </TableCell>
                      <TableCell>
                        <ActionBtn color="#27ae60" onClick={() => openEdit(g)}>
                          <EditIcon fontSize="small" />
                        </ActionBtn>
                      </TableCell>
                      <TableCell>
                        <ActionBtn
                          color={g.is_active ? "#e53935" : "#1565c0"}
                          onClick={() => handleToggle(g._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </ActionBtn>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
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

      <Dialog
        open={Boolean(modal)}
        onClose={() => setModal(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, bgcolor: "#d8dce2", border: "1.5px solid #b0b8c1" } }}
      >
        <DialogTitle
          sx={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            letterSpacing: 2,
            color: "#1a2233",
          }}
        >
          {modal === "create" ? "Nuevo Género" : "Editar Género"}
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "8px !important" }}>
          {formError && <Alert severity="error">{formError}</Alert>}
          <TextField
            label="Nombre"
            size="small"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            sx={{ bgcolor: "white" }}
          />
          <TextField
            label="Descripción"
            size="small"
            multiline
            rows={3}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            sx={{ bgcolor: "white" }}
          />
          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => setModal(null)}
              sx={{ bgcolor: "#e53935", "&:hover": { bgcolor: "#c62828" } }}
            >
              CANCELAR
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              disabled={formLoad}
              onClick={handleSave}
              sx={{ color: "#fff" }}
            >
              {formLoad ? <CircularProgress size={18} color="inherit" /> : "GUARDAR"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
