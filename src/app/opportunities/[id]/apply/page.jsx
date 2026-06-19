"use client";

import "@/styles/opportunity-detail.css";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getOpportunityById, verifyOpportunityAccessKey } from "@/services/opportunities";
import { applyToOpportunity, getMyApplications } from "@/services/applications";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import LoadingButton from "@/components/common/LoadingButton";

import { parseApiError } from "@/lib/utils/apiError";

const formatImageUrl = (url) => {
  if (!url) return "/placeholder.png";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    const backendBase = process.env.NEXT_PUBLIC_API_BASE_URL || "https://smakjit.publicvm.com";
    if (url.includes("localhost:8000")) {
      return url.replace("http://localhost:8000", backendBase);
    }
    return url;
  }
  if (url.startsWith("/")) {
    const staticAssets = ["/placeholder.png", "/logos/", "/images/"];
    if (staticAssets.some(asset => url.startsWith(asset))) {
      return url;
    }
    const backendBase = process.env.NEXT_PUBLIC_API_BASE_URL || "https://smakjit.publicvm.com";
    return `${backendBase}${url}`;
  }
  return url;
};

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
          heroImage: formatImageUrl(
            data.images
              ? (typeof data.images === 'string' ? data.images.split(',')[0] : data.images[0])
              : (data.heroImage || "/placeholder.png")
          ),
          date: data.logistic?.start_date
            ? new Date(data.logistic.start_date).toLocaleDateString("km-KH")
            : (data.date_range ? new Date(data.date_range).toLocaleDateString("km-KH") : (data.date || "TBD")),
          location: data.logistic?.location_label || data.location_label || data.location || "TBD",
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
      <main className="opp-login-required-page" style={{ paddingTop: 112 }}>
        {/* Background Image backdrop (blurred) */}
        <div className="opp-login-req-backdrop">
          <img src={opportunity?.heroImage || "/placeholder.png"} alt="" />
          <div className="opp-login-req-overlay" />
        </div>

        <div className="container position-relative z-3">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div className="opp-login-req-card">
                {/* Icon wrapper with glow */}
                <div className="opp-login-req-icon-wrap mb-4">
                  <div className="opp-login-req-icon-glow" />
                  <i className="bi bi-shield-lock-fill"></i>
                </div>

                <h2 className="opp-login-req-title mb-3">សូមចូលក្នុងគណនីរបស់អ្នក</h2>
                <p className="opp-login-req-text mb-4">
                  អ្នកត្រូវការចូលក្នុងគណនីជាមុនសិន ដើម្បីអាចបន្តទៅកាន់ការដាក់ពាក្យស្ម័គ្រចិត្តក្នុងកម្មវិធី 
                  <span className="opp-login-req-opp-title"> "{opportunity?.title}"</span>
                </p>

                <div className="d-grid gap-3">
                  <Link href={`/auth/login?redirect=/opportunities/${params.id}/apply`} className="opp-btn-primary py-3 fs-6">
                    <i className="bi bi-box-arrow-in-right me-2"></i>ចូលក្នុងគណនី
                  </Link>
                  <div className="opp-divider my-2">
                    <span>ឬ</span>
                  </div>
                  <Link href="/auth/register" className="opp-btn-outline py-3 fs-6">
                    <i className="bi bi-person-plus-fill me-2"></i>ចុះឈ្មោះគណនីថ្មី
                  </Link>
                </div>

                <div className="mt-5">
                  <Link href={`/opportunities/${params.id}`} className="opp-back-link">
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
    <main className="opp-apply-container py-5" style={{ marginTop: '80px' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <div className="opp-apply-card">
              <div className="row g-0">
                {/* Left Side - Program Info */}
                <div className="col-md-5 opp-apply-sidebar">
                  <div className="opp-apply-sidebar-glow" />
                  <div className="opp-apply-sidebar-grid" />
                  
                  <div className="opp-apply-sidebar-content">
                    <h2 className="opp-apply-sidebar-title">ចូលរួមជាមួយយើង</h2>
                    <p className="opp-apply-sidebar-desc">រាល់ការចំណាយពេលរបស់អ្នក នឹងក្លាយជាការផ្លាស់ប្តូរដ៏អស្ចារ្យសម្រាប់សង្គម។</p>

                    <div className="opp-apply-info-card">
                      <h5 className="opp-apply-info-opp-title">{opportunity.title}</h5>
                      <div className="opp-apply-info-item">
                        <span className="opp-apply-info-icon">
                          <i className="bi bi-geo-alt-fill"></i>
                        </span>
                        <span>{opportunity.location || opportunity.location_label || "TBD"}</span>
                      </div>
                      <div className="opp-apply-info-item">
                        <span className="opp-apply-info-icon">
                          <i className="bi bi-calendar-check-fill"></i>
                        </span>
                        <span>{opportunity.date}</span>
                      </div>
                    </div>

                    <img
                      src={opportunity.heroImage}
                      alt={opportunity.title}
                      className="opp-apply-sidebar-img"
                    />
                  </div>
                </div>

                {/* Right Side - Form */}
                <div className="col-md-7 opp-apply-form-panel">
                  <h2 className="opp-apply-form-title">ពាក្យសុំស្ម័គ្រចិត្ត</h2>
                  <p className="opp-apply-form-subtitle">សូមបំពេញព័ត៌មានឱ្យបានគ្រប់ជ្រុងជ្រោយ ដើម្បីងាយស្រួលដល់ក្រុមការងារ។</p>

                  {showSuccess && (
                    <div className="opp-apply-success-card">
                      <i className="bi bi-check-circle-fill opp-apply-success-icon d-block"></i>
                      <strong className="d-block mb-1">ជោគជ័យ!</strong> ពាក្យរបស់អ្នកត្រូវបានបញ្ជូនទៅកាន់អ្នករៀបចំកម្មវិធី។ អ្នកនឹងត្រូវបានបញ្ជូនទៅកាន់ទំព័រកម្មវិធីរបស់អ្នកក្នុងពេលឆាប់ៗ។
                    </div>
                  )}

                  {error && (
                    <div className="opp-apply-error-alert">
                      <i className="bi bi-exclamation-circle-fill opp-apply-error-icon"></i>
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <h5 className="opp-apply-section-title">ព័ត៌មានផ្ទាល់ខ្លួន</h5>
                    <div className="row g-3 mb-4">
                      <div className="col-12">
                        <label className="form-label">ឈ្មោះពេញ <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" id="fullName" value={formData.fullName} onChange={handleInputChange} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">លេខទូរស័ព្ទ <span className="text-danger">*</span></label>
                        <input type="tel" className="form-control" id="phone" value={formData.phone} onChange={handleInputChange} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">អ៊ីមែល <span className="text-danger">*</span></label>
                        <input type="email" className="form-control" id="email" value={formData.email} onChange={handleInputChange} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">ភេទ <span className="text-danger">*</span></label>
                        <select className="form-select" id="gender" name="gender" value={formData.gender} onChange={handleInputChange} required>
                          <option value="">ជ្រើសរើសភេទ</option>
                          <option value="ប្រុស">ប្រុស (Male)</option>
                          <option value="ស្រី">ស្រី (Female)</option>
                          <option value="ផ្សេងៗ">ផ្សេងៗ (Other)</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">ទីលំនៅបច្ចុប្បន្ន <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" id="location" value={formData.location} onChange={handleInputChange} placeholder="ឧ. ភ្នំពេញ" required />
                      </div>
                    </div>

                    <h5 className="opp-apply-section-title">ជំនាញ និងបទពិសោធន៍</h5>
                    <div className="mb-4">
                      <label className="form-label">ជំនាញដែលអ្នកមាន (ជ្រើសរើសច្រើន)</label>
                      <div className="d-flex flex-wrap gap-1">
                        {["Education", "Healthcare", "Technology", "Art/Culture", "Environment", "Agriculture", "Other"].map(s => (
                          <div key={s}>
                            <input type="checkbox" className="opp-skill-chip-input" id={s} checked={formData.skills.includes(s)} onChange={handleInputChange} />
                            <label className="opp-skill-chip-label" htmlFor={s}>{s}</label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label">សារទៅកាន់អ្នករៀបចំកម្មវិធី</label>
                      <textarea className="form-control" id="notes" rows="3" value={formData.notes} onChange={handleInputChange} placeholder="បញ្ជាក់ពីមូលហេតុដែលអ្នកចង់ចូលរួម..."></textarea>
                    </div>

                    <div className="mb-4">
                      <label className="form-label">ភ្ជាប់ប្រវត្តិរូបសង្ខេប - CV (បើមាន)</label>
                      <div className="opp-file-input-wrapper">
                        <input type="file" id="cv" onChange={handleInputChange} accept=".pdf,.doc,.docx" />
                        <div className="opp-file-input-trigger">
                          <i className="bi bi-cloud-arrow-up-fill opp-file-input-icon"></i>
                          <span className="opp-file-input-filename">
                            {formData.cv ? formData.cv.name : "ជ្រើសរើសឯកសារប្រវត្តិរូបសង្ខេប (PDF, DOC)"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {opportunity.is_private && (
                      <div className="opp-apply-access-key-box">
                        <label className="form-label small fw-bold">Access Key <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" id="accessKey" value={formData.accessKey} onChange={handleInputChange} placeholder="បញ្ចូលកូដសម្ងាត់សម្រាប់កម្មវិធីឯកជន" required />
                        <small className="text-muted mt-2 d-block">កម្មវិធីនេះជាកម្មវិធីឯកជន។ អ្នកត្រូវការកូដពីអ្នករៀបចំកម្មវិធី។</small>
                      </div>
                    )}

                    <div className="mb-4">
                      <label className="opp-apply-checkbox-wrap" htmlFor="agree">
                        <input className="opp-apply-checkbox-input" type="checkbox" id="agree" checked={formData.agree} onChange={handleInputChange} required />
                        <span className="opp-apply-checkbox-label">
                          ខ្ញុំយល់ព្រមតាមលក្ខខណ្ឌ និងប្តេជ្ញាចូលរួមដោយស្ម័គ្រចិត្ត។
                        </span>
                      </label>
                    </div>

                    <LoadingButton
                      type="submit"
                      className="opp-apply-submit-btn"
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
