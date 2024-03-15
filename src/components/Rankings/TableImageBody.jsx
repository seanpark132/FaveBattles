import { Image } from "primereact/image";

export const TableImageBody = (rowData) => {
  return (
    <Image
      src={rowData.url_384w}
      zoomSrc={rowData.url}
      alt={`${rowData.name} image`}
      imageClassName="h-32 object-cover"
      loading="lazy"
      preview
    />
  );
};
