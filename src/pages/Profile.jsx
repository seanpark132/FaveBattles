import Navbar from "../components/Navbar";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const navigate = useNavigate();

async function signOutUser() {
    try {
        await signOut(auth);
        alert("Successfully signed out.");
        navigate("/");
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
