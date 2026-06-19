"use client";

import { useEffect, useState } from "react";

export default function SafeDate({ dateString, locale = "km-KH", options = {} }) {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    if (!dateString) {
      setFormattedDate("TBD");
      return;
    }
    try {
      const date = new Date(dateString);
      const defaultOptions = {
        day: "2-digit",
        month: "short",
        year: "numeric",
      };
      setFormattedDate(date.toLocaleDateString(locale, { ...defaultOptions, ...options }));
    } catch {
      setFormattedDate(dateString);
    }
  }, [dateString, locale, options]);

  return <span>{formattedDate}</span>;
}
