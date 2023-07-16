import { useState } from "react";
import { Link } from "react-router-dom";
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
                        <Link to="/create" className="text-lg">
                            <i className="mr-3 fa-solid fa-plus fa-xs"></i>Create a new game
                        </Link>            
                    </li>                
                    <li className="my-2">
                        {auth.currentUser ? 
                            <Link to="/profile" className="text-lg">
                                <i className="mr-3 fa-solid fa-plus fa-xs"></i>My Profile
                            </Link>
                            :<Link to="/sign-in" className="text-lg">
                                <i className="mr-3 fa-solid fa-plus fa-xs"></i>Sign In
                            </Link >   
                        }      
                    </li>            
                </ul>
            </div>
            <Link to="/" className="absolute -translate-x-1/2 left-1/2">
                <img className="max-h-7" src="/logo.png" />   
            </Link >
        </nav>  
    );
};