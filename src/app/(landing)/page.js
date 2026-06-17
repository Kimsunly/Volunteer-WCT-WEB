import { cookies } from "next/headers";
import HomepageContent from "../homepage/HomepageContent";
import HeroBanner from "./components/HeroBanner";
import AboutUs from "./components/AboutUs";
import StatsStripModern from "@/components/base/StatsStripModern";
import LandingOpportunities from "./components/LandingOpportunities";
import UpcomingEvents from "./components/UpcomingEvents";
import CTAJoin from "./components/CTAJoin";
import OrganizerCTA from "./components/OrganizerCTA";
import BenefitsGrid from "./components/BenefitsGrid";
import FAQAccordion from "./components/FAQAccordion";
import TestimonialsSlider from "./components/TestimonialsSlider";



async function getUpcomingEvents() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/events/upcoming`, { cache: 'no-store' });
        if (res.ok) {
            const json = await res.json();
            if (json.success && json.data) {
                return json.data;
            }
        }
    } catch (e) {
        console.error("Failed to fetch upcoming events:", e);
    }
    return [];
}

async function getOpportunities() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("authToken")?.value || cookieStore.get("token")?.value;
        const headers = {};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/opportunities?limit=6`, {
            headers,
            cache: 'no-store'
        });
        if (res.ok) {
            const json = await res.json();
            if (json.data) {
                return json.data;
            }
        }
    } catch (e) {
        console.error("Failed to fetch opportunities:", e);
    }
    return [];
}

async function getTestimonials() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/testimonials`, { cache: 'no-store' });
        if (res.ok) {
            const json = await res.json();
            if (json.success && json.data) {
                return json.data;
            }
        }
    } catch (e) {
        console.error("Failed to fetch testimonials:", e);
    }
    return [];
}

export default async function LandingPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;
    
    // Let's verify the token is valid before showing HomepageContent
    let isValidToken = false;
    if (token) {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.ok) {
                isValidToken = true;
            }
        } catch (e) {
            console.error("Token validation failed:", e);
        }
    }

    if (token && isValidToken) {
        return <HomepageContent />;
    }

    const events = await getUpcomingEvents();
    const opportunities = await getOpportunities();
    const testimonials = await getTestimonials();

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    const ensureAbsoluteUrl = (path) => {
        if (!path) return path;
        if (path.startsWith('http')) return path;
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        if (cleanPath.startsWith('/storage/')) return `${apiBaseUrl}${cleanPath}`;
        if (cleanPath.startsWith('/uploads/')) return `${apiBaseUrl}${cleanPath}`;
        if (cleanPath.startsWith('/images/')) return cleanPath; // local public assets
        return `${apiBaseUrl}/storage${cleanPath}`;
    };

    // Map backend opportunities to card structure
    const mappedOpportunities = Array.isArray(opportunities) ? opportunities.map(item => {
        const catName = item.category?.name || item.category_label || (typeof item.category === 'string' ? item.category : '');
        const locName = item.location_label || item.logistic?.location_label || (typeof item.location === 'string' ? item.location : '');

        // Handle images array - ensure absolute URLs
        let rawImages = [];
        if (item.details?.images_json) {
            rawImages = item.details.images_json;
        } else if (item.images) {
            rawImages = typeof item.images === 'string' ? item.images.split(',') : item.images;
        }

        const images = (Array.isArray(rawImages) ? rawImages : []).map(ensureAbsoluteUrl);

        return {
            ...item,
            id: String(item.id),
            category: {
                slug: catName ? catName.toLowerCase().replace(/\s+/g, '-') : 'all',
                label: catName || 'ផ្សេងៗ'
            },
            location: {
                slug: locName ? locName.toLowerCase().replace(/\s+/g, '-') : 'all',
                label: locName || 'TBD'
            },
            images: images,
            imageUrl: images[0] || "/images/placeholder.png",
            date: item.logistic?.start_date ? new Date(item.logistic.start_date).toLocaleDateString('km-KH', { day: '2-digit', month: 'long', year: 'numeric' }) : 'TBD',
            time: item.logistic?.time_range || 'TBD',
            transport: item.logistic?.transport,
            housing: item.logistic?.housing,
            meals: item.logistic?.meals || item.logistic?.meal,
            detailHref: `/opportunities/${item.id}`,
        };
    }) : [];

    // Map backend events to homepage upcoming events structure
    const mappedEvents = Array.isArray(events) ? events.map(evt => {
        const rawImg = evt.imageUrl || (evt.details?.images_json?.[0]) || (evt.images?.[0]);

        return {
            id: String(evt.id),
            title: evt.title,
            dateDay: evt.dateDay || "TBD",
            dateMonth: evt.dateMonth || "TBD",
            timeRange: evt.timeRange || "TBD",
            location: evt.location || "TBD",
            imageUrl: ensureAbsoluteUrl(rawImg) || "/images/even-soon/default.jpg",
            href: evt.href || `/opportunities/${evt.id}`,
            category: evt.category || {
                label: "Volunteer",
                icon: "bi bi-calendar-event",
                colorClass: "bg-primary"
            }
        };
    }) : [];

    const displayOpps = mappedOpportunities;
    const displayEvents = mappedEvents;

    return (
        <main>
            <HeroBanner />
            <AboutUs />
            <BenefitsGrid />
            <StatsStripModern />
            <LandingOpportunities items={displayOpps} />
            <UpcomingEvents items={displayEvents} />
            <TestimonialsSlider testimonials={testimonials} />
            <OrganizerCTA />
            <FAQAccordion />
            <CTAJoin />
        </main>
    );
}
