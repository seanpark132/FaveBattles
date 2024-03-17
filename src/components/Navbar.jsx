import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
import Icon from "./Icon";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const user = useUser();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const menuRef = useRef();
  const themeRef = useRef();

  async function signOutUser() {
    try {
      await signOut(auth);
      toast("Successfully signed out.");
      setIsMenuOpen(false);
      navigate("/");
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    let menuHandler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };

    let themeHandler = (e) => {
      if (!themeRef.current.contains(e.target)) {
        setIsThemeOpen(false);
      }
    };

    document.addEventListener("mousedown", menuHandler);
    document.addEventListener("mousedown", themeHandler);

    return () => {
      document.removeEventListener("mousedown", menuHandler);
      document.removeEventListener("mousedown", themeHandler);
    };
  }, []);

  return (
    <nav className={`sticky top-0 flex items-center justify-between ${theme}`}>
      <div ref={menuRef}>
        <button
          className="ml-3 flex align-middle text-2xl"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Menu"
        >
          <Icon name="menu" />
        </button>
        <div className={`nav-menu ${isMenuOpen && "open"} ${theme}`}>
          <ul>
            <li className="mt-2">
              <Link
                to="/create"
                className="flex items-center md:text-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <Icon name="plus" styles="mr-2" />
                Create a new game
              </Link>
            </li>
            <li className="my-2">
              {user ? (
                <Link
                  to="/profile"
                  className="flex items-center md:text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon name="user" styles="mr-2" />
                  My Profile
                </Link>
              ) : (
                <Link
                  to="/sign-in"
                  className="flex items-center md:text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon name="enter" styles="mr-2" />
                  Sign In
                </Link>
              )}
            </li>
            {user && (
              <li className="my-2">
                <button
                  className="flex items-center text-red-500 md:text-lg"
                  onClick={signOutUser}
                  aria-label="Sign out"
                >
                  <Icon name="exit" styles="mr-2" />
                  Sign Out
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
      <Link to="/" className="absolute left-1/2 -translate-x-1/2 select-none">
        <img width="229.5" height="28" src="/logo.png" alt="site logo" />
      </Link>
      <div ref={themeRef}>
        <button
          className="mr-4 flex items-center"
          onClick={() => setIsThemeOpen((prev) => !prev)}
          aria-label="Theme menu"
        >
          {theme === "dark" ? (
            <Icon name="moon" styles="text-sky-400 md:text-lg" />
          ) : (
            <Icon name="sun" styles="text-yellow-500 md:text-lg" />
          )}
        </button>
        <div className={`nav-theme-menu ${isThemeOpen && "open"} ${theme}`}>
          <ul>
            <li className="mt-2">
              <button
                className="flex items-center md:text-lg"
                onClick={() => {
                  setTheme("dark");
                  setIsThemeOpen((prev) => !prev);
                }}
                aria-label="Dark mode"
              >
                <Icon name="moon" styles="mr-2 text-sky-400" />
                Dark Mode
              </button>
            </li>
            <li className="my-2">
              <button
                className="flex items-center md:text-lg"
                onClick={() => {
                  setTheme("light");
                  setIsThemeOpen((prev) => !prev);
                }}
                aria-label="Light mode"
              >
                <Icon name="sun" styles="mr-2 text-yellow-500" />
                Light Mode
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
