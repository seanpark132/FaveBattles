import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
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

  const [allGameData, setAllGameData] = useState({});
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    const initializeGameData = async () => {
      const allGamesCollectionRef = collection(db, "all_games");
      
      try {
        const allDocs = await getDocs(allGamesCollectionRef);
  
        setAllGameData(allDocs.docs.map(doc => (
          {...doc.data()}
        )));  
        setIsDataFetched(true);

      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to get game data.")
      };
    };

    initializeGameData();   
  }, []);


  
  return(
    <>
      {isDataFetched &&       
        <BrowserRouter>
          <Routes>
            <Route index element={<Home allGameData={allGameData} />} />
            <Route path="/home" element={<Home allGameData={allGameData} />}/>
            <Route path="/create" element={<Create />} />   
            <Route path="/create-img" element={<CreateImg />} />     
            <Route path="/create-video" element={<CreateVideo />} />     
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


