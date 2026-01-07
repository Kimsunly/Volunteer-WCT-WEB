"use client";
import React from "react";

export default function ContactMap() {
  return (
    <iframe
      className="rounded-3"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.075322378142!2d104.8895335!3d11.5684338!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109519d78b810b7%3A0x2300d568887136a3!2sRoyal%20University%20of%20Phnom%20Penh!5e0!3m2!1sen!2skh!4v1700000000000!5m2!1sen!2skh"
      width="100%"
      height="250"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="Royal University of Phnom Penh Map"
    />
  );
}
