"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getOpportunityById, verifyOpportunityAccessKey } from "@/services/opportunities";
import { applyToOpportunity, getMyApplications } from "@/services/applications";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import LoadingButton from "@/components/common/LoadingButton";

import { parseApiError } from "@/lib/utils/apiError";

export default function VolunteerApplyPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    location: "",
    gender: "",
    volunteerType: "",
    skills: [],
    availability: [],
    notes: "",
    cv: null,
    agree: false,
    accessKey: "",
  });

  useEffect(() => {
    async function fetchOpp() {
      if (!params?.id) return;
      try {
        const res = await getOpportunityById(params.id);
        const data = res.data || res;
        const transformedOpp = {
          ...data,
          is_private: data.is_private || data.visibility === 'private',
          heroImage: data.images ? (typeof data.images === 'string' ? data.images.split(',')[0] : data.images[0]) : (data.heroImage || "/placeholder.png"),
          date: data.date_range ? new Date(data.date_range).toLocaleDateString() : (data.date || "TBD"),
        };
        
        // If it's a private opportunity, verify the key
        if (transformedOpp.is_private) {
          const savedKey = sessionStorage.getItem('private_access_key');
          if (!savedKey) {
            toast.error("សូមបញ្ចូលកូដសម្ងាត់សម្រាប់កម្មវិធីឯកជននេះជាមុនសិន។");
            router.replace(`/opportunities/${params.id}`);
            return;
          }
          try {
            await verifyOpportunityAccessKey(params.id, savedKey);
            // Valid key! Set it in form data and keep it in opportunity state
            setFormData(prev => ({ ...prev, accessKey: savedKey }));
            setOpportunity(transformedOpp);
          } catch (err) {
            console.error("Verification failed on apply load:", err);
            sessionStorage.removeItem('private_access_key');
            toast.error("កូដសម្ងាត់មិនត្រឹមត្រូវទេ");
            router.replace(`/opportunities/${params.id}`);
            return;
          }
        } else {
          setOpportunity(transformedOpp);
        }
      } catch (err) {
        console.error("Error fetching opportunity:", err);
        setError("មិនអាចស្វែងរកកម្មវិធីបានទេ។");
      } finally {
        setLoading(false);
      }
    }
    fetchOpp();
  }, [params?.id, router]);

  // Check if user already applied
  useEffect(() => {
    async function checkExistingApplication() {
      if (!user || !params?.id) return;
      try {
        const { data } = await getMyApplications({ limit: 100, offset: 0 });
        const existingApp = data.find(app => app.opportunity_id === parseInt(params.id));
        if (existingApp) {
          setHasApplied(true);
        }
      } catch (err) {
        console.error("Error checking existing application:", err);
      }
    }
    checkExistingApplication();
  }, [user, params?.id]);

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.full_name || user.name || "",
        email: user.email || "",
        phone: user.phone || user.phone_number || "",
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (id === "agree") {
        setFormData({ ...formData, agree: checked });
      } else {
        const skillId = id;
        setFormData({
          ...formData,
          skills: checked
            ? [...formData.skills, skillId]
            : formData.skills.filter((s) => s !== skillId),
        });
      }
    } else if (type === "radio") {
      const name = e.target.name;
      setFormData({ ...formData, [name]: value });
    } else if (type === "file") {
      setFormData({ ...formData, cv: e.target.files[0] });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleAvailabilityChange = (e) => {
    const { id, checked } = e.target;
    setFormData({
      ...formData,
      availability: checked
        ? [...formData.availability, id]
        : formData.availability.filter((a) => a !== id),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agree) {
      toast.error("សូមយល់ព្រមតាមលក្ខខណ្ឌ!");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      if (formData.cv) {
        const fData = new FormData();
        fData.append("opportunity_id", parseInt(params.id));
        fData.append("name", formData.fullName);
        fData.append("email", formData.email);
        fData.append("phone_number", formData.phone);
        fData.append("skills", formData.skills.join(', ') || "N/A");
        fData.append("availability", formData.availability.join(', ') || "N/A");
        fData.append("sex", formData.gender === "ប្រុស" ? "male" : (formData.gender === "ស្រី" ? "female" : "other"));
        fData.append("message", formData.notes);
        if (formData.accessKey) fData.append("access_key", formData.accessKey);
        fData.append("cv", formData.cv); // File

        await applyToOpportunity(fData, true);
      } else {
        const payload = {
          opportunity_id: parseInt(params.id),
          name: formData.fullName,
          email: formData.email,
          phone_number: formData.phone,
          skills: formData.skills.join(', ') || "N/A",
          availability: formData.availability.join(', ') || "N/A",
          sex: formData.gender === "ប្រុស" ? "male" : (formData.gender === "ស្រី" ? "female" : "other"),
          message: formData.notes,
          access_key: formData.accessKey || undefined,
        };
        await applyToOpportunity(payload, false);
      }
      toast.success("បានដាក់ពាក្យដោយជោគជ័យ!");
      setShowSuccess(true);
      sessionStorage.removeItem('private_access_key');
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Navigate back to opportunity detail page after delay
      setTimeout(() => {
        router.push(`/opportunities/${params.id}`);
      }, 3000);

    } catch (err) {
      console.error("Submission error:", err);
      const errMsg = parseApiError(err) || "មានបញ្ហាក្នុងការដាក់ពាក្យ។ សូមព្យាយាមម្តងទៀត។";
      setError(errMsg);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading || (!opportunity && !error)) {
    return (
      <div className="container py-5 text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">កំពុងទាញយក...</p>
      </div>
    );
  }

  if (hasApplied) {
    return (
      <div className="container py-5 text-center my-5 bg-white rounded shadow-sm">
        <i className="bi bi-check-circle-fill fs-1 text-success"></i>
        <h3 className="mt-3 fw-bold">អ្នកបានដាក់ពាក្យរួចរាល់ហើយ</h3>
        <p className="text-muted">អ្នកបានដាក់ពាក្យសម្រាប់កម្មវិធីនេះរួចហើយ។ សូមរង់ចាំការឆ្លើយតបពីអ្នករៀបចំ។</p>
        <Link href={`/opportunities/${params.id}`} className="btn btn-primary mt-3">ត្រឡប់ទៅកាន់ព័ត៌មានលម្អិត</Link>
      </div>
    );
  }

  if (error && !opportunity) {
    return (
      <div className="container py-5 text-center my-5">
        <i className="bi bi-exclamation-triangle fs-1 text-danger"></i>
        <h3 className="mt-3">{error}</h3>
        <Link href="/opportunities" className="btn btn-primary mt-3">ត្រឡប់ទៅមើលកម្មវិធីផ្សេងទៀត</Link>
      </div>
    );
  }

  if (!user) {
    return (
      <main className="py-5 bg-light min-vh-100 d-flex align-items-center" style={{ marginTop: '40px' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden text-center p-5">
                <div className="mb-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                    <i className="bi bi-person-lock text-primary fs-1"></i>
                  </div>
                </div>
                
                <h2 className="fw-bold mb-3">សូមចូលក្នុងគណនីរបស់អ្នក</h2>
                <p className="text-muted mb-4 px-lg-5">
                  អ្នកត្រូវការចូលក្នុងគណនីជាមុនសិន ដើម្បីអាចបន្តទៅកាន់ការដាក់ពាក្យស្ម័គ្រចិត្តក្នុងកម្មវិធី 
                  <span className="text-primary fw-semibold"> "{opportunity?.title}"</span> ។
                </p>

                <div className="d-grid gap-3">
                  <Link href={`/auth/login?redirect=/opportunities/${params.id}/apply`} className="btn btn-primary btn-lg rounded-pill py-3 fw-bold">
                    ចូលក្នុងគណនី
                  </Link>
                  <div className="d-flex align-items-center justify-content-center my-2">
                    <hr className="flex-grow-1" />
                    <span className="mx-3 text-muted small">ឬ</span>
                    <hr className="flex-grow-1" />
                  </div>
                  <Link href="/auth/register" className="btn btn-outline-primary btn-lg rounded-pill py-3 fw-bold">
                    ចុះឈ្មោះគណនីថ្មី
                  </Link>
                </div>

                <div className="mt-5">
                  <Link href={`/opportunities/${params.id}`} className="text-decoration-none text-muted small hover-primary">
                    <i className="bi bi-arrow-left me-2"></i>ត្រឡប់ទៅកាន់ព័ត៌មានលម្អិតវិញ
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-5 bg-light" style={{ marginTop: '80px' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <div className="card shadow-lg border-0 overflow-hidden">
              <div className="row g-0">
                {/* Left Side - Program Info */}
                <div className="col-md-5 bg-primary text-white p-5 d-flex flex-column align-items-center justify-content-center text-center">
                  <h2 className="fw-bold mb-4">ចូលរួមជាមួយយើង</h2>
                  <p className="mb-4 opacity-75">រាល់ការចំណាយពេលរបស់អ្នក នឹងក្លាយជាការផ្លាស់ប្តូរដ៏អស្ចារ្យសម្រាប់សង្គម។</p>

                  <div className="bg-white bg-opacity-10 p-4 rounded-4 w-100 mb-4 border border-white border-opacity-25">
                    <h5 className="fw-bold mb-3">{opportunity.title}</h5>
                    <div className="small d-flex align-items-center justify-content-center mb-2">
                      <i className="bi bi-geo-alt-fill me-2"></i>{opportunity.location_label || opportunity.location}
                    </div>
                    <div className="small d-flex align-items-center justify-content-center">
                      <i className="bi bi-calendar-check-fill me-2"></i>{opportunity.date}
                    </div>
                  </div>

                  <img
                    src={opportunity.heroImage}
                    alt={opportunity.title}
                    className="img-fluid rounded-4 shadow"
                    style={{ height: '250px', width: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Right Side - Form */}
                <div className="col-md-7 p-4 p-md-5 bg-white">
                  <h2 className="mb-2 fw-bold text-primary">ពាក្យសុំស្ម័គ្រចិត្ត</h2>
                  <p className="text-muted mb-4 small">សូមបំពេញព័ត៌មានឱ្យបានគ្រប់ជ្រុងជ្រោយ ដើម្បីងាយស្រួលដល់ក្រុមការងារ។</p>

                  {showSuccess && (
                    <div className="alert alert-success border-0 shadow-sm mb-4 text-center">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      <strong>ជោគជ័យ!</strong> ពាក្យរបស់អ្នកត្រូវបានបញ្ជូនទៅកាន់អ្នករៀបចំកម្មវិធី។ អ្នកនឹងត្រូវបានបញ្ជូនទៅកាន់ទំព័រកម្មវិធីរបស់អ្នកក្នុងពេលឆាប់ៗ។
                    </div>
                  )}

                  {error && (
                    <div className="alert alert-danger border-0 shadow-sm mb-4">
                      <i className="bi bi-exclamation-circle-fill me-2"></i>{error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <h5 className="mb-3 border-bottom pb-2 fw-bold small text-uppercase text-muted">ព័ត៌មានផ្ទាល់ខ្លួន</h5>
                    <div className="row g-3 mb-4">
                      <div className="col-12">
                        <label className="form-label small fw-bold">ឈ្មោះពេញ <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" id="fullName" value={formData.fullName} onChange={handleInputChange} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">លេខទូរស័ព្ទ <span className="text-danger">*</span></label>
                        <input type="tel" className="form-control" id="phone" value={formData.phone} onChange={handleInputChange} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">អ៊ីមែល <span className="text-danger">*</span></label>
                        <input type="email" className="form-control" id="email" value={formData.email} onChange={handleInputChange} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">ភេទ <span className="text-danger">*</span></label>
                        <select className="form-select" id="gender" name="gender" value={formData.gender} onChange={handleInputChange} required>
                          <option value="">ជ្រើសរើសភេទ</option>
                          <option value="ប្រុស">ប្រុស (Male)</option>
                          <option value="ស្រី">ស្រី (Female)</option>
                          <option value="ផ្សេងៗ">ផ្សេងៗ (Other)</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">ទីលំនៅបច្ចុប្បន្ន <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" id="location" value={formData.location} onChange={handleInputChange} placeholder="ឧ. ភ្នំពេញ" required />
                      </div>
                    </div>

                    <h5 className="mb-3 border-bottom pb-2 fw-bold small text-uppercase text-muted">ជំនាញ និងបទពិសោធន៍</h5>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">ជំនាញដែលអ្នកមាន (ជ្រើសរើសច្រើន)</label>
                      <div className="d-flex flex-wrap gap-1">
                        {["Education", "Healthcare", "Technology", "Art/Culture", "Environment", "Agriculture", "Other"].map(s => (
                          <div key={s}>
                            <input type="checkbox" className="btn-check" id={s} checked={formData.skills.includes(s)} onChange={handleInputChange} />
                            <label className="btn btn-outline-secondary btn-sm rounded-pill px-3" htmlFor={s}>{s}</label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label small fw-bold">សារទៅកាន់អ្នករៀបចំកម្មវិធី</label>
                      <textarea className="form-control" id="notes" rows="3" value={formData.notes} onChange={handleInputChange} placeholder="បញ្ជាក់ពីមូលហេតុដែលអ្នកចង់ចូលរួម..."></textarea>
                    </div>

                    <div className="mb-4">
                      <label className="form-label small fw-bold">ភ្ជាប់ប្រវត្តិរូបសង្ខេប - CV (បើមាន)</label>
                      <input type="file" className="form-control" id="cv" onChange={handleInputChange} accept=".pdf,.doc,.docx" />
                    </div>

                    {opportunity.is_private && (
                      <div className="mb-4 p-3 bg-warning bg-opacity-10 border border-warning rounded">
                        <label className="form-label small fw-bold text-dark">Access Key <span className="text-danger">*</span></label>
                        <input type="text" className="form-control border-warning" id="accessKey" value={formData.accessKey} onChange={handleInputChange} placeholder="បញ្ចូលកូដសម្ងាត់សម្រាប់កម្មវិធីឯកជន" required />
                        <small className="text-muted mt-1 d-block">កម្មវិធីនេះជាកម្មវិធីឯកជន។ អ្នកត្រូវការកូដពីអ្នករៀបចំកម្មវិធី។</small>
                      </div>
                    )}

                    <div className="form-check mb-4">
                      <input className="form-check-input" type="checkbox" id="agree" checked={formData.agree} onChange={handleInputChange} required />
                      <label className="form-check-label small text-muted" htmlFor="agree">
                        ខ្ញុំយល់ព្រមតាមលក្ខខណ្ឌ និងប្តេជ្ញាចូលរួមដោយស្ម័គ្រចិត្ត។
                      </label>
                    </div>

                    <LoadingButton
                      type="submit"
                      className="btn btn-primary btn-lg w-100 rounded-pill shadow-sm"
                      loading={submitting}
                      loadingText="កំពុងបញ្ជូន..."
                    >
                      ដាក់ពាក្យឥឡូវនេះ
                    </LoadingButton>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
