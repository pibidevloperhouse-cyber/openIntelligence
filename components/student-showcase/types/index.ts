export interface StudentProject {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: 'AI & ML' | 'Robotics & GreenTech' | 'Cybersecurity & Web3' | 'IoT & Hardware' | 'Healthcare & Assistive';
  leadStudent: string;
  teamMembers: string[];
  institution: string;
  image: string;
  tags: string[];
  upvotes: number;
  rank?: 1 | 2 | 3; // Top 3 rank if winner
  prizeAmountINR?: string;
  prizeAmountUSD?: string;
  openIntelligenceFeatured: boolean;
  demoUrl?: string;
  githubUrl?: string;
  videoUrl?: string;
  architectureHighlights: string[];
  impactMetric: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export interface TimelineStep {
  date: string;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'upcoming';
}
