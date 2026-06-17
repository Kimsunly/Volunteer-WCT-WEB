import Link from "next/link";
import { benefitsSectionContent as defaultContent } from "@/data/benefits";

export default function BenefitsGrid() {
  const { badge, title, subtitle, cards, cta } = defaultContent;

  return (
    <section className="benefits-modern position-relative">
      <div className="container">
        <div className="text-center mb-5" data-aos="fade-up">
          <span className="benefits-badge">
            <i className={badge.icon} /> {badge.label}
          </span>
          <h2 className="benefits-title mt-3 mb-3">{title}</h2>
          <p className="benefits-subtitle mx-auto">{subtitle}</p>
        </div>

        <div className="row g-4">
          {cards.map((card, idx) => (
            <div
              className="col-md-6 col-lg-4"
              key={card.title}
              data-aos="fade-up"
              data-aos-delay={(idx + 1) * 100}
            >
              <div className={`benefit-card ${card.color}`}>
                <div className="benefit-icon-wrapper">
                  <div className="benefit-icon">
                    <img src={card.icon} alt={card.title} />
                  </div>
                  <div className="benefit-glow"></div>
                </div>
                <h3 className="benefit-title">{card.title}</h3>
                <ul className="benefit-list">
                  {card.points.map((point) => (
                    <li key={point}>
                      <i className="bi bi-check-circle-fill" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="benefit-pattern"></div>
              </div>
            </div>
          ))}

          <div
            className="col-md-6 col-lg-4"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <div className="benefit-cta-card">
              <div className="cta-icon">
                <i className={cta.icon} />
              </div>
              <h3>{cta.title}</h3>
              <p>{cta.description}</p>
              <Link href={cta.href} className="cta-button">
                <span>{cta.label}</span>
                <i className="bi bi-arrow-right" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
