"use client";
import { useMemo, useState } from "react";

export type Campaign = {
  id: string;
  name: string;
  status: "Active" | "Paused" | "Completed";
  budget: number;        // USD
  impressions: number;
  clicks: number;
  updatedAt: string;     // ISO date
};

// --- filters ---
const STATUSES = ["All", "Active", "Paused", "Completed"] as const;
type Status = typeof STATUSES[number];

// --- sorting ---
type SortKey =
  | "name"
  | "status"
  | "budget"
  | "impressions"
  | "clicks"
  | "ctr"
  | "updatedAt";

export default function CampaignTable({ campaigns }: { campaigns: Campaign[] }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<Status>("All");

  const [sortBy, setSortBy] = useState<SortKey>("updatedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value);
  const onStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setStatus(e.target.value as Status);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return campaigns.filter((c) => {
      const matchesQ = c.name.toLowerCase().includes(qq);
      const matchesStatus = status === "All" ? true : c.status === status;
      return matchesQ && matchesStatus;
    });
  }, [q, status, campaigns]);

  const getVal = (c: Campaign, key: SortKey) => {
    switch (key) {
      case "ctr":
        return c.impressions ? c.clicks / c.impressions : 0;
      case "updatedAt":
        return new Date(c.updatedAt).getTime();
      case "budget":
        return c.budget;
      case "impressions":
        return c.impressions;
      case "clicks":
        return c.clicks;
      case "name":
        return c.name.toLowerCase();
      case "status":
        return c.status;
    }
  };

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const va = getVal(a, sortBy);
      const vb = getVal(b, sortBy);
      if (va! < vb!) return sortDir === "asc" ? -1 : 1;
      if (va! > vb!) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortBy, sortDir]);

  const onSort = (key: SortKey) => {
    if (sortBy === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortBy(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        <div className="w-full md:w-72">
          <label htmlFor="q" className="sr-only">Search campaigns</label>
          <input
            id="q"
            value={q}
            onChange={onSearch}
            placeholder="Search campaigns…"
            className="w-full rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label htmlFor="status" className="sr-only">Status</label>
          <select
            id="status"
            value={status}
            onChange={onStatusChange}
            className="rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <span aria-live="polite" className="text-sm text-slate-400">
          {filtered.length} result{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900/60 text-slate-300">
            <tr>
              <H label="Name" k="name" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
              <H label="Status" k="status" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
              <H label="Budget" k="budget" sortBy={sortBy} sortDir={sortDir} onSort={onSort} right />
              <H label="Impr." k="impressions" sortBy={sortBy} sortDir={sortDir} onSort={onSort} right />
              <H label="Clicks" k="clicks" sortBy={sortBy} sortDir={sortDir} onSort={onSort} right />
              <H label="CTR" k="ctr" sortBy={sortBy} sortDir={sortDir} onSort={onSort} right />
              <H label="Updated" k="updatedAt" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
            </tr>
          </thead>
          <tbody>
            {sorted.map((c) => {
              const ctr = c.impressions ? (c.clicks / c.impressions) * 100 : 0;
              return (
                <tr key={c.id} className="border-t border-slate-800 hover:bg-slate-900/40">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        "inline-flex items-center rounded-full px-2.5 py-1 text-xs " +
                        (c.status === "Active"
                          ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-700/40"
                          : c.status === "Paused"
                          ? "bg-amber-500/15 text-amber-300 ring-1 ring-amber-700/40"
                          : "bg-slate-500/15 text-slate-300 ring-1 ring-slate-700/40")
                      }
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">${c.budget.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">{c.impressions.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">{c.clicks.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">{ctr.toFixed(2)}%</td>
                  <td className="px-4 py-3">
                    {new Date(c.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function H({
  label,
  k,
  right,
  sortBy,
  sortDir,
  onSort,
}: {
  label: string;
  k: SortKey;
  right?: boolean;
  sortBy: SortKey;
  sortDir: "asc" | "desc";
  onSort: (key: SortKey) => void;
}) {
  const active = sortBy === k;

  // Map to valid ARIA values
  const ariaSort: "none" | "ascending" | "descending" =
    active ? (sortDir === "asc" ? "ascending" : "descending") : "none";

  const arrow = !active ? "" : sortDir === "asc" ? "▲" : "▼";

  return (
    <th
      scope="col"
      role="button"
      tabIndex={0}
      aria-sort={ariaSort}
      onClick={() => onSort(k)}
      onKeyDown={(e: React.KeyboardEvent<HTMLTableCellElement>) =>
        e.key === "Enter" && onSort(k)
      }
      className={`px-4 py-3 select-none cursor-pointer ${
        right ? "text-right" : "text-left"
      }`}
      title={`Sort by ${label}`}
    >
      {label} {arrow}
    </th>
  );
}

