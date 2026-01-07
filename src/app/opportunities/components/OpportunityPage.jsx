"use client";
import { useState, useEffect, useMemo } from "react";
import OpportunityCard from "@/components/cards/OpportunityCard";
import AOSInit from "@/components/common/AOSInit";

const OPPORTUNITIES = [
  {
    id: "1",
    title: "ការបង្រៀនភាសាអង់គ្លេស",
    category: { slug: "education", label: "ការអប់រំ" },
    location: { slug: "siem-reap", label: "សៀមរាប" },
    images: [
      "/images/opportunities/Education/English teaching/image-1.png",
      "/images/opportunities/Education/English teaching/image-2.png",
      "/images/opportunities/Education/English teaching/image-3.png",
    ],
    description: "ជួយបង្រៀនថ្នាក់ភាសាអង់គ្លេសនៅតាមតំបន់ជនបទ",
    organization: "អង្គការអភិវឌ្ឍជនបទកម្ពុជា",
    date: "ថ្ងៃទី ២៥ ខែមករា ឆ្នាំ២០២៥​ - ២៥ មេសា ២០២៥",
    time: "ម៉ោង ៧:០០ - ១១:០០",
    capacity: 20,
    benefits: {
      transport: "មានរថយន្ត",
      housing: "មានកន្លែងស្នាក់នៅ",
      meals: "មានអាហារ",
    },
    detailHref: "detailpage-card-education.html",
    applyHref: "volunteer-apply.html",
  },
  {
    id: "2",
    title: "យុទ្ធនាការសម្អាតឆ្នេរ",
    category: { slug: "environment", label: "បរិស្ថាន" },
    location: { slug: "koh-kong", label: "កោះកុង" },
    images: [
      "/images/opportunities/Environment/card-2/img-1.png",
      "/images/opportunities/Environment/card-2/img-4.png",
      "/images/opportunities/Environment/card-2/img-3.png",
    ],
    description: "រួមគ្នាដើម្បីធ្វើឲ្យឆ្នេររបស់យើងស្អាត និងគ្មានសំរាម",
    organization: "អង្គការបរិស្ថានកម្ពុជា​ និង មូលនិធិបរិស្ថានកម្ពុជា",
    date: "ថ្ងៃទី ១៥ ខែកញ្ញា ឆ្នាំ២០២៥",
    time: "ម៉ោង ៧:៣០ - ១១:៣០",
    capacity: 50,
    benefits: {
      transport: "គ្មានរថយន្ត",
      housing: "គ្មានកន្លែងស្នាក់នៅ",
      meals: "អាហារ (ថ្ងៃត្រង់)",
    },
    detailHref: "detailpage-card-environment.html",
    applyHref: "volunteer-apply.html",
  },
  {
    id: "3",
    title: "ស្ម័គ្រចិត្តថែទាំសត្វ",
    category: { slug: "wildlife", label: "ជម្រកសត្វព្រៃ" },
    location: { slug: "steung-treng", label: "ស្ទឹងត្រែង" },
    images: [
      "/images/opportunities/Wildlife/card-3/img-1.png",
      "/images/opportunities/Wildlife/card-3/img-3.png",
      "/images/opportunities/Wildlife/card-3/volunteer.png",
    ],
    description:
      "ជួយថែរក្សាសត្វព្រៃដែលរងរបួស និងចូលរួមសកម្មភាពអភិរក្សនៅមជ្ឈមណ្ឌលសង្គ្រោះ",
    organization: "អង្គការអភិរក្សសត្វព្រៃ",
    date: "ថ្ងៃទី ២៨-២៩ ខែសីហា ឆ្នាំ២០២៥",
    time: "ម៉ោង ០៨:០០ - ម៉ោង ១៧:០០",
    capacity: 25,
    benefits: {
      transport: "មានរថយន្ត",
      housing: "មានកន្លែងស្នាក់នៅ",
      meals: "មានអាហារ",
    },
    detailHref: "detailpage-card-wildlife.html",
    applyHref: "volunteer-apply.html",
  },
  {
    id: "4",
    title: "ស្ម័គ្រចិត្តថែទាំកុមារ",
    category: { slug: "childcare", label: "មើលថែកុមារ" },
    location: { slug: "kandal", label: "កណ្តាល" },
    images: [
      "/images/opportunities/Childcare/card-4/img-1.png",
      "/images/opportunities/Childcare/card-4/img-2.png",
      "/images/opportunities/Childcare/card-4/img-3.png",
    ],
    description:
      "ចូលរួមជួយផ្តល់ក្តីស្រឡាញ់ ការថែទាំ និងការអប់រំដល់កុមារនៅមណ្ឌលកុមារកំព្រា",
    organization: "អង្គការសប្បុរសធម៌កម្ពុជា",
    date: "ថ្ងៃទី ០៥-០៦ ខែតុលា ឆ្នាំ២០២៥",
    time: "ម៉ោង ០៨:៣០ - ម៉ោង ១៦:៣០",
    capacity: 15,
    benefits: {
      transport: "មានរថយន្ត",
      housing: "មានកន្លែងស្នាក់នៅ",
      meals: "មានអាហារ",
    },
    detailHref: "detailpage-card-childcare.html",
    applyHref: "volunteer-apply.html",
  },
  {
    id: "5",
    title: "ស្ម័គ្រចិត្តជួយប្រមូលផល",
    category: { slug: "agriculture", label: "កសិកម្ម" },
    location: { slug: "siem-reap", label: "សៀមរាប" },
    images: [
      "/images/opportunities/Agriculture/card-5/img-1.png",
      "/images/opportunities/Agriculture/card-5/img-2.png",
      "/images/opportunities/Agriculture/card-5/img-3.png",
    ],
    description:
      "ចូលរួមជួយកសិករក្នុងមូលដ្ឋានប្រមូលផលស្រូវ និងបន្លែធម្មជាតិ ដើម្បីលើកកម្ពស់ជីវភាពរស់នៅ",
    organization: "ក្រសួងកសិកម្ម និង អង្គការកសិផលខ្មែរ",
    date: "ថ្ងៃទី ១២ ខែវិច្ឆិកា ឆ្នាំ២០២៥",
    time: "ម៉ោង ០៧:០០ - ម៉ោង ១១:០០",
    capacity: 30,
    benefits: {
      transport: "គ្មានរថយន្ត",
      housing: "គ្មានកន្លែងស្នាក់នៅ",
      meals: "មានអាហារ",
    },
    detailHref: "detailpage-card-agriculture.html",
    applyHref: "volunteer-apply.html",
  },
  {
    id: "6",
    title: "យុទ្ធនាការបរិច្ចាគឈាម",
    category: { slug: "health", label: "សុខភាព" },
    location: { slug: "phnom-penh", label: "ភ្នំពេញ" },
    images: [
      "/images/opportunities/Health/card-6/img-1.png",
      "/images/opportunities/Health/card-6/img-2.png",
      "/images/opportunities/Health/card-6/img-4.png",
    ],
    description:
      "ចូលរួមផ្តល់ក្តីសង្ឃឹម និងជួយសង្គ្រោះជីវិតអ្នកជំងឺដែលត្រូវការឈាមជាបន្ទាន់",
    organization: "មជ្ឈមណ្ឌលជាតិផ្តល់ឈាម",
    date: "ថ្ងៃទី ២៤ ខែធ្នូ ឆ្នាំ២០២៥",
    time: "ម៉ោង ០៨:០០ - ម៉ោង ១៥:០០",
    capacity: 50,
    benefits: {
      transport: "គ្មានរថយន្ត",
      housing: "គ្មានកន្លែងស្នាក់នៅ",
      meals: "គ្មានអាហារ",
    },
    detailHref: "detailpage-card-health.html",
    applyHref: "volunteer-apply.html",
  },
  {
    id: "7",
    title: "វគ្គបណ្តុះបណ្តាលជាងអគ្គិសនី",
    category: { slug: "education", label: "ការអប់រំ" },
    location: { slug: "kratié", label: "ក្រចេះ" },
    images: [
      "/images/opportunities/Education/card-7/img-1.png",
      "/images/opportunities/Education/card-7/img-2.png",
      "/images/opportunities/Education/card-7/img-3.png",
    ],
    description:
      "ចូលរួមរៀនជំនាញអគ្គិសនីដើម្បីមានឱកាសការងារល្អ និងប្រាក់ចំណូលខ្ពស់",
    organization: "ក្រសួងការងារ និងបណ្តុះបណ្តាលវិជ្ជាជីវៈ",
    date: "ថ្ងៃទី ១៨ ខែមករា - ១៨ ខែកុម្ភៈ ឆ្នាំ២០២៦",
    time: "ម៉ោង ០៨:០០ - ម៉ោង ១៦:០០",
    capacity: 20,
    benefits: {
      transport: "គ្មានរថយន្ត",
      housing: "គ្មានកន្លែងស្នាក់នៅ",
      meals: "គ្មានអាហារ",
    },
    detailHref: "detailpage-card-education.html",
    applyHref: "volunteer-apply.html",
  },
  {
    id: "8",
    title: "បង្រៀនកុំព្យូទ័រដល់កុមារ",
    category: { slug: "education", label: "ការអប់រំ" },
    location: { slug: "siem-reap", label: "សៀមរាប" },
    images: [
      "/images/opportunities/Education/card-8/img-1.png",
      "/images/opportunities/Education/card-8/img-2.png",
      "/images/opportunities/Education/card-8/img-3.png",
    ],
    description:
      "ជួយបង្រៀនកុមារនូវជំនាញកុំព្យូទ័រមូលដ្ឋាន និងការប្រើប្រាស់អ៊ីនធឺណិត",
    organization: "ក្រុមយុវជនបច្ចេកវិទ្យា",
    date: "ថ្ងៃទី ១៣-១៤ ខែកញ្ញា ឆ្នាំ២០២៥",
    time: "ម៉ោង ០៩:០០ - ម៉ោង ១២:០០",
    capacity: 8,
    benefits: {
      transport: "រថយន្ត",
      housing: "កន្លែងស្នាក់នៅ",
      meals: "អាហារ",
    },
    detailHref: "detailpage-card-education.html",
    applyHref: "volunteer-apply.html",
  },
  {
    id: "9",
    title: "ជួយសត្វព្រៃដែលរងរបួស",
    category: { slug: "wildlife", label: "ជម្រកសត្វព្រៃ" },
    location: { slug: "mondulkiri", label: "មណ្ឌលគិរី" },
    images: [
      "/images/opportunities/Wildlife/card-9/img-1.png",
      "/images/opportunities/Wildlife/card-9/img-2.png",
      "/images/opportunities/Wildlife/card-9/img-3.png",
    ],
    description:
      "ចូលរួមថែទាំ និងជួយព្យាបាលសត្វព្រៃដែលត្រូវបានសង្គ្រោះពីការជួញដូរខុសច្បាប់",
    organization: "អង្គការសត្វព្រៃកម្ពុជា",
    date: "ថ្ងៃទី ២៥-២៧ ខែសីហា ២០២៥",
    time: "ម៉ោង ០៨:០០ - ម៉ោង ០៥:០០",
    capacity: 10,
    benefits: {
      transport: "រថយន្ត",
      housing: "កន្លែងស្នាក់នៅ",
      meals: "អាហារ",
    },
    detailHref: "detailpage-card-wildlife.html",
    applyHref: "volunteer-apply.html",
  },
  {
    id: "10",
    title: "កម្មវិធីជំរុំរដូវក្តៅសម្រាប់កុមារ",
    category: { slug: "childcare", label: "ថែទាំកុមារ" },
    location: { slug: "siem-reap", label: "សៀមរាប" },
    images: [
      "/images/opportunities/Childcare/card-10/img-1.png",
      "/images/opportunities/Childcare/card-10/img-2.png",
      "/images/opportunities/Childcare/card-10/img-2.png",
    ],
    description:
      "ជួយរៀបចំសកម្មភាពកម្សាន្ត និងមើលថែទាំកុមារពិការក្នុងអំឡុងពេលជំរុំរដូវក្តៅ",
    organization: "មូលនិធិកុមារពិការកម្ពុជា",
    date: "ថ្ងៃទី ១៥-២០ ខែមេសា ២០២៥",
    time: "ម៉ោង ០៨:០០ - ម៉ោង ០៥:០០",
    capacity: 20,
    benefits: {
      transport: "មានរថយន្ត",
      housing: "មានកន្លែងស្នាក់នៅ",
      meals: "មានអាហារ",
    },
    detailHref: "detailpage-card-childcare.html",
    applyHref: "volunteer-apply.html",
  },
  {
    id: "11",
    title: "ដាំដើមឈើក្នុងក្រុង",
    category: { slug: "environment", label: "បរិស្ថាន" },
    location: { slug: "phnom-penh", label: "ភ្នំពេញ" },
    images: [
      "/images/opportunities/Environment/card-11/img-1.png",
      "/images/opportunities/Environment/card-11/img-2.png",
      "/images/opportunities/Environment/card-11/img-3.png",
    ],
    description:
      "ចូលរួមដាំដើមឈើដើម្បីបង្កើនម្លប់ និងកែលម្អគុណភាពខ្យល់នៅក្នុងក្រុង",
    organization: "ក្រុមយុវជនបៃតង",
    date: "ថ្ងៃទី ២៥ ខែតុលា ឆ្នាំ២០២៥",
    time: "ម៉ោង ០៧:០០ - ម៉ោង ១០:០០",
    capacity: 30,
    benefits: {
      transport: "មានរថយន្ត",
      housing: "គ្មានកន្លែងស្នាក់នៅ",
      meals: "មានអាហារ",
    },
    detailHref: "detailpage-card-environment.html",
    applyHref: "volunteer-apply.html",
  },
  {
    id: "12",
    title: "ការពារបក្សីជិតផុតពូជ",
    category: { slug: "wildlife", label: "ជម្រកសត្វព្រៃ" },
    location: { slug: "ratanakiri", label: "រតនៈគិរី" },
    images: [
      "/images/opportunities/Wildlife/card-12/img-1.png",
      "/images/opportunities/Wildlife/card-12/img-2.png",
      "/images/opportunities/Wildlife/card-12/img-3.png",
    ],
    description:
      "ចូលរួមការងារស្រាវជ្រាវ និងការពារសំបុកសត្វត្រយងយក្សដែលជិតផុតពូជ",
    organization: "សមាគមអភិរក្សធម្មជាតិ",
    date: "ថ្ងៃទី ០១-០៣ ខែកញ្ញា ២០២៥",
    time: "ម៉ោង ០៧:០០ - ម៉ោង ០៤:០០",
    capacity: 5,
    benefits: {
      transport: "រថយន្ត",
      housing: "កន្លែងស្នាក់នៅ",
      meals: "អាហារ",
    },
    detailHref: "detailpage-card-wildlife.html",
    applyHref: "volunteer-apply.html",
  },
  {
    id: "13",
    title: "កម្មវិធីស្ម័គ្រចិត្តសម្រាប់ព្រឹត្តិការណ៍រត់ប្រណាំង",
    category: { slug: "event", label: "ព្រឹត្តិការណ៏" },
    location: { slug: "siem-reap", label: "សៀមរាប" },
    images: [
      "/images/opportunities/Event/card-13/img-4.png",
      "/images/opportunities/Event/card-13/img-5.png",
      "/images/opportunities/Event/card-13/img-6.png",
    ],
    description: "ជួយរៀបចំកន្លែងចុះឈ្មោះ និងផ្តល់ទឹកដល់អ្នកចូលរួមរត់ប្រណាំង",
    organization: "គណៈកម្មាធិការជាតិអូឡាំពិកកម្ពុជា",
    date: "ថ្ងៃទី ៣០ ខែកញ្ញា ២០២៥",
    time: "ម៉ោង ៦:០០ ព្រឹក - ១០:០០ ព្រឹក",
    capacity: 30,
    benefits: {
      transport: "រថយន្ត",
      housing: "កន្លែងស្នាក់នៅ",
      meals: "អាហារ",
    },
    detailHref: "detailpage-card-event.html",
    applyHref: "volunteer-apply.html",
  },
  {
    id: "14",
    title: "ពិនិត្យសុខភាពដោយឥតគិតថ្លៃ",
    category: { slug: "health", label: "សុខភាព" },
    location: { slug: "kampot", label: "កំពត" },
    images: [
      "/images/opportunities/Health/card-14/img-1.png",
      "/images/opportunities/Health/card-14/img-2.png",
      "/images/opportunities/Health/card-14/img-3.png",
    ],
    description:
      "ក្រុមគ្រូពេទ្យស្ម័គ្រចិត្តចុះពិនិត្យសុខភាពទូទៅដល់ប្រជាពលរដ្ឋដោយឥតគិតថ្លៃ",
    organization: "ក្រុមវេជ្ជបណ្ឌិតស្ម័គ្រចិត្តកម្ពុជា",
    date: "ថ្ងៃទី ០៧ ខែមករា ឆ្នាំ២០២៦",
    time: "ម៉ោង ០៧:៣០ - ម៉ោង ០៣:៣០",
    capacity: 20,
    benefits: {
      transport: "រថយន្ត",
      housing: "កន្លែងស្នាក់នៅ",
      meals: "មានអាហារ",
    },
    detailHref: "detailpage-card-health.html",
    applyHref: "volunteer-apply.html",
  },
  {
    id: "15",
    title: "សិល្បៈនិងសិប្បកម្មជាមួយកុមារកំព្រា",
    category: { slug: "childcare", label: "មើលថែកុមារ" },
    location: { slug: "siem-reap", label: "សៀមរាប" },
    images: [
      "/images/opportunities/Childcare/card-15/img-1.png",
      "/images/opportunities/Childcare/card-15/img-3.png",
      "/images/opportunities/Childcare/card-15/img-3.png",
    ],
    description:
      "ចូលរួមរៀបចំ និងដឹកនាំសកម្មភាពសិល្បៈ សិប្បកម្ម ដើម្បីជួយអភិវឌ្ឍទេពកោសល្យ និងការច្នៃប្រឌិត",
    organization: "សមាគមសិល្បករវ័យក្មេង",
    date: "ថ្ងៃទី ២២ ខែវិច្ឆិកា ឆ្នាំ២០២៥",
    time: "ម៉ោង ០៩:០០ - ម៉ោង ០១:០០",
    capacity: 7,
    benefits: {
      transport: "មានរថយន្ត",
      housing: "មានកន្លែងស្នាក់នៅ",
      meals: "មានអាហារ",
    },
    detailHref: "detailpage-card-childcare.html",
    applyHref: "volunteer-apply.html",
  },
  {
    id: "16",
    title: "សិក្ខាសាលាកែច្នៃប្លាស្ទិក",
    category: { slug: "environment", label: "បរិស្ថាន" },
    location: { slug: "phnom-penh", label: "ភ្នំពេញ" },
    images: [
      "/images/opportunities/Environment/card-16/img-1.png",
      "/images/opportunities/Environment/card-16/img-2.png",
      "/images/opportunities/Environment/card-16/img-3.png",
    ],
    description: "រៀនពីរបៀបកែច្នៃកាកសំណល់ប្លាស្ទិកទៅជាផលិតផលថ្មីដែលមានប្រយោជន៍",
    organization: "ក្រុមហ៊ុនកែច្នៃសំរាម Cambodia Green",
    date: "ថ្ងៃទី ០២ ខែវិច្ឆិកា ឆ្នាំ២០២៥",
    time: "ម៉ោង ០១:០០ - ម៉ោង ០៤:០០",
    capacity: 25,
    benefits: {
      transport: "មានរថយន្ត",
      housing: "គ្មានកន្លែងស្នាក់នៅ",
      meals: "មានអាហារ",
    },
    detailHref: "detailpage-card-environment.html",
    applyHref: "volunteer-apply.html",
  },
  {
    id: "17",
    title: "សិក្ខាសាលាដាំបន្លែសរីរាង្គ",
    category: { slug: "agriculture", label: "កសិកម្ម" },
    location: { slug: "kandal", label: "កណ្តាល" },
    images: [
      "/images/opportunities/Agriculture/card-17/img-1.png",
      "/images/opportunities/Agriculture/card-17/img-2.png",
      "/images/opportunities/Agriculture/card-17/img-3.png",
    ],
    description:
      "រៀនពីបច្ចេកទេសដាំបន្លែធម្មជាតិគ្មានជាតិគីមី និងការថែទាំដំណាំឱ្យបានត្រឹមត្រូវ",
    organization: "ក្រុមយុវជនកសិកម្មសរីរាង្គ",
    date: "ថ្ងៃទី ០៧ ខែធ្នូ ឆ្នាំ២០២៥",
    time: "ម៉ោង ០៨:០០ - ម៉ោង ១២:០០",
    capacity: 15,
    benefits: {
      transport: "មានរថយន្ត",
      housing: "មានកន្លែងស្នាក់នៅ",
      meals: "មានអាហារ",
    },
    detailHref: "detailpage-card-agriculture.html",
    applyHref: "volunteer-apply.html",
  },
  {
    id: "18",
    title: "សិក្ខាសាលាសុខភាពផ្លូវចិត្ត",
    category: { slug: "health", label: "សុខភាព" },
    location: { slug: "phnom-penh", label: "ភ្នំពេញ" },
    images: [
      "/images/opportunities/Health/card-18/img-1.png",
      "/images/opportunities/Health/card-18/img-1.png",
      "/images/opportunities/Health/card-18/img-1.png",
    ],
    description:
      "យល់ដឹងពីសារៈសំខាន់នៃសុខភាពផ្លូវចិត្ត និងវិធីសាស្ត្រថែរក្សាសុខភាពផ្លូវចិត្តប្រចាំថ្ងៃ",
    organization: "មជ្ឈមណ្ឌលសុខភាពផ្លូវចិត្តកម្ពុជា",
    date: "ថ្ងៃទី ១៥ ខែមករា ឆ្នាំ២០២៦",
    time: "ម៉ោង ០៨:០០ - ម៉ោង ១២:០០",
    capacity: 35,
    benefits: {
      transport: "រថយន្ត",
      housing: "កន្លែងស្នាក់នៅ",
      meals: "មានអាហារ",
    },
    detailHref: "detailpage-card-health.html",
    applyHref: "volunteer-apply.html",
  },
  {
    id: "19",
    title: "ស្ម័គ្រចិត្តជួយស្ទូងស្រូវ",
    category: { slug: "agriculture", label: "កសិកម្ម" },
    location: { slug: "steung-treng", label: "ស្ទឹងត្រែង" },
    images: [
      "/images/opportunities/Agriculture/card-19/img-1.png",
      "/images/opportunities/Agriculture/card-19/img-2.png",
      "/images/opportunities/Agriculture/card-19/img-3.png",
    ],
    description:
      "ចូលរួមជាមួយកសិករក្នុងសកម្មភាពស្ទូងស្រូវ និងជួយរៀបចំប្រព័ន្ធស្រោចស្រពក្នុងចំការ",
    organization: "សហគមន៍កសិករកម្ពុជា",
    date: "ថ្ងៃទី ២២ ខែវិច្ឆិកា ឆ្នាំ២០២៥",
    time: "ម៉ោង ០៧:៣០ - ម៉ោង ០៣:០០",
    capacity: 20,
    benefits: {
      transport: "មានរថយន្ត",
      housing: "មានកន្លែងស្នាក់នៅ",
      meals: "មានអាហារ",
    },
    detailHref: "detailpage-card-agriculture.html",
    applyHref: "volunteer-apply.html",
  },
  {
    id: "20",
    title: "ស្ម័គ្រចិត្តជួយសិក្ខាសាលាបច្ចេកវិទ្យា",
    category: { slug: "event", label: "ព្រឹត្តិការណ៏" },
    location: { slug: "phnom-penh", label: "ភ្នំពេញ" },
    images: [
      "/images/opportunities/Event/card-20/img-3.png",
      "/images/opportunities/Event/card-20/img-3.png",
      "/images/opportunities/Event/card-20/img-3.png",
    ],
    description: "ជួយរៀបចំសម្ភារៈ និងណែនាំអ្នកចូលរួមក្នុងសិក្ខាសាលា",
    organization: "ក្រុមហ៊ុនបច្ចេកវិទ្យា Tech Cambodia",
    date: "ថ្ងៃទី ០៥ ខែតុលា ២០២៥",
    time: "ម៉ោង ៨:០០ ព្រឹក - ៤:០០ ល្ងាច",
    capacity: 10,
    benefits: {
      transport: "រថយន្ត",
      housing: "កន្លែងស្នាក់នៅ",
      meals: "អាហារ",
    },
    detailHref: "detailpage-card-event.html",
    applyHref: "volunteer-apply.html",
  },
  {
    id: "21",
    title: "ស្ម័គ្រចិត្តក្នុងមហោស្រពវប្បធម៌ជាតិ",
    category: { slug: "event", label: "ព្រឹត្តិការណ៏" },
    location: { slug: "phnom-penh", label: "ភ្នំពេញ" },
    images: [
      "/images/opportunities/Event/card-13/img-4.png",
      "/images/opportunities/Event/card-13/img-5.png",
      "/images/opportunities/Event/card-13/img-6.png",
    ],
    description: "ជួយណែនាំភ្ញៀវជាតិ និងអន្តរជាតិអំពីរោងទស្សនីយភាពនានា",
    organization: "ក្រសួងវប្បធម៌ និងវិចិត្រសិល្បៈ",
    date: "ថ្ងៃទី ១៥ ខែវិច្ឆិកា ២០២៥",
    time: "ម៉ោង ៩:០០ ព្រឹក - ៧:០០ ល្ងាច",
    capacity: 25,
    benefits: {
      transport: "រថយន្ត",
      housing: "កន្លែងស្នាក់នៅ",
      meals: "អាហារ",
    },
    detailHref: "detailpage-card-event.html",
    applyHref: "volunteer-apply.html",
  },
];

