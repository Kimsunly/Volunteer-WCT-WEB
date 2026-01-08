import HeroBanner from "../(landing)/components/HeroBanner";
import AboutUs from "../(landing)/components/AboutUs";
import StatsStripModern from "@/components/base/StatsStripModern";
import LandingOpportunities from "../(landing)/components/LandingOpportunities";
import UpcomingEvents from "../(landing)/components/UpcomingEvents";
import CTAJoin from "../(landing)/components/CTAJoin";
import BenefitsGrid from "../(landing)/components/BenefitsGrid";
import FAQAccordion from "../(landing)/components/FAQAccordion";
import TestimonialsSlider from "../(landing)/components/TestimonialsSlider";

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
    detailHref: "/opportunities/1",
    isFavorite: false,
  },
  {
    id: "opp-2",
    title: "យុទ្ធនាការសម្អាតឆ្នេរ",
    category: {
      label: "បរិស្ថាន",
      colorClass: "bg-success",
      icon: "bi bi-tree",
    },
    imageUrl: "/images/opportunities/Environment/card-2/img-6.png",
    location: "ខេត្តកោះកុង",
    date: "១៥ កញ្ញា ២០២៥",
    time: "ម៉ោង ៧:៣០ - ១១:៣០",
    capacityLabel: "ចំនួន ៥០ នាក់",
    benefits: ["transport", "housing"],
    detailHref: "/opportunities/2",
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
    detailHref: "/opportunities/3",
    isFavorite: false,
  },
  {
    id: "opp-4",
    title: "ការបង្រៀនកុមារ",
    category: { label: "កុមារ", colorClass: "bg-warning", icon: "bi bi-heart" },
    imageUrl: "/images/opportunities/Childcare/card-10/img-1.png",
    location: "ភ្នំពេញ",
    date: "១០ ឧសភា ២០២៥",
    time: "ម៉ោង ២:០០ - ៥:០០",
    capacityLabel: "ចំនួន ១៥ នាក់",
    benefits: ["transport", "food"],
    detailHref: "/opportunities/4",
    isFavorite: true,
  },
  {
    id: "opp-5",
    title: "ការថែទាំសុខភាព",
    category: {
      label: "សុខភាព",
      colorClass: "bg-danger",
      icon: "bi bi-hospital",
    },
    imageUrl: "/images/opportunities/Health/card-14/img-1.png",
    location: "ខេត្តបាត់ដំបង",
    date: "២០ មិថុនា ២០២៥",
    time: "ម៉ោង ៨:០០ - ១២:០០",
    capacityLabel: "ចំនួន ៣០ នាក់",
    benefits: ["housing", "food"],
    detailHref: "/opportunities/1",
    isFavorite: false,
  },
  {
    id: "opp-6",
    title: "ការដាំដើមឈើ",
    category: {
      label: "បរិស្ថាន",
      colorClass: "bg-success",
      icon: "bi bi-tree",
    },
    imageUrl: "/images/opportunities/Environment/card-11/img-1.png",
    location: "ខេត្តសៀមរាប",
    date: "៥ កក្កដា ២០២៥",
    time: "ម៉ោង ៦:០០ - ១០:០០",
    capacityLabel: "ចំនួន ១០០ នាក់",
    benefits: ["transport", "food"],
    detailHref: "/opportunities/2",
    isFavorite: false,
  },
];

const mockEvents = [
  {
    id: "evt-1",
    title: "វគ្គបណ្តុះបណ្តាលអ្នកដឹកនាំ",
    date: "២៥ មីនា ២០២៥",
    time: "ម៉ោង ៨:០០",
    location: "ភ្នំពេញ",
    imageUrl: "/images/even-soon/1.jpg",
    detailHref: "/event/evt-1",
  },
  {
    id: "evt-2",
    title: "យុទ្ធនាការសម្អាតឆ្នេរ",
    date: "១០ មេសា ២០២៥",
    time: "ម៉ោង ៧:៣០",
    location: "ខេត្តកោះកុង",
    imageUrl: "/images/even-soon/2.jpg",
    detailHref: "/event/evt-2",
  },
  {
    id: "evt-3",
    title: "ពិព័រណ៍វប្បធម៌",
    date: "១៥ ឧសភា ២០២៥",
    time: "ម៉ោង ៩:០០",
    location: "ខេត្តសៀមរាប",
    imageUrl: "/images/even-soon/3.jpg",
    detailHref: "/event/evt-3",
  },
];

export default function HomepageContent() {
  return (
    <main className="flex-shrink-0">
      <HeroBanner />
      <AboutUs />
      <StatsStripModern />
      <LandingOpportunities items={mockOpportunities} />
      <UpcomingEvents items={mockEvents} />
      <BenefitsGrid />
      <TestimonialsSlider />
      <CTAJoin />
      <FAQAccordion />
    </main>
  );
}
