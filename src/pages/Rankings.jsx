import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Image } from "primereact/image";
import { ProgressBar } from "primereact/progressbar";
import "primereact/resources/primereact.min.css";
import { useQuery } from "@tanstack/react-query";
import { getRankingsData } from "../api/getRankingsData";

export default function Rankings({ gameData }) {
	const [filters, setFilters] = useState({
		global: { value: null, matchMode: FilterMatchMode.CONTAINS },
	});

	const rankingsQuery = useQuery({
		queryKey: ["rankings"],
		queryFn: () => getRankingsData(gameData.id),
		cacheTime: 0,
	});

	if (rankingsQuery.isLoading) {
		return <h1 className="m-6">Loading...</h1>;
	}
	if (rankingsQuery.isError) {
		return (
			<h1 className="m-6">
				An error has occurred. Please try refreshing the page.
			</h1>
		);
	}

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
				<h2 className="mt-4 text-center text-lg lg:text-2xl">
					[{gameData.mainCategory}] {gameData.title}
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
		<main>
			<DataTable
				tableStyle={{ fontSize: "1rem" }}
				value={rankingsQuery.data}
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
				{gameData.gameType === "video-youtube" ? (
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
		</main>
	);
}