const CATEGORY_TABS = [
  { slug: "all", label: "ទាំងអស់", icon: "/logos/logo.png" },
  {
    slug: "wildlife",
    label: "ជម្រកសត្វព្រៃ",
    icon: "/images/opportunities/Categories/wildlife.png",
  },
  {
    slug: "education",
    label: "ការអប់រំ",
    icon: "/images/opportunities/Categories/teaching.png",
  },
  {
    slug: "childcare",
    label: "មើលថែកុមារ",
    icon: "/images/opportunities/Categories/childcare.png",
  },
  {
    slug: "environment",
    label: "បរិស្ថាន",
    icon: "/images/opportunities/Categories/environment.png",
  },
  {
    slug: "agriculture",
    label: "កសិកម្ម",
    icon: "/images/opportunities/Categories/agriculture.png",
  },
  {
    slug: "event",
    label: "រៀបចំព្រឹត្តការណ៍",
    icon: "/images/opportunities/Categories/event.png",
  },
  {
    slug: "health",
    label: "សុខភាព",
    icon: "/images/opportunities/Categories/img-1.png",
  },
];

const LOCATIONS = [
  { slug: "all", label: "គ្រប់កន្លែងទាំងអស់" },
  { slug: "phnom-penh", label: "ភ្នំពេញ" },
  { slug: "siem-reap", label: "សៀមរាប" },
  { slug: "kampot", label: "កំពត" },
  { slug: "kep", label: "កែប" },
  { slug: "koh-kong", label: "កោះកុង" },
  { slug: "kandal", label: "កណ្តាល" },
  { slug: "prey-veng", label: "ព្រៃវែង" },
  { slug: "ratanakiri", label: "រតនៈគិរី" },
  { slug: "mondulkiri", label: "មណ្ឌលគិរី" },
  { slug: "steung-treng", label: "ស្ទឹងត្រែង" },
  { slug: "kratié", label: "ក្រចេះ" },
  { slug: "pursat", label: "ពោធិ៍សាត់" },
];

