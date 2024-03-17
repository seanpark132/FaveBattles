export default function Icon({ name, styles }) {
  return (
    <svg className={styles ? `icon ${styles}` : "icon"}>
      <use xlinkHref={`#icon-${name}`}></use>
    </svg>
  );
}
