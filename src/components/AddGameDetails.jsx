import { CATEGORY_OPTIONS } from "../utils/global_consts";
import Select from "react-select";

export default function AddGameDetails(props) {
	function handleChange(event) {
		const { name, value } = event.target;

		props.setFormData((prev) => {
			return {
				...prev,
				[name]: value,
			};
		});
	}

	return (
		<div className="flex flex-col w-full md:flex-row">
			<div className="flex flex-col p-6 md:w-1/2">
				<label htmlFor="title">Game Title:</label>
				<input
					type="text"
					className="mb-4 p-2"
					value={props.formData.title}
					onChange={(e) => handleChange(e)}
					id="title"
					name="title"
				/>
				<label>Categories (First one will be the main one):</label>
				<Select
					isMulti
					options={CATEGORY_OPTIONS}
					className="text-black"
					value={props.selectedCategories}
					onChange={props.setSelectedCategories}
					id="categories"
					name="categories"
				/>
			</div>
			<div className="p-6 md:w-1/2">
				<label htmlFor="description">
					Enter a description for your game:
				</label>
				<br />
				<textarea
					className="text-base mt-2 h-28 border-transparent rounded w-full p-2 md:h-24"
					value={props.formData.description}
					onChange={(e) => handleChange(e)}
					id="description"
					name="description"
				/>
			</div>
		</div>
	);
}
