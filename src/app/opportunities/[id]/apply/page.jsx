"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getOpportunityById } from "@/data/mockOpportunities";

export default function VolunteerApplyPage() {
  const params = useParams();
  const router = useRouter();
  const [opportunity, setOpportunity] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
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
  });

  useEffect(() => {
    queueMicrotask(() => setMounted(true));

    if (params?.id) {
      const oppData = getOpportunityById(params.id);
      if (oppData) {
        setOpportunity(oppData);
      } else {
        router.push("/opportunities");
      }
    }
  }, [params?.id, router]);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.email ||
      !formData.location ||
      !formData.gender ||
      !formData.volunteerType ||
      !formData.agree
    ) {
      alert("សូមបំពេញព័ត៌មានចាំបាច់ទាំងអស់!");
      return;
    }

    // Show success message
    setShowSuccess(true);

    // Reset form
    setFormData({
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
    });

    // Scroll to success message
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);

    // Hide success message after 5 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
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
    <main className="py-1 bg-light">
      <div className="container-fluid my-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-9">
            <div
              className="card shadow-lg border-0"
              data-aos="zoom-in"
              data-aos-duration="1000"
              style={{ maxWidth: "1600px", margin: "auto" }}
            >
              <div className="row g-0">
                {/* Left Side - Program Info */}
                <div
                  className="col-md-5 bg-primary text-white d-flex flex-column justify-content-center align-items-center text-center p-4 rounded-start-2"
                  data-aos="fade-right"
                  data-aos-duration="1000"
                >
                  <h1 className="display-6 fw-bold mb-3">
                    ចូលរួមជាមួយយើង ដើម្បីបង្កើតការផ្លាស់ប្តូរ
                  </h1>
                  <p className="lead mb-4">
                    ការងារស្ម័គ្រចិត្តរបស់អ្នកនឹងរួមចំណែកយ៉ាងសំខាន់ដល់សហគមន៍។
                  </p>

                  {/* Opportunity Info */}
                  <div className="bg-white bg-opacity-10 rounded-3 p-3 mb-3 w-100">
                    <h5 className="fw-bold mb-2">{opportunity.title}</h5>
                    <p className="small mb-2">
                      <i className="bi bi-geo-alt-fill me-2"></i>
                      {opportunity.location}
                    </p>
                    <p className="small mb-0">
                      <i className="bi bi-calendar-check me-2"></i>
                      {opportunity.date}
                    </p>
                  </div>

                  <Image
                    src={opportunity.heroImage}
                    alt="ក្រុមស្ម័គ្រចិត្ត"
                    width={400}
                    height={350}
                    className="img-fluid rounded-4 shadow-lg"
                    style={{ maxHeight: "350px", objectFit: "cover" }}
                  />
                </div>

                {/* Right Side - Application Form */}
                <div
                  className="col-md-7 p-4 p-md-5"
                  data-aos="fade-left"
                  data-aos-duration="1000"
                >
                  <h2 className="mb-1 text-center text-primary fw-bold">
                    បំពេញពាក្យសុំស្ម័គ្រចិត្ត
                  </h2>
                  <p className="text-center text-muted m-3">
                    សូមបំពេញព័ត៌មានខាងក្រោមដើម្បីចាប់ផ្តើមដំណើរស្ម័គ្រចិត្តរបស់អ្នកជាមួយយើង។
                  </p>

                  {/* Success Message */}
                  {showSuccess && (
                    <div
                      className="alert alert-success text-center"
                      role="alert"
                    >
                      <i className="bi bi-check-circle me-2"></i>🎉
                      អ្នកបានចុះឈ្មោះដោយជោគជ័យ!
                      យើងនឹងទាក់ទងអ្នកក្នុងពេលឆាប់ៗនេះ។
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    {/* Personal Information */}
                    <fieldset className="mb-3">
                      <legend className="h5 text-secondary">
                        ព័ត៌មានផ្ទាល់ខ្លួន
                      </legend>
                      <div className="row g-3">
                        <div className="col-12">
                          <label htmlFor="fullName" className="form-label">
                            ឈ្មោះពេញ <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="phone" className="form-label">
                            លេខទូរស័ព្ទ <span className="text-danger">*</span>
                          </label>
                          <input
                            type="tel"
                            className="form-control"
                            id="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="email" className="form-label">
                            អ៊ីមែល <span className="text-danger">*</span>
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-12">
                          <label htmlFor="location" className="form-label">
                            ខេត្ត/ក្រុង <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select"
                            id="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">ជ្រើសរើសខេត្ត/ក្រុង</option>
                            <option value="ភ្នំពេញ">ភ្នំពេញ</option>
                            <option value="សៀមរាប">សៀមរាប</option>
                            <option value="បាត់ដំបង">បាត់ដំបង</option>
                            <option value="កំពត">កំពត</option>
                            <option value="ផ្សេងៗ">ខេត្តផ្សេងៗ...</option>
                          </select>
                        </div>
                        <div className="col-12">
                          <label className="form-label">
                            ភេទ <span className="text-danger">*</span>
                          </label>
                          <div>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="gender"
                                id="male"
                                value="ប្រុស"
                                checked={formData.gender === "ប្រុស"}
                                onChange={handleInputChange}
                                required
                              />
                              <label
                                className="form-check-label"
                                htmlFor="male"
                              >
                                ប្រុស
                              </label>
                            </div>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="gender"
                                id="female"
                                value="ស្រី"
                                checked={formData.gender === "ស្រី"}
                                onChange={handleInputChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="female"
                              >
                                ស្រី
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </fieldset>

                    {/* Skills and Interests */}
                    <fieldset className="mb-3">
                      <legend className="h5 text-secondary mb-3">
                        ជំនាញ និងចំណាប់អារម្មណ៍
                      </legend>
                      <div className="mb-3">
                        <label className="form-label">
                          ប្រភេទការងារស្ម័គ្រចិត្ត{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <div className="d-flex flex-wrap gap-2">
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="volunteerType"
                              id="fullTime"
                              value="ពេញម៉ោង"
                              checked={formData.volunteerType === "ពេញម៉ោង"}
                              onChange={handleInputChange}
                              required
                            />
                            <label
                              className="form-check-label"
                              htmlFor="fullTime"
                            >
                              ពេញម៉ោង
                            </label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="volunteerType"
                              id="partTime"
                              value="ក្រៅម៉ោង"
                              checked={formData.volunteerType === "ក្រៅម៉ោង"}
                              onChange={handleInputChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="partTime"
                            >
                              ក្រៅម៉ោង
                            </label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="volunteerType"
                              id="projectBased"
                              value="តាមគម្រោង"
                              checked={formData.volunteerType === "តាមគម្រោង"}
                              onChange={handleInputChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="projectBased"
                            >
                              តាមគម្រោង
                            </label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="form-label">
                          ជំនាញ (អាចជ្រើសរើសច្រើន)
                        </label>
                        <div className="d-flex flex-wrap gap-2">
                          {[
                            "education",
                            "health",
                            "it_tech",
                            "art_culture",
                            "environment",
                            "agriculture",
                            "other_skills",
                          ].map((skill) => (
                            <div key={skill}>
                              <input
                                type="checkbox"
                                className="btn-check"
                                id={skill}
                                checked={formData.skills.includes(skill)}
                                onChange={handleInputChange}
                              />
                              <label
                                className="btn btn-outline-secondary rounded-pill"
                                htmlFor={skill}
                              >
                                {skill === "education" && "អប់រំ"}
                                {skill === "health" && "សុខភាព"}
                                {skill === "it_tech" && "បច្ចេកវិទ្យា"}
                                {skill === "art_culture" && "សិល្បៈ/វប្បធម៌"}
                                {skill === "environment" && "បរិស្ថាន"}
                                {skill === "agriculture" && "កសិកម្ម"}
                                {skill === "other_skills" && "ផ្សេងៗ"}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </fieldset>

                    {/* Availability */}
                    <fieldset className="mb-3">
                      <legend className="h5 text-secondary mb-3">
                        ពេលវេលាដែលអាចធ្វើបាន
                      </legend>
                      <p className="mb-3">
                        សូមជ្រើសរើសពេលវេលាដែលអ្នកអាចចូលរួម (អាចជ្រើសរើសច្រើនបាន)
                      </p>
                      <div className="row g-2">
                        <div className="col-12">
                          <legend className="h6 text-secondary mb-2">
                            ថ្ងៃធ្វើការ
                          </legend>
                          <div className="d-flex flex-wrap gap-3">
                            {[
                              "availabilityMorningWeekday",
                              "availabilityAfternoonWeekday",
                              "availabilityEveningWeekday",
                            ].map((time) => (
                              <div className="form-check" key={time}>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={time}
                                  checked={formData.availability.includes(time)}
                                  onChange={handleAvailabilityChange}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={time}
                                >
                                  {time === "availabilityMorningWeekday" &&
                                    "ពេលព្រឹក"}
                                  {time === "availabilityAfternoonWeekday" &&
                                    "ពេលរសៀល"}
                                  {time === "availabilityEveningWeekday" &&
                                    "ពេលយប់"}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="col-12 mt-2">
                          <legend className="h6 text-secondary mb-2">
                            ចុងសប្តាហ៍
                          </legend>
                          <div className="d-flex flex-wrap gap-3">
                            {[
                              "availabilityMorningWeekend",
                              "availabilityAfternoonWeekend",
                              "availabilityEveningWeekend",
                              "availabilityAnytime",
                            ].map((time) => (
                              <div className="form-check" key={time}>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={time}
                                  checked={formData.availability.includes(time)}
                                  onChange={handleAvailabilityChange}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={time}
                                >
                                  {time === "availabilityMorningWeekend" &&
                                    "ពេលព្រឹក"}
                                  {time === "availabilityAfternoonWeekend" &&
                                    "ពេលរសៀល"}
                                  {time === "availabilityEveningWeekend" &&
                                    "ពេលយប់"}
                                  {time === "availabilityAnytime" && "គ្រប់ពេល"}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </fieldset>

                    {/* Notes */}
                    <div className="mb-3">
                      <label htmlFor="notes" className="form-label">
                        កំណត់ត្រា/ចំណាប់អារម្មណ៍
                      </label>
                      <textarea
                        className="form-control"
                        id="notes"
                        rows="2"
                        value={formData.notes}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>

                    {/* CV Upload */}
                    <div className="mb-3">
                      <label htmlFor="cv" className="form-label fw-medium">
                        Upload CV (optional)
                      </label>
                      <input
                        type="file"
                        className="form-control rounded-3"
                        id="cv"
                        onChange={handleInputChange}
                        accept=".pdf,.doc,.docx"
                      />
                    </div>

                    {/* Agreement */}
                    <div className="form-check m-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="agree"
                        checked={formData.agree}
                        onChange={handleInputChange}
                        required
                      />
                      <label className="form-check-label small" htmlFor="agree">
                        ខ្ញុំយល់ព្រមតាមលក្ខខណ្ឌ
                        និងប្ដេជ្ញាស្ម័គ្រចិត្តប្រកបដោយការទទួលខុសត្រូវ។
                        <span className="text-danger">*</span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <div className="d-grid mt-4">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg rounded-pill"
                      >
                        <i className="bi bi-person-add me-2"></i>{" "}
                        ចុះឈ្មោះឥឡូវនេះ
                      </button>
                    </div>
                  </form>

                  {/* Back to Homepage */}
                  <div className="mt-4 d-flex justify-content-center gap-3">
                    <Link
                      href={`/opportunities/${params.id}`}
                      className="btn btn-outline-primary btn-lg rounded-pill fs-6"
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      ត្រលប់ក្រោយ
                    </Link>
                    <Link
                      href="/"
                      className="btn btn-primary btn-lg rounded-pill fs-6"
                    >
                      ទៅកាន់ទំព័រដើម
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
