import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import AppLayout from "../components/layout/AppLayout";

const LandingPage = lazy(() => import("../pages/LandingPage"));
const GameMenuPage = lazy(() => import("../pages/GameMenuPage"));
const LobbyPage = lazy(() => import("../pages/LobbyPage"));
const Lobby = lazy(() => import("../pages/Lobby"));
const Game = lazy(() => import("../pages/Game"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const FriendsPage = lazy(() => import("../pages/FriendsPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const SettingsPage = lazy(() => import("../pages/SettingsPage"));
const HelpPage = lazy(() => import("../pages/HelpPage"));
const AboutPage = lazy(() => import("../pages/AboutPage"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald">
      <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function SuspenseWrap({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SuspenseWrap><LandingPage /></SuspenseWrap>} />

        <Route element={<AppLayout />}>
          <Route path="/play" element={<SuspenseWrap><GameMenuPage /></SuspenseWrap>} />
          <Route path="/lobby" element={<SuspenseWrap><LobbyPage /></SuspenseWrap>} />
          <Route path="/room/:roomCode" element={<SuspenseWrap><Lobby /></SuspenseWrap>} />
          <Route path="/login" element={<SuspenseWrap><LoginPage /></SuspenseWrap>} />
          <Route path="/register" element={<SuspenseWrap><RegisterPage /></SuspenseWrap>} />
          <Route path="/friends" element={<SuspenseWrap><FriendsPage /></SuspenseWrap>} />
          <Route path="/profile" element={<SuspenseWrap><ProfilePage /></SuspenseWrap>} />
          <Route path="/settings" element={<SuspenseWrap><SettingsPage /></SuspenseWrap>} />
          <Route path="/help" element={<SuspenseWrap><HelpPage /></SuspenseWrap>} />
          <Route path="/about" element={<SuspenseWrap><AboutPage /></SuspenseWrap>} />
          <Route path="/rules" element={<Navigate to="/help#playing" replace />} />
          <Route path="/faq" element={<Navigate to="/help#faq" replace />} />
        </Route>

        <Route path="/game/:gameId" element={<SuspenseWrap><Game /></SuspenseWrap>} />
      </Routes>
    </BrowserRouter>
  );
}
