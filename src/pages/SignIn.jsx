import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    
    async function signIn(e) { 
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);      
            alert(`Successfully signed in with ${email}`);
            navigate("/");
        } catch(err) {
            console.error(err.message);

            if (err.message === "Firebase: Error (auth/wrong-password).") {
                alert("Incorrect password.");
                return;
            };

            if (err.message === "Firebase: Error (auth/user-not-found).") {
                alert("An account with this email does not exist.")
                return;
            };
            
            alert("An error has occured while signing in. Please try again.")
        };        
    };

    return (
        <div className="h-screen flex flex-col justify-center items-center">
            <Navbar type="fixed" />
            <div>
                <div className="mb-6 px-4 sign-up-width-clamp">
                    <p className="mb-4 text-3xl font-bold md:text-4xl">Sign In to Account</p>
                    <p>Don't have an account? <Link to="/sign-up" className="underline underline-offset-2">Sign Up.</Link ></p>
                </div>     
                <form>
                    <div className="flex flex-col border rounded-3xl p-8 w-fit m-2">
                        <label className="mb-2">Email Address:</label>
                        <input 
                            className="sign-up-input"                             
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label className="my-2">Password:</label>
                        <input 
                            className="sign-up-input"                           
                            type="password" 
                            onChange={(e) => setPassword(e.target.value)}
                        />     
                        <Link className="text-blue-400" to="/reset-password">Reset Password</Link>     
                        <button className="sign-up-button"  onClick={(e) => signIn(e)}>Sign In</button>                   
                    </div>   
                </form>   
            </div>                   
        </div>         
    );
};