export default function OpportunityPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showGoTop, setShowGoTop] = useState(false);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return OPPORTUNITIES.filter((opp) => {
      const matchCat =
        selectedCategory === "all" || opp.category.slug === selectedCategory;
      const matchLoc =
        selectedLocation === "all" || opp.location.slug === selectedLocation;
      const matchTerm =
        !term ||
        opp.title.toLowerCase().includes(term) ||
        opp.description.toLowerCase().includes(term) ||
        opp.category.label.toLowerCase().includes(term);
      return matchCat && matchLoc && matchTerm;
    });
  }, [selectedCategory, selectedLocation, searchTerm]);

  useEffect(() => {
    const onScroll = () => setShowGoTop(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleFavorite = (id, isFav) => {
    // Keep local toggle only; no backend
    const idx = OPPORTUNITIES.findIndex((o) => o.id === id);
    if (idx >= 0) OPPORTUNITIES[idx].isFavorite = isFav;
  };

  return (
    <>
      <AOSInit />
      <main className="flex-grow-1">
        <section
          className="opportunity py-4 pt-5"
          style={{ marginTop: "120px" }}
        >
          <div className="container">
            {/* Search + Select filters */}
            <div
              className="opportunity-search-filter mb-4"
              data-aos="fade-down"
              data-aos-duration="1000"
            >
              <div className="row">
                <div className="col-12 col-lg-7">
                  <div className="opportunity-search">
                    <input
                      type="text"
                      placeholder="ស្វែងរកការងារស្ម័គ្រចិត្ត..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="search-btn">ស្វែងរក</button>
                  </div>
                </div>
                <div className="col-12 col-lg-5">
                  <div className="opportunity-filters row pt-3 pt-lg-0">
                    <select
                      id="categoryFilter"
                      className="filter-category col-4 col-md-5 ms-md-3 mx-md-4 mx-4 shadow-sm"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      {CATEGORY_TABS.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <select
                      id="locationFilter"
                      className="filter-location col-4 col-md-5 me-0 shadow-sm"
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                    >
                      {LOCATIONS.map((l) => (
                        <option key={l.slug} value={l.slug}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Category icon tabs */}
            <div className="category-icons">
              <div className="tab mb-3">
                <div className="col-12 col-lg-10 d-flex flex-wrap gap-3">
                  {CATEGORY_TABS.map((cat, idx) => (
                    <button
                      key={cat.slug}
                      className={`tablinks ${selectedCategory === cat.slug ? "active" : ""}`}
                      onClick={() => setSelectedCategory(cat.slug)}
                      data-aos="fade-up"
                      data-aos-duration="800"
                      data-aos-delay={`${(idx + 1) * 100}`}
                    >
                      <div className="category-icons_item">
                        <img src={cat.icon} alt={cat.label} />
                        <span>{cat.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Cards */}
            <div className="opportunities-card-list">
              <div className="row g-4">
                {filtered.length > 0 ? (
                  filtered.map((opportunity) => (
                    <OpportunityCard
                      key={opportunity.id}
                      data={opportunity}
                      onToggleFavorite={handleFavorite}
                    />
                  ))
                ) : (
                  <div className="col-12 text-center text-muted p-5">
                    <i className="bi bi-search fs-1"></i>
                    <p className="mt-3 fs-5">
                      មិនមានលទ្ធផល — សូមសាកល្បងតម្រងផ្សេង
                      ឬពិនិត្យម្តងទៀតពេលក្រោយ។
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Go-top button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          id="go-top"
          title="Go to top"
          className="btn btn-primary rounded-circle position-fixed bottom-0 end-0 m-4"
          style={{
            zIndex: 99,
            width: 50,
            height: 50,
            display: showGoTop ? "flex" : "none",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <i className="bi bi-arrow-up-short fs-5"></i>
        </button>
      </main>
    </>
  );
}
