import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './css/App.css'
import Home from "./pages/Home"
import Game from "./pages/Game"
import Create from "./pages/Create"
import {db} from "./firebaseConfig"
import {collection, getDocs} from "firebase/firestore"

export default function App() {  

  const [gameData, setGameData] = useState(null)
  const allGamesCollectionRef = collection(db, "all_games")

  useEffect(() => {
    const getGameData = async () => {
      const data = await getDocs(allGamesCollectionRef) 
      setGameData(data.docs.map(doc => (
        {...doc.data()}
      )))
    }    
    getGameData()          
  }, [])  
  
  let gameRoutes = null
  // Every url with game/game.id will have the "game" page with the game info of that ID 
  if (gameData !== null) {
    gameRoutes = gameData.map(game => 
      <Route key={game.id} path={`/game/${game.id}`} element={<Game key={game.id} gameData={game}/>}/>
      )
  }

    return(
    <>
      {gameRoutes ?       
        <BrowserRouter>
          <Routes>
            <Route index element={<Home gameData={gameData} />} />
            <Route path="/home" element={<Home gameData={gameData} />}/>
            <Route path="/create" element={<Create/>} />       
            {gameRoutes}
          </Routes> 
        </BrowserRouter>
        : null
      }  
    </>
  )
}


