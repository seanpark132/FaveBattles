import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from "./pages/Home";
import Game from "./pages/Game";
import Stats from "./pages/Stats";
import Create from "./pages/Create"
import CreateImg from "./pages/CreateImg";
import CreateVideo from "./pages/CreateVideo";
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Profile from './pages/Profile';
import ResetPassword from './pages/ResetPassword';
import EditGame from './pages/EditGame';
import NoPage from './pages/NoPage';
import { auth, db } from "./firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';
import "./css/Profile.css"
import "./css/SignUp.css"
import './css/App.css';
import "./css/Home.css";
import "./css/Game.css";
import "./css/Create.css";
import { FIRESTORE_COLLECTION_NAME } from './utils/global_consts';

export default function App() {  
  const [allGameData, setAllGameData] = useState([]);
  const [myGamesData, setMyGamesData] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    const getGameData = async () => {
      const gamesRef = collection(db, FIRESTORE_COLLECTION_NAME);
      
      try {
        const allDocs = await getDocs(gamesRef);
        
        setAllGameData(allDocs.docs.map((doc) => {      
          return {...doc.data()};
        }));  
        
        if (auth.currentUser) {
          const q = query(gamesRef, where("creatorId", "==", auth.currentUser.uid));
          const myGamesDocs = await getDocs(q); 
          setMyGamesData(myGamesDocs.docs.map((doc) => {
            return {...doc.data()};
          }));
        };
        
        setIsDataFetched(true);

      } catch (error) {
        console.error(error.message);
        alert("Failed to get game data.")
      };
    };

    getGameData();   
  }, []);
  
  return(
    <>    
      {isDataFetched &&           
        <BrowserRouter> 
          <Routes>
            <Route index element={<Home allGameData={allGameData} />} /> 
            <Route path="/create" element={<Create />} />   
            <Route path="/create-img" element={<CreateImg />} />     
            <Route path="/create-video" element={<CreateVideo />} /> 
            <Route path="/sign-up" element={<SignUp />}/>
            <Route path="/sign-in" element={<SignIn/>}/>         
            <Route path='/reset-password' element={<ResetPassword />}/>   
            <Route path='/profile' element={<Profile />}/>          
            {myGamesData.map(game => 
              <Route key={game.id} path={`/edit-game/${game.id}`} element={<EditGame key={game.id} gameData={game}/>}/>
            )} 
            {allGameData.map(game => 
              <Route key={game.id} path={`/game/${game.id}`} element={<Game key={game.id} gameData={game}/>}/>
            )}
            {allGameData.map(game => 
              <Route key={game.id} path={`/stats/${game.id}`} element={<Stats key={game.id} gameData={game} />}/>
            )}
            <Route path="*" element={<NoPage />} />
          </Routes>      
        </BrowserRouter>        
      }  
    </>
  );
};


