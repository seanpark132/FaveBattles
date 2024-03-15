import { Link } from "react-router-dom";
import { useUser } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function ProfileMyAccount() {
  const user = useUser();
  const { theme, setTheme } = useTheme();

  return (
    <section className="flex w-full flex-col px-6">
      <h1 className="mb-4">My Account</h1>
      <label className="text-xl" htmlFor="email">
        Email Address:
      </label>
      <input
        className={`mt-2 max-w-md px-4 py-2 ${theme}`}
        type="text"
        name="email"
        id="email"
        placeholder={user.email}
        readOnly
      />
      <Link className="mt-4 w-fit text-xl text-blue-400" to="/reset-password">
        Reset Password Here
      </Link>
    </section>
  );
}
