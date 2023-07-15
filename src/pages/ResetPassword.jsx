import { auth } from "../firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from 'react';
import Navbar from "../components/Navbar";

export default function ResetPassword() {
    const [email, setEmail] = useState("");
    
    async function resetPassword(e) {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            alert(`An email with steps to reset your password has been sent to ${email}.`)
            setEmail("");
        } catch(err) {
            console.error(err.message);
        };
    };

    return (
        <div className="h-screen flex flex-col justify-center items-center">
            <Navbar type="fixed" />
            <div>
                <div className="mb-6 px-4 sign-up-width-clamp">
                    <p className="mb-4 text-3xl font-bold md:text-4xl">Reset Password</p>    
                    <p className="text-sm md:text-base">Please enter your email below and click Reset Password. An email will be sent to reset your password.</p>       
                </div>     
                <form className="flex justify-center">
                    <div className="flex flex-col border rounded-3xl p-8 w-fit m-2">
                        <label className="mb-2">Email Address:</label>
                        <input 
                            className="sign-up-input"                             
                            onChange={(e) => setEmail(e.target.value)}
                        />      
                        <button className="sign-up-button" onClick={(e) => resetPassword(e)}>Reset Password</button>                   
                    </div>   
                </form>   
            </div>                   
        </div>         
    );
};
