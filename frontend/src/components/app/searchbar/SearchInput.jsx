/* eslint-disable react/prop-types */

const SearchInput = ({ value, onChange, className }) => {
    return (
        <input
            placeholder="Search anything..."
            type="text"
            className={className}
            value={value}
            onChange={onChange}
        />
    );
};

export default SearchInput;
