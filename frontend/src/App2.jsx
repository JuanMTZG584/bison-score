import { useState } from "react";
import GameList from "./gamelist";
import Login from "./Login";
import Register from "./Register";

export default function App() {
  const [screen, setScreen] = useState("home");

  return (
    <>
      {screen === "home"     && <GameList  onLogin={() => setScreen("login")} onRegister={() => setScreen("register")} />}
      {screen === "login"    && <Login     onCancel={() => setScreen("home")} onGoRegister={() => setScreen("register")} />}
      {screen === "register" && <Register  onCancel={() => setScreen("home")} onGoLogin={() => setScreen("login")} />}
    </>
  );
}