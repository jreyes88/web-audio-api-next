import React from "react";

interface FilterCutoffProps {
  filterFreq: number;
  handleFilterChange: (val: number) => void;
}

export default function FilterCutoff({
  filterFreq,
  handleFilterChange,
}: FilterCutoffProps) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterChange(parseInt(e.target.value, 10));
  };
  return (
    <div className="">
      <label htmlFor="filter-cutoff">Filter cutoff: {filterFreq}Hz</label>
      <input
        id="filter-cutoff"
        type="range"
        min="50"
        max="5000"
        value={filterFreq}
        onChange={onChange}
      />
    </div>
  );
}
