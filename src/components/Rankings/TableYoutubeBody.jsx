export const TableYoutubeBody = (rowData) => {
  return (
    <iframe
      width="320"
      height="180"
      src={rowData.embedUrl}
      title="YouTube video player"
      allow="accelerometer;"
      allowFullScreen
    ></iframe>
  );
};
