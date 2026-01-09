import { supabase } from "@/lib/supabase";

export default async function DetailPage({ params }) {
  const { id } = await params;
  
  // ទាញទិន្នន័យតាម ID
  const { data: opp } = await supabase
    .from('opportunities')
    .select('*')
    .eq('id', id)
    .single();

  if (!opp) return <div>រកមិនឃើញទិន្នន័យ</div>;

  // Compute a safe image source from various possible shapes
  let imageSrc = "/placeholder.svg";
  if (Array.isArray(opp.images) && opp.images.length) {
    const first = opp.images[0];
    if (typeof first === "string") imageSrc = first;
    else if (first && (first.url || first.path || first.name)) imageSrc = first.url || first.path || first.name;
  } else if (typeof opp.images === "string" && opp.images.trim() !== "") {
    try {
      const parsed = JSON.parse(opp.images);
      if (Array.isArray(parsed) && parsed.length) imageSrc = typeof parsed[0] === "string" ? parsed[0] : parsed[0]?.url || parsed[0]?.path || imageSrc;
      else if (typeof parsed === "string") imageSrc = parsed;
    } catch (e) {
      imageSrc = opp.images;
    }
  } else if (opp.imageUrl) {
    imageSrc = opp.imageUrl;
  }

  return (
    <div className="container mt-5 pt-5">
      <img src={imageSrc} className="w-100 rounded shadow" style={{maxHeight: '400px', objectFit: 'cover'}} />
      <h1 className="mt-4">{opp.title}</h1>
      <p className="badge bg-primary">{opp.category_label}</p>
      <div className="mt-4 border-top pt-3">
        <h3>ព័ត៌មានលម្អិត</h3>
        <p>{opp.description}</p>
        <p><strong>ទីតាំង៖</strong> {opp.location_label}</p>
        <p><strong>រៀបចំដោយ៖</strong> {opp.organization}</p>
      </div>
    </div>
  );
}