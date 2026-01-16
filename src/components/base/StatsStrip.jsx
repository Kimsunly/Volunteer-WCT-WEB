// Generic stats strip component - can be customized for different pages
export default function StatsStrip({ stats }) {
  return (
    <section className="stats-strip">
      <div className="container">
        <div className="row">
          {stats.map((stat, idx) => (
            <div key={idx} className="col-6 col-md-3">
              <div className="stat-item text-center">
                {stat.icon && <i className={`bi ${stat.icon} mb-2 fs-3`} />}
                <h3 className="fw-bold">{stat.value}</h3>
                <p className="text-muted mb-0">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
