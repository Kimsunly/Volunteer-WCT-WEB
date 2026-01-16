export default function CTAJoin() {
  return (
    <section className="cta-area-modern">
      <div className="container">
        <div className="cta-wrapper">
          <div className="row align-items-center g-5">
            <div className="col-lg-6" data-aos="fade-right">
              <div className="cta-content-modern">
                <span className="cta-badge"><i className="bi bi-star-fill me-2" /> ចាប់ផ្តើមថ្ងៃនេះ</span>
                <h2 className="display-5 fw-bold mb-4">
                  ក្លាយជាស្ម័គ្រចិត្ត <span className="text-gradient">ថ្ងៃនេះ!</span>
                </h2>
                <p className="lead mb-4">
                  កម្ពុជាកំពុងត្រូវការមនុស្សមានចិត្តស្ម័គ្រដូចអ្នក...
                </p>
                <ul className="cta-features list-unstyled mb-4">
                  <li className="mb-3"><i className="bi bi-check-circle-fill text-success me-2" />ចុះឈ្មោះឥតគិតថ្លៃ</li>
                  <li className="mb-3"><i className="bi bi-check-circle-fill text-success me-2" />ជ្រើសរើសកម្មវិធីដែលអ្នកចូលចិត្ត</li>
                  <li className="mb-3"><i className="bi bi-check-circle-fill text-success me-2" />ទទួលបានវិញ្ញាបនប័ត្រ</li>
                </ul>
                <div className="d-flex flex-wrap gap-3">
                  <a href="/auth/login" className="btn btn-cta-primary btn-lg px-5">
                    <i className="bi bi-person-plus-fill me-2" /> ចុះឈ្មោះឥឡូវនេះ <i className="bi bi-arrow-right ms-2" />
                  </a>
                  <a href="#" className="btn btn-cta-outline btn-lg px-5">
                    <i className="bi bi-play-circle me-2" /> មើលវីដេអូ
                  </a>
                </div>
                <div className="social-proof mt-5">
                  <div className="d-flex align-items-center gap-3">
                    <div className="avatar-group">
                      <img src="/images/homepage/testimonial_01.jpg" alt="" className="avatar" />
                      <img src="/images/homepage/testimonial_02.jpg" alt="" className="avatar" />
                      <img src="/images/homepage/testimonial_03.jpg" alt="" className="avatar" />
                      <span className="avatar-more">+650</span>
                    </div>
                    <div>
                      <div className="text-warning mb-1">
                        <i className="bi bi-star-fill" /><i className="bi bi-star-fill" /><i className="bi bi-star-fill" /><i className="bi bi-star-fill" /><i className="bi bi-star-fill" />
                      </div>
                      <small className="text-muted">អ្នកស្ម័គ្រចិត្តជាង 650+ នាក់</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6" data-aos="fade-left" data-aos-delay="200">
              <div className="cta-visual position-relative">
                <div className="image-wrapper">
                  <img src="/images/homepage/cta-phone.png" alt="" className="img-fluid main-img" />
                  <div className="floating-card card-1">
                    <i className="bi bi-people-fill text-primary" />
                    <div className="ms-2">
                      <div className="fw-bold">650+</div>
                      <small className="text-muted">អ្នកស្ម័គ្រចិត្ត</small>
                    </div>
                  </div>
                  <div className="floating-card card-2">
                    <i className="bi bi-heart-fill text-danger" />
                    <div className="ms-2">
                      <div className="fw-bold">125+</div>
                      <small className="text-muted">កម្មវិធី</small>
                    </div>
                  </div>
                </div>
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}