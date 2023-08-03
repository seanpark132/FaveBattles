import { auth } from "../firebaseConfig";
import { AuthErrorCodes, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ResetPassword() {
	const [email, setEmail] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	async function resetPassword(e) {
		e.preventDefault();
		try {
			await sendPasswordResetEmail(auth, email);
			setErrorMessage("");
			setEmail("");
			toast(
				`An email with instructions to reset your password has been sent to ${email}.`
			);
		} catch (error) {
			console.error(error.message);

			if (error.code === AuthErrorCodes.INVALID_EMAIL) {
				setErrorMessage("Invalid Email Address");
				return;
			}

			setErrorMessage(
				"An error occurred while reseting your password. Please try again"
			);
		}
	}

	return (
		<div className="h-vh-nav flex flex-col justify-center items-center">
			<div>
				<div className="mb-6 px-4 sign-up-title-width">
					<p className="mb-4 text-3xl font-bold md:text-4xl">
						Reset Password
					</p>
					<p className="text-sm md:text-base">
						Please enter your email below and click Reset Password.
						An email will be sent to reset your password.
					</p>
				</div>
				<form className="flex justify-center">
					<div className="flex flex-col border rounded-3xl p-8 w-fit m-2">
						<label className="mb-2">Email Address:</label>
						<input
							className="sign-up-input"
							onChange={(e) => setEmail(e.target.value)}
						/>
						{errorMessage && (
							<p className="text-red-500 font-medium sign-up-form-width">
								{errorMessage}
							</p>
						)}
						<button
							className="sign-up-button"
							onClick={(e) => resetPassword(e)}
						>
							Reset Password
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
