import { useState, useEffect, useCallback } from "react";
import {
  Alert, Avatar, Box, Button, CircularProgress, Container, Dialog,
  DialogContent, DialogTitle, IconButton, InputAdornment, MenuItem,
  Paper, Select, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Typography, Pagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon   from "@mui/icons-material/Edit";
import AddIcon    from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Navbar from "./Navbar";
import { scoreColor } from "./theme";
import { getVideoGames, createVideoGame, updateVideoGame, toggleVideoGameStatus }
  from "./api/videogames";
import { getGenreOptions }    from "./api/genres";
import { getPlatformOptions } from "./api/platforms";
import { getUsers, toggleUserStatus, updateUserByAdmin } from "./api/users";
import { getGenres, createGenre, updateGenre, toggleGenreStatus } from "./api/genres";
import { getPlatforms, createPlatform, updatePlatform, togglePlatformStatus } from "./api/platforms";

/* ─── Constantes ─────────────────────────────────────────── */
const TABS = ["USUARIOS", "PLATAFORMAS", "VIDEOJUEGOS", "GÉNEROS"];

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
    color:   active ? "#2e7d32" : "#c62828",
    fontSize: "0.75rem", fontWeight: 700,
  }}>
    {active ? "Activo" : "Inactivo"}
  </Box>
);

