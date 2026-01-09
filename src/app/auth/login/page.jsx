"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authAPI } from '@/lib/api';
import { AuthShell, PasswordField } from "../components";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
      const response = await authAPI.login(formData);
      console.log("Login Success:", response);
      router.push('/dashboard');
    } catch (err) {
      console.error("Login Error:", err);
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : "អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ");
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
                  imageSrc="/images/homepage/login-img.jpg"
                  title="ចូលប្រើប្រាស់គណនី"
                  subtitle="សូមស្វាគមន៍មកកាន់វេទិកាស្ម័គ្រចិត្ត"
                >
                  <form
                    id="loginForm"
                    className="row gy-3 needs-validation"
                    noValidate
                    onSubmit={handleSubmit}
                  >
                    {error && (
                      <div className="col-12">
                        <div className="alert alert-danger" role="alert">
                          {error}
                        </div>
                      </div>
                    )}

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
                        សូមបញ្ចូលអ៊ីមែលត្រឹមត្រូវ។
                      </div>
                    </div>

                    <PasswordField
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                    />

                    <div className="col-12 d-flex justify-content-between align-items-center">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="rememberMe"
                          defaultChecked
                        />
                        <label
                          className="form-check-label"
                          htmlFor="rememberMe"
                        >
                          ចងចាំខ្ញុំ
                        </label>
                      </div>
                      <Link href="/auth/forget-password">
                        ភ្លេចពាក្យសម្ងាត់?
                      </Link>
                    </div>

                    <div className="col-12">
                      <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? "កំពុងចូល..." : "ចូលគណនី"}
                      </button>
                    </div>

                    <div className="col-12">
                      <div className="d-flex align-items-start">
                        <hr />
                        <span className="mx-2">ឬ</span>
                        <hr />
                      </div>
                    </div>
                      {/* Social login (static) */}
                      <div className="col-12">
                      <ul className="login-list">
                        <li>
                          <a href="#">
                            <Image
                              src="/images/Icon/facebook.png"
                              alt="Facebook"
                              width={40}
                              height={40}
                            />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <Image
                              src="/images/Icon/search.png"
                              alt="Google"
                              width={40}
                              height={40}
                            />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <Image
                              src="/images/Icon/github.png"
                              alt="GitHub"
                              width={40}
                              height={40}
                            />
                          </a>
                        </li>
                      </ul>
                    </div>

                    <div className="col-12">
                      <p className="text-center mb-0">
                        មិនទាន់មានគណនីទេ?{" "}
                        <Link href="/auth/register">ចុះឈ្មោះ</Link>
                      </p>
                    </div>

                    <div className="col-12">
                      <div className="d-flex align-items-start">
                        <hr />
                      </div>
                    </div>

                    <div className="col-12">
                      <p className="text-center mb-0">
                        គណនីរបស់អង្គការមែនទេ?{" "}
                        <Link href="/auth/org/login">ចូលគណនី</Link>
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