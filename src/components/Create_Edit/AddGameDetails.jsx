import { CATEGORY_OPTIONS } from "../../utils/global_consts";
import Select from "react-select";
import { useTheme } from "../../context/ThemeContext";

export default function AddGameDetails({
  formData,
  setFormData,
  selectedCategories,
  setSelectedCategories,
}) {
  const { theme } = useTheme();

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  return (
    <div className="flex w-full flex-col md:flex-row">
      <div className="flex flex-col p-6 md:w-1/2">
        <label htmlFor="title">Game Title:</label>
        <input
          type="text"
          className={`mb-4 mt-2 p-2 ${theme}`}
          value={formData.title}
          onChange={(e) => handleChange(e)}
          name="title"
          id="title"
        />
        <label>Categories (First one will be the main one):</label>
        <Select
          isMulti
          options={CATEGORY_OPTIONS}
          className="mt-2"
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              background: theme === "dark" ? "#535353" : "white",
              borderColor: theme === "dark" ? "#535353" : "#9e9fa5",
            }),
            menu: (baseStyles, state) => ({
              ...baseStyles,
              background: theme === "dark" ? "#535353" : "white",
              zIndex: 0,
            }),
            placeholder: (baseStyles, state) => ({
              ...baseStyles,
              color: theme === "dark" ? "white" : "black",
            }),
            option: (baseStyles, state) => ({
              ...baseStyles,
              background:
                state.isFocused && (theme === "dark" ? "teal" : "#99f6e4"),
            }),
            multiValueRemove: (baseStyles, state) => ({
              ...baseStyles,
              color: theme === "dark" ? "black" : "white",
            }),
          }}
          value={selectedCategories}
          onChange={setSelectedCategories}
          name="categories"
        />
      </div>
      <div className="p-6 md:w-1/2">
        <label htmlFor="description">Enter a description for your game:</label>
        <br />
        <textarea
          className={`mt-2 h-32 w-full rounded p-2 ${theme}`}
          value={formData.description}
          onChange={(e) => handleChange(e)}
          id="description"
          name="description"
        />
      </div>
    </div>
  );
}
