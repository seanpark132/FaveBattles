import { ProgressBar } from "primereact/progressbar";

export const TableWinPercentBody = (rowData) => {
  return (
    <div className="mb-4 flex flex-col items-center">
      <p>{rowData.winPercent}%</p>
      <ProgressBar
        className="w-full max-w-xs"
        value={rowData.winPercent}
        showValue={false}
      ></ProgressBar>
    </div>
  );
};
