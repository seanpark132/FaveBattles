import Navbar from "../components/Navbar";
import HomeGameBox from "../components/HomeGameBox";
import "../css/Home.css";

export default function Home(props) {

    const homeGameBoxes = props.gameData.map(data =>
        <HomeGameBox
            key={data.id}
            {...data}
        />
    );

    return (
        <div>
            <Navbar />     
            <div className="m-5 flex flex-wrap">
                {homeGameBoxes}
            </div>
        </div>
    );
};