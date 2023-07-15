import Navbar from "../components/Navbar";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";

export default function Profile() {

async function signOutUser() {
    try {
        await signOut(auth);
        alert("Successfully signed out.");
        window.location.href = "/";
    } catch(err) {
        console.error(err.message);        
    };
    
};

    return (
        <div>
            <Navbar />
            <div className="p-4">
                <div>Profile</div>
                <button onClick={signOutUser} className="p-2 border rounded text-red-500">Sign Out</button>
            </div>  
        </div>                      
    );
};
