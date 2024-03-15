import React from "react";
import { useState } from "react";
import {
  filterGameDataByCategory,
  filterGameDataByTitle,
  sortGameDataByProperty,
} from "../utils/sort_functions";
import { Dropdown } from "primereact/dropdown";
import { CATEGORY_OPTIONS } from "../utils/global_consts";
import { useTheme } from "../context/ThemeContext";

export default function FiltersAndSearch({
  allGamesData,
  sortedData,
  setDisplayData,
  setSortedData,
}) {
  const [sortByProperty, setSortByProperty] = useState("Popularity");
  const [filterByCategory, setFilterByCategory] = useState("No Filter");
  const [searchInput, setSearchInput] = useState("");
  const { theme, setTheme } = useTheme();

  function handleSort(e) {
    setSortByProperty(e.value);
    const sorted = sortGameDataByProperty(allGamesData, e.value);
    setSortedData(sorted);
    const categoryFiltered = filterGameDataByCategory(sorted, filterByCategory);
    setDisplayData(categoryFiltered);
    setSearchInput("");
  }

  function handleFilter(e) {
    setFilterByCategory(e.value);
    const categoryFiltered = filterGameDataByCategory(sortedData, e.value);
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
    <section className="flex flex-wrap px-6">
      <div className="mr-6 pt-4">
        <p className="mb-1 pl-1 font-semibold">Sort by:</p>
        <Dropdown
          value={sortByProperty}
          onChange={(e) => handleSort(e)}
          options={["Popularity", "Latest"]}
          placeholder="Sort By"
          className="w-40 rounded-lg"
        />
      </div>
      <div className="mr-6 pt-4">
        <p className="mb-1 pl-1 font-semibold">Filter by:</p>
        <Dropdown
          value={filterByCategory}
          onChange={(e) => handleFilter(e)}
          options={[
            "No Filter",
            ...CATEGORY_OPTIONS.map((option) => option.label),
          ]}
          placeholder="Category"
          className="w-40 rounded-lg"
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
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </div>
    </section>
  );
}
