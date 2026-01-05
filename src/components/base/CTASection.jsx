// Generic reusable CTA section component
// Can be customized with props for different pages
export default function CTASection({
  title,
  description,
  primaryBtnText,
  primaryBtnHref,
  secondaryBtnText,
  backgroundImage,
}) {
  return (
    <section className="cta-section position-relative">
      {backgroundImage && (
        <div
          className="cta-bg"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      <div className="container">
        <div className="cta-wrapper text-center">
          <h2>{title}</h2>
          <p className="lead">{description}</p>
          <div className="d-flex gap-3 justify-content-center">
            <a href={primaryBtnHref} className="btn btn-primary btn-lg">
              {primaryBtnText}
            </a>
            {secondaryBtnText && (
              <button className="btn btn-outline-primary btn-lg">
                {secondaryBtnText}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
