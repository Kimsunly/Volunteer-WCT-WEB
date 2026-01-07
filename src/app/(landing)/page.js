import { cookies } from "next/headers";
import HomepageContent from "../homepage/HomepageContent";
import HeroBanner from "./components/HeroBanner";
import AboutUs from "./components/AboutUs";
import StatsStripModern from "@/components/base/StatsStripModern";
import LandingOpportunities from "./components/LandingOpportunities";
import UpcomingEvents from "./components/UpcomingEvents";
import CTAJoin from "./components/CTAJoin";
import BenefitsGrid from "./components/BenefitsGrid";
import FAQAccordion from "./components/FAQAccordion";
import TestimonialsSlider from "./components/TestimonialsSlider";

const mockOpportunities = [
    {
        id: "opp-1",
        title: "ការបង្រៀនភាសាអង់គ្លេស",
        category: { label: "អប់រំ", colorClass: "bg-primary", icon: "bi bi-book" },
        imageUrl: "/images/opportunities/Education/card-7/img-1.png",
        location: "ខេត្តកំពត",
        date: "២៥ មេសា ២០២៥",
        time: "ម៉ោង ៧:០០ - ១១:००",
        capacityLabel: "ចំនួន ២០ នាក់",
        benefits: ["transport", "housing", "food"],
        detailHref: "/opportunity/opp-1",
        isFavorite: false,
    },
    {
        id: "opp-2",
        title: "យុទ្ធនាការសម្អាតឆ្នេរ",
        category: { label: "បរិស្ថាន", colorClass: "bg-success", icon: "bi bi-tree" },
        imageUrl: "/images/opportunities/Environment/card-2/img-6.png",
        location: "ខេត្តកោះកុង",
        date: "១៥ កញ្ញា ២០២៥",
        time: "ម៉ោង ៧:៣០ - ១១:៣០",
        capacityLabel: "ចំនួន ៥០ នាក់",
        benefits: ["transport", "housing"],
        detailHref: "/opportunity/opp-2",
        isFavorite: false,
    },
    {
        id: "opp-3",
        title: "សម្អាតសហគមន៍",
        category: { label: "សហគមន៍", colorClass: "bg-info", icon: "bi bi-people" },
        imageUrl: "/images/opportunities/Childcare/card-4/img-3.png",
        location: "ខេត្តកំពត",
        date: "២៥ មេសា ២០២៥",
        time: "ម៉ោង ៧:००ー១១:००",
        capacityLabel: "ចំនួន ២០ នាក់",
        benefits: ["food"],
        detailHref: "/opportunity/opp-3",
        isFavorite: false,
    },
];

const mockEvents = [
    {
        id: "ev1",
        dateDay: "០៥",
        dateMonth: "តុលា",
        imageUrl: "/images/opportunities/Environment/card-2/img-6.png",
        category: { label: "បរិស្ថាន", icon: "bi bi-tree-fill", colorClass: "bg-success" },
        title: "ការសម្អាតឆ្នេរ",
        description: "ចូលរួមជាមួយយើងក្នុងការសម្អាតឆ្នេរ...",
        location: "ខេត្តកោះកុង",
        timeRange: "៧:៣០ - ១១:៣០",
        href: "/auth/login",
    },
    {
        id: "ev2",
        dateDay: "១៦",
        dateMonth: "តុលា",
        imageUrl: "/images/opportunities/Childcare/card-4/img-3.png",
        category: { label: "កុមារ", icon: "bi bi-heart-fill", colorClass: "bg-warning" },
        title: "ការមើលថែទាំកុមារ",
        description: "ចូលរួមជួយមើលថែទាំកុមារ...",
        location: "ភ្នំពេញ",
        timeRange: "៨:००ー១២:००",
        href: "/auth/login",
    },
    {
        id: "ev3",
        dateDay: "២១",
        dateMonth: "តុលា",
        imageUrl: "/images/opportunities/Environment/card-11/img-1.png",
        category: { label: "អប់រំ", icon: "bi bi-book-fill", colorClass: "bg-primary" },
        title: "វគ្គសិក្សាបរិស្ថាន",
        description: "រៀនអំពីការថែរក្សាបរិស្ថាន...",
        location: "ខេត្តសៀមរាប",
        timeRange: "៩:००ー១६:००",
        href: "/auth/login",
    },
    {
        id: "ev4",
        dateDay: "០២",
        dateMonth: "វិច្ឆកា",
        imageUrl: "/images/opportunities/Environment/card-11/img-2.png",
        category: { label: "បរិស្ថាន", icon: "bi bi-tree-fill", colorClass: "bg-success" },
        title: "ដាំឈើជាសហគមន៍",
        description: "ចូលរួមដាំដើមឈើជាមួយសហគមន៍...",
        location: "ខេត្តកំពង់ធំ",
        timeRange: "៦:៣០ - ១០:៣០",
        href: "/auth/login",
    },
];

export default async function LandingPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;
    if (token) {
        return <HomepageContent />;
    }

    return (
        <main>
            <HeroBanner />
            <AboutUs />
            <BenefitsGrid />
            <StatsStripModern />
            <LandingOpportunities items={mockOpportunities} />
            <UpcomingEvents items={mockEvents} />
            <TestimonialsSlider />
            <FAQAccordion />
            <CTAJoin />
        </main>
    );
}
