function MobileFieldTitle({text}) {
    if (text) {
        return <span className="mobile-field-title">{text}</span>
    } else {
        return null;
    }
}

export default MobileFieldTitle;