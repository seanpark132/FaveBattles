import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from 'react';
import NavbarFixed from "../components/NavbarFixed";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    async function signIn(e) {     
        try {
            const user = await signInWithEmailAndPassword(auth, email, password);
            console.log(user);
        } catch(err) {
            console.error(err.message);
        };        
    };

    return (
        <div className="h-screen flex flex-col justify-center items-center">
            <NavbarFixed />
            <div className="max-w-3xl">
                <div className="mb-6 px-4">
                    <p className="mb-4 text-3xl font-bold sm:text-4xl">Sign In to Account</p>
                    <p>Don't have an account? <a href="/sign-up" className="underline underline-offset-2">Sign Up.</a> </p>
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
                        <button className="sign-up-button" onClick={(e) => signIn(e)}>Sign In</button>                   
                    </div>   
                </form>   
            </div>                   
        </div>         
    );
};
