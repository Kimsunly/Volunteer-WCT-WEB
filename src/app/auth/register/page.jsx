"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AuthShell, PasswordField } from "../components";
import { register as apiRegister, me as apiMe } from "@/lib/services/auth";
import { useRouter } from "next/navigation";
import { setAuth } from "@/lib/utils/authState";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import LoadingButton from "@/components/common/LoadingButton";

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const payload = {
      firstname: form.querySelector("#firstname")?.value,
      lastname: form.querySelector("#lastname")?.value,
      email: form.querySelector("#email")?.value,
      password: form.querySelector("#password")?.value,
      passwordConfirm: form.querySelector("#passwordConfirm")?.value,
      phone: form.querySelector("#phone")?.value,
    };
    // quick client-side check
    if (
      payload.password &&
      payload.passwordConfirm &&
      payload.password !== payload.passwordConfirm
    ) {
      toast.error("ពាក្យសម្ងាត់ និងបញ្ជាក់មិនត្រូវគ្នា");
      return;
    }
    try {
      setSubmitting(true);
      const { token, data } = await apiRegister(payload);
      if (token) {
        setAuth({ token });
        // Fetch user info to populate context and role
        const userInfo = await apiMe();
        const role = userInfo?.role || data?.user?.role || "user";
        setAuth({ token, role });
        setUser({
          id: userInfo?.id || data?.user?.id,
          name:
            userInfo?.name ||
            `${payload.firstname || ""} ${payload.lastname || ""}`.trim(),
          email: userInfo?.email || data?.user?.email || payload.email,
          role,
          profileImage: userInfo?.image || "/images/profile.png",
        });
        toast.success("ចុះឈ្មោះបានជោគជ័យ!");
      }
      // Direct to home screen after successful register
      router.push("/");
    } catch (err) {
      console.error("Register error", err);
      const msg = err?.message || "ការចុះឈ្មោះបរាជ័យ";
      toast.error(msg);
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
                  imageSrc="/images/homepage/register-img.jpg"
                  title="បង្កើតគណនីរបស់អ្នក"
                  subtitle="ចាប់ផ្តើមធ្វើការផ្លាស់ប្តូរជាមួយយើង"
                >
                  <form
                    id="registerForm"
                    className="row gy-3 needs-validation"
                    noValidate
                    onSubmit={onSubmit}
                  >
                    <div className="col-12 col-md-6">
                      <label htmlFor="firstname" className="form-label">
                        គោត្តនាម
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="firstname"
                        placeholder="បញ្ចូលគោត្តនាម"
                        defaultValue="ចាន់"
                        required
                      />
                      <div className="invalid-feedback">
                        សូមបញ្ចូលគោត្តនាមរបស់អ្នក!
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <label htmlFor="lastname" className="form-label">
                        នាមខ្លួន
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="lastname"
                        placeholder="បញ្ចូលនាម"
                        defaultValue="រដ្ឋនា"
                        required
                      />
                      <div className="invalid-feedback">
                        សូមបញ្ចូលនាមរបស់អ្នក!
                      </div>
                    </div>

                    <div className="col-12">
                      <label htmlFor="email" className="form-label">
                        អ៊ីមែល
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="បញ្ចូលអ៊ីមែល"
                        defaultValue="RathanaKh123@gmail.com"
                        required
                      />
                      <div className="invalid-feedback">
                        សូមបញ្ចូលអ៊ីមែលត្រឹមត្រូវ!
                      </div>
                    </div>

                    <PasswordField
                      id="password"
                      defaultValue="1234567"
                      minLength={6}
                    />

                    <PasswordField
                      id="passwordConfirm"
                      label="បញ្ជាក់ពាក្យសម្ងាត់"
                      defaultValue="1234567"
                      minLength={6}
                    />

                    <div className="col-12">
                      <label htmlFor="phone" className="form-label">
                        លេខទូរស័ព្ទ
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        placeholder="បញ្ចូលលេខទូរស័ព្ទ"
                        defaultValue="+855 12 345 678"
                        required
                      />
                      <div className="invalid-feedback">
                        សូមបញ្ចូលលេខទូរស័ព្ទត្រឹមត្រូវ!
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="terms"
                          defaultChecked
                          required
                        />
                        <label className="form-check-label" htmlFor="terms">
                          ខ្ញុំយល់ព្រមតាមលក្ខខណ្ឌ និង គោលការណ៍ឯកជន
                        </label>
                        <div className="invalid-feedback">
                          សូមយល់ព្រមនឹងលក្ខខណ្ឌ!
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <LoadingButton
                        type="submit"
                        className="btn btn-primary w-100"
                        loading={submitting}
                        loadingText="កំពុងបង្កើត..."
                      >
                        បង្កើតគណនី
                      </LoadingButton>
                    </div>

                    <div className="col-12">
                      <p className="text-center mb-0">
                        មានគណនីរួចហើយ? <Link href="/auth/login">ចូលគណនី</Link>
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