/* ─── Tab Usuarios ───────────────────────────────────────── */
function UsersTab({ currentUserId }) {
  const [users,       setUsers]       = useState([]);
  const [page,        setPage]        = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const [search,      setSearch]      = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isActive,    setIsActive]    = useState("");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [editUser,    setEditUser]    = useState(null);
  const [editForm,    setEditForm]    = useState({});
  const [editError,   setEditError]   = useState("");
  const [editLoad,    setEditLoad]    = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const params = { page, limit: 10, search: search || undefined };
      if (isActive !== "") params.is_active = isActive;
      const data = await getUsers(params);
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [page, search, isActive]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleToggle = async (id) => {
    try { await toggleUserStatus(id); fetchUsers(); }
    catch (e) { setError(e.message); }
  };

  const openEdit = (u) => {
    setEditUser(u);
    setEditForm({
      name:       u.name || "",
      birth_date: u.birth_date ? u.birth_date.slice(0, 10) : "",
      password:   "",
      role:       u.role || "USER",
    });
    setEditError("");
  };

  const handleEditSave = async () => {
    setEditLoad(true); setEditError("");
    try {
      const payload = {};
      if (editForm.name)       payload.name       = editForm.name;
      if (editForm.birth_date) payload.birth_date = editForm.birth_date;
      if (editForm.password)   payload.password   = editForm.password;
      if (editForm.role)       payload.role       = editForm.role;
      await updateUserByAdmin(editUser._id, payload);
      setEditUser(null);
      fetchUsers();
    } catch (e) { setEditError(e.message); }
    finally { setEditLoad(false); }
  };

  return (
    <>
      <Box sx={{ display: "flex", gap: 1.5, mb: 2, flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          size="small" placeholder="Buscar nombre o correo"
          value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (setPage(1), setSearch(searchInput))}
          sx={{ bgcolor: "white", borderRadius: 1, flex: 1, minWidth: 180 }}
          InputProps={{ endAdornment: (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => { setPage(1); setSearch(searchInput); }}>
                <SearchIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          )}}
        />
        <Select size="small" value={isActive} onChange={(e) => { setIsActive(e.target.value); setPage(1); }}
          displayEmpty sx={{ bgcolor: "white", borderRadius: 1, minWidth: 130 }}>
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="true">Activos</MenuItem>
          <MenuItem value="false">Inactivos</MenuItem>
        </Select>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}><CircularProgress /></Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#3a4a5a" }}>
                  {["USUARIO", "CORREO", "ROL", "ESTADO", "EDITAR", "TOGGLE"].map((h, i) => (
                    <TableCell key={i} sx={headSx}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 3, color: "#888" }}>No se encontraron usuarios</TableCell></TableRow>
                ) : users.map((u, i) => (
                  <TableRow key={u._id} sx={{ bgcolor: i % 2 === 0 ? "white" : "#f5f6f7" }}>
                    <TableCell sx={{ fontWeight: 600 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar src={u.image_url} sx={{ width: 28, height: 28, fontSize: "0.8rem" }}>
                          {u.name?.[0]?.toUpperCase()}
                        </Avatar>
                        {u.name}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.8rem" }}>{u.email}</TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell><StatusBadge active={u.is_active} /></TableCell>
                    <TableCell>
                      <ActionBtn color="#27ae60" onClick={() => openEdit(u)} disabled={u._id === currentUserId}>
                        <EditIcon fontSize="small" />
                      </ActionBtn>
                    </TableCell>
                    <TableCell>
                      <ActionBtn color={u.is_active ? "#e53935" : "#1565c0"} onClick={() => handleToggle(u._id)} disabled={u._id === currentUserId}>
                        <DeleteIcon fontSize="small" />
                      </ActionBtn>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" />
            </Box>
          )}
        </>
      )}

      <Dialog open={Boolean(editUser)} onClose={() => setEditUser(null)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 3, bgcolor: "#d8dce2", border: "1.5px solid #b0b8c1" } }}>
        <DialogTitle sx={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, letterSpacing: 2, color: "#1a2233" }}>
          Editar Usuario
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "8px !important" }}>
          {editError && <Alert severity="error">{editError}</Alert>}
          <TextField label="Nombre" size="small" value={editForm.name || ""} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} sx={{ bgcolor: "white" }} />
          <TextField label="Fecha de nacimiento" type="date" size="small" value={editForm.birth_date || ""} onChange={(e) => setEditForm((f) => ({ ...f, birth_date: e.target.value }))} InputLabelProps={{ shrink: true }} sx={{ bgcolor: "white" }} />
          <TextField label="Nueva contraseña" type="password" size="small" value={editForm.password || ""} onChange={(e) => setEditForm((f) => ({ ...f, password: e.target.value }))} placeholder="Dejar vacío para no cambiar" sx={{ bgcolor: "white" }} />
          <Select size="small" value={editForm.role || "USER"} onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))} sx={{ bgcolor: "white" }}>
            <MenuItem value="USER">USER</MenuItem>
            <MenuItem value="ADMIN">ADMIN</MenuItem>
          </Select>
          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            <Button fullWidth variant="contained" onClick={() => setEditUser(null)} sx={{ bgcolor: "#e53935", "&:hover": { bgcolor: "#c62828" } }}>CANCELAR</Button>
            <Button fullWidth variant="contained" color="secondary" disabled={editLoad} onClick={handleEditSave} sx={{ color: "#fff" }}>
              {editLoad ? <CircularProgress size={18} color="inherit" /> : "GUARDAR"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ─── Tab Géneros ────────────────────────────────────────── */
function GenresTab() {
  const [genres,      setGenres]      = useState([]);
  const [page,        setPage]        = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const [search,      setSearch]      = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isActive,    setIsActive]    = useState("");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [modal,       setModal]       = useState(null);
  const [selected,    setSelected]    = useState(null);
  const [form,        setForm]        = useState({ name: "", description: "" });
  const [formError,   setFormError]   = useState("");
  const [formLoad,    setFormLoad]    = useState(false);

  const fetchGenres = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const params = { page, limit: 10, search: search || undefined };
      if (isActive !== "") params.is_active = isActive;
      const data = await getGenres(params);
      setGenres(data.genres);
      setTotalPages(data.totalPages);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [page, search, isActive]);

  useEffect(() => { fetchGenres(); }, [fetchGenres]);

  const handleToggle = async (id) => {
    try { await toggleGenreStatus(id); fetchGenres(); }
    catch (e) { setError(e.message); }
  };

  const openCreate = () => { setForm({ name: "", description: "" }); setFormError(""); setModal("create"); };
  const openEdit   = (g) => { setSelected(g); setForm({ name: g.name, description: g.description }); setFormError(""); setModal("edit"); };

  const handleSave = async () => {
    setFormLoad(true); setFormError("");
    try {
      if (modal === "create") await createGenre(form);
      else await updateGenre(selected._id, form);
      setModal(null);
      fetchGenres();
    } catch (e) { setFormError(e.message); }
    finally { setFormLoad(false); }
  };

  return (
    <>
      <Box sx={{ display: "flex", gap: 1.5, mb: 2, flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          size="small" placeholder="Buscar género"
          value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (setPage(1), setSearch(searchInput))}
          sx={{ bgcolor: "white", borderRadius: 1, flex: 1, minWidth: 180 }}
          InputProps={{ endAdornment: (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => { setPage(1); setSearch(searchInput); }}>
                <SearchIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          )}}
        />
        <Select size="small" value={isActive} onChange={(e) => { setIsActive(e.target.value); setPage(1); }}
          displayEmpty sx={{ bgcolor: "white", borderRadius: 1, minWidth: 130 }}>
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="true">Activos</MenuItem>
          <MenuItem value="false">Inactivos</MenuItem>
        </Select>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={openCreate} sx={{ color: "#fff", whiteSpace: "nowrap" }}>
          Nuevo
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}><CircularProgress /></Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#3a4a5a" }}>
                  {["NOMBRE", "DESCRIPCIÓN", "ESTADO", "EDITAR", "TOGGLE"].map((h, i) => (
                    <TableCell key={i} sx={headSx}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {genres.length === 0 ? (
                  <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3, color: "#888" }}>No se encontraron géneros</TableCell></TableRow>
                ) : genres.map((g, i) => (
                  <TableRow key={g._id} sx={{ bgcolor: i % 2 === 0 ? "white" : "#f5f6f7" }}>
                    <TableCell sx={{ fontWeight: 600 }}>{g.name}</TableCell>
                    <TableCell sx={{ fontSize: "0.8rem", color: "#555", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {g.description}
                    </TableCell>
                    <TableCell><StatusBadge active={g.is_active} /></TableCell>
                    <TableCell><ActionBtn color="#27ae60" onClick={() => openEdit(g)}><EditIcon fontSize="small" /></ActionBtn></TableCell>
                    <TableCell><ActionBtn color={g.is_active ? "#e53935" : "#1565c0"} onClick={() => handleToggle(g._id)}><DeleteIcon fontSize="small" /></ActionBtn></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" />
            </Box>
          )}
        </>
      )}

      <Dialog open={Boolean(modal)} onClose={() => setModal(null)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 3, bgcolor: "#d8dce2", border: "1.5px solid #b0b8c1" } }}>
        <DialogTitle sx={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, letterSpacing: 2, color: "#1a2233" }}>
          {modal === "create" ? "Nuevo Género" : "Editar Género"}
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "8px !important" }}>
          {formError && <Alert severity="error">{formError}</Alert>}
          <TextField label="Nombre" size="small" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} sx={{ bgcolor: "white" }} />
          <TextField label="Descripción" size="small" multiline rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} sx={{ bgcolor: "white" }} />
          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            <Button fullWidth variant="contained" onClick={() => setModal(null)} sx={{ bgcolor: "#e53935", "&:hover": { bgcolor: "#c62828" } }}>CANCELAR</Button>
            <Button fullWidth variant="contained" color="secondary" disabled={formLoad} onClick={handleSave} sx={{ color: "#fff" }}>
              {formLoad ? <CircularProgress size={18} color="inherit" /> : "GUARDAR"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ─── Tab Plataformas ────────────────────────────────────── */
function PlatformsTab() {
  const [platforms,   setPlatforms]   = useState([]);
  const [page,        setPage]        = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const [search,      setSearch]      = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isActive,    setIsActive]    = useState("");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [modal,       setModal]       = useState(null);
  const [selected,    setSelected]    = useState(null);
  const [form,        setForm]        = useState({ name: "", manufacturer: "", release_date: "" });
  const [formError,   setFormError]   = useState("");
  const [formLoad,    setFormLoad]    = useState(false);

  const fetchPlatforms = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const params = { page, limit: 10, search: search || undefined };
      if (isActive !== "") params.is_active = isActive;
      const data = await getPlatforms(params);
      setPlatforms(data.platforms);
      setTotalPages(data.totalPages);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [page, search, isActive]);

  useEffect(() => { fetchPlatforms(); }, [fetchPlatforms]);

  const handleToggle = async (id) => {
    try { await togglePlatformStatus(id); fetchPlatforms(); }
    catch (e) { setError(e.message); }
  };

  const openCreate = () => { setForm({ name: "", manufacturer: "", release_date: "" }); setFormError(""); setModal("create"); };
  const openEdit   = (p) => {
    setSelected(p);
    setForm({ name: p.name || "", manufacturer: p.manufacturer || "", release_date: p.release_date ? p.release_date.slice(0, 10) : "" });
    setFormError(""); setModal("edit");
  };

  const handleSave = async () => {
    setFormLoad(true); setFormError("");
    try {
      if (modal === "create") await createPlatform(form);
      else await updatePlatform(selected._id, form);
      setModal(null);
      fetchPlatforms();
    } catch (e) { setFormError(e.message); }
    finally { setFormLoad(false); }
  };

  return (
    <>
      <Box sx={{ display: "flex", gap: 1.5, mb: 2, flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          size="small" placeholder="Buscar plataforma"
          value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (setPage(1), setSearch(searchInput))}
          sx={{ bgcolor: "white", borderRadius: 1, flex: 1, minWidth: 180 }}
          InputProps={{ endAdornment: (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => { setPage(1); setSearch(searchInput); }}>
                <SearchIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          )}}
        />
        <Select size="small" value={isActive} onChange={(e) => { setIsActive(e.target.value); setPage(1); }}
          displayEmpty sx={{ bgcolor: "white", borderRadius: 1, minWidth: 130 }}>
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="true">Activos</MenuItem>
          <MenuItem value="false">Inactivos</MenuItem>
        </Select>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={openCreate} sx={{ color: "#fff", whiteSpace: "nowrap" }}>
          Nueva
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}><CircularProgress /></Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#3a4a5a" }}>
                  {["NOMBRE", "FABRICANTE", "LANZAMIENTO", "ESTADO", "EDITAR", "TOGGLE"].map((h, i) => (
                    <TableCell key={i} sx={headSx}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {platforms.length === 0 ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 3, color: "#888" }}>No se encontraron plataformas</TableCell></TableRow>
                ) : platforms.map((p, i) => (
                  <TableRow key={p._id} sx={{ bgcolor: i % 2 === 0 ? "white" : "#f5f6f7" }}>
                    <TableCell sx={{ fontWeight: 600 }}>{p.name}</TableCell>
                    <TableCell>{p.manufacturer}</TableCell>
                    <TableCell sx={{ fontSize: "0.8rem" }}>
                      {p.release_date ? new Date(p.release_date).toLocaleDateString("es-MX") : "—"}
                    </TableCell>
                    <TableCell><StatusBadge active={p.is_active} /></TableCell>
                    <TableCell><ActionBtn color="#27ae60" onClick={() => openEdit(p)}><EditIcon fontSize="small" /></ActionBtn></TableCell>
                    <TableCell><ActionBtn color={p.is_active ? "#e53935" : "#1565c0"} onClick={() => handleToggle(p._id)}><DeleteIcon fontSize="small" /></ActionBtn></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" />
            </Box>
          )}
        </>
      )}

      <Dialog open={Boolean(modal)} onClose={() => setModal(null)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 3, bgcolor: "#d8dce2", border: "1.5px solid #b0b8c1" } }}>
        <DialogTitle sx={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, letterSpacing: 2, color: "#1a2233" }}>
          {modal === "create" ? "Nueva Plataforma" : "Editar Plataforma"}
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "8px !important" }}>
          {formError && <Alert severity="error">{formError}</Alert>}
          <TextField label="Nombre" size="small" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} sx={{ bgcolor: "white" }} />
          <TextField label="Fabricante" size="small" value={form.manufacturer} onChange={(e) => setForm((f) => ({ ...f, manufacturer: e.target.value }))} sx={{ bgcolor: "white" }} />
          <TextField label="Fecha de lanzamiento" type="date" size="small" value={form.release_date} onChange={(e) => setForm((f) => ({ ...f, release_date: e.target.value }))} InputLabelProps={{ shrink: true }} sx={{ bgcolor: "white" }} />
          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            <Button fullWidth variant="contained" onClick={() => setModal(null)} sx={{ bgcolor: "#e53935", "&:hover": { bgcolor: "#c62828" } }}>CANCELAR</Button>
            <Button fullWidth variant="contained" color="secondary" disabled={formLoad} onClick={handleSave} sx={{ color: "#fff" }}>
              {formLoad ? <CircularProgress size={18} color="inherit" /> : "GUARDAR"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}



