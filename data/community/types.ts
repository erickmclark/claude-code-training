export interface ChangelogItem {
  text: string;
  category: 'added' | 'fixed' | 'improved' | 'changed' | 'removed';
}

export interface ChangelogVersion {
  version: string;
  date: string;
  items: ChangelogItem[];
}

export interface WhatsNewWeek {
  weekNumber: number;
  dateRange: string;
  versionRange: string;
  headline: string;
  highlights: string[];
  digestUrl: string;
}

export interface BorisTip {
  id: number;
  title: string;
  category: string;
  content: string;
  quote?: string;
  hasCode: boolean;
}

export interface CommunityLink {
  title: string;
  url: string;
  icon: 'twitter' | 'blog' | 'github' | 'docs' | 'changelog';
  description: string;
}
