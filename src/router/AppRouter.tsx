import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import PlayPage from "../pages/PlayPage";
import RoomPage from "../pages/RoomPage";
import GamePage from "../pages/GamePage";
import FriendsPage from "../pages/FriendsPage";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Full-screen game menu — no website chrome */}
        <Route path="/" element={<HomePage />} />

        <Route element={<AppLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/play" element={<PlayPage />} />
          <Route path="/room/:roomCode" element={<RoomPage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="/game/:gameId" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  );
}
