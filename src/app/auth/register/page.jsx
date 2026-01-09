"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authAPI } from '@/lib/api';
import { AuthShell, PasswordField } from "../components";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    phone: '' // Required by your Python model
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Construct the exact payload your FastAPI Model (UserRegister) expects
      const payload = {
        email: formData.email.trim(),
        password: formData.password,
        first_name: formData.firstname.trim(),
        last_name: formData.lastname.trim(),
        phone: formData.phone || "" 
      };

      console.log("Submitting Payload:", payload);

      const response = await authAPI.register(payload);
      console.log("Registration Success:", response);
      
      // Redirect to login after successful registration
      router.push('/auth/login?registered=true');
    } catch (err) {
      console.error("Register Error:", err);
      
      // 2. Robust Error Parsing to prevent React crashes
      const detail = err.response?.data?.detail;
      
      if (Array.isArray(detail)) {
        // This handles the 422 Unprocessable Entity validation list
        // detail[0].loc[1] is the name of the field that failed (e.g., "first_name")
        const field = detail[0].loc[1];
        const msg = detail[0].msg;
        setError(`បញ្ចូលទិន្នន័យខុស: ${field} - ${msg}`);
      } else if (typeof detail === 'string') {
        setError(detail);
      } else {
        setError("ការចុះឈ្មោះមិនបានសម្រេច។ សូមពិនិត្យមើលទិន្នន័យម្តងទៀត។");
      }
    } finally {
      setLoading(false);
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
                    onSubmit={handleSubmit}
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
                        value={formData.firstname}
                        onChange={handleChange}
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
                        value={formData.lastname}
                        onChange={handleChange}
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
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      <div className="invalid-feedback">
                        សូមបញ្ចូលអ៊ីមែលត្រឹមត្រូវ!
                      </div>
                    </div>

                    <PasswordField
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      minLength={6}
                    />

                    <div className="col-12">
                      <label htmlFor="phone" className="form-label">
                        លេខទូរសព្ទ
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        placeholder="បញ្ចូលលេខទូរសព្ទ"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>

                    {error && (
                      <div className="col-12">
                        <div className="alert alert-danger" role="alert">
                          {error}
                        </div>
                      </div>
                    )}

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
                      <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? "កំពុងបង្កើត..." : "បង្កើតគណនី"}
                      </button>
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