export function Icons({ name }) {
  if (!name) return null;

  let content = null;
  const size = 40;

  if (name === 'tags') {
    content = (
      <>
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
          d="M20.162 10.926 13.716 4.48a2.5 2.5 0 0 0-1.767-.732h-5.2a3 3 0 0 0-3 3v5.2a2.5 2.5 0 0 0 .731 1.768l6.445 6.446a4 4 0 0 0 5.657 0l1.79-1.79 1.79-1.79a4 4 0 0 0 0-5.657"
        />
        <circle
          cx="7.738"
          cy="7.738"
          r="1.277"
          fill="currentColor"
          transform="rotate(-45 7.738 7.738)"
        />
      </>
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
        strokeWidth="1"
        d="M3 9.5h18m-18 5h18M8 4.5v15m-1.8 0h11.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C21 17.98 21 17.42 21 16.3V7.7c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C19.48 4.5 18.92 4.5 17.8 4.5H6.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C3 6.02 3 6.58 3 7.7v8.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874c.428.218.988.218 2.108.218Z"
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
