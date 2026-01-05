"use client";

export default function HeroBanner() {
  return (
    <section className="hero-banner position-relative overflow-hidden">
      {/* Content stays on top of slides */}
      <div
        className="hero-content position-absolute top-50 start-50 translate-middle text-center w-100"
        style={{ zIndex: 5 }}
      >
        <div className="container d-flex justify-content-center">
          <div className="hero-content-inner text-center position-relative">
            <div className="hero-badge mb-3 animate__animated animate__bounceIn animate__delay-1s">
              <span className="badge bg-light text-primary px-4 py-2 rounded-pill">
                <i className="bi bi-heart-fill text-danger me-2" />
                ចូលរួមជាមួយយើង ២០២៥
              </span>
            </div>

            <h1 className="hero-title lead fw-bold display-4 text-white mb-4">
              តោះ! ចូលរួមស្ម័គ្រចិត្តទាំងអស់គ្នា
            </h1>

            <p className="hero-decript lead mt-3 line-3 text-white mb-5">
              ការស្ម័គ្រចិត្តធ្វើឱ្យសង្គមប្រមូលផ្តុំជាធ្លុងមួយ
              ដើម្បីរួមគ្នាអភិវឌ្ឍសហគមន៍
              និងថែមទាំងផ្តល់ជាមធ្យោបាយសម្រាប់ឱ្យប្រជាជន បង្ហាញពីតម្លៃរបស់ពួកគេ
              និងបញ្ជាក់សាជាថ្មីថាពួកគេមានចំណែកដ៏មានសារៈសំខាន់សម្រាប់សង្គម។
            </p>

            <div className="hero-action d-flex gap-3 justify-content-center mb-5">
              <button
                type="button"
                className="btn hero-contact btn-lg shadow-sm"
              >
                <i className="bi bi-envelope-fill me-2" />
                ទាក់ទងមកយើង
              </button>
              <button
                type="button"
                className="btn as-volunteer btn-lg shadow-sm"
              >
                <i className="bi bi-people-fill me-2" />
                ក្លាយជាអ្នកស្ម័គ្រចិត្ត
              </button>
            </div>

            <div className="hero-stats animate__animated animate__fadeInUp animate__delay-2s">
              <div className="row g-3 justify-content-center">
                <div className="col-4 col-md-3">
                  <div className="stat-card bg-white bg-opacity-10 backdrop-blur rounded-3 p-3">
                    <h4 className="text-white fw-bold mb-0">650+</h4>
                    <small className="text-white-50">អ្នកស្ម័គ្រចិត្ត</small>
                  </div>
                </div>
                <div className="col-4 col-md-3">
                  <div className="stat-card bg-white bg-opacity-10 backdrop-blur rounded-3 p-3">
                    <h4 className="text-white fw-bold mb-0">125+</h4>
                    <small className="text-white-50">កម្មវិធី</small>
                  </div>
                </div>
                <div className="col-4 col-md-3">
                  <div className="stat-card bg-white bg-opacity-10 backdrop-blur rounded-3 p-3">
                    <h4 className="text-white fw-bold mb-0">300+</h4>
                    <small className="text-white-50">ក្មេងទទួលអប់រំ</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slides under content */}
      <div className="hero-slide h-100 position-relative">
        <div
          className="carousel slide carousel-fade h-100 position-relative"
          data-bs-ride="carousel"
          id="heroCarousel"
          style={{ zIndex: 2 }}
        >
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide-to="0"
              className="active"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
          </div>

          <div className="carousel-inner h-100">
            <div className="carousel-item active h-100" data-bs-interval="3500">
              <img
                src="/images/homepage/3.Banner.jpg"
                className="d-block w-100 h-100 object-fit-cover"
                alt="Banner 1"
              />
            </div>
            <div className="carousel-item h-100" data-bs-interval="3500">
              <img
                src="/images/homepage/2.Banner.jpg"
                className="d-block w-100 h-100 object-fit-cover"
                alt="Banner 2"
              />
            </div>
            <div className="carousel-item h-100" data-bs-interval="3500">
              <img
                src="/images/homepage/4.banner.jpg"
                className="d-block w-100 h-100 object-fit-cover"
                alt="Banner 3"
              />
            </div>
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide="prev"
            style={{ zIndex: 6 }}
          >
            <span className="carousel-control-prev-icon"></span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide="next"
            style={{ zIndex: 6 }}
          >
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>

        {/* Overlay for readability; ignore clicks so arrows stay usable */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.55))",
            zIndex: 3,
            pointerEvents: "none",
          }}
        />
      </div>
    </section>
  );
}
