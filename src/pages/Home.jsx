import Navbar from "../components/Navbar";
import HomeGameBox from "../components/HomeGameBox";

export default function Home(props) {

    const homeGameBoxes = props.allGameData.map(gameData =>
        <HomeGameBox
            key={gameData.id}
            {...gameData}
        />
    );

    return (
        <div>
            <Navbar />     
            <div className="m-4 flex flex-wrap justify-center">
                {homeGameBoxes} 
            </div>
        </div>
    );
};