import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import AppLayout from "../components/layout/AppLayout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import LobbyPage from "../pages/LobbyPage";
import Lobby from "../pages/Lobby";
import FriendsPage from "../pages/FriendsPage";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";
import HelpPage from "../pages/HelpPage";

const Game = lazy(() => import("../pages/Game"));

function GameLoader() {
  return (
    <div className="h-screen flex items-center justify-center bg-emerald">
      <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route element={<AppLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/lobby" element={<LobbyPage />} />
          <Route path="/play" element={<Navigate to="/lobby" replace />} />
          <Route path="/room/:roomCode" element={<Lobby />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/rules" element={<Navigate to="/help" replace />} />
        </Route>

        <Route
          path="/game/:gameId"
          element={
            <Suspense fallback={<GameLoader />}>
              <Game />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
