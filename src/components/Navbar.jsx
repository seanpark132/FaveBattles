import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/AuthContext";

export default function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const user = useUser();
	const navigate = useNavigate();

	async function signOutUser() {
		try {
			await signOut(auth);
			alert("Successfully signed out.");
			setIsMenuOpen(false);
			navigate("/");
		} catch (err) {
			console.error(err.message);
		}
	}

	return (
		<nav className="sticky top-0">
			<button
				className="ml-4 text-2xl"
				onClick={() => setIsMenuOpen((prev) => !prev)}
			>
				<i className="fa-solid fa-bars"></i>
			</button>
			<div className={`nav-menu ${isMenuOpen && "open"}`}>
				<ul>
					<li className="my-2">
						<Link to="/create" className="text-lg">
							<i className="mr-4 fa-solid fa-plus fa-xs"></i>
							Create a new game
						</Link>
					</li>
					<li className="my-2">
						{user ? (
							<Link to="/profile" className="text-lg">
								<i className="mr-3 fa-solid fa-user"></i>My
								Profile
							</Link>
						) : (
							<Link to="/sign-in" className="text-lg">
								<i className="mr-3 fa-solid fa-right-from-bracket"></i>
								Sign In
							</Link>
						)}
					</li>
					<li className="my-2">
						{user && (
							<button
								className="text-lg text-red-500"
								onClick={signOutUser}
							>
								<i className="mr-3 -scale-x-100 fa-solid fa-right-from-bracket"></i>
								Sign Out
							</button>
						)}
					</li>
				</ul>
			</div>
			<Link to="/" className="absolute -translate-x-1/2 left-1/2">
				<img className="max-h-7" src="/logo.png" />
			</Link>
		</nav>
	);
}
