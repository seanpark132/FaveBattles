import Navbar from "../components/Navbar";
import DisplayGameBox from "../components/DisplayGameBox";

export default function Home(props) {

    const homeGameBoxes = props.allGameData.map(gameData =>
        <DisplayGameBox
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