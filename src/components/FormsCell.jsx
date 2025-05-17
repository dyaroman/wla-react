import { Highlight } from './Highlight';

export function FormsCell({ forms, host, filter }) {
  const formsList = Object.keys(forms).map((form) => {
    const pages = Object.keys(forms[form]);
    const pagesList = pages.map((page) => {
      const config = forms[form][page];
      const configList = Object.keys(config).map((key) => {
        let content;
        if (Array.isArray(config[key])) {
          content = (
            <>
              {key}:{' '}
              <ul>
                {config[key].map((item) => (
                  <li key={item}>{JSON.stringify(item)}</li>
                ))}
              </ul>
            </>
          );
        } else if (key === 'primaryColor') {
          content = (
            <div className="primary-color">
              {key}:{' '}
              <span className="primary-color__inner">
                <span
                  className="color-preview"
                  style={{
                    backgroundColor: config[key],
                  }}
                />
                {config[key]}
              </span>
            </div>
          );
        } else {
          content = (
            <>
              {key}: {JSON.stringify(config[key])}
            </>
          );
        }

        return <li key={key}>{content}</li>;
      });

      return (
        <li key={page}>
          <a href={`https://${host}/${page}`} target="_blank" rel="noreferrer">
            {page}
          </a>
          <ul>{configList}</ul>
        </li>
      );
    });

    return (
      <li key={form}>
        <Highlight text={form} highlight={filter} />
        <ul>{pagesList}</ul>
      </li>
    );
  });

  return <ul>{formsList}</ul>;
}
