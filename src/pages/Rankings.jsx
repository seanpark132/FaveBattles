import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { useQuery } from "@tanstack/react-query";
import { getRankingsData } from "../api/getRankingsData";
import { TableHeader } from "../components/Rankings/TableHeader";
import { TableImageBody } from "../components/Rankings/TableImageBody";
import { TableYoutubeBody } from "../components/Rankings/TableYoutubeBody";
import { TableFirstPercentBody } from "../components/Rankings/TableFirstPercentBody";
import { TableWinPercentBody } from "../components/Rankings/TableWinPercentBody";

export default function Rankings({ gameData }) {
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const rankingsQuery = useQuery({
    queryKey: ["rankings"],
    queryFn: () => getRankingsData(gameData.id),
    cacheTime: 0,
  });

  const { theme } = useTheme();

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
        rowsPerPageOptions={[10, 20, 40, 100]}
        stripedRows
        showGridlines
        header={
          <TableHeader
            gameData={gameData}
            theme={theme}
            setFilters={setFilters}
          />
        }
      >
        <Column
          className="font-bold md:text-lg lg:text-2xl"
          field="rank"
          header="Rank"
          style={{ width: "5%" }}
          sortable
        />
        <Column
          className="text-base font-bold md:text-lg lg:text-2xl"
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
            body={TableYoutubeBody}
            style={{ width: "25%" }}
          />
        ) : (
          <Column
            className="md:text-lg lg:text-2xl"
            field="url"
            header="Image"
            body={TableImageBody}
            style={{ width: "25%", minWidth: "10rem" }}
          />
        )}
        <Column
          className="md:text-lg lg:text-2xl"
          field="firstPercent"
          header="Game Win %"
          body={TableFirstPercentBody}
          style={{ width: "20%" }}
          sortable
        />
        <Column
          className="md:text-lg lg:text-2xl"
          field="winPercent"
          header="Round Win %"
          body={TableWinPercentBody}
          style={{ width: "20%" }}
          sortable
        />
      </DataTable>
    </main>
  );
}
