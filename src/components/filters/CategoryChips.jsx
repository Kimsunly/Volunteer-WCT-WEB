"use client";
export default function CategoryChips({ active = "all", onChange }) {
  const chips = [
    { key: "all", icon: "bi-stars", label: "ទាំងអស់" },
    { key: "education", icon: "bi-book", label: "អប់រំ" },
    { key: "environment", icon: "bi-tree", label: "បរិស្ថាន" },
    { key: "community", icon: "bi-people", label: "សហគមន៍" },
    { key: "event", icon: "bi-calendar-event", label: "ព្រឹត្តិការណ៍" },
  ];
  return (
    <div className="d-flex flex-wrap gap-2">
      {chips.map((c) => (
        <button
          key={c.key}
          className={`btn btn-sm ${active === c.key ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => onChange?.(c.key)}
        >
          <i className={`bi ${c.icon} me-1`} />
          {c.label}
        </button>
      ))}
    </div>
  );
}
