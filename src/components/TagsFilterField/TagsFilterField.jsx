import { MobileFieldTitle } from '../MobileFieldTitle/MobileFieldTitle';

export function TagsFilterField({ children }) {
  return (
    <>
      <MobileFieldTitle text="tags" />
      <div className="tags-filter">{children}</div>
    </>
  );
}
