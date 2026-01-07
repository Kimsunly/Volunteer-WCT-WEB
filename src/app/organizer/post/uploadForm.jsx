"use client";
import { supabase } from "@/lib/supabase";

export default function PostOpportunity() {
  async function handlePost(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    const newEntry = {
      title: formData.get("title"),
      category_slug: formData.get("category"),
      location_label: formData.get("location"),
      description: formData.get("description"),
      organization: formData.get("organization"),
      images: [formData.get("image_url")], // ដាក់ URL រូបភាពសិនដើម្បីលឿន
      date_range: formData.get("date"),
    };

    const { error } = await supabase.from("opportunities").insert([newEntry]);
    
    if (!error) {
      alert("បង្ហោះបានជោគជ័យ!");
      window.location.href = "/opportunities";
    }
  }

  return (
    <div className="container mt-5 pt-5">
      <form onSubmit={handlePost} className="card p-4 shadow-sm mx-auto" style={{maxWidth: '600px'}}>
        <h2 className="mb-4">បង្ហោះការងារស្ម័គ្រចិត្តថ្មី</h2>
        <input name="title" className="form-control mb-3" placeholder="ចំណងជើង" required />
        <input name="organization" className="form-control mb-3" placeholder="ឈ្មោះអង្គការ" required />
        <input name="image_url" className="form-control mb-3" placeholder="Link រូបភាព (URL)" required />
        <textarea name="description" className="form-control mb-3" placeholder="ការពិពណ៌នាសង្ខេប"></textarea>
        <button type="submit" className="btn btn-primary w-100">ផុសឥឡូវនេះ</button>
      </form>
    </div>
  );
}