"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getOpportunityById,
  getRelatedOpportunities,
} from "@/data/mockOpportunities";

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [opportunity, setOpportunity] = useState(null);
  const [relatedOpportunities, setRelatedOpportunities] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [commentFormData, setCommentFormData] = useState({
    name: "",
    role: "",
    text: "",
    agree: false,
  });
  const [localComments, setLocalComments] = useState([]);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));

    if (params?.id) {
      const oppData = getOpportunityById(params.id);
      if (oppData) {
        setOpportunity(oppData);
        setLocalComments(oppData.comments || []);
        setRelatedOpportunities(getRelatedOpportunities(params.id, 3));
      } else {
        router.push("/opportunities");
      }
    }
  }, [params?.id, router]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();

    if (
      !commentFormData.name ||
      !commentFormData.role ||
      !commentFormData.text ||
      !commentFormData.agree
    ) {
      return;
    }

    const newComment = {
      id: localComments.length + 1,
      name: commentFormData.name,
      role: commentFormData.role,
      date: new Intl.DateTimeFormat("km-KH", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date()),
      text: commentFormData.text,
    };

    setLocalComments([newComment, ...localComments]);
    setCommentFormData({ name: "", role: "", text: "", agree: false });
  };

  if (!mounted || !opportunity) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-grow-1">
      <div className="container">
        {/* Breadcrumb */}
        <nav
          className="breadcrumb-page"
          style={{ "--bs-breadcrumb-divider": "'>'" }}
          aria-label="breadcrumb"
        >
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link href="/opportunities">ការងារស្ម័គ្រចិត្ត</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {opportunity.title}
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="position-relative mb-5 rounded overflow-hidden">
          <div className="hero-img">
            <Image
              src={opportunity.heroImage}
              alt={opportunity.title}
              width={1200}
              height={600}
              className="img-fluid w-100"
              priority
            />
          </div>
          <div className="hero-overlay position-absolute">
            <h1 className="fw-bold mb-3 text-white">{opportunity.title}</h1>
            <Link
              href={`/opportunities/${params.id}/apply`}
              className="btn btn-primary btn-lg px-4 py-2 rounded-pill fs-5"
            >
              ដាក់ពាក្យឥឡូវនេះ
            </Link>
          </div>
        </div>

        {/* Counter Cards */}
        <div className="row g-4 mb-5">
          {opportunity.counters.map((counter, index) => (
            <div className="col-md-4" key={index}>
              <div
                className={`counter-card ${index === 0 ? "card-green" : index === 1 ? "card-pink" : "card-orange"}`}
              >
                <span className="fs-1">{counter.icon}</span>
                <h3>{counter.value}</h3>
                <p>{counter.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Program Info and Quick Info */}
        <div className="row g-5 mb-5">
          <div className="col-lg-7">
            <div className="program-info">
              <h3 className="section-heading">ព័ត៌មានទូទៅអំពីកម្មវិធី</h3>
              <p className="mb-4">{opportunity.programInfo}</p>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="card p-4 shadow-sm rounded-4 card-info">
              <h5 className="mb-3">ព័ត៌មានរហ័ស</h5>
              <div className="quick-info">
                <ul>
                  <li className="d-flex align-items-center mb-2">
                    <i className="bi bi-calendar3 me-3 text-primary"></i>
                    <strong className="me-2">កាលបរិច្ឆេទ:</strong>{" "}
                    {opportunity.date}
                  </li>
                  <li className="d-flex align-items-center mb-2">
                    <i className="bi bi-clock me-3 text-primary"></i>
                    <strong className="me-2">ពេលវេលា:</strong>{" "}
                    {opportunity.time}
                  </li>
                  <li className="d-flex align-items-center mb-2">
                    <i className="bi bi-people me-3 text-primary"></i>
                    <strong className="me-2">ប្រភេទកម្មវិធី:</strong>{" "}
                    {opportunity.type}
                  </li>
                  <li className="d-flex align-items-center mb-2">
                    <i className="bi bi-geo-alt me-3 text-primary"></i>
                    <strong className="me-2">ទីតាំង:</strong>{" "}
                    {opportunity.location}
                  </li>
                  {opportunity.benefits.length > 0 && (
                    <li className="d-flex align-items-center mb-2">
                      <i className="bi bi-gift me-3 text-primary"></i>
                      <strong className="me-2">ផលប្រយោជន៍:</strong>{" "}
                      {opportunity.benefits.join(", ")}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Skills and Tasks */}
          <div className="col-lg-6">
            <h3 className="section-heading">
              ជំនាញដែលត្រូវការសម្រាប់ស្ម័គ្រចិត្ត
            </h3>
            <div className="skill-require">
              <ul>
                {opportunity.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-lg-6">
            <h3 className="section-heading">ភារកិច្ចសំខាន់ៗ</h3>
            <div className="tasks">
              <ul>
                {opportunity.tasks.map((task, index) => (
                  <li key={index}>{task}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Impact and Testimonials */}
        <section className="impact-testimonials p-5 rounded-4 shadow mb-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h3 className="section-heading mb-4">🌱 ផលប៉ះពាល់របស់យើង</h3>
              <p className="lead">{opportunity.impact.description}</p>
              <div className="row mt-4">
                {opportunity.impact.stats.map((stat, index) => (
                  <div className="col-6 mb-3" key={index}>
                    <h4 className="fw-bold display-5">{stat.value}</h4>
                    <p className="mb-0">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-6">
              <h3 className="section-heading text-white mb-4">
                🗣️ អ្វីដែលពួកគេនិយាយ
              </h3>
              {opportunity.testimonials.map((testimonial, index) => (
                <div
                  className="card bg-white text-dark p-4 rounded-4 shadow-sm mb-3 feedback"
                  key={index}
                >
                  <div className="d-flex align-items-center mb-3">
                    <Image
                      src={testimonial.image}
                      className="rounded-circle me-3"
                      alt={testimonial.name}
                      width={50}
                      height={50}
                    />
                    <div>
                      <h5 className="mb-0 fw-bold">{testimonial.name}</h5>
                      <small className="text-muted">{testimonial.role}</small>
                    </div>
                  </div>
                  <p className="mb-0">{testimonial.quote}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="mb-5">
          <h3 className="section-heading">រូបថតសកម្មភាព</h3>
          <div className="row g-4">
            {opportunity.images.slice(0, 6).map((img, index) => (
              <div
                className="col-md-4"
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div
                  className="position-relative overflow-hidden rounded-3 shadow-sm"
                  style={{ height: "280px" }}
                >
                  <Image
                    src={img}
                    alt={`សកម្មភាព ${index + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                    className="hover-zoom transition-all"
                  />
                  <div className="position-absolute bottom-0 start-0 w-100 bg-gradient-dark p-3 opacity-0 hover-opacity-100 transition-opacity">
                    <p className="text-white mb-0 small">
                      <i className="bi bi-camera-fill me-2"></i>
                      រូបភាពសកម្មភាព {index + 1}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <style jsx>{`
            .hover-zoom {
              transition: transform 0.4s ease;
            }
            .hover-zoom:hover {
              transform: scale(1.1);
            }
            .hover-opacity-100 {
              transition: opacity 0.3s ease;
            }
            .hover-opacity-100:hover {
              opacity: 1 !important;
            }
            .bg-gradient-dark {
              background: linear-gradient(
                to top,
                rgba(0, 0, 0, 0.7),
                transparent
              );
            }
          `}</style>
        </section>

        {/* Organization Info */}
        <div className="mb-5 organization">
          <h3 className="section-heading">អំពីអង្គការ</h3>
          <p>{opportunity.organizationInfo}</p>
        </div>

        {/* Comments Section */}
        <section className="mb-5" id="opportunity-comments">
          <div className="d-flex align-items-center mb-3">
            <h3 className="section-heading mb-0 me-3">💬 មតិយោបល់ពីកម្មវិធី</h3>
            <span className="badge bg-primary-soft text-primary border border-primary px-3 py-2">
              សម្រាប់ទស្សនិកជនដែលមើលលម្អិត
            </span>
          </div>
          <div className="row g-4">
            <div className="col-lg-5">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="mb-3">សេចក្តីណែនាំខ្លី</h5>
                  <ul className="list-unstyled small mb-3">
                    <li className="mb-2">
                      <strong>Guest:</strong> មើលលម្អិតបាន
                      ប៉ុន្តែមិនអាចបញ្ចេញមតិយោបល់ ឬចុះឈ្មោះ។
                    </li>
                    <li className="mb-2">
                      <strong>User:</strong> អាចបញ្ចេញមតិយោបល់
                      និងចុះឈ្មោះចូលរួមកម្មវិធី។
                    </li>
                    <li className="mb-2">
                      <strong>Organizer:</strong> អាចគ្រប់គ្រង
                      និងឆ្លើយតបមតិយោបល់លើកម្មវិធីរបស់ខ្លួន។
                    </li>
                    <li className="mb-2">
                      <strong>Admin:</strong> អាចសម្រេច និងលុបមតិយោបល់។
                    </li>
                  </ul>
                  <p className="small text-muted mb-0">
                    សូមគោរពសុចរិតធម៌ ឆ្លើយតបដោយក្តីគោរព
                    និងកុំផ្ទុកព័ត៌មានផ្ទាល់ខ្លួន។
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="mb-3">បញ្ចេញមតិយោបល់</h5>
                  <form
                    onSubmit={handleCommentSubmit}
                    className="needs-validation"
                  >
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="commentName" className="form-label">
                          ឈ្មោះ
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="commentName"
                          placeholder="ឧ. សុខ សុភ័ក្រ"
                          value={commentFormData.name}
                          onChange={(e) =>
                            setCommentFormData({
                              ...commentFormData,
                              name: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="commentRole" className="form-label">
                          តួនាទី
                        </label>
                        <select
                          className="form-select"
                          id="commentRole"
                          value={commentFormData.role}
                          onChange={(e) =>
                            setCommentFormData({
                              ...commentFormData,
                              role: e.target.value,
                            })
                          }
                          required
                        >
                          <option value="">ជ្រើសរើសតួនាទី</option>
                          <option value="User">User</option>
                          <option value="Organizer">Organizer</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label htmlFor="commentText" className="form-label">
                          មតិយោបល់
                        </label>
                        <textarea
                          className="form-control"
                          id="commentText"
                          rows="4"
                          placeholder="បញ្ជាក់អ្វីដែលអ្នកចូលចិត្ត ឬអ្វីដែលត្រូវកែលម្អ..."
                          value={commentFormData.text}
                          onChange={(e) =>
                            setCommentFormData({
                              ...commentFormData,
                              text: e.target.value,
                            })
                          }
                          required
                        ></textarea>
                      </div>
                      <div className="col-12 form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="commentAgree"
                          checked={commentFormData.agree}
                          onChange={(e) =>
                            setCommentFormData({
                              ...commentFormData,
                              agree: e.target.checked,
                            })
                          }
                          required
                        />
                        <label
                          className="form-check-label"
                          htmlFor="commentAgree"
                        >
                          ខ្ញុំយល់ព្រមគោរពសុចរិតធម៌ និងច្បាប់កំណត់របស់វេទិកា
                        </label>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2 mt-3">
                      <button type="submit" className="btn btn-primary">
                        បោះពុម្ពមតិយោបល់
                      </button>
                      <small className="text-muted">
                        សម្រាប់ UI សាកល្បង មតិយោបល់នឹងបង្ហាញភ្លាមៗ
                      </small>
                    </div>
                  </form>
                  <hr className="my-4" />
                  <div className="d-flex align-items-center mb-3">
                    <h6 className="mb-0">មតិយោបល់ចុងក្រោយ</h6>
                    <span className="badge bg-light text-dark ms-2">
                      {localComments.length}
                    </span>
                  </div>
                  <div className="d-flex flex-column gap-3">
                    {localComments.map((comment) => (
                      <div
                        className="border rounded-3 p-3 bg-white shadow-sm"
                        key={comment.id}
                      >
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <strong>{comment.name}</strong>
                            <span
                              className={`badge ${
                                comment.role === "Organizer"
                                  ? "bg-success"
                                  : comment.role === "Admin"
                                    ? "bg-danger"
                                    : "bg-primary"
                              } ms-2`}
                            >
                              {comment.role}
                            </span>
                          </div>
                          <small className="text-muted">{comment.date}</small>
                        </div>
                        <p className="mb-0">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <div className="contact-card mb-5">
          <h3 className="section-heading mb-4">ព័ត៌មានទំនាក់ទំនង</h3>
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="card shadow border-0 rounded-4 p-4 h-100">
                <div className="d-flex align-items-center">
                  <div className="icon-circle bg-primary text-white me-3">
                    <i className="bi bi-globe fs-4"></i>
                  </div>
                  <div>
                    <h5 className="mb-1">គេហទំព័រ</h5>
                    <a
                      href={`https://${opportunity.contact.website}`}
                      className="text-decoration-none text-dark fw-semibold hover-link"
                    >
                      {opportunity.contact.website}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card shadow border-0 rounded-4 p-4 h-100">
                <h5 className="mb-3">អ៊ីមែល & លេខទូរស័ព្ទ</h5>
                <div className="row gap-1">
                  <div className="col-6">
                    <p className="mb-2 d-flex align-items-center">
                      <i className="bi bi-envelope-fill text-primary me-2"></i>
                      <a
                        href={`mailto:${opportunity.contact.email}`}
                        className="text-dark fw-semibold hover-link"
                      >
                        {opportunity.contact.email}
                      </a>
                    </p>
                  </div>
                  <div className="col-6">
                    <p className="d-flex align-items-center">
                      <i className="bi bi-telephone-fill text-primary me-2"></i>
                      <a
                        href={`tel:${opportunity.contact.phone}`}
                        className="text-dark fw-semibold hover-link"
                      >
                        {opportunity.contact.phone}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="card shadow border-0 rounded-4 py-4 px-5">
                <div className="row">
                  <div className="col-lg-4 mb-3 mb-lg-0">
                    <h5>តាមដានយើង</h5>
                    <div className="d-flex pt-2">
                      <a
                        href={opportunity.contact.social.facebook}
                        className="social-icon me-3"
                      >
                        <i className="bi bi-facebook"></i>
                      </a>
                      <a
                        href={opportunity.contact.social.twitter}
                        className="social-icon me-3"
                      >
                        <i className="bi bi-twitter"></i>
                      </a>
                      <a
                        href={opportunity.contact.social.telegram}
                        className="social-icon me-3"
                      >
                        <i className="bi bi-telegram"></i>
                      </a>
                      <a
                        href={opportunity.contact.social.linkedin}
                        className="social-icon me-3"
                      >
                        <i className="bi bi-linkedin"></i>
                      </a>
                      <a
                        href={opportunity.contact.social.instagram}
                        className="social-icon"
                      >
                        <i className="bi bi-instagram"></i>
                      </a>
                    </div>
                  </div>
                  <div className="col-lg-4 mb-3 mb-lg-0">
                    <h5>ម៉ោងធ្វើការ</h5>
                    <p className="mb-0">
                      <i className="bi bi-clock text-warning me-2"></i>
                      {opportunity.contact.workingHours}
                    </p>
                  </div>
                  <div className="col-lg-4">
                    <h5>អាសយដ្ឋាន</h5>
                    <p className="mb-0">
                      <i className="bi bi-geo-alt text-danger me-2"></i>
                      {opportunity.contact.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <section className="courage-card text-center text-white p-5 rounded-4 mb-5 shadow-lg">
          <h2 className="fw-bold display-5 mb-4">
            🚀 ត្រៀមខ្លួនសម្រាប់ការផ្លាស់ប្តូរជីវិត?
          </h2>
          <Link
            href={`/opportunities/${params.id}/apply`}
            className="btn btn-outline-light btn-lg mx-2 my-2 px-4 py-2 rounded-pill fw-bold"
          >
            ដាក់ពាក្យឥឡូវនេះ
          </Link>
          <button
            type="button"
            className="btn btn-outline-light btn-lg mx-2 my-2 px-4 py-2 rounded-pill fw-bold"
            data-bs-toggle="modal"
            data-bs-target="#shareModal"
          >
            ចែករំលែក
          </button>
        </section>

        {/* Related Opportunities */}
        <section className="mb-5">
          <h3 className="section-heading">🔎 កម្មវិធីស្ម័គ្រចិត្តផ្សេងទៀត</h3>
          <div className="row g-4">
            {relatedOpportunities.map((related) => (
              <div className="col-lg-4" key={related.id}>
                <div className="card shadow-lg h-100">
                  <Link href={`/opportunities/${related.id}`}>
                    <Image
                      src={related.heroImage}
                      className="card-img-top"
                      alt={related.title}
                      width={400}
                      height={250}
                    />
                  </Link>
                  <div className="card-body d-flex flex-column">
                    <h3 className="card-title fw-medium fs-4">
                      {related.title}
                    </h3>
                    <div className="location mb-2">
                      <i className="bi bi-geo-alt-fill"></i>
                      <span>{related.location}</span>
                    </div>
                    <p className="card-text mb-1">{related.description}</p>
                    <p className="small mb-3 text-orgainzation">
                      រៀបចំដោយ: {related.organization}
                    </p>
                    <div className="mt-auto">
                      <div className="card-action d-flex justify-content-between">
                        <Link
                          href={`/opportunities/${related.id}`}
                          className="btn btn-outline-primary"
                        >
                          ព័ត៌មានលម្អិត
                        </Link>
                        <Link
                          href={`/opportunities/${related.id}/apply`}
                          className="btn btn-primary"
                        >
                          ដាក់ពាក្យ
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Share Modal */}
      <div
        className="modal fade"
        id="shareModal"
        tabIndex="-1"
        aria-labelledby="shareModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="shareModalLabel">
                ចែករំលែក
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <ul className="d-flex gap-3">
                <li>
                  <a href="#" className="social-icon">
                    <i className="bi bi-facebook"></i>
                  </a>
                </li>
                <li>
                  <a href="#" className="social-icon">
                    <i className="bi bi-twitter"></i>
                  </a>
                </li>
                <li>
                  <a href="#" className="social-icon">
                    <i className="bi bi-telegram"></i>
                  </a>
                </li>
                <li>
                  <a href="#" className="social-icon">
                    <i className="bi bi-linkedin"></i>
                  </a>
                </li>
                <li>
                  <a href="#" className="social-icon">
                    <i className="bi bi-instagram"></i>
                  </a>
                </li>
              </ul>
              <div className="text-start mt-3">
                <h5 className="mb-3">គេហទំព័រ Link</h5>
                <button
                  className="btn btn-secondary rounded-pill"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied!");
                  }}
                >
                  📋 គេហទំព័រ Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
