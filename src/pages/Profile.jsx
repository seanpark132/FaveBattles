import Navbar from "../components/Navbar";
import { auth } from "../firebaseConfig";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import ProfileMyGames from "../components/ProfileMyGames";

export default function Profile() {
    const [currentTab, setCurrentTab] = useState("my-account");

    const navigate = useNavigate();

    const myAccountSection = 
        <section className="flex flex-col w-full py-8">
            <h1 className="mb-4">My Account</h1>
            <label className="text-xl" htmlFor="email">Email Address:</label>
            <input className="mt-2 py-2 px-4 max-w-md" type="text" id="email" placeholder={auth.currentUser.email} readOnly />
            <Link className="mt-4 text-xl text-blue-400" to="/reset-password">Reset Password Here</Link>
        </section>

    return (
        <div className="w-screen">
            <Navbar />
            <div className="p-6 w-full">
                <div className="flex border-b">
                    <button 
                        className={currentTab === "my-account" ? "profile-tab text-purple-300 bg-purple-950": "profile-tab"} 
                        onClick={() => setCurrentTab("my-account")}
                    >My Account
                    </button>
                    <button 
                        className={currentTab === "my-games" ? "profile-tab text-purple-300 bg-purple-950": "profile-tab"} 
                        onClick={() => setCurrentTab("my-games")}
                    >My Games
                    </button>                    
                </div>    
                {currentTab === "my-account" && myAccountSection}
                {currentTab === "my-games" && <ProfileMyGames />}     
            </div>  
        </div>                      
    );
};

// TOP BAR : email or username, signout button
// ACCOUNT DETAILS : EMAIL, CHANGE PASS, DELETE ACCOUNT
// My games: list of games created by auth.currentUser.id
// Last played games ???
