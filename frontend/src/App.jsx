import { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./theme";
import GameList   from "./GameList";
import GameDetail from "./GameDetail";
import Login      from "./Login";
import Register   from "./Register";
import MyAccount  from "./MyAccount";
import Reports    from "./Reports";
import Admin      from "./Admin";

export default function App() {
  const [screen,       setScreen]       = useState("home");
  const [selectedGame, setSelectedGame] = useState(null);
  const [user,         setUser]         = useState({ name: "Player843" }); // { name: "..." }

  const handleNavigate = (dest, data) => {
    if (dest === "game" && data) setSelectedGame(data);
    setScreen(dest);
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    setUser(null);
    setScreen("home");
  };

  const commonProps = { onNavigate: handleNavigate, user, onLogout: handleLogout };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {screen === "home"     && <GameList   {...commonProps} />}
      {screen === "game"     && <GameDetail {...commonProps} game={selectedGame} />}
      {screen === "login"    && <Login      {...commonProps} onLogin={setUser} />}
      {screen === "register" && <Register   {...commonProps} />}
      {screen === "account"  && <MyAccount  {...commonProps} />}
      {screen === "reports"  && <Reports    {...commonProps} />}
      {screen === "admin"    && <Admin      {...commonProps} />}
    </ThemeProvider>
  );
}