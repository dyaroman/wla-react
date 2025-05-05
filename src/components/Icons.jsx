export function Icons({ name }) {
  if (!name) return null;

  let content = null;
  const size = 40;

  if (name === 'tags') {
    content = (
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        d="M8.5 3h3.012c.733 0 1.1 0 1.446.083.306.073.598.195.867.36.303.185.562.444 1.08.963L20.5 10m-12.95.05h.01M9.512 6H8.3c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3.5 8.28 3.5 9.12 3.5 10.8v1.212c0 .733 0 1.1.083 1.446.073.306.195.598.36.867.185.303.444.562.963 1.08l3.2 3.2c1.188 1.189 1.782 1.783 2.467 2.005a3 3 0 0 0 1.854 0c.685-.222 1.28-.816 2.467-2.004l1.212-1.212c1.188-1.188 1.782-1.782 2.004-2.467a3 3 0 0 0 0-1.854c-.222-.685-.816-1.28-2.004-2.467l-3.2-3.2c-.519-.519-.778-.778-1.081-.964a3.001 3.001 0 0 0-.867-.36C10.612 6 10.245 6 9.512 6ZM8.05 10.05a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"
      />
    );
  }

  if (name === 'filters') {
    content = (
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        d="m4 4 5 8v6l6 3v-9l5-8H4Z"
      />
    );
  }

  if (name === 'columns') {
    content = (
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        d="M4 15v1.8c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874c.427.218.987.218 2.105.218H12m-8-5V9m0 6h8M4 9V7.2c0-1.12 0-1.68.218-2.108.192-.377.497-.682.874-.874C5.52 4 6.08 4 7.2 4H12M4 9h8m0-5h4.8c1.12 0 1.68 0 2.108.218a2 2 0 0 1 .874.874c.218.427.218.987.218 2.105V9m-8-5v5m0 0v6m0-6h8m-8 6v5m0-5h8m-8 5h4.804c1.118 0 1.677 0 2.104-.218.376-.192.682-.498.874-.874.218-.428.218-.986.218-2.104V15m0 0V9"
      />
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
    >
      {content}
    </svg>
  );
}
