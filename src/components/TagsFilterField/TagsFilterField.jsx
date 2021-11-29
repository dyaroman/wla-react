import MobileFieldTitle from '../MobileFieldTitle/MobileFieldTitle';

function TagsFilterField({children}) {
  return (<>
    <MobileFieldTitle text="tags"/>
    <div className="tags-filter">
      {children}
    </div>
  </>);
}

export default TagsFilterField;
