
// src/app/contact/page.jsx
import React from "react";
import {
    ContactHero,
    ContactInfoList,
    ContactMap,
    ContactForm,
} from "./components";

export default function ContactPage() {
    return (
        <main className="flex-grow-1 contact-main">
            <section className="contact-area">
                <div className="container">
                    {/* Title & intro */}
                    <ContactHero />

                    {/* Two-column: info + map | form */}
                    <div className="row gy-3 mt-5">
                        {/* Left column: contact info + map */}
                        <div
                            className="col-12 col-xl-5"
                            data-aos="fade-right"
                            data-aos-offset="200"
                            data-aos-easing="ease-in-sine"
                        >
                            <div className="contact-info">
                                <ContactInfoList />
                                <div className="map" data-aos="zoom-in" data-aos-delay="400">
                                    <ContactMap />
                                </div>
                            </div>
                        </div>

                        {/* Right column: form */}
                        <div
                            className="col-12 col-xl-7"
                            data-aos="fade-left"
                            data-aos-offset="200"
                            data-aos-easing="ease-in-sine"
                        >
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
