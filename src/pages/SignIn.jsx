import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword, AuthErrorCodes } from "firebase/auth";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { theme } = useTheme();

  async function signIn(e) {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setErrorMessage("");
      toast(`Successfully signed in with ${email}`);
      navigate("/");
    } catch (err) {
      console.error(err.message);

      if (err.code === AuthErrorCodes.INVALID_PASSWORD) {
        setErrorMessage("Wrong password. Please try again.");
        return;
      }

      if (err.code === AuthErrorCodes.INVALID_EMAIL) {
        setErrorMessage("Invalid email address.");
        return;
      }

      if (err.code === AuthErrorCodes.USER_DELETED) {
        setErrorMessage("An account with this email does not exist.");
        return;
      }

      setErrorMessage(
        "An error has occured while signing in. Please try again.",
      );
    }
  }

  return (
    <main className="flex h-vh-nav flex-col items-center justify-center">
      <section>
        <div className="sign-up-title-width mb-6 px-4">
          <p className="mb-4 text-3xl font-bold md:text-4xl">
            Sign In to Account
          </p>
          <p>
            Don't have an account?{" "}
            <Link
              to="/sign-up"
              className="font-semibold underline underline-offset-2"
            >
              Sign Up.
            </Link>
          </p>
        </div>
        <form>
          <div className="m-2 flex w-fit flex-col rounded-3xl border p-8">
            <label className="mb-2" htmlFor="email">
              Email Address:
            </label>
            <input
              className={`sign-up-input ${theme}`}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              name="email"
            />
            <label className="my-2" htmlFor="password">
              Password:
            </label>
            <input
              className={`sign-up-input ${theme}`}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              name="password"
            />
            {errorMessage && (
              <p className="sign-up-form-width mb-2 font-medium text-red-500">
                {errorMessage}
              </p>
            )}
            <Link
              className="w-fit font-medium text-blue-400"
              to="/reset-password"
            >
              Reset Password
            </Link>
            <button
              className={`sign-up-button ${theme}`}
              onClick={(e) => signIn(e)}
            >
              Sign In
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