/* ─── Tab Videojuegos ────────────────────────────────────────────────────────*/
function VideoGamesTab() {
  const [games,          setGames]          = useState([]);
  const [page,           setPage]           = useState(1);
  const [totalPages,     setTotalPages]     = useState(1);
  const [search,         setSearch]         = useState("");
  const [searchInput,    setSearchInput]    = useState("");
  const [isActive,       setIsActive]       = useState("");
  const [platformFilter, setPlatformFilter] = useState("");
  const [genreFilter,    setGenreFilter]    = useState("");
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState("");

  const [genreOptions,    setGenreOptions]    = useState([]);
  const [platformOptions, setPlatformOptions] = useState([]);

  const [modal,     setModal]     = useState(null); // "create" | "edit"
  const [selected,  setSelected]  = useState(null);
  const [form,      setForm]      = useState(emptyForm());
  const [formError, setFormError] = useState("");
  const [formLoad,  setFormLoad]  = useState(false);

  function emptyForm() {
    return {
      title:        "",
      description:  "",
      developer:    "",
      release_date: "",
      platform_id:  "",
      genre_id:     "",
      image_url:    "",
    };
  }

  // Carga los combos de géneros y plataformas activos al montar
  useEffect(() => {
    async function loadOptions() {
      try {
        const [gData, pData] = await Promise.all([
          getGenreOptions(),
          getPlatformOptions(),
        ]);
        setGenreOptions(gData.genres       || []);
        setPlatformOptions(pData.platforms || []);
      } catch {
        // silencioso; no bloquea la tabla
      }
    }
    loadOptions();
  }, []);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, limit: 10, search: search || undefined };
      if (isActive       !== "") params.is_active   = isActive;
      if (platformFilter !== "") params.platform_id = platformFilter;
      if (genreFilter    !== "") params.genre_id    = genreFilter;
      const data = await getVideoGames(params);
      setGames(data.videoGames);
      setTotalPages(data.totalPages);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, isActive, platformFilter, genreFilter]);

  useEffect(() => { fetchGames(); }, [fetchGames]);

  const handleToggle = async (id) => {
    try {
      await toggleVideoGameStatus(id);
      fetchGames();
    } catch (e) {
      setError(e.message);
    }
  };

  const openCreate = () => {
    setForm(emptyForm());
    setFormError("");
    setModal("create");
  };

  const openEdit = (g) => {
    setSelected(g);
    setForm({
      title:        g.title        || "",
      description:  g.description  || "",
      developer:    g.developer    || "",
      release_date: g.release_date ? g.release_date.slice(0, 10) : "",
      platform_id:  g.platform_id?._id || g.platform_id || "",
      genre_id:     g.genre_id?._id    || g.genre_id    || "",
      image_url:    g.image_url    || "",
    });
    setFormError("");
    setModal("edit");
  };

  const handleSave = async () => {
    setFormLoad(true);
    setFormError("");
    try {
      if (modal === "create") await createVideoGame(form);
      else await updateVideoGame(selected._id, form);
      setModal(null);
      fetchGames();
    } catch (e) {
      setFormError(e.message);
    } finally {
      setFormLoad(false);
    }
  };

  const f = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <>
      {/* ── Barra de filtros ────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", gap: 1.5, mb: 2, flexWrap: "wrap", alignItems: "center" }}>

        <TextField
          size="small"
          placeholder="Buscar videojuego"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { setPage(1); setSearch(searchInput); }
          }}
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
          sx={{ bgcolor: "white", borderRadius: 1, minWidth: 120 }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="true">Activos</MenuItem>
          <MenuItem value="false">Inactivos</MenuItem>
        </Select>

        <Select
          size="small"
          value={platformFilter}
          onChange={(e) => { setPlatformFilter(e.target.value); setPage(1); }}
          displayEmpty
          sx={{ bgcolor: "white", borderRadius: 1, minWidth: 140 }}
        >
          <MenuItem value="">Plataforma</MenuItem>
          {platformOptions.map((p) => (
            <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>
          ))}
        </Select>

        <Select
          size="small"
          value={genreFilter}
          onChange={(e) => { setGenreFilter(e.target.value); setPage(1); }}
          displayEmpty
          sx={{ bgcolor: "white", borderRadius: 1, minWidth: 130 }}
        >
          <MenuItem value="">Género</MenuItem>
          {genreOptions.map((g) => (
            <MenuItem key={g._id} value={g._id}>{g.name}</MenuItem>
          ))}
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

      {/* ── Tabla ───────────────────────────────────────────────────────── */}
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
                  {["TÍTULO", "PLATAFORMA", "GÉNERO", "DESARROLLADOR", "ESTADO", "EDITAR", "TOGGLE"].map(
                    (h, i) => <TableCell key={i} sx={headSx}>{h}</TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {games.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3, color: "#888" }}>
                      No se encontraron videojuegos
                    </TableCell>
                  </TableRow>
                ) : (
                  games.map((g, i) => (
                    <TableRow key={g._id} sx={{ bgcolor: i % 2 === 0 ? "white" : "#f5f6f7" }}>
                      <TableCell sx={{
                        fontWeight: 600, maxWidth: 160,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {g.title}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.8rem" }}>
                        {g.platform_id?.name || "—"}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.8rem" }}>
                        {g.genre_id?.name || "—"}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.8rem" }}>
                        {g.developer}
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

      {/* ── Modal Crear / Editar ─────────────────────────────────────────── */}
      <Dialog
        open={Boolean(modal)}
        onClose={() => setModal(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, bgcolor: "#d8dce2", border: "1.5px solid #b0b8c1" } }}
      >
        <DialogTitle sx={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 800, letterSpacing: 2, color: "#1a2233",
        }}>
          {modal === "create" ? "Nuevo Videojuego" : "Editar Videojuego"}
        </DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "8px !important" }}>
          {formError && <Alert severity="error">{formError}</Alert>}

          <TextField
            label="Título" size="small"
            value={form.title} onChange={f("title")}
            sx={{ bgcolor: "white" }}
          />
          <TextField
            label="Descripción" size="small" multiline rows={3}
            value={form.description} onChange={f("description")}
            sx={{ bgcolor: "white" }}
          />
          <TextField
            label="Desarrollador" size="small"
            value={form.developer} onChange={f("developer")}
            sx={{ bgcolor: "white" }}
          />
          <TextField
            label="Fecha de lanzamiento" type="date" size="small"
            value={form.release_date} onChange={f("release_date")}
            InputLabelProps={{ shrink: true }}
            sx={{ bgcolor: "white" }}
          />

          <Select
            size="small" value={form.platform_id} onChange={f("platform_id")}
            displayEmpty sx={{ bgcolor: "white" }}
          >
            <MenuItem value="" disabled>Selecciona plataforma</MenuItem>
            {platformOptions.map((p) => (
              <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>
            ))}
          </Select>

          <Select
            size="small" value={form.genre_id} onChange={f("genre_id")}
            displayEmpty sx={{ bgcolor: "white" }}
          >
            <MenuItem value="" disabled>Selecciona género</MenuItem>
            {genreOptions.map((g) => (
              <MenuItem key={g._id} value={g._id}>{g.name}</MenuItem>
            ))}
          </Select>

          <TextField
            label="URL de imagen (opcional)" size="small"
            value={form.image_url} onChange={f("image_url")}
            sx={{ bgcolor: "white" }}
          />

          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            <Button
              fullWidth variant="contained"
              onClick={() => setModal(null)}
              sx={{ bgcolor: "#e53935", "&:hover": { bgcolor: "#c62828" } }}
            >
              CANCELAR
            </Button>
            <Button
              fullWidth variant="contained" color="secondary"
              disabled={formLoad} onClick={handleSave}
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



/* ─── Componente principal Admin ─────────────────────────── */
export default function Admin({ onNavigate, user, onLogout }) {
  const [tab, setTab] = useState(0);

  return (
    <>
      <Navbar onNavigate={onNavigate} user={user} onLogout={onLogout} />
      <Container maxWidth="md" sx={{ pt: 4, pb: 6 }}>
        <Paper elevation={2} sx={{ bgcolor: "#d8dce2", borderRadius: 3, border: "1.5px solid #b0b8c1", p: 3 }}>
          <Typography sx={{
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
            fontSize: "1.4rem", letterSpacing: 3, color: "#1a2233",
            textAlign: "center", mb: 3, textTransform: "uppercase",
          }}>
            Página de Administrador
          </Typography>

          <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center", mb: 3, flexWrap: "wrap" }}>
            {TABS.map((t, i) => (
              <Button key={t} variant="contained" onClick={() => setTab(i)}
                sx={{
                  bgcolor: tab === i ? "#3a4a5a" : "#555",
                  "&:hover": { bgcolor: "#3a4a5a" },
                  fontSize: "0.85rem", py: 0.8, px: 2,
                }}>
                {t}
              </Button>
            ))}
          </Box>

          {tab === 0 && <UsersTab currentUserId={user?._id} />}
          {tab === 1 && <PlatformsTab />}
          {tab === 2 && <VideoGamesTab />}
          {tab === 3 && <GenresTab />}
        </Paper>
      </Container>
    </>
  );
}