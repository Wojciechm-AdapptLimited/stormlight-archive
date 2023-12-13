import React from "react";

const Select = ({ options, value, setValue }) => {
    return (
        <select value={value} onChange={(e) => setValue(e.target.value)}>
            {options.map((option) => {
                return (
                    <option key={option} value={option}>
                        {option}
                    </option>
                );
            })}
        </select>
    );
}

export { Select };