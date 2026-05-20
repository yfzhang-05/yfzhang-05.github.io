import architectureIcon from "@/assets/icons/architecture.png";
import cquLogo from "@/assets/icons/cqulogo.png";
import emailIcon from "@/assets/icons/email.svg";

export type SectionId = "about" | "news" | "portfolio";

export interface NavItem {
  id: SectionId;
  label: string;
}

export interface SocialLink {
  label: string;
  href?: string;
  icon: string;
}

export interface ResearchArea {
  label: string;
  icon: string;
}

export interface NewsItem {
  date: string;
  content: string;
  highlights: string[];
}

export interface PortfolioLink {
  label: string;
  href?: string;
  icon: string;
}

export interface PortfolioItem {
  title: string;
  authors: string[];
  highlightedAuthors: string[];
  venueTag: string;
  venue: string;
  year: string;
  image: string;
  links: PortfolioLink[];
}

export const navItems: NavItem[] = [
  { id: "about", label: "About" },
  { id: "news", label: "News" },
  { id: "portfolio", label: "Portfolio" },
];

export const profile = {
  name: "Yifan Zhang",
  chineseName: "张一凡",
  avatarAlt: "Portrait of Yifan Zhang",
  logo: cquLogo,
  affiliation: "Master's Student in Architecture @ Chongqing University",
  researchAreas: [
    { label: "Architecture", icon: architectureIcon },
  ] as ResearchArea[],
  links: [
    {
      label: "Email",
      href: "mailto:yfzhang05@126.com",
      icon: emailIcon,
    },
  ] as SocialLink[],
};

export const introduction = {
  paragraphs: [
    "Welcome to visit my homepage! I studied Architecture at Qingdao University of Technology from 2020 to 2025.",
    "In 2025, I was admitted to the Master of Architecture program at Chongqing University, supervised by Prof. Ke Chen.",
  ],
  highlights: [
    "Qingdao University of Technology",
    "Chongqing University",
    "Prof. Ke Chen",
    "Architecture",
  ],
};

export const newsItems: NewsItem[] = [
  {
    date: "2025.09",
    content:
      "I was admitted to the Master of Architecture program at Chongqing University, supervised by Prof. Ke Chen.",
    highlights: [
      "Master of Architecture",
      "Chongqing University",
      "Prof. Ke Chen",
    ],
  },
  {
    date: "2025.06",
    content:
      "I completed my undergraduate studies in Architecture at Qingdao University of Technology.",
    highlights: ["Architecture", "Qingdao University of Technology"],
  },
  {
    date: "2020.09",
    content:
      "I began my undergraduate studies in Architecture at Qingdao University of Technology.",
    highlights: ["Architecture", "Qingdao University of Technology"],
  },
];

export const portfolioItems: PortfolioItem[] = [];
