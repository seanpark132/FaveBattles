import { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import {db} from "../firebaseConfig";
import {doc, getDoc} from "firebase/firestore";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Image } from "primereact/image";
import { ProgressBar } from "primereact/progressbar"
import "primereact/resources/themes/lara-light-indigo/theme.css";     
import "primereact/resources/primereact.min.css";   
import "../css/Stats.css"
import "primereact/resources/themes/arya-purple/theme.css"

export default function Stats(props) {
    const [choicesData, setChoicesData] = useState([]);
    const [isDataFetched, setIsDataFetched] = useState(false)   
    const [filters, setFilters] = useState({
        global: {value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    
    // get choicesData array for the specified gameId, calculate and add first% and win% for each choice, 
    // sort choices array by first%, set choicesData state to sorted array
    useEffect(() => {                
        const gameDocRef = doc(db, "all_games", props.gameData.id);
        getDoc(gameDocRef).then(res => {
            let gameNumCompletes = res.data().numCompletes; 
            if (gameNumCompletes === 0) {
                gameNumCompletes = 1;
            };
            let docChoicesData = res.data().choices;
            docChoicesData.forEach(choice => {
                if (choice.numGames !== 0) {
                    const firstPercent = parseFloat((100 * choice.numFirst / gameNumCompletes).toFixed(1));
                    const winPercent = parseFloat((100 * choice.numWins / choice.numGames).toFixed(1));
    
                    choice.firstPercent = firstPercent;
                    choice.winPercent = winPercent;       
                } else {
                    choice.firstPercent = 0;
                    choice.winPercent = 0;
                };                       
            });
            
            docChoicesData.sort((a, b) => {
                if (b.firstPercent === a.firstPercent) {
                    return b.winPercent - a.winPercent
                };

                return b.firstPercent - a.firstPercent
            });    


            let rank = 1
            docChoicesData.forEach(choice => {
                choice.rank = rank
                rank += 1
            })        
            setChoicesData(docChoicesData);
            setIsDataFetched(true)
        });   
    }, []);

    useEffect(() => {
        console.log(choicesData)
    }, [choicesData])

    const renderHeader = () => {
        return (
            <div className="h-12 m-4 flex items-center">
                <span className="p-input-icon-left">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <InputText 
                        onInput={(e) => 
                            setFilters({
                                global: {value: e.target.value, matchMode: FilterMatchMode.CONTAINS}
                            })            
                        }
                        placeholder="Search by Name"                    
                    />
                </span>                  
                <h2 className="text-white centered">[{props.gameData.mainCategory}] {props.gameData.title}</h2>         
        </div>
        )
    };

    const imageBody = (rowData) => {
        return (
            <Image src={rowData.url} alt="choice-img" imageClassName="stats-img" preview/>
        )
    };

    const firstPercentBody = (rowData) => {
        return (
            <div className="text-center mb-6">
                <p>{rowData.firstPercent}%</p>
                <ProgressBar value={rowData.firstPercent} showValue={false}></ProgressBar> 
            </div>        
        )  
    };

    const winPercentBody = (rowData) => {
        return (
            <div className="text-center mb-6">
                <p>{rowData.winPercent}%</p>
                <ProgressBar value={rowData.winPercent} showValue={false}></ProgressBar> 
            </div>        
        )  
    };

    return (
        <div>
            <Navbar />       
            <DataTable     
                tableStyle={{fontSize:"1.5rem"}}
                value={choicesData} 
                sortMode="multiple" 
                filters={filters}             
                globalFilterFields={["name"]}
                paginator
                rows={10}
                rowsPerPageOptions={[10,20,100]}              
                stripedRows
                header={renderHeader}
            >
                <Column className="font-bold" field="rank" header="Rank" sortable />
                <Column className="font-bold" field="name" header="Name" style={{width: "30rem"}} sortable />
                <Column field="url" header="Image" body={imageBody} style={{width:"25rem"}}/>
                <Column field="firstPercent" header="Game Win %" body={firstPercentBody} style={{width: "24rem"}} sortable />
                <Column field="winPercent" header="Round Win %" body={winPercentBody} style={{width: "24rem"}} sortable />            
            </DataTable>
        </div>   
    );
};