import { useState } from "react";
import {
  AppBar, Toolbar, Typography, InputBase, IconButton,
  Box, Menu, MenuItem, ListItemIcon, Divider, Tooltip, alpha,
} from "@mui/material";
import SearchIcon        from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LoginIcon         from "@mui/icons-material/Login";
import PersonAddIcon     from "@mui/icons-material/PersonAdd";
import PersonIcon        from "@mui/icons-material/Person";
import LogoutIcon        from "@mui/icons-material/Logout";
import AssessmentIcon    from "@mui/icons-material/Assessment";
import BuildIcon         from "@mui/icons-material/Build";

export default function Navbar({ searchValue, onSearchChange, onNavigate, user, onLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <AppBar position="sticky" color="primary" elevation={3}>
      <Toolbar sx={{ gap: 1 }}>
        <Typography
          variant="h6"
          onClick={() => onNavigate("home")}
          sx={{ display: "flex", alignItems: "center", gap: 0.8, cursor: "pointer", userSelect: "none" }}
        >
          🦬 BisonScore
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {/* Búsqueda */}
        <Box sx={{
          display: "flex", alignItems: "center",
          bgcolor: alpha("#fff", 0.15), borderRadius: 1.5, px: 1.5,
          "&:hover": { bgcolor: alpha("#fff", 0.22) },
        }}>
          <InputBase
            placeholder="Buscar juego"
            value={searchValue ?? ""}
            onChange={onSearchChange}
            disabled={!onSearchChange}
            sx={{
              color: "white", width: 190, opacity: onSearchChange ? 1 : 0.6,
              "& input::placeholder": { color: alpha("#fff", 0.7) },
            }}
          />
        </Box>
        <IconButton sx={{ bgcolor: "secondary.main", "&:hover": { bgcolor: "#219150" }, borderRadius: 1.5 }}>
          <SearchIcon sx={{ color: "#fff" }} />
        </IconButton>

        {/* Dropdown de cuenta */}
        <Tooltip title="Cuenta">
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ color: "white" }}>
            <AccountCircleIcon />
            <ArrowDropDownIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{ sx: { mt: 1, minWidth: 180 } }}
        >
          {!user ? [
            <MenuItem key="login" onClick={() => { setAnchorEl(null); onNavigate("login"); }}>
              <ListItemIcon><LoginIcon fontSize="small" /></ListItemIcon>
              Iniciar sesión
            </MenuItem>,
            <MenuItem key="register" onClick={() => { setAnchorEl(null); onNavigate("register"); }}>
              <ListItemIcon><PersonAddIcon fontSize="small" /></ListItemIcon>
              Registrarse
            </MenuItem>,
          ] : [
            <MenuItem key="account" onClick={() => { setAnchorEl(null); onNavigate("account"); }}>
              <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
              Mi Cuenta
            </MenuItem>,
            <Divider key="div" />,
            <MenuItem key="logout" onClick={() => { setAnchorEl(null); onLogout(); }} sx={{ color: "error.main" }}>
              <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
              Cerrar Sesión
            </MenuItem>,
          ]}
        </Menu>

        {/* Reportes */}
        <Tooltip title="Reportes">
          <IconButton onClick={() => onNavigate("reports")} sx={{ color: "white" }}>
            <AssessmentIcon />
          </IconButton>
        </Tooltip>

        {/* Admin */}
        <Tooltip title="Administrador">
          <IconButton onClick={() => onNavigate("admin")} sx={{ color: "white" }}>
            <BuildIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}