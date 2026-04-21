import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary:    { main: "#2c3e50" },
    secondary:  { main: "#27ae60" },
    background: { default: "#f0f2f5", paper: "#d8dce2" },
    error:      { main: "#e53935" },
  },
  typography: {
    fontFamily: "'Barlow', 'Segoe UI', sans-serif",
    h6: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: 1 },
  },
  components: {
    MuiTextField: {
      defaultProps: { size: "small", fullWidth: true },
      styleOverrides: {
        root: { "& .MuiOutlinedInput-root": { background: "#fff", borderRadius: 5 } },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 800, fontSize: "1rem",
          letterSpacing: 1.5, borderRadius: 6, textTransform: "none",
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 20, fontSize: "0.78rem" } },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", transition: "box-shadow 0.2s" },
      },
    },
  },
});

export function scoreColor(s) {
  if (s >= 90) return "#1a7a3c";
  if (s >= 80) return "#2a6e1f";
  return "#e67e00";
}

export const labelSx = {
  fontSize: "0.75rem", fontWeight: 700,
  letterSpacing: 1.5, color: "#1a2233", mb: 0.5,
};

export const GAMES = [
  {
    id: 1, title: "Uncharted 4", platform: "Playstation 5", genre: "Acción", score: 90,
    image: "https://pics.filmaffinity.com/uncharted_4_a_thief_s_end-134903281-mmed.jpg",
    description: "Una aventura de acción épica que sigue a Nathan Drake en su última misión.",
    reviews: [
      { user: "PLAYER843", score: 9, text: "Una obra maestra de la narrativa en videojuegos. Gráficos impresionantes y jugabilidad fluida." },
      { user: "GAMER_X",   score: 8, text: "Excelente juego. La historia te atrapa desde el principio hasta el final." },
    ],
  },
  {
    id: 2, title: "Microsoft Flight Simulator", platform: "Xbox", genre: "Simulador", score: 80,
    image: "https://m.media-amazon.com/images/M/MV5BMzlhNTVhZjYtZWFmYy00YjhiLWFiOWYtMDM1NGZkNDRlY2Q3XkEyXkFqcGc@._V1_.jpg",
    description: "El simulador de vuelo más realista del mercado con gráficos fotorrealistas.",
    reviews: [
      { user: "PILOT99", score: 8, text: "Increíblemente realista. La mejor experiencia de simulación disponible." },
    ],
  },
  {
    id: 3, title: "Mario Kart 8", platform: "Nintendo Switch", genre: "Carreras", score: 85,
    image: "https://m.media-amazon.com/images/M/MV5BOWVlNTVjNmQtM2ExNS00YjM5LTg1NjMtYmU3NGI4MmNkMWJiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    description: "Mario Kart 8 Deluxe es un videojuego de carreras desarrollado y publicado por Nintendo para la consola Nintendo Switch.",
    reviews: [
      { user: "PLAYER843", score: 7, text: "Mariokart 8 deluxe is a great game with stunning courses. It has endless replayability with the items, old and new, and different paths on tracks, making it a unique experience every time. The dlc adding an extra 48 tracks, making the total 96 tracks, this is a mariokart record amount of tracks..." },
      { user: "PLAYER503", score: 9, text: "Broad selection of tracks. Very polished gameplay but the online gets repetitive after a while." },
    ],
  },
];

export const PLATFORMS = ["Todas", "Playstation 5", "Xbox", "Nintendo Switch"];
export const GENRES    = ["Todos", "Acción", "Simulador", "Carreras"];

export const MOCK_USERS = [
  { id: 1, username: "Player843", email: "Player843@gmail.com", birth_date: "12/03/1993", password: "player843" },
  { id: 2, username: "Player422", email: "Player422@gmail.com", birth_date: "21/02/2000", password: "player422" },
  { id: 3, username: "Player123", email: "Player123@gmail.com", birth_date: "15/07/2003", password: "player123" },
];

export const REPORTS = [
  {
    id: 1, title: "TOP 10 MEJORES VIDEOJUEGOS CALIFICADOS",
    desc: "Aquí están los juegos lanzados durante 2025 que ganaron importantes premios de la industria o recibieron nominaciones.",
    image: "https://upload.wikimedia.org/wikipedia/en/6/6e/Mario_Kart_8_Deluxe_box_art.jpg",
  },
  {
    id: 2, title: "VIDEOJUEGOS CON MAYOR NUMERO DE RESEÑAS",
    desc: "Aquí están los juegos lanzados durante 2025 con mayor número de reseñas. Actualizaremos cada mes.",
    image: "https://upload.wikimedia.org/wikipedia/en/9/9b/Microsoft_Flight_Simulator_2020_cover.jpg",
  },
  {
    id: 3, title: "ACTIVIDAD DE USUARIOS",
    desc: "Actividad semanal de usuarios. Interacciones, reseñas, calificaciones y más.",
    image: "https://upload.wikimedia.org/wikipedia/en/e/ef/Uncharted_4_box_art.jpg",
  },
];