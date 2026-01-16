"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getOpportunityById, listOpportunities } from "@/services/opportunities";
import { getComments, createComment } from "@/services/comments";
import toast from "react-hot-toast";

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [opportunity, setOpportunity] = useState(null);
  const [relatedOpportunities, setRelatedOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [commentFormData, setCommentFormData] = useState({
    text: "",
    agree: false,
  });
  const [localComments, setLocalComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!params || !params.id) return;

      setLoading(true);
      try {
        const data = await getOpportunityById(params.id);

        // Transform backend data to frontend model
        const transformedOpp = {
          ...data,
          heroImage: data.images ? (typeof data.images === 'string' ? data.images.split(',')[0] : data.images[0]) : "/placeholder.png",
          images: data.images ? (typeof data.images === 'string' ? data.images.split(',') : data.images) : [],
          programInfo: data.description || "មិនមានព័ត៌មានលម្អិតសម្រាប់កម្មវិធីនេះទេ។",
          date: data.date_range ? new Date(data.date_range).toLocaleDateString() : "TBD",
          time: data.time_range || "TBD",
          type: data.category_label || "Volunteer",
          location: data.location_label || "Other",
          benefits: [
            data.transport && `ការដឹកជញ្ជូន: ${data.transport}`,
            data.housing && `កន្លែងស្នាក់នៅ: ${data.housing}`,
            data.meals && `អាហារ: ${data.meals}`
          ].filter(Boolean),

          // Use dynamic data from API with fallbacks
          counters: [
            { icon: "🫂", value: data.capacity || "50+", label: "អ្នកស្ម័គ្រចិត្តត្រូវការ" },
            { icon: "📍", value: data.location_label || "កម្ពុជា", label: "ទីតាំងគម្រោង" },
            { icon: "✨", value: data.popularity_level || "ពេញនិយម", label: "កម្រិតកម្មវិធី" }
          ],
          skills: data.skills || ["ការប្រាស្រ័យទាក់ទង", "ការធ្វើការជាក្រុម", "ភាពអំណត់"],
          tasks: data.tasks || ["ជួយរៀបចំកម្មវិធី", "សម្របសម្រួលសកម្មភាព", "រៀបចំរបាយការណ៍សង្ខេប"],
          impact: {
            description: data.impact_description || "កម្មវិធីនេះមានគោលបំណងបង្កើតផលប៉ះពាល់វិជ្ជមានលើសហគមន៍មូលដ្ឋាន និងបរិស្ថានតាមរយៈកិច្ចខិតខំប្រឹងប្រែងរួមគ្នា។",
            stats: data.impact_stats ? Object.entries(data.impact_stats).map(([key, value]) => ({ value, label: key })) : [
              { value: "500+", label: "អ្នកទទួលផល" },
              { value: "20+", label: "គម្រោងបានជោគជ័យ" }
            ]
          },
          testimonials: data.testimonials || [
            { name: "សុខ ពិសិដ្ឋ", role: "អ្នកស្ម័គ្រចិត្តអតីតកាល", image: "/images/testimonials/user-1.png", quote: "វាជាបទពិសោធន៍ដ៏អស្ចារ្យដែលខ្ញុំមិនអាចបំភ្លេចបាន។" }
          ],
          organizationInfo: `អង្គការ ${data.organization || 'ដៃគូស្ម័គ្រចិត្ត'} ប្តេជ្ញាចិត្តក្នុងការលើកកម្ពស់ការចូលរួមសង្គមក្នុងចំណោមយុវជន។`,
          contact: {
            website: data.contact_website || "www.volunteer-wct.org",
            email: data.contact_email || "contact@example.com",
            phone: data.contact_phone || "+855 12 345 678",
            social: data.contact_social || { facebook: "#", twitter: "#", telegram: "#", linkedin: "#", instagram: "#" },
            workingHours: data.contact_hours || "ម៉ោង ៨:០០ ព្រឹក - ៥:០០ ល្ងាច",
            address: data.contact_address || data.location_label || "ភ្នំពេញ"
          }
        };

        setOpportunity(transformedOpp);

        // Fetch comments
        fetchComments(params.id);

        // Fetch related opportunities (mock for now or list others)
        const others = await listOpportunities({ pageSize: 3 });
        setRelatedOpportunities(others.items ? others.items.filter(o => String(o.id) !== String(params.id)).slice(0, 3) : []);

      } catch (err) {
        console.error("Error fetching opportunity:", err);
        setError("មិនអាចស្វែងរកកម្មវិធីដែលអ្នកចង់បាន។");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params?.id, router]);

  const fetchComments = async (id) => {
    setCommentsLoading(true);
    try {
      const data = await getComments("opportunity", String(id));
      setLocalComments(data.comments || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
      // Gracefully handle error - don't break the page
      setLocalComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentFormData.text || !commentFormData.agree) return;

    try {
      await createComment(commentFormData.text, "opportunity", String(params.id));
      toast.success("បានបញ្ចេញមតិដោយជោគជ័យ");
      setCommentFormData({ text: "", agree: false });
      fetchComments(params.id);
    } catch (err) {
      toast.error("បរាជ័យក្នុងការបញ្ចេញមតិ។ សូមប្រាកដថាអ្នកបានចូលក្នុងគណនី។");
    }
  };

  if (loading) {
    return (
      <main className="flex-grow-1">
        <div className="container" style={{ marginTop: "120px" }}>
          {/* Breadcrumb Skeleton */}
          <div className="mb-4">
            <div className="placeholder-glow">
              <span className="placeholder col-3"></span>
            </div>
          </div>

          {/* Hero Image Skeleton */}
          <div className="position-relative mb-5 rounded overflow-hidden shadow-lg" style={{ height: '400px', backgroundColor: '#e9ecef' }}>
            <div className="placeholder-glow w-100 h-100"></div>
          </div>

          {/* Counter Cards Skeleton */}
          <div className="row g-4 mb-5">
            {[1, 2, 3].map((i) => (
              <div className="col-md-4" key={i}>
                <div className="card shadow-sm p-4">
                  <div className="placeholder-glow">
                    <span className="placeholder col-12 mb-2" style={{ height: '60px' }}></span>
                    <span className="placeholder col-8"></span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Content Skeleton */}
          <div className="row g-5 mb-5">
            <div className="col-lg-7">
              <div className="placeholder-glow">
                <span className="placeholder col-12 mb-3" style={{ height: '30px' }}></span>
                <span className="placeholder col-12 mb-2"></span>
                <span className="placeholder col-12 mb-2"></span>
                <span className="placeholder col-10"></span>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="card p-4 shadow-sm">
                <div className="placeholder-glow">
                  <span className="placeholder col-12 mb-3" style={{ height: '25px' }}></span>
                  <span className="placeholder col-12 mb-2"></span>
                  <span className="placeholder col-12 mb-2"></span>
                  <span className="placeholder col-8"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="container py-5 text-center my-5 shadow-sm rounded">
        <i className="bi bi-exclamation-octagon fs-1 text-danger"></i>
        <h2 className="mt-3">{error || "រកមិនឃើញកម្មវិធី"}</h2>
        <Link href="/opportunities" className="btn btn-primary mt-3">ត្រឡប់ទៅការងារស្ម័គ្រចិត្តវិញ</Link>
      </div>
    );
  }

  return (
    <main className="flex-grow-1">
      <div className="container">
        {/* Breadcrumb */}
        <nav
          className="breadcrumb-page"
          style={{ "--bs-breadcrumb-divider": "'>'", marginTop: "120px" }}
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
        <div className="position-relative mb-5 rounded overflow-hidden shadow-lg">
          <div className="hero-img" style={{ height: '400px', overflow: 'hidden' }}>
            <img
              src={opportunity.heroImage}
              alt={opportunity.title}
              className="img-fluid w-100 h-100"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="hero-overlay position-absolute bottom-0 start-0 w-100 p-4 bg-dark bg-opacity-50 text-white">
            <h1 className="fw-bold mb-3">{opportunity.title}</h1>
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
                className={`counter-card ${index === 0 ? "card-green" : index === 1 ? "card-pink" : "card-orange"} shadow-sm`}
              >
                <span className="fs-1">{counter.icon}</span>
                <h3 className="fw-bold">{counter.value}</h3>
                <p className="mb-0">{counter.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Program Info and Quick Info */}
        <div className="row g-5 mb-5">
          <div className="col-lg-7">
            <div className="program-info">
              <h3 className="section-heading mb-4 border-bottom pb-2">ព័ត៌មានទូទៅអំពីកម្មវិធី</h3>
              <p className="mb-4 text-secondary leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>{opportunity.programInfo}</p>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="card p-4 shadow-sm rounded-4 card-info border-0 bg-light">
              <h5 className="mb-4 fw-bold">ព័ត៌មានរហ័ស</h5>
              <div className="quick-info">
                <ul className="list-unstyled">
                  <li className="d-flex align-items-center mb-3">
                    <i className="bi bi-calendar3 me-3 text-primary fs-5"></i>
                    <div>
                      <strong className="d-block small text-muted">កាលបរិច្ឆេទ:</strong>
                      <span>{opportunity.date}</span>
                    </div>
                  </li>
                  <li className="d-flex align-items-center mb-3">
                    <i className="bi bi-clock me-3 text-primary fs-5"></i>
                    <div>
                      <strong className="d-block small text-muted">ពេលវេលា:</strong>
                      <span>{opportunity.time}</span>
                    </div>
                  </li>
                  <li className="d-flex align-items-center mb-3">
                    <i className="bi bi-people me-3 text-primary fs-5"></i>
                    <div>
                      <strong className="d-block small text-muted">ប្រភេទកម្មវិធី:</strong>
                      <span>{opportunity.type}</span>
                    </div>
                  </li>
                  <li className="d-flex align-items-center mb-3">
                    <i className="bi bi-geo-alt me-3 text-primary fs-5"></i>
                    <div>
                      <strong className="d-block small text-muted">ទីតាំង:</strong>
                      <span>{opportunity.location}</span>
                    </div>
                  </li>
                  {opportunity.benefits && opportunity.benefits.length > 0 && (
                    <li className="d-flex align-items-start mb-3">
                      <i className="bi bi-gift me-3 text-primary fs-5"></i>
                      <div>
                        <strong className="d-block small text-muted">ផលប្រយោជន៍:</strong>
                        <div className="d-flex flex-wrap gap-1 mt-1">
                          {opportunity.benefits.map((b, i) => (
                            <span key={i} className="badge bg-white text-dark border">{b}</span>
                          ))}
                        </div>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Skills and Tasks */}
          <div className="col-lg-6">
            <h3 className="section-heading mb-3 border-bottom pb-2">
              ជំនាញដែលត្រូវការ
            </h3>
            <div className="skill-require">
              <ul className="list-group list-group-flush bg-transparent">
                {opportunity.skills.map((skill, index) => (
                  <li key={index} className="list-group-item bg-transparent px-0 border-0">
                    <i className="bi bi-check2-circle text-success me-2"></i>{skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-lg-6">
            <h3 className="section-heading mb-3 border-bottom pb-2">ភារកិច្ចសំខាន់ៗ</h3>
            <div className="tasks">
              <ul className="list-group list-group-flush bg-transparent">
                {opportunity.tasks.map((task, index) => (
                  <li key={index} className="list-group-item bg-transparent px-0 border-0">
                    <i className="bi bi-megaphone text-info me-2"></i>{task}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Impact and Testimonials */}
        <section className="impact-testimonials p-5 rounded-4 shadow mb-5" style={{ background: 'linear-gradient(135deg, #2c3e50, #4ca1af)' }}>
          <div className="row align-items-center">
            <div className="col-lg-6 text-white text-md-start text-center mb-lg-0 mb-5">
              <h3 className="section-heading mb-4 text-white">🌱 ផលប៉ះពាល់របស់យើង</h3>
              <p className="lead opacity-75">{opportunity.impact.description}</p>
              <div className="row mt-4">
                {opportunity.impact.stats.map((stat, index) => (
                  <div className="col-6 mb-3" key={index}>
                    <h4 className="fw-bold display-5 text-white">{stat.value}</h4>
                    <p className="mb-0 opacity-75">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-6">
              <h3 className="section-heading text-white mb-4 text-md-start text-center">
                🗣️ អ្វីដែលពួកគេនិយាយ
              </h3>
              {opportunity.testimonials.map((testimonial, index) => (
                <div
                  className="card bg-white text-dark p-4 rounded-4 shadow-sm mb-3 feedback border-0"
                  key={index}
                >
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={testimonial.image}
                      className="rounded-circle me-3"
                      alt={testimonial.name}
                      width={50}
                      height={50}
                      style={{ objectFit: 'cover' }}
                    />
                    <div>
                      <h5 className="mb-0 fw-bold">{testimonial.name}</h5>
                      <small className="text-muted">{testimonial.role}</small>
                    </div>
                  </div>
                  <p className="mb-0 font-italic">"{testimonial.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery */}
        {opportunity.images && opportunity.images.length > 0 && (
          <section className="mb-5">
            <h3 className="section-heading mb-4 border-bottom pb-2">រូបថតសកម្មភាព</h3>
            <div className="row g-4">
              {opportunity.images.map((img, index) => (
                <div
                  className="col-md-4"
                  key={index}
                >
                  <div
                    className="position-relative overflow-hidden rounded-3 shadow-sm"
                    style={{ height: "240px" }}
                  >
                    <img
                      src={img}
                      alt={`សកម្មភាព ${index + 1}`}
                      className="w-100 h-100 transition-all hover-zoom"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Organization Info */}
        <div className="mb-5 organization p-4 bg-light rounded-4 border-start border-primary border-4 shadow-sm">
          <h3 className="section-heading mb-3">អំពីអង្គការ</h3>
          <p className="mb-0 text-muted">{opportunity.organizationInfo}</p>
        </div>

        {/* Comments Section */}
        <section className="mb-5" id="opportunity-comments">
          <div className="d-flex align-items-center mb-3">
            <h3 className="section-heading mb-0 me-3">💬 មតិយោបល់ពីកម្មវិធី</h3>
            <span className="badge bg-primary text-white px-3 py-2">បញ្ចេញមតិ</span>
          </div>
          <div className="row g-4">
            <div className="col-lg-5">
              <div className="card shadow-sm h-100 border-0 bg-light p-3">
                <div className="card-body">
                  <h5 className="mb-3 fw-bold underline">សេចក្តីណែនាំ</h5>
                  <ul className="list-unstyled small mb-3">
                    <li className="mb-2 d-flex">
                      <i className="bi bi-info-circle-fill text-primary me-2"></i>
                      <span><strong>Guest:</strong> មើលបានតែមតិយោបល់</span>
                    </li>
                    <li className="mb-2 d-flex">
                      <i className="bi bi-person-fill text-primary me-2"></i>
                      <span><strong>User:</strong> អាចបញ្ចេញមតិ និងចុះឈ្មោះ</span>
                    </li>
                  </ul>
                  <p className="small text-muted mb-0 fst-italic">
                    សូមប្រើប្រាស់ភាសាសមរម្យ និងគោរពគ្នាទៅវិញទៅមក។
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="card shadow-sm h-100 border-0">
                <div className="card-body">
                  <h5 className="mb-4 fw-bold">បញ្ចេញមតិយោបល់</h5>
                  <form
                    onSubmit={handleCommentSubmit}
                  >
                    <div className="row g-3">
                      <div className="col-12">
                        <textarea
                          className="form-control mb-2"
                          rows="4"
                          placeholder="តើអ្នកមានចំណាប់អារម្មណ៍យ៉ាងណាចំពោះកម្មវិធីនេះ?"
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
                      <div className="col-12 form-check mb-2">
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
                          className="form-check-label small"
                          htmlFor="commentAgree"
                        >
                          ខ្ញុំយល់ព្រមតាមគោលការណ៍របស់វេទិកា
                        </label>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary px-4">
                      ផ្ញើមតិ
                    </button>
                  </form>

                  <hr className="my-4" />

                  <div className="d-flex align-items-center mb-3">
                    <h6 className="mb-0 fw-bold">មតិយោបល់</h6>
                    <span className="badge bg-light text-dark ms-2">
                      {localComments.length}
                    </span>
                  </div>

                  <div className="d-flex flex-column gap-3">
                    {commentsLoading ? (
                      <div className="text-center py-3"><div className="spinner-border spinner-border-sm text-primary"></div></div>
                    ) : localComments.length > 0 ? (
                      localComments.map((comment) => (
                        <div
                          className="border-bottom pb-3 bg-white"
                          key={comment.id}
                        >
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div className="d-flex align-items-center">
                              {comment.user_avatar ? (
                                <img src={comment.user_avatar} width="30" height="30" className="rounded-circle me-2" alt="" />
                              ) : (
                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: 30, height: 30 }}>{comment.user_name[0]}</div>
                              )}
                              <strong className="small">{comment.user_name}</strong>
                            </div>
                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>{new Date(comment.created_at).toLocaleDateString()}</small>
                          </div>
                          <p className="mb-0 small text-secondary">{comment.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted small py-4">មិនទាន់មានមតិយោបល់នៅឡើយទេ។ ជាអ្នកដំបូងដែលបញ្ចេញមតិ!</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <div className="contact-card mb-5">
          <h3 className="section-heading mb-4 border-bottom pb-2">ព័ត៌មានទំនាក់ទំនង</h3>
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="card shadow-sm border-0 rounded-4 p-4 h-100 bg-light">
                <div className="d-flex align-items-center">
                  <div className="icon-circle bg-primary text-white me-3 d-flex align-items-center justify-content-center rounded-circle" style={{ width: 50, height: 50 }}>
                    <i className="bi bi-globe"></i>
                  </div>
                  <div>
                    <h6 className="mb-0 text-muted">គេហទំព័រ</h6>
                    <a href="#" className="text-dark small fw-bold">{opportunity.contact.website}</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card shadow-sm border-0 rounded-4 p-4 h-100 bg-light">
                <div className="d-flex align-items-center">
                  <div className="icon-circle bg-success text-white me-3 d-flex align-items-center justify-content-center rounded-circle" style={{ width: 50, height: 50 }}>
                    <i className="bi bi-envelope"></i>
                  </div>
                  <div>
                    <h6 className="mb-0 text-muted">អ៊ីមែល</h6>
                    <a href={`mailto:${opportunity.contact.email}`} className="text-dark small fw-bold">{opportunity.contact.email}</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card shadow-sm border-0 rounded-4 p-4 h-100 bg-light">
                <div className="d-flex align-items-center">
                  <div className="icon-circle bg-info text-white me-3 d-flex align-items-center justify-content-center rounded-circle" style={{ width: 50, height: 50 }}>
                    <i className="bi bi-telephone"></i>
                  </div>
                  <div>
                    <h6 className="mb-0 text-muted">ទូរស័ព្ទ</h6>
                    <a href={`tel:${opportunity.contact.phone}`} className="text-dark small fw-bold">{opportunity.contact.phone}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <section className="text-center text-white p-5 rounded-4 mb-5 shadow-lg bg-primary">
          <h2 className="fw-bold mb-4">
            🚀 ត្រៀមខ្លួនសម្រាប់ការផ្លាស់ប្តូរជីវិត?
          </h2>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link
              href={`/opportunities/${params.id}/apply`}
              className="btn btn-light btn-lg px-5 py-2 rounded-pill fw-bold text-primary"
            >
              ដាក់ពាក្យឥឡូវនេះ
            </Link>
            <button
              type="button"
              className="btn btn-outline-light btn-lg px-5 py-2 rounded-pill fw-bold"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("ចម្លងតំណភ្ជាប់បានជោគជ័យ!");
              }}
            >
              ចែករំលែក
            </button>
          </div>
        </section>

        {/* Related Opportunities */}
        {relatedOpportunities.length > 0 && (
          <section className="mb-5">
            <h3 className="section-heading mb-4 border-bottom pb-2">🔎 កម្មវិធីស្ម័គ្រចិត្តផ្សេងទៀត</h3>
            <div className="row g-4">
              {relatedOpportunities.map((related) => (
                <div className="col-lg-4" key={related.id}>
                  <div className="card shadow-sm h-100 border-0 hover-lift">
                    <Link href={`/opportunities/${related.id}`}>
                      <img
                        src={related.images ? (typeof related.images === 'string' ? related.images.split(',')[0] : related.images[0]) : "/placeholder.png"}
                        className="card-img-top"
                        alt={related.title}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    </Link>
                    <div className="card-body d-flex flex-column p-4">
                      <h5 className="card-title fw-bold mb-2">
                        {related.title}
                      </h5>
                      <div className="small text-muted mb-3">
                        <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                        {related.location_label || related.location}
                      </div>
                      <div className="mt-auto d-flex gap-2">
                        <Link
                          href={`/opportunities/${related.id}`}
                          className="btn btn-outline-primary btn-sm flex-grow-1"
                        >
                          ព័ត៌មានលម្អិត
                        </Link>
                        <Link
                          href={`/opportunities/${related.id}/apply`}
                          className="btn btn-primary btn-sm flex-grow-1"
                        >
                          ដាក់ពាក្យ
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
