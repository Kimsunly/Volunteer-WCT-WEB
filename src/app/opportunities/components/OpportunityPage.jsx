// app/opportunities/page.jsx
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../../../lib/supabase"; // relative import to be robust against alias issues
import OpportunityCard from "../../../components/cards/OpportunityCard";
import EventCard from "@/components/cards/EventCard";

export default function OpportunityPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters / search state
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // ១. ទាញទិន្នន័យពី Database
  useEffect(() => {
    async function fetchOpps() {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setOpportunities(data);
      setLoading(false);
    }
    fetchOpps();
  }, []);

  // ២. កែសម្រួល filtered logic ឱ្យប្រើ opportunities ពី state
  const filtered = useMemo(() => {
    const q = (searchTerm || "").trim().toLowerCase();
    return opportunities.filter((opp) => {
      const oppCat = opp.category?.slug || opp.category_slug || "";
      const oppLoc = opp.location?.slug || opp.location_slug || "";
      const matchCat = selectedCategory === "all" || oppCat === selectedCategory;
      const matchLoc = selectedLocation === "all" || oppLoc === selectedLocation;
      const matchSearch = !q || (opp.title && opp.title.toLowerCase().includes(q)) || (opp.description && opp.description.toLowerCase().includes(q));
      return matchCat && matchLoc && matchSearch;
    });
  }, [opportunities, selectedCategory, selectedLocation, searchTerm]);

  if (loading) return <div className="text-center p-5">កំពុងទាញទិន្នន័យ...</div>;

  return (
    <div className="container py-4">
      <div className="mb-4 d-flex gap-2 align-items-center">
        <input
          type="search"
          className="form-control"
          placeholder="រកឈ្មោះឬពាក្យស្វែងរក..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="form-select"
        >
          <option value="all">ទាំងអស់</option>
          {Array.from(new Set(opportunities.map((o) => o.category?.slug || o.category_slug).filter(Boolean))).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="form-select"
        >
          <option value="all">ទីតាំងទាំងអស់</option>
          {Array.from(new Set(opportunities.map((o) => o.location?.slug || o.location_slug).filter(Boolean))).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="row">
        {filtered.length === 0 ? (
          <div className="text-center p-5">គ្មានលទ្ធផល</div>
        ) : (
          filtered.map((opp) => <OpportunityCard key={opp.id} data={opp} />)
        )}
      </div>
    </div>
  );
}
