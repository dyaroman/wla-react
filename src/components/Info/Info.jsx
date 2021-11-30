import { useSelector } from "react-redux";

export function Info() {
  const { timestamp = "", commit = "" } = useSelector(
    (state) => state["table"].websitesData
  );

  return (
    <section className="info">
      {timestamp && <h4>Data last updated: {timestamp}</h4>}
      {commit && (
        <h4>
          Commit:{" "}
          <a
            href={`https://dev.azure.com/myorg/websites/_git/websites/commit/${commit}`}
            target="_blank"
            rel="noreferrer"
          >
            {commit.substr(0, 10)}
          </a>
        </h4>
      )}
    </section>
  );
}
