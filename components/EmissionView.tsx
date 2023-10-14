"use client";

import { ChangeEvent, useState } from "react";
import { DataEntry } from "@/types";

interface Option {
  value: string;
  label?: string;
}

interface SelectProps {
  options: Option[];
  selected: string;
  handleChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

interface EmissionViewProps {
  entries: DataEntry[];
}

function getCompanies(entries: DataEntry[]): string[] {
  const companies = new Set<string>();
  entries.forEach((_) => companies.add(_.company));
  return [...companies].sort((a, b) => (a < b ? -1 : 1));
}

function Select({ options, selected, handleChange }: SelectProps) {
  return (
    <select value={selected} onChange={handleChange}>
      {[
        options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label || value}
          </option>
        )),
      ]}
    </select>
  );
}

export default function EmissionView({ entries }: EmissionViewProps) {
  const NONE = "__none__";
  const [selected, setSelected] = useState(NONE);
  const companies = getCompanies(entries);

  const options = [
    { value: NONE, label: "Select company" },
    ...companies.map((company) => ({ value: company })),
  ];

  return (
    <div>
      <Select
        options={options}
        selected={selected}
        handleChange={(e) => setSelected(e.target.value)}
      />
      {selected !== NONE && <div>Selected: {selected}</div>}
    </div>
  );
}
