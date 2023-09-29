export function ImgCell({ sources = [] }) {
  return (
    <div className="images">
      {sources.map((src) => (
        <img
          key={src}
          src={src}
          className="images__item"
          loading="lazy"
          alt=""
        />
      ))}
    </div>
  );
}
