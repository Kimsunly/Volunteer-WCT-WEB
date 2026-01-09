"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell, UploadArea, PasswordField } from "../../components";

export default function OrgRegisterPage() {
  const router = useRouter();
  const [orgType, setOrgType] = useState("");

  const onFile = (file) => {
    // You can upload to backend or store in state
    console.log("Selected file:", file);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const form = document.getElementById("orgRegisterForm");
    if (!form?.checkValidity()) {
      form?.classList.add("was-validated");
      return;
    }
    alert("បង្កើតគណនីអង្គការ (Mock)");
    router.push("/auth/org/confirm");
  };

  return (
    <div className="authentication-body org-login">
      <main>
        <section>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-xl-9 d-flex">
                <AuthShell
                  imageSrc="/images/homepage/register-img.jpg"
                  title="បង្កើតគណនីរបស់អង្គការ"
                >
                  <form
                    id="orgRegisterForm"
                    className="row gy-2 needs-validation"
                    noValidate
                    onSubmit={onSubmit}
                  >
                    <div className="col-xl-12">
                      <label htmlFor="orgname" className="form-label">
                        ឈ្មោះអង្គការ ៖
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="orgname"
                        defaultValue="អង្គការមនុស្សធម៏ដើម្បីកម្ពុជា"
                        placeholder="បញ្ចូលឈ្មោះអង្គការ"
                        required
                      />
                      <div className="invalid-feedback">
                        សូមបញ្ចូលឈ្មោះអង្គការ។
                      </div>
                    </div>

                    <div className="col-xl-6">
                      <label htmlFor="email" className="form-label">
                        អ៊ីមែល ៖
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        defaultValue="Volunteer@gmail.com"
                        placeholder="បញ្ចូលអ៊ីមែល"
                        required
                      />
                      <div className="invalid-feedback">
                        សូមបញ្ចូលអ៊ីមែលត្រឹមត្រូវ។
                      </div>
                    </div>

                    <div className="col-xl-6">
                      <label htmlFor="phone" className="form-label">
                        លេខទូរស័ព្ទ ៖
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        defaultValue="+855 683 828 00"
                        placeholder="បញ្ចូលលេខទូរស័ព្ទ"
                        required
                      />
                      <div className="invalid-feedback">
                        សូមបញ្ចូលលេខទូរស័ព្ទ។
                      </div>
                    </div>

                    <PasswordField
                      id="password"
                      label="ពាក្យសម្ងាត់ ៖"
                      defaultValue="SokryPes@123"
                    />

                    <div className="col-xl-12">
                      <label htmlFor="orgType" className="form-label">
                        ប្រភេទអង្គការ ៖
                      </label>
                      <select
                        id="orgType"
                        className="form-control"
                        value={orgType}
                        onChange={(e) => setOrgType(e.target.value)}
                        required
                      >
                        <option value="">ជ្រើសរើសអង្គការ</option>
                        <option value="environment">អង្គការបរិស្ថាន</option>
                        <option value="health">អង្គការសុខាភិបាល</option>
                        <option value="community">អង្គការសហគមន៏</option>
                        <option value="charity">អង្គការមនុស្សធម៏</option>
                      </select>
                      <div className="invalid-feedback">
                        សូមជ្រើសរើសប្រភេទអង្គការ។
                      </div>
                    </div>

                    <div className="col-xl-12">
                      <label className="form-label">រូបសញ្ញាអង្គការ ៖</label>
                      <UploadArea onFile={onFile} />
                    </div>

                    <div className="col-xl-12">
                      <div>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="agree"
                          defaultChecked
                          required
                        />
                        <label className="form-check-label" htmlFor="agree">
                          លក្ខខណ្ឌ និង គោរពគោលការណ៏ឯកជន
                        </label>
                        <div className="invalid-feedback">
                          ត្រូវតែយល់ព្រមមុនពេលបន្ត។
                        </div>
                      </div>
                    </div>

                    <div className="col-xl-12">
                      <button
                        type="submit"
                        className="text-white btn btn-primary w-100"
                      >
                        បង្កើតគណនី
                      </button>
                    </div>

                    <div className="col-xl-12">
                      <p className="text-center">
                        មានគណនីអង្គការរួចហើយ?{" "}
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
