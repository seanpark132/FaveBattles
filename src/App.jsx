import { Routes, Route, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllGameData } from "./api/getAllGameData";
import { ToastContainer } from "react-toastify";
import { useTheme } from "./context/ThemeContext";
import { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import "react-toastify/dist/ReactToastify.css";
import "./css/SignUp.css";
import "./css/App.css";
import "./css/Home.css";
import "./css/Game.css";
import "./css/Create_Edit.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Create from "./pages/Create";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import NoPage from "./pages/NoPage";

const Game = lazy(() => import("./pages/Game"));
const Rankings = lazy(() => import("./pages/Rankings"));
const CreateImg = lazy(() => import("./pages/CreateImg"));
const CreateVideo = lazy(() => import("./pages/CreateVideo"));
const EditGame = lazy(() => import("./pages/EditGame"));

export default function App() {
  const allGamesDataQuery = useQuery({
    queryKey: ["allGamesData"],
    queryFn: () => getAllGameData(),
  });
  const { theme } = useTheme();
  const navigate = useNavigate();

  if (allGamesDataQuery.isLoading) return <h1 className="m-6">Loading...</h1>;
  if (allGamesDataQuery.isError) {
    return (
      <h1 className="m-6">
        An error occurred. Please try refreshing the page.
      </h1>
    );
  }

  return (
    <div className="App" id={theme}>
      <ToastContainer theme={theme} style={{ zIndex: 9999 }} />
      <Navbar />
      <Routes>
        <Route
          index
          element={<Home allGamesData={allGamesDataQuery.data.allGamesData} />}
        />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/create" element={<Create />} />
        <Route
          path="/create-img"
          element={
            <ErrorBoundary
              FallbackComponent={NoPage}
              onReset={() => navigate("/")}
            >
              <Suspense fallback={<h1 className="m-6">Loading...</h1>}>
                <CreateImg />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="/create-video"
          element={
            <ErrorBoundary
              FallbackComponent={NoPage}
              onReset={() => navigate("/")}
            >
              <Suspense fallback={<h1 className="m-6">Loading...</h1>}>
                <CreateVideo />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="/profile"
          element={
            <ErrorBoundary
              FallbackComponent={NoPage}
              onReset={() => navigate("/")}
            >
              <Suspense fallback={<h1 className="m-6">Loading...</h1>}>
                <Profile />
              </Suspense>
            </ErrorBoundary>
          }
        />
        {allGamesDataQuery.data.allGameIds.map((id) => (
          <Route
            key={id}
            path={`/edit-game/${id}`}
            element={
              <ErrorBoundary
                FallbackComponent={NoPage}
                onReset={() => navigate("/")}
              >
                <Suspense fallback={<h1 className="m-6">Loading...</h1>}>
                  <EditGame key={id} gameId={id} />
                </Suspense>
              </ErrorBoundary>
            }
          />
        ))}
        {allGamesDataQuery.data.allGamesData.map((gameData) => (
          <Route
            key={gameData.id}
            path={`/game/${gameData.id}`}
            element={
              <ErrorBoundary
                FallbackComponent={NoPage}
                onReset={() => navigate("/")}
              >
                <Suspense fallback={<h1 className="m-6">Loading...</h1>}>
                  <Game key={gameData.id} gameData={gameData} />
                </Suspense>
              </ErrorBoundary>
            }
          />
        ))}
        {allGamesDataQuery.data.allGamesData.map((gameData) => (
          <Route
            key={gameData.id}
            path={`/rankings/${gameData.id}`}
            element={
              <ErrorBoundary
                FallbackComponent={NoPage}
                onReset={() => navigate("/")}
              >
                <Suspense fallback={<h1 className="m-6">Loading...</h1>}>
                  <Rankings key={gameData.id} gameData={gameData} />
                </Suspense>
              </ErrorBoundary>
            }
          />
        ))}
        <Route path="*" element={<NoPage />} />
      </Routes>
    </div>
  );
}
