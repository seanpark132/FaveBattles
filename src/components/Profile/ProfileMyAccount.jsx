import { Link } from "react-router-dom";
import { useUser } from "../../context/AuthContext";

export default function ProfileMyAccount() {
	const user = useUser();
	return (
		<section className="flex flex-col w-full">
			<h1 className="mb-4">My Account</h1>
			<label className="text-xl" htmlFor="email">
				Email Address:
			</label>
			<input
				className="mt-2 py-2 px-4 max-w-md"
				type="text"
				id="email"
				placeholder={user.email}
				readOnly
			/>
			<Link
				className="mt-4 text-xl text-blue-400 w-fit"
				to="/reset-password"
			>
				Reset Password Here
			</Link>
		</section>
	);
}