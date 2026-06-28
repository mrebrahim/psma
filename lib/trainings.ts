export type Training = {
  slug: string;
  title: string;
  url: string;
  category: string;
  description?: string;
};

export type TrainingOrg = {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  website: string;
  color: string;
  trainings: Training[];
};

export const TRAINING_ORGS: TrainingOrg[] = [
  {
    slug: "egycopt",
    name: "مؤسسة إيجي كوبت",
    shortName: "إيجي كوبت",
    tagline: "تدريب مهني وفني وإداري مجاني",
    description:
      "مؤسسة EgyCopt مؤسسة تنموية متخصصة في توفير تدريبات مجانية في المجالات الحرفية والفنية، تكنولوجيا المعلومات، الإدارة، الهندسة، والرعاية الصحية. التدريبات معتمدة وبتأهّل الشباب لسوق العمل.",
    website: "https://egycopt.org",
    color: "#1a4d2e",
    trainings: [
      // 1 — حرفي وفني
      { slug: "welding", title: "اللحام بكل أنواعه", url: "https://egycopt.org/course-category/technician/welding/", category: "حرفي وفني" },
      { slug: "electricity", title: "الكهرباء بكل أنواعها", url: "https://egycopt.org/course-category/technician/electricity/", category: "حرفي وفني" },
      { slug: "mobile-repair", title: "صيانة الموبايل", url: "https://egycopt.org/course/mobile-phone-repairing/", category: "حرفي وفني" },
      { slug: "ac-refrigeration", title: "تبريد وتكييف", url: "https://egycopt.org/course/ac-and-refrigeration/", category: "حرفي وفني" },
      { slug: "turning", title: "خراطة", url: "https://egycopt.org/course/turning/", category: "حرفي وفني" },
      { slug: "cnc-turning", title: "خراطة CNC (تحكم رقمي)", url: "https://egycopt.org/course/cnc-turning-numerical-control/", category: "حرفي وفني" },
      { slug: "home-appliance-maintenance", title: "صيانة الأجهزة المنزلية والغسالات", url: "https://egycopt.org/course/home-appliance-maintenance/", category: "حرفي وفني" },
      { slug: "cctv-installation", title: "تركيب أجهزة كاميرات المراقبة", url: "https://egycopt.org/course/alarm-cctv-installation/", category: "حرفي وفني" },

      // 2 — تكنولوجيا السيارات
      { slug: "automotive-technology", title: "تكنولوجيا السيارات", url: "https://egycopt.org/course-category/automotive-technology/", category: "تكنولوجيا السيارات" },

      // 3 — تكنولوجيا المعلومات
      { slug: "python-fundamentals", title: "أساسيات برمجة بايثون", url: "https://egycopt.org/course/python-programming-fundamentals/", category: "تكنولوجيا المعلومات" },

      // 4 — إدارة ومالية وتسويق
      { slug: "hr-diploma", title: "دبلومة الموارد البشرية", url: "https://egycopt.org/course/hr-diploma/", category: "إدارة ومالية وتسويق" },
      { slug: "graphic-design-diploma", title: "دبلومة الجرافيك ديزاين", url: "https://egycopt.org/course/graphic-design-diploma/", category: "إدارة ومالية وتسويق" },
      { slug: "secretarial-office-mgmt", title: "سكرتارية وإدارة المكاتب", url: "https://egycopt.org/course/secretarial-and-office-management/", category: "إدارة ومالية وتسويق" },
      { slug: "digital-marketing-diploma", title: "دبلومة التسويق الإلكتروني", url: "https://egycopt.org/course/digital-marketing-diploma/", category: "إدارة ومالية وتسويق" },
      { slug: "accounting-diploma", title: "دبلومة المحاسبة", url: "https://egycopt.org/course/diploma-in-accounting/", category: "إدارة ومالية وتسويق" },

      // 5 — برامج هندسية
      { slug: "eng-mechanical", title: "هندسة ميكانيكا", url: "https://egycopt.org/course-category/engineering-programs/mechanical/", category: "برامج هندسية" },
      { slug: "eng-electrical", title: "هندسة كهرباء", url: "https://egycopt.org/course-category/engineering-programs/electrical/", category: "برامج هندسية" },
      { slug: "eng-civil", title: "هندسة مدنية", url: "https://egycopt.org/course-category/engineering-programs/civil/", category: "برامج هندسية" },
      { slug: "eng-architecture", title: "هندسة عمارة", url: "https://egycopt.org/course-category/engineering-programs/architecture/", category: "برامج هندسية" },
      { slug: "eng-various", title: "دورات هندسية متنوعة", url: "https://egycopt.org/course-category/engineering-programs/various-courses/", category: "برامج هندسية" },

      // 6 — خدمات طبية
      { slug: "healthcare-provider", title: "مقدم الرعاية الصحية", url: "https://egycopt.org/course/healthcare-provider/", category: "خدمات طبية" },
    ],
  },
];

export function getOrg(slug: string): TrainingOrg | undefined {
  return TRAINING_ORGS.find((o) => o.slug === slug);
}

export function getTraining(orgSlug: string, courseSlug: string): { org: TrainingOrg; training: Training } | null {
  const org = getOrg(orgSlug);
  if (!org) return null;
  const training = org.trainings.find((t) => t.slug === courseSlug);
  if (!training) return null;
  return { org, training };
}

export function groupByCategory(trainings: Training[]): Record<string, Training[]> {
  const groups: Record<string, Training[]> = {};
  for (const t of trainings) {
    (groups[t.category] ||= []).push(t);
  }
  return groups;
}
