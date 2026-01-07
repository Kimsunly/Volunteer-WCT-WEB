
// src/app/donation/page.jsx
"use client";

import React, { useState } from "react";
import {
    DonationHero,
    DonationGrid,
    DonationForm,
    SidebarSecurity,
    SidebarContact,
    SidebarSelectedCause,
    Testimonials,
    FAQ,
    ContactCTA,
    InfoModal,
    BloodDonateModal,
} from "./components";

export default function DonationPage() {
    // Local modal state
    const [infoModal, setInfoModal] = useState({ open: false, title: "", body: "" });
    const [bloodModalOpen, setBloodModalOpen] = useState(false);

    // Example cause selected in sidebar (can wire to DonationForm later)
    const selectedCause = {
        name: "General Fund",
        collected: 45000,
        target: 100000,
        percent: 45,
        description: "គាំទ្រកម្មវិធីទូទៅរបស់អង្គការ",
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
                        <div className="sidebar-card-modern" data-aos="fade-left" data-aos-delay="100">
                            <SidebarSecurity />
                        </div>

                        <div className="sidebar-card-modern" data-aos="fade-left" data-aos-delay="200">
                            <SidebarContact />
                        </div>

                        <div className="sidebar-card-modern" data-aos="fade-left" data-aos-delay="300">
                            <SidebarSelectedCause cause={selectedCause} />
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

            {/* Info Modal (for the first two cards) */}
            <InfoModal
                open={infoModal.open}
                title={infoModal.title}
                onClose={() => setInfoModal({ open: false, title: "", body: "" })}
            >
                {infoModal.body}
            </InfoModal>

            {/* Blood Donation Modal */}
            <BloodDonateModal open={bloodModalOpen} onClose={() => setBloodModalOpen(false)} />
        </main>
    );
}
