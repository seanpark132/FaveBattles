import { ProgressBar } from "primereact/progressbar";

export const TableFirstPercentBody = (rowData) => {
  return (
    <div className="mb-4 flex flex-col items-center">
      <p>{rowData.firstPercent}%</p>
      <ProgressBar
        className="w-full max-w-xs"
        value={rowData.firstPercent}
        showValue={false}
      ></ProgressBar>
    </div>
  );
};
