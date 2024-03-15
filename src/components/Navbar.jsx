import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
import PrimeReact from "primereact/api";

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
          className="ml-4 text-2xl"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Menu"
        >
          <i className="fa-solid fa-bars select-none"></i>
        </button>
        <div className={`nav-menu ${isMenuOpen && "open"} ${theme}`}>
          <ul>
            <li className="mt-2">
              <Link
                to="/create"
                className="md:text-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fa-solid fa-plus fa-xs mr-4"></i>
                Create a new game
              </Link>
            </li>
            <li className="my-2">
              {user ? (
                <Link
                  to="/profile"
                  className="md:text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fa-solid fa-user mr-3"></i>My Profile
                </Link>
              ) : (
                <Link
                  to="/sign-in"
                  className="md:text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fa-solid fa-right-from-bracket mr-3"></i>
                  Sign In
                </Link>
              )}
            </li>
            <li className="my-2">
              {user && (
                <button
                  className="text-red-500 md:text-lg"
                  onClick={signOutUser}
                  aria-label="Sign out"
                >
                  <i className="fa-solid fa-right-from-bracket mr-3 -scale-x-100"></i>
                  Sign Out
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
      <Link to="/" className="absolute left-1/2 -translate-x-1/2 select-none">
        <img width="229.5" height="28" src="/logo.png" alt="site logo" />
      </Link>
      <div ref={themeRef}>
        <button
          className="mr-4 select-none"
          onClick={() => setIsThemeOpen((prev) => !prev)}
          aria-label="Theme menu"
        >
          {theme === "dark" ? (
            <i className="fa-solid fa-moon text-2xl text-sky-400" />
          ) : (
            <i className="fa-solid fa-sun text-xl text-yellow-400" />
          )}
        </button>
        <div className={`nav-theme-menu ${isThemeOpen && "open"} ${theme}`}>
          <ul>
            <li className="mt-2">
              <button
                className="flex"
                onClick={() => {
                  setTheme("dark");
                  setIsThemeOpen((prev) => !prev);
                }}
                aria-label="Dark mode"
              >
                <i className="fa-solid fa-moon mr-4 w-4 self-center text-2xl text-sky-400" />
                <p className="self-center md:text-lg">Dark Mode</p>
              </button>
            </li>
            <li className="my-2">
              <button
                className="flex"
                onClick={() => {
                  setTheme("light");
                  setIsThemeOpen((prev) => !prev);
                }}
                aria-label="Light mode"
              >
                <i className="fa-solid fa-sun mr-4 w-4 self-center text-xl text-yellow-400" />
                <p className="self-center md:text-lg">Light Mode</p>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
