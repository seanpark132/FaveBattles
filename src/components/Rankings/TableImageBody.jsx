import { Image } from "primereact/image";

export const TableImageBody = (rowData) => {
  return (
    <Image
      src={rowData.url_sm}
      zoomSrc={rowData.url_lg}
      alt={`${rowData.name} image`}
      imageClassName="h-32 object-cover"
      loading="lazy"
      preview
    />
  );
};
