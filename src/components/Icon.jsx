export default function Icon({ name, styles }) {
  return (
    <svg className={`icon ${styles}`}>
      <use xlinkHref={`#icon-${name}`}></use>
    </svg>
  );
}
