import { useState } from "react";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav>     
            <button className="ml-4 text-2xl" onClick={() => setIsMenuOpen(prev => !prev)}>
                <i className="fa-solid fa-bars"></i>
            </button>            
            <div className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
                <ul>
                    <li className="my-2">
                        <a href="/create" target="_blank" className="text-lg">
                            <i className="mr-2 fa-solid fa-plus fa-xs"></i>Create a new game
                        </a>            
                    </li>      
                </ul>
            </div>
            <a href="/" className="absolute -translate-x-1/2 left-1/2">
                <img className="max-h-7" src="/logo.png" />   
            </a>
        </nav>
    );
};