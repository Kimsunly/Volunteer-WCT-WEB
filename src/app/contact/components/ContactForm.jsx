"use client";

import { useState } from "react";
import { submitContactMessage } from "@/services/contact";
import toast from "react-hot-toast";
import LoadingButton from "@/components/common/LoadingButton";

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      phone: form.phone,
      message: form.message,
    };

    try {
      setSubmitting(true);
      await submitContactMessage(payload);
      toast.success("សាររបស់អ្នកត្រូវបានបញ្ជូនដោយជោគជ័យ! សូមអរគុណ។");
      handleReset();
    } catch (err) {
      console.error("Contact submit error:", err);
      toast.error("បរាជ័យក្នុងការបញ្ជូនសារ។ សូមព្យាយាមម្តងទៀត។");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm({
      lastName: "",
      firstName: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        {/* Last name */}
        <div className="col-12 col-xl-6">
          <div className="mb-4 form-floating">
            <input
              type="text"
              className="form-control"
              id="lastName"
              name="lastName"
              placeholder="នាមត្រកូល"
              value={form.lastName}
              onChange={handleChange}
              required
            />
            <label htmlFor="lastName">នាមត្រកូល</label>
          </div>
        </div>

        {/* First name */}
        <div className="col-12 col-xl-6">
          <div className="mb-4 form-floating">
            <input
              type="text"
              className="form-control"
              id="firstName"
              name="firstName"
              placeholder="នាមខ្លួន"
              value={form.firstName}
              onChange={handleChange}
              required
            />
            <label htmlFor="firstName">នាមខ្លួន</label>
          </div>
        </div>

        {/* Email */}
        <div className="col-12">
          <div className="mb-4 form-floating">
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="អ៊ីម៉ែល"
              value={form.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="email">អ៊ីម៉ែល</label>
          </div>
        </div>

        {/* Phone */}
        <div className="col-12">
          <div className="mb-4 form-floating">
            <input
              type="tel"
              className="form-control"
              id="phone"
              name="phone"
              placeholder="លេខទូរស័ព្ទ"
              value={form.phone}
              onChange={handleChange}
            />
            <label htmlFor="phone">លេខទូរស័ព្ទ</label>
          </div>
        </div>

        {/* Message */}
        <div className="col-12">
          <div className="form-floating">
            <textarea
              className="form-control"
              id="message"
              name="message"
              placeholder="ផ្ញើសារ..."
              style={{ height: "160px" }}
              value={form.message}
              onChange={handleChange}
              required
            />
            <label htmlFor="message">ផ្ញើសារ...</label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-3">
        <LoadingButton
          type="submit"
          className="btn btn-primary fw-bold"
          loading={submitting}
          loadingText="កំពុងបញ្ជូន..."
        >
          បញ្ជូន
        </LoadingButton>
        <button
          type="button"
          className="btn btn-secondary fw-bold ms-2"
          onClick={handleReset}
          disabled={submitting}
        >
          បោះបង់
        </button>
      </div>
    </form>
  );
}
