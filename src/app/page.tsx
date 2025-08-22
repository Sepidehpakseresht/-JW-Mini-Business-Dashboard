import CampaignTable, { type Campaign } from "../components/CampaignTable";

const campaigns: Campaign[] = [
  {
    id: "c1",
    name: "Blockbuster Summer",
    status: "Active",
    budget: 12000,
    impressions: 320000,
    clicks: 12400,
    updatedAt: "2025-08-18T12:00:00Z",
  },
  {
    id: "c2",
    name: "Awards Season Push",
    status: "Paused",
    budget: 8000,
    impressions: 145000,
    clicks: 3100,
    updatedAt: "2025-08-15T10:00:00Z",
  },
  {
    id: "c3",
    name: "Sports Weekend Drive",
    status: "Completed",
    budget: 5000,
    impressions: 98000,
    clicks: 2700,
    updatedAt: "2025-08-10T09:00:00Z",
  },
  {
    id: "c4",
    name: "Console Launch Teaser",
    status: "Active",
    budget: 15000,
    impressions: 410000,
    clicks: 15100,
    updatedAt: "2025-08-20T08:30:00Z",
  },
];

function kpi() {
  const totalBudget = campaigns.reduce((s, c) => s + c.budget, 0);
  const active = campaigns.filter((c) => c.status === "Active").length;
  const paused = campaigns.filter((c) => c.status === "Paused").length;
  const completed = campaigns.filter((c) => c.status === "Completed").length;
  return { totalBudget, active, paused, completed };
}

export default function Page() {
  const { totalBudget, active, paused, completed } = kpi();

  return (
    <main className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-semibold">Business Dashboard (demo)</h1>
        <p className="text-slate-500">
          Simple internal tool UI — search, filter & sort campaigns. Built with Next.js + TypeScript + Tailwind.
        </p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Total Budget" value={`$${totalBudget.toLocaleString()}`} />
        <KpiCard label="Active" value={String(active)} />
        <KpiCard label="Paused" value={String(paused)} />
        <KpiCard label="Completed" value={String(completed)} />
      </section>

      <CampaignTable campaigns={campaigns} />
    </main>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-300 bg-slate-100 text-slate-800 p-4">
      <div className="text-slate-500 text-xs">{label}</div>
      <div className="text-xl md:text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}
