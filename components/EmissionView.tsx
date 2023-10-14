"use client";

import { ChangeEvent, useState, memo } from "react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
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

interface AbsoluteEmissionsProps {
  entries: DataEntry[];
  selected: string;
}

const AbsoluteEmissions = memo(function AbsoluteEmissions({
  entries,
  selected,
}: AbsoluteEmissionsProps) {
  const selectedEntries = entries
    .filter((_) => _.company === selected)
    .sort((a, b) => (a.year < b.year ? -1 : 1));

  if (selectedEntries.length < 1) return null;

  return (
    <AreaChart
      width={600}
      height={400}
      data={selectedEntries}
      margin={{ top: 10, right: 5, bottom: 5, left: 40 }}
    >
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="year" />
      <YAxis />
      <Tooltip />
      <Area
        type="monotone"
        dataKey="emissions_scope1"
        stackId="1"
        stroke="red"
        fill="red"
      />
      <Area
        type="monotone"
        dataKey="emissions_scope2_location"
        stackId="1"
        stroke="blue"
        fill="blue"
      />
      <Area
        type="monotone"
        dataKey="emissions_scope3"
        stackId="1"
        stroke="orange"
        fill="orange"
      />
    </AreaChart>
  );
});

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
      <AbsoluteEmissions entries={entries} selected={selected} />
    </div>
  );
}
