"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  organizerLogin,
  getOrganizerProfile,
} from "@/lib/services/organizerAuth";
import { setAuth } from "@/lib/utils/authState";
import { parseApiError } from "@/lib/utils/apiError";
import { AuthShell, PasswordField } from "../../components";
import toast from "react-hot-toast";

export default function OrgLoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    const email =
      e.currentTarget.querySelector("#email")?.value ||
      "Volunteer@gmail.com";
    const password = e.currentTarget.querySelector("#password")?.value || "SokryPes@123";
    try {
      setSubmitting(true);
      const { token } = await organizerLogin({ email, password });
      if (!token) {
        toast.error("ការចូលគណនីបានបរាជ័យ៖ មិនមានថូខឹន");
        return;
      }
      setAuth({ token, role: "organizer" });

      const profile = await getOrganizerProfile().catch(() => null);
      setUser({
        id: profile?.id,
        name: profile?.name || "អង្គការ",
        email,
        role: "organizer",
        profileImage: profile?.image || "/images/profile.png",
      });
      toast.success("ចូលគណនីបានជោគជ័យ!");
      router.push("/");
    } catch (err) {
      console.error("Organizer login error", err);
      const errorMsg = parseApiError(err);
      toast.error(errorMsg || "ការចូលគណនីបានបរាជ័យ។");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="authentication-body">
      <main>
        <section>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-xl-10 col-lg-11">
                <AuthShell
                  imageSrc="/images/homepage/login-img.jpg"
                  title="ចូលប្រើប្រាស់គណនីអង្គការ"
                  subtitle="សូមស្វាគមន៍មកកាន់វេទិកាស្ម័គ្រចិត្ត"
                >
                  <form
                    id="orgloginForm"
                    className="row gy-3 needs-validation"
                    noValidate
                    onSubmit={onSubmit}
                  >
                    <div className="col-12">
                      <label htmlFor="email" className="form-label">
                        អ៊ីមែល
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="បញ្ចូលអ៊ីមែល"
                        defaultValue="Volunteer@gmail.com"
                        required
                      />
                      <div className="invalid-feedback">
                        សូមបញ្ចូលអ៊ីមែលត្រឹមត្រូវ។
                      </div>
                    </div>

                    <PasswordField
                      id="password"
                      defaultValue="SokryPes@123"
                    />

                    <div className="col-12 d-flex justify-content-between align-items-center">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="rememberMe"
                          defaultChecked
                          required
                        />
                        <label
                          className="form-check-label"
                          htmlFor="rememberMe"
                        >
                          ចងចាំខ្ញុំ
                        </label>
                      </div>
                      <Link href="/auth/org/forget">ភ្លេចពាក្យសម្ងាត់?</Link>
                    </div>

                    <div className="col-12">
                      <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
                        {submitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            កំពុងចូល...
                          </>
                        ) : "ចូលគណនី"}
                      </button>
                    </div>

                    <div className="col-12">
                      <p className="text-center mb-0">
                        មិនទាន់មានគណនីទេ?{" "}
                        <Link href="/auth/org/register">ចុះឈ្មោះ</Link>
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
