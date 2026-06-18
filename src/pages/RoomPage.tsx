import { Navigate, useParams } from "react-router-dom";

/** @deprecated Use /room/:roomCode */
export default function RoomPage() {
  const { roomCode } = useParams();
  return <Navigate to={roomCode ? `/room/${roomCode}` : "/"} replace />;
}
