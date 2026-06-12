"use client";

export default function ActivityImagesGrid({ images = [] }) {
  // Default static images if no images provided
  const defaultImages = [
    "/images/homepage/opportunity_01.jpg",
    "/images/homepage/opportunity_02.jpg",
    "/images/homepage/opportunity_03.jpg",
    "/images/homepage/opportunity_04.jpg",
    "/images/homepage/opportunity_05.jpg",
    "/images/homepage/opportunity_06.jpg",
  ];

  const displayImages = images.length > 0 ? images.slice(0, 6) : defaultImages;

  return (
    <section className="activity-images-area py-5">
      <div className="container">
        <div className="section-header mb-4" data-aos="fade-up">
          <div className="section-title-wrapper text-center">
            <h2 className="section-title my-5">រូបភាពសកម្មភាព</h2>
            <p className="section-decript mb-0 text-muted">
              សកម្មភាពស្ម័គ្រចិត្តរបស់យើង
            </p>
          </div>
        </div>

        <div className="row g-3">
          {displayImages.map((image, index) => (
            <div
              key={index}
              className="col-12 col-sm-6 col-md-4"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="activity-image-card position-relative overflow-hidden rounded-4">
                <img
                  src={image}
                  alt={`Activity ${index + 1}`}
                  className="w-100 h-100 object-fit-cover"
                  style={{ height: "250px", cursor: "pointer" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/placeholder.png";
                  }}
                />
                <div className="position-absolute bottom-0 start-0 end-0 bg-gradient-dark p-3">
                  <span className="text-white small">
                    សកម្មភាព {index + 1}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .activity-image-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .activity-image-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }
        .activity-image-card img {
          transition: transform 0.5s ease;
        }
        .activity-image-card:hover img {
          transform: scale(1.05);
        }
        .bg-gradient-dark {
          background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
        }
      `}</style>
    </section>
  );
}
