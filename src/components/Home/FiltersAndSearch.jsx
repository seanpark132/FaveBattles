import React from "react";
import { useState } from "react";
import {
  filterGameDataByCategory,
  filterGameDataByTitle,
  sortGameDataByProperty,
} from "../../utils/sort_functions";
import { Dropdown } from "primereact/dropdown";
import { CATEGORY_OPTIONS } from "../../utils/global_consts";
import { useTheme } from "../../context/ThemeContext";
import SelectDropdown from "./SelectDropdown";
import Icon from "../Icon";

export default function FiltersAndSearch({
  allGamesData,
  sortedData,
  setDisplayData,
  setSortedData,
}) {
  const [sortByProperty, setSortByProperty] = useState("Popularity");
  const [filterByCategory, setFilterByCategory] = useState("No Filter");
  const [searchInput, setSearchInput] = useState("");
  const { theme } = useTheme();

  const SORT_BY_OPTIONS = ["Popularity", "Latest"];
  const FILTER_BY_OPTIONS = [
    "No Filter",
    ...CATEGORY_OPTIONS.map((option) => option.label),
  ];

  function handleSort(e) {
    setSortByProperty(e.target.value);
    const sorted = sortGameDataByProperty(allGamesData, e.target.value);
    console.log(sorted);
    setSortedData(sorted);
    const categoryFiltered = filterGameDataByCategory(sorted, filterByCategory);
    setDisplayData(categoryFiltered);
    setSearchInput("");
  }

  function handleFilter(e) {
    setFilterByCategory(e.target.value);
    const categoryFiltered = filterGameDataByCategory(
      sortedData,
      e.target.value,
    );
    setDisplayData(categoryFiltered);
    setSearchInput("");
  }

  function handleSearch(e) {
    if (e.key !== "Enter") {
      return;
    }

    const titleFiltered = filterGameDataByTitle(sortedData, searchInput);

    const categoryFiltered = filterGameDataByCategory(
      titleFiltered,
      filterByCategory,
    );

    setDisplayData(categoryFiltered);
  }

  function handleSearchButton() {
    const titleFiltered = filterGameDataByTitle(sortedData, searchInput);

    const categoryFiltered = filterGameDataByCategory(
      titleFiltered,
      filterByCategory,
    );

    setDisplayData(categoryFiltered);
  }

  return (
    <form className="flex flex-wrap px-6">
      <div className="mr-6 pt-4">
        <p className="mb-1 pl-1 font-semibold">Sort by:</p>
        <SelectDropdown
          options={SORT_BY_OPTIONS}
          value={sortByProperty}
          theme={theme}
          onChangeHandle={handleSort}
          placeholder="Sort By"
        />
      </div>
      <div className="mr-6 pt-4">
        <p className="mb-1 pl-1 font-semibold">Filter by:</p>
        <SelectDropdown
          options={FILTER_BY_OPTIONS}
          value={filterByCategory}
          theme={theme}
          onChangeHandle={handleFilter}
          placeholder="Category"
        />
      </div>
      <div className="flex flex-col pt-4">
        <label htmlFor="searchInput" className="mb-1">
          Search by title:
        </label>
        <div className="flex">
          <input
            type="text"
            className={`home-search-input ${theme}`}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => handleSearch(e)}
            name="searchInput"
            id="searchInput"
          />
          <button
            onClick={handleSearchButton}
            className={`home-search-btn ${theme}`}
            aria-label="Search by title"
          >
            <Icon name="search" />
          </button>
        </div>
      </div>
    </form>
  );
}
