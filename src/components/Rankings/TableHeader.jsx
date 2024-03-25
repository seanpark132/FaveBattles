import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import Icon from "../Icon";

export const TableHeader = ({ gameData, theme, setFilters }) => {
  return (
    <div className="m-2">
      <span className="p-input-icon-left mt-2">
        <Icon name="search" />
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
          className={`py-1 pl-9 pr-2  ${theme === "dark" ? "bg-slate-700" : ""}`}
        />
      </span>
      <h2
        className={`mt-4 text-center text-lg lg:text-2xl ${theme === "dark" ? "text-white" : ""} `}
      >
        [{gameData.mainCategory}] {gameData.title}
      </h2>
    </div>
  );
};
