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
	const { theme, setTheme } = useTheme();

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
				"An error has occured while signing in. Please try again."
			);
		}
	}

	return (
		<main className="h-vh-nav flex flex-col justify-center items-center">
			<section>
				<div className="mb-6 px-4 sign-up-title-width">
					<p className="mb-4 text-3xl font-bold md:text-4xl">
						Sign In to Account
					</p>
					<p>
						Don't have an account?{" "}
						<Link
							to="/sign-up"
							className="underline underline-offset-2 font-semibold"
						>
							Sign Up.
						</Link>
					</p>
				</div>
				<form>
					<div className="flex flex-col border rounded-3xl p-8 w-fit m-2">
						<label className="mb-2" htmlFor="email">
							Email Address:
						</label>
						<input
							className={`sign-up-input ${
								theme === "dark" && "dark"
							}`}
							onChange={(e) => setEmail(e.target.value)}
							id="email"
							name="email"
						/>
						<label className="my-2" htmlFor="password">
							Password:
						</label>
						<input
							className={`sign-up-input ${
								theme === "dark" && "dark"
							}`}
							type="password"
							onChange={(e) => setPassword(e.target.value)}
							id="password"
							name="password"
						/>
						{errorMessage && (
							<p className="text-red-500 mb-2 font-medium sign-up-form-width">
								{errorMessage}
							</p>
						)}
						<Link
							className="text-blue-400 w-fit font-medium"
							to="/reset-password"
						>
							Reset Password
						</Link>
						<button
							className={`sign-up-button ${
								theme === "dark" && "dark"
							}`}
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
