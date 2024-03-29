import { Link } from "react-router-dom";

export default function NotSignedIn() {
  return (
    <main className="flex flex-col justify-center p-8 text-center">
      <h2>You are not signed in. To create games, you must be signed in.</h2>
      <h1>
        <Link
          to="/sign-in"
          className="text-blue-400 underline underline-offset-2"
        >
          Sign In Here
        </Link>
      </h1>
    </main>
  );
}
