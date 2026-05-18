import { useState, useEffect, useCallback } from "react";
import {
  Alert, Avatar, Box, Button, CircularProgress, Dialog,
  DialogContent, DialogTitle, IconButton, InputAdornment, MenuItem,
  Paper, Select, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Pagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import { getUsers, toggleUserStatus, updateUserByAdmin } from "../api/users";
import { validateUserUpdate } from "../utils/authValidations";

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

export default function UsersTab({ currentUserId }) {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isActive, setIsActive] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editError, setEditError] = useState("");
  const [editLoad, setEditLoad] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, limit: 10, search: search || undefined };
      if (isActive !== "") params.is_active = isActive;
      const data = await getUsers(params);
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, isActive]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggle = async (id) => {
    try {
      await toggleUserStatus(id);
      fetchUsers();
    } catch (e) {
      setError(e.message);
    }
  };

  const openEdit = (u) => {
    setEditUser(u);
    setEditForm({
      name: u.name || "",
      birth_date: u.birth_date ? u.birth_date.slice(0, 10) : "",
      password: "",
      role: u.role || "USER",
    });
    setEditError("");
  };

  const handleEditSave = async () => {
    setEditError("");

    const errors = validateUserUpdate({
      name: editForm.name,
      password: editForm.password,
      birth_date: editForm.birth_date,
    });

    if (Object.keys(errors).length > 0) {
      setEditError(Object.values(errors)[0]);
      return;
    }

    setEditLoad(true);

    try {
      const payload = {};
      if (editForm.name) payload.name = editForm.name;
      if (editForm.birth_date) payload.birth_date = editForm.birth_date;
      if (editForm.password) payload.password = editForm.password;
      if (editForm.role) payload.role = editForm.role;
      await updateUserByAdmin(editUser._id, payload);
      setEditUser(null);
      fetchUsers();
    } catch (e) {
      setEditError(e.message);
    } finally {
      setEditLoad(false);
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", gap: 1.5, mb: 2, flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          size="small"
          placeholder="Buscar nombre o correo"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (setPage(1), setSearch(searchInput))}
          sx={{ bgcolor: "white", borderRadius: 1, flex: 1, minWidth: 180 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => { setPage(1); setSearch(searchInput); }}>
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
                  {["USUARIO", "CORREO", "ROL", "ESTADO", "EDITAR", "TOGGLE"].map((h, i) => (
                    <TableCell key={i} sx={headSx}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3, color: "#888" }}>
                      No se encontraron usuarios
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((u, i) => (
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
                      <TableCell>
                        <StatusBadge active={u.is_active} />
                      </TableCell>
                      <TableCell>
                        <ActionBtn
                          color="#27ae60"
                          onClick={() => openEdit(u)}
                          disabled={u._id === currentUserId}
                        >
                          <EditIcon fontSize="small" />
                        </ActionBtn>
                      </TableCell>
                      <TableCell>
                        <ActionBtn
                          color={u.is_active ? "#e53935" : "#1565c0"}
                          onClick={() => handleToggle(u._id)}
                          disabled={u._id === currentUserId}
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
        open={Boolean(editUser)}
        onClose={() => setEditUser(null)}
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
          Editar Usuario
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "8px !important" }}>
          {editError && <Alert severity="error">{editError}</Alert>}
          <TextField
            label="Nombre"
            size="small"
            value={editForm.name || ""}
            onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
            sx={{ bgcolor: "white" }}
          />
          <TextField
            label="Fecha de nacimiento"
            type="date"
            size="small"
            value={editForm.birth_date || ""}
            onChange={(e) => setEditForm((f) => ({ ...f, birth_date: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            sx={{ bgcolor: "white" }}
          />
          <TextField
            label="Nueva contraseña"
            type="password"
            size="small"
            value={editForm.password || ""}
            onChange={(e) => setEditForm((f) => ({ ...f, password: e.target.value }))}
            placeholder="Dejar vacío para no cambiar"
            sx={{ bgcolor: "white" }}
          />
          <Select
            size="small"
            value={editForm.role || "USER"}
            onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}
            sx={{ bgcolor: "white" }}
          >
            <MenuItem value="USER">USER</MenuItem>
            <MenuItem value="ADMIN">ADMIN</MenuItem>
          </Select>
          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => setEditUser(null)}
              sx={{ bgcolor: "#e53935", "&:hover": { bgcolor: "#c62828" } }}
            >
              CANCELAR
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              disabled={editLoad}
              onClick={handleEditSave}
              sx={{ color: "#fff" }}
            >
              {editLoad ? <CircularProgress size={18} color="inherit" /> : "GUARDAR"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
