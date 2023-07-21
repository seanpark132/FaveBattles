import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword, AuthErrorCodes } from "firebase/auth";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate, Link } from "react-router-dom";

export default function SignUp() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();

	async function signUpUser(e) {
		e.preventDefault();
		if (password.length < 6) {
			setErrorMessage(
				"Please enter a password that is at least 6 characters."
			);
			return;
		}

		try {
			await createUserWithEmailAndPassword(auth, email, password);
			setErrorMessage("");
			alert(`Account successfully registered with ${email}.`);
			navigate("/");
		} catch (error) {
			console.error(error.message);

			if (error.code === AuthErrorCodes.INVALID_EMAIL) {
				setErrorMessage("Invalid email address.");
				return;
			}

			if (error.code === AuthErrorCodes.EMAIL_EXISTS) {
				setErrorMessage(
					"An account already exists with this email address."
				);
				return;
			}

			setErrorMessage(
				"An error occured while creating your account. Please try again."
			);
		}
	}

	return (
		<div className="h-screen flex flex-col justify-center items-center">
			<Navbar type="fixed" />
			<div>
				<div className="mb-6 px-4 sign-up-title-width">
					<p className="mb-4 text-3xl font-bold md:text-4xl">
						Create Account
					</p>
					<p>
						Already have an account?{" "}
						<Link
							to="/sign-in"
							className="underline underline-offset-2"
						>
							Sign In.
						</Link>{" "}
					</p>
				</div>
				<form>
					<div className="flex flex-col border rounded-3xl p-8 w-fit m-2">
						<label className="mb-2">Email Address:</label>
						<input
							className="sign-up-input"
							onChange={(e) => setEmail(e.target.value)}
						/>
						<label className="mb-2">Password:</label>
						<input
							className="sign-up-input"
							type="password"
							onChange={(e) => setPassword(e.target.value)}
						/>
						{errorMessage && (
							<p className="text-red-500 sign-up-form-width">
								{errorMessage}
							</p>
						)}
						<button
							className="sign-up-button"
							onClick={(e) => signUpUser(e)}
						>
							Sign Up
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
