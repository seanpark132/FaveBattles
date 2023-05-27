import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './css/App.css';
import Home from "./pages/Home";
import Game from "./pages/Game";
import Stats from "./pages/Stats";
import Create from "./pages/Create"
import CreateImg from "./pages/CreateImg";
import CreateVideo from "./pages/CreateVideo";
import NoPage from './pages/NoPage';
import {db} from "./firebaseConfig";
import {collection, getDocs} from "firebase/firestore";

export default function App() {  

  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    const allGamesCollectionRef = collection(db, "all_games");

    getDocs(allGamesCollectionRef).then(res => {
      setGameData(res.docs.map(doc => (
        {...doc.data()}
      )));
    });
    
  }, []);
  
  return(
    <>
      {gameData ?       
        <BrowserRouter>
          <Routes>
            <Route index element={<Home gameData={gameData} />} />
            <Route path="/home" element={<Home gameData={gameData} />}/>
            <Route path="/create" element={<Create />} />   
            <Route path="/create-img" element={<CreateImg />} />     
            <Route path="/create-video" element={<CreateVideo />} />     
            {gameData.map(game => 
              <Route key={game.id} path={`/game/${game.id}`} element={<Game key={game.id} gameData={game}/>}/>
            )}
            {gameData.map(game => 
              <Route key={game.id} path={`/stats/${game.id}`} element={<Stats key={game.id} gameData={game} />}/>
            )}
            <Route path="*" element={<NoPage />} />
          </Routes> 
        </BrowserRouter>
        : null
      }  
    </>
  );
};


