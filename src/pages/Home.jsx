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
        <>
            <Navbar />     
            <div className="my-4 flex flex-wrap justify-center">
                {homeGameBoxes} 
            </div>
        </>
    );
};