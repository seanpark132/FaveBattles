import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Image } from "primereact/image";
import { ProgressBar } from "primereact/progressbar";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/arya-purple/theme.css";

const YOUTUBE_GAMETYPE = "video-youtube";
const FIRESTORE_COLLECTION_NAME = "all_games";

export default function Stats(props) {
	const [choicesData, setChoicesData] = useState([]);
	const [isTypeYoutube, setIsTypeYoutube] = useState(false);
	const [filters, setFilters] = useState({
		global: { value: null, matchMode: FilterMatchMode.CONTAINS },
	});

	function addFirstAndWinPercentsToChoices(choicesArray, gameNumCompletes) {
		choicesArray.forEach((choice) => {
			if (choice.numGames !== 0) {
				const firstPercent = parseFloat(
					((100 * choice.numFirst) / gameNumCompletes).toFixed(1)
				);
				const winPercent = parseFloat(
					((100 * choice.numWins) / choice.numGames).toFixed(1)
				);

				choice.firstPercent = firstPercent;
				choice.winPercent = winPercent;
			} else {
				choice.firstPercent = 0;
				choice.winPercent = 0;
			}
		});
	}

	function sortByFirstPercentThenWinPercent(choicesArray) {
		choicesArray.sort((a, b) => {
			if (b.firstPercent === a.firstPercent) {
				return b.winPercent - a.winPercent;
			}

			return b.firstPercent - a.firstPercent;
		});
	}

	useEffect(() => {
		if (props.gameData.gameType === YOUTUBE_GAMETYPE) {
			setIsTypeYoutube(true);
		}

		const gameDocRef = doc(
			db,
			FIRESTORE_COLLECTION_NAME,
			props.gameData.id
		);

		getDoc(gameDocRef).then((res) => {
			const liveGameData = res.data();
			let gameNumCompletes = liveGameData.numCompletes;
			if (gameNumCompletes === 0) {
				gameNumCompletes = 1;
			}

			let choicesArray = liveGameData.choices;

			addFirstAndWinPercentsToChoices(choicesArray, gameNumCompletes);
			sortByFirstPercentThenWinPercent(choicesArray);

			let rank = 1;
			choicesArray.forEach((choice) => {
				choice.rank = rank;
				rank += 1;
			});

			setChoicesData(choicesArray);
		});
	}, []);

	const renderHeader = () => {
		return (
			<div className="m-2">
				<span className="p-input-icon-left">
					<i className="fa-solid fa-magnifying-glass"></i>
					<InputText
						onInput={(e) =>
							setFilters({
								global: {
									value: e.target.value,
									matchMode: FilterMatchMode.CONTAINS,
								},
							})
						}
						placeholder="Search by Name"
					/>
				</span>
				<h2 className="mt-4 text-white text-center text-lg lg:text-2xl">
					[{props.gameData.mainCategory}] {props.gameData.title}
				</h2>
			</div>
		);
	};

	const imageBody = (rowData) => {
		return (
			<Image
				src={rowData.url}
				alt="choice-img"
				imageClassName="h-32 object-cover"
				preview
			/>
		);
	};

	const youtubeBody = (rowData) => {
		return (
			<iframe
				width="320"
				height="180"
				className=""
				src={rowData.embedUrl}
				title="YouTube video player"
				allow="accelerometer;"
				allowFullScreen
			></iframe>
		);
	};

	const firstPercentBody = (rowData) => {
		return (
			<div className="flex flex-col items-center mb-4">
				<p>{rowData.firstPercent}%</p>
				<ProgressBar
					className="max-w-xs w-full"
					value={rowData.firstPercent}
					showValue={false}
				></ProgressBar>
			</div>
		);
	};

	const winPercentBody = (rowData) => {
		return (
			<div className="flex flex-col items-center mb-4">
				<p>{rowData.winPercent}%</p>
				<ProgressBar
					className="max-w-xs w-full"
					value={rowData.winPercent}
					showValue={false}
				></ProgressBar>
			</div>
		);
	};

	return (
		<div>
			<Navbar />
			<DataTable
				tableStyle={{ fontSize: "1rem" }}
				value={choicesData}
				sortMode="multiple"
				filters={filters}
				globalFilterFields={["name"]}
				paginator
				rows={10}
				rowsPerPageOptions={[10, 20, 100]}
				stripedRows
				showGridlines
				header={renderHeader}
			>
				<Column
					className="font-bold md:text-lg lg:text-2xl"
					field="rank"
					header="Rank"
					style={{ width: "5%" }}
					sortable
				/>
				<Column
					className="font-bold text-base md:text-lg lg:text-2xl"
					field="name"
					header="Name"
					style={{ width: "30%" }}
					sortable
				/>
				{isTypeYoutube ? (
					<Column
						className="font-bold md:text-lg lg:text-2xl"
						field="embedUrl"
						header="Video"
						body={youtubeBody}
						style={{ width: "25%" }}
					/>
				) : (
					<Column
						className="md:text-lg lg:text-2xl"
						field="url"
						header="Image"
						body={imageBody}
						style={{ width: "25%" }}
					/>
				)}
				<Column
					className="md:text-lg lg:text-2xl"
					field="firstPercent"
					header="Game Win %"
					body={firstPercentBody}
					style={{ width: "20%" }}
					sortable
				/>
				<Column
					className="md:text-lg lg:text-2xl"
					field="winPercent"
					header="Round Win %"
					body={winPercentBody}
					style={{ width: "20%" }}
					sortable
				/>
			</DataTable>
		</div>
	);
}
