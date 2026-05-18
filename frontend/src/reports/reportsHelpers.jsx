import { Box, TableRow, TableCell, Skeleton, Avatar } from "@mui/material";

// ── Shared styles ─────────────────────────────────────────

const thSx = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 800, fontSize: "0.8rem", letterSpacing: 1.2,
  color: "#1a2233", textTransform: "uppercase",
};

// ── Helper functions ──────────────────────────────────────

function scoreColor(s) {
  if (s >= 80) return "#1a7a3c";
  if (s >= 60) return "#e67e00";
  return "#c0392b";
}

// ── Helper components ─────────────────────────────────────

function ScoreBadge({ score }) {
  const color = scoreColor(score);
  return (
    <Box sx={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 46, height: 46, borderRadius: "50%",
      border: `3px solid ${color}`, color,
      fontFamily: "'Barlow Condensed', sans-serif",
      fontWeight: 800, fontSize: "1rem",
    }}>
      {Math.round(score)}
    </Box>
  );
}

function GameAvatar({ image_url, title, size = 48 }) {
  return (
    <Avatar src={image_url} variant="rounded"
      sx={{
        width: size, height: size, bgcolor: "#e0e4ea",
        fontSize: "0.75rem", fontWeight: 700, color: "#555", flexShrink: 0
      }}>
      {title?.slice(0, 2).toUpperCase()}
    </Avatar>
  );
}

function UserAvatar({ image_url, name, size = 40 }) {
  return (
    <Avatar src={image_url}
      sx={{
        width: size, height: size, bgcolor: "#2c3e50",
        fontSize: "0.8rem", flexShrink: 0
      }}>
      {name?.slice(0, 1).toUpperCase()}
    </Avatar>
  );
}

function SkeletonRow({ cols }) {
  return (
    <TableRow>
      {Array.from({ length: cols }).map((_, i) => (
        <TableCell key={i}><Skeleton animation="wave" /></TableCell>
      ))}
    </TableRow>
  );
}

export {
  thSx,
  scoreColor,
  ScoreBadge,
  GameAvatar,
  UserAvatar,
  SkeletonRow,
};
