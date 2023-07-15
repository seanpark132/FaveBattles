import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from 'react';
import Navbar from "../components/Navbar";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    async function signUpUser(e) {
        e.preventDefault();
        if (password.length < 6) {
            alert("Please enter a password that is at least 6 characters.")
            return;
        };

        try {
            await createUserWithEmailAndPassword(auth, email, password);      
            alert(`Account successfully registered with ${email}.`);          
            window.location.href = "/"  

        } catch(err) {            
            console.error(err.message);
            if (err.message === "Firebase: Error (auth/invalid-email).") {
                alert("Please enter a valid email");
                return;
            };            

            if (err.message === "Firebase: Error (auth/email-already-in-use).") {
                alert("An account already exists with this email address.");
                return;
            };

            alert("An error occured while creating your account. Please try again.");
        };        
    };

    return (
        <div className="h-screen flex flex-col justify-center items-center">
            <Navbar type="fixed" />
            <div>
                <div className="mb-6 px-4 sign-up-width-clamp">
                    <p className="mb-4 text-3xl font-bold md:text-4xl">Create Account</p>
                    <p>Already have an account? <a href="/sign-in" className="underline underline-offset-2">Sign In.</a> </p>
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
                        <button className="sign-up-button" onClick={(e) => signUpUser(e)}>Sign Up</button>                   
                    </div>   
                </form>   
            </div>                   
        </div>       
    );
};
