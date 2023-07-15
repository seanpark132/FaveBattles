import { useState } from "react";
import { auth } from "../firebaseConfig"

export default function Navbar(props) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className={props.type === "fixed" ? "fixed top-0 w-full": "sticky top-0"}>        
            <button className="ml-4 text-2xl" onClick={() => setIsMenuOpen(prev => !prev)}>
                <i className="fa-solid fa-bars"></i>
            </button>            
            <div className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
                <ul>                          
                    <li className="my-2">
                        <a href="/create" className="text-lg">
                            <i className="mr-3 fa-solid fa-plus fa-xs"></i>Create a new game
                        </a>            
                    </li>                
                    <li className="my-2">
                        {auth.currentUser ? 
                            <a href="/profile" className="text-lg">
                                <i className="mr-3 fa-solid fa-plus fa-xs"></i>My Profile
                            </a>
                            :<a href="/sign-in" className="text-lg">
                                <i className="mr-3 fa-solid fa-plus fa-xs"></i>Sign In
                            </a>   
                        }      
                    </li>            
                </ul>
            </div>
            <a href="/" className="absolute -translate-x-1/2 left-1/2">
                <img className="max-h-7" src="/logo.png" />   
            </a>
        </nav>  
    );
};