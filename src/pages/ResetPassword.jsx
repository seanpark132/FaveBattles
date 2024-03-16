import { auth } from "../firebaseConfig";
import { AuthErrorCodes, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { theme } = useTheme();

  async function resetPassword(e) {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setErrorMessage("");
      setEmail("");
      toast(
        `An email with instructions to reset your password has been sent to ${email}.`,
      );
    } catch (error) {
      console.error(error.message);

      if (error.code === AuthErrorCodes.INVALID_EMAIL) {
        setErrorMessage("Invalid Email Address");
        return;
      }

      setErrorMessage(
        "An error occurred while reseting your password. Please try again",
      );
    }
  }

  return (
    <main className="flex h-vh-nav flex-col items-center justify-center">
      <section>
        <div className="sign-up-title-width mb-6 px-4">
          <p className="mb-4 text-3xl font-bold md:text-4xl">Reset Password</p>
          <p className="text-sm md:text-base">
            Please enter your email below and click Reset Password. An email
            will be sent to reset your password.
          </p>
        </div>
        <form className="flex justify-center">
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
            {errorMessage && (
              <p className="sign-up-form-width font-medium text-red-500">
                {errorMessage}
              </p>
            )}
            <button
              className={`sign-up-button ${theme}`}
              onClick={(e) => resetPassword(e)}
            >
              Reset Password
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
