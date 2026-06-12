"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell, UploadArea, PasswordField } from "../../components";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { setAuth } from "@/lib/utils/authState";
import { showToast } from "@/components/common/CustomToaster";
import { parseApiError } from "@/lib/utils/apiError";

export default function OrgRegisterPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [orgType, setOrgType] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const onFile = (file) => {
    setSelectedFile(file);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = document.getElementById("orgRegisterForm");
    if (!form?.checkValidity()) {
      form?.classList.add("was-validated");
      return;
    }
    if (!selectedFile) {
      showToast.error("សូមជ្រើសរើស និងផ្ទុកឡើងនូវឯកសារបញ្ជាក់អង្គភាព ឬស្ថាប័នរបស់អ្នក។", "ខ្វះឯកសារបញ្ជាក់");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append(
        "organization_name",
        form.querySelector("#orgname")?.value,
      );
      formData.append("email", form.querySelector("#email")?.value);
      formData.append("phone", form.querySelector("#phone")?.value);
      formData.append("password", form.querySelector("#password")?.value);
      formData.append("organizer_type", orgType);
      formData.append("document", selectedFile);

      const { data } = await api.post("/api/organizer/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Store token if needed
      const token =
        data?.meta?.access_token ||
        data?.token ||
        data?.access_token ||
        data?.data?.token ||
        data?.data?.access_token;
      const refreshToken =
        data?.meta?.refresh_token ||
        data?.refresh_token;

      if (token) {
        setAuth({ token, refreshToken, role: data?.data?.role || "user" });
        setUser(data?.data);
      }

      showToast.success(
        "គណនីអ្នករៀបចំត្រូវបានស្នើសុំដោយជោគជ័យ! សូមរង់ចាំការពិនិត្យ និងអនុម័តពីអភិបាលប្រព័ន្ធ (Admin Approval)។",
        "ការស្នើសុំជោគជ័យ"
      );
      router.push("/");
    } catch (err) {
      console.error("Organizer register error", err);
      const msg = parseApiError(err) || "ការចុះឈ្មោះជាអ្នករៀបចំបរាជ័យ";
      showToast.error(msg, "ចុះឈ្មោះបរាជ័យ");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="authentication-body org-login">
      <main>
        <section>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12">
                <AuthShell
                  imageSrc="/images/svg_login/Volunteering-bro.svg"
                  title="Organizer Register"
                  switchText="Already have an organization account?"
                  switchLink="/auth/org/login"
                  switchAction="Login"
                >
                  <form
                    id="orgRegisterForm"
                    className="row gy-3 needs-validation"
                    noValidate
                    onSubmit={onSubmit}
                  >
                    <div className="col-xl-12">
                      <input
                        type="text"
                        className="auth-modern-input w-100"
                        id="orgname"
                        defaultValue="អង្គការមនុស្សធម៌ដើម្បីកម្ពុជា"
                        placeholder="Organization Name"
                        required
                      />
                    </div>

                    <div className="col-xl-6">
                      <input
                        type="email"
                        className="auth-modern-input w-100"
                        id="email"
                        defaultValue="Volunteer@gmail.com"
                        placeholder="Email Address"
                        required
                      />
                    </div>

                    <div className="col-xl-6">
                      <input
                        type="tel"
                        className="auth-modern-input w-100"
                        id="phone"
                        defaultValue="+855 683 828 00"
                        placeholder="Phone Number"
                        required
                      />
                    </div>

                    <PasswordField
                      id="password"
                      placeholder="Password"
                      defaultValue="SokryPes@123"
                    />

                    <div className="col-xl-12">
                      <select
                        id="orgType"
                        className="auth-modern-input w-100"
                        value={orgType}
                        onChange={(e) => setOrgType(e.target.value)}
                        required
                        style={{ appearance: "none" }}
                      >
                        <option value="">Select Organization Type</option>
                        <option value="ngo">NGO</option>
                        <option value="nonprofit">Non-profit</option>
                        <option value="community">Community</option>
                        <option value="educational">Educational</option>
                        <option value="religious">Religious</option>
                        <option value="government">Government</option>
                        <option value="corporate">Corporate</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="col-xl-12">
                      <label className="form-label ms-3 mb-2 fw-bold text-muted">
                        Organization Document
                      </label>
                      <UploadArea onFile={onFile} />
                    </div>

                    <div className="col-xl-12">
                      <div className="auth-modern-checkbox-container">
                        <input
                          type="checkbox"
                          id="agree"
                          defaultChecked
                          required
                        />
                        <label htmlFor="agree">
                          Receive news and updates for organizers
                        </label>
                      </div>
                    </div>

                    <div className="col-xl-12">
                      <button
                        type="submit"
                        className="auth-modern-btn"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            កំពុងបង្កើត...
                          </>
                        ) : (
                          "Get Started"
                        )}
                      </button>
                    </div>

                    <div className="col-xl-12 mt-4">
                      <p className="text-center mb-0 text-muted">
                        Are you a volunteer?{" "}
                        <Link
                          href="/auth/register"
                          style={{ color: "#2d6a4f", fontWeight: 700 }}
                        >
                          Register as Volunteer
                        </Link>
                      </p>
                    </div>
                  </form>
                </AuthShell>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
