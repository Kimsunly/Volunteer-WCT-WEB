
// src/app/donation/page.jsx
"use client";

import React, { useState } from "react";
import {
    DonationHero,
    DonationGrid,
    DonationForm,
    SidebarContact,
    Testimonials,
    FAQ,
    ContactCTA,
    InfoModal,
    BloodDonateModal,
    QRDonateModal,
} from "./components";

export default function DonationPage() {
    // Local modal state
    const [infoModal, setInfoModal] = useState({ open: false, title: "", body: "" });
    const [bloodModalOpen, setBloodModalOpen] = useState(false);
    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [qrModalHospital, setQrModalHospital] = useState(null);

    const hospitals = [
        {
            id: "koma-angkor",
            name: "Koma Angkor Children's Hospital",
            qrImage: "/images/Donation/QR-Koma-Angkor.png",
            location: "សមាមកមុមារអង្គរវត្ត • Siem Reap",
            description: "ជួយគាំទ្រការថែទាំសុខភាពកុមារ ដោយផ្តល់ថ្នាំ វីភាគ និងការថែទាំបន្ទាន់ឥតគិតថ្លៃ។",
            mission: "បេសកម្មរបស់យើងគឺផ្តល់សេវាពេទ្យឥតគិតថ្លៃដល់កុមារក្រីក្រនៅភាគខាងជើងនៃប្រទេសកម្ពុជា។",
            services: [
                "ការថែទាំបន្ទាន់ (Emergency Care)",
                "ការវះកាត់កុមារ (Pediatric Surgery)",
                "ការព្យាបាលជំងឺមហារីកកុមារ (Pediatric Oncology)",
                "ការថែទាំដំបូង (Primary Care)",
                "កម្មវិធីវ៉ាក់សាំង (Vaccination Programs)"
            ],
            founded: 2003
        },
        {
            id: "kuntha-bopha",
            name: "Jayavarman VII – Kantha Bopha",
            qrImage: "/images/Donation/Kantha-Bopha-qr.jpg",
            location: "មន្ទីរពេទ្យកុមារ • Phnom Penh & Siem Reap",
            description: "ជួយថែទាំកុមារក្រីក្រ ជាមួយនឹងសេវាពេទ្យឥតគិតថ្លៃ និងការពិបាលជំងឺធ្ងន់ធ្ងរ។",
            mission: "ផ្តល់ការថែទាំសុខភាពឥតគិតថ្លៃដល់កុមារទាំងអស់ ដោយមិនគិតពីស្ថានភាពសេដ្ឋកិច្ច។",
            services: [
                "ការថែទាំបន្ទាន់ 24 ម៉ោង (24hr Emergency)",
                "ការវះកាត់បេះដូងកុមារ (Pediatric Cardiac Surgery)",
                "ការព្យាបាលជំងឺខួរឆ្អឹង (Neonatal Care)",
                "កម្មវិធីបណ្តុះបណ្តាល (Training Programs)",
                "មណ្ឌលស្រាវជ្រាវ (Research Center)"
            ],
            founded: 1992
        }
    ];

    const handleQRDonate = (hospitalId) => {
        const hospital = hospitals.find(h => h.id === hospitalId);
        if (hospital) {
            setQrModalHospital(hospital);
            setQrModalOpen(true);
        }
    };

    return (
        <main className="flex-grow-1 mt-5 overflow-x-hidden">
            {/* Hero + Stats */}
            <DonationHero />

            {/* Cards grid */}
            <section className="container mt-5">
                <DonationGrid
                    onInfo={(payload) => setInfoModal({ open: true, ...payload })}
                    onBloodRegister={() => setBloodModalOpen(true)}
                    onQRDonate={handleQRDonate}
                />
            </section>

            {/* Form + Sidebar */}
            <section className="container mb-5">
                <div className="row g-4">
                    {/* Main Form */}
                    <div className="col-lg-8" data-aos="fade-up">
                        <DonationForm />
                    </div>

                    {/* Sidebar */}
                    <div className="col-lg-4">
                        <div
                            className="p-4"
                            style={{
                                backgroundColor: "white",
                                borderRadius: "20px",
                                boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
                            }}
                            data-aos="fade-left"
                        >
                            <SidebarContact />
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="container mb-5" data-aos="fade-up">
                <Testimonials />
            </section>

            {/* FAQ */}
            <section className="faq-donation-modern">
                <div className="container">
                    <FAQ />
                    <ContactCTA />
                </div>
            </section>

            {/* Info Modal */}
            <InfoModal
                open={infoModal.open}
                title={infoModal.title}
                onClose={() => setInfoModal({ open: false, title: "", body: "" })}
            >
                {infoModal.body}
            </InfoModal>

            {/* QR Donate Modal */}
            {qrModalHospital && (
                <QRDonateModal
                    open={qrModalOpen}
                    onClose={() => {
                        setQrModalOpen(false);
                        setQrModalHospital(null);
                    }}
                    hospital={qrModalHospital}
                />
            )}

            {/* Blood Donation Modal */}
            <BloodDonateModal open={bloodModalOpen} onClose={() => setBloodModalOpen(false)} />
        </main>
    );
}
