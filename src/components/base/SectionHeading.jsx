// Generic section heading component for reuse across pages
export default function SectionHeading({
  badge,
  title,
  subtitle,
  align = "center",
}) {
  const alignClass =
    align === "left"
      ? "text-start"
      : align === "right"
        ? "text-end"
        : "text-center";

  return (
    <div className={`section-heading mb-5 ${alignClass}`}>
      {badge && (
        <span className="section-badge">
          <i className="bi bi-star-fill me-2" /> {badge}
        </span>
      )}
      <h2 className="section-title mt-3 mb-3">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
}
