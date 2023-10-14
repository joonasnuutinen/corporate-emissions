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

interface SelectProps<T> {
  options: Option[];
  selected: string;
  handleChange: (e: ChangeEvent<T>) => void;
}

interface EmissionViewProps {
  entries: DataEntry[];
}

function getCompanies(entries: DataEntry[]): string[] {
  const companies = new Set<string>();
  entries.forEach((_) => companies.add(_.company));
  return [...companies].sort((a, b) => (a < b ? -1 : 1));
}

function Select({
  options,
  selected,
  handleChange,
}: SelectProps<HTMLSelectElement>) {
  return (
    <select value={selected} onChange={handleChange}>
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label || value}
        </option>
      ))}
    </select>
  );
}

function RadioButtons({
  options,
  selected,
  handleChange,
}: SelectProps<HTMLInputElement>) {
  return (
    <div>
      {options.map(({ value, label }) => (
        <label key={value}>
          <input
            type="radio"
            value={value}
            checked={selected === value}
            onChange={handleChange}
          />
          {label || value}
        </label>
      ))}
    </div>
  );
}

interface AbsoluteEmissionsProps {
  entries: DataEntry[];
  selected: string;
  scope2Option: string;
}

const AbsoluteEmissions = memo(function AbsoluteEmissions({
  entries,
  selected,
  scope2Option,
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
        dataKey={`emissions_scope2_${scope2Option}`}
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
  const [scope2Option, setScope2Option] = useState("market");
  const companies = getCompanies(entries);

  const companyOptions = [
    { value: NONE, label: "Select company" },
    ...companies.map((company) => ({ value: company })),
  ];

  const scope2Options = [{ value: "market" }, { value: "location" }];

  return (
    <div>
      <Select
        options={companyOptions}
        selected={selected}
        handleChange={(e) => setSelected(e.target.value)}
      />
      <RadioButtons
        options={scope2Options}
        selected={scope2Option}
        handleChange={(e) => setScope2Option(e.target.value)}
      />
      <AbsoluteEmissions
        entries={entries}
        selected={selected}
        scope2Option={scope2Option}
      />
    </div>
  );
}
