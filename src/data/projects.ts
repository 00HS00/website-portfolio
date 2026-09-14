export type Domain = 'business' | 'tech' | 'hybrid';
export type Status = 'in-progress' | 'delivered';

export interface Project {
  slug: string;
  title: string;
  summary: string;
  category: string;
  domain: Domain;
  status: Status;
  tags: string[];
  year: string;
  featured: boolean;
  cover: string;
  gallery: string[];
  role: string;
  problem: string;
  approach: string;
  outcome: string;
  liveUrl?: string;
  repoUrl?: string;
}

export const categories = ['Web App', 'Automation Tool', 'AI Tool'];

export const statusMeta: Record<Status, { label: string; className: string; dotClassName: string }> = {
  'in-progress': {
    label: 'In Progress',
    className: 'border-gold/30 bg-gold/10 text-gold',
    dotClassName: 'bg-gold animate-pulse',
  },
  delivered: {
    label: 'Delivered',
    className: 'border-live/30 bg-live/10 text-live',
    dotClassName: 'bg-live',
  },
};

export const domainMeta: Record<
  Domain,
  { label: string; className: string; tagClassName: string; textClassName: string }
> = {
  business: {
    label: 'Business-led',
    className: 'bg-gold',
    tagClassName: 'bg-gold/10 text-gold border-gold/25',
    textClassName: 'text-gold',
  },
  tech: {
    label: 'Tech-led',
    className: 'bg-blue',
    tagClassName: 'bg-blue/10 text-blue border-blue/25',
    textClassName: 'text-blue',
  },
  hybrid: {
    label: 'Business + Tech',
    className: 'bg-gradient-duotone',
    tagClassName: 'bg-blue/10 text-blue border-blue/25',
    textClassName: 'text-gradient',
  },
};

export const projects: Project[] = [
  {
    slug: 'clinder',
    title: 'Clinder',
    summary:
      'An AI-powered sourcing and CRM platform for independent and small-agency recruiters, one place for targeting, sourcing, outreach, and pipeline instead of five disconnected tools.',
    category: 'Web App',
    domain: 'hybrid',
    status: 'in-progress',
    tags: ['Next.js', 'TypeScript', 'Supabase', 'AI'],
    year: '2025',
    featured: true,
    cover: '/projects/clinder.png',
    gallery: ['/projects/clinder.png'],
    role: 'Founder, solo, in active development (AI-assisted build)',
    problem:
      'Recruiting at a small agency meant juggling several disconnected tools just to find people, track outreach, and manage a pipeline. Most of the time went into switching between tools and searching, not actually reaching out to candidates and clients.',
    approach:
      'Designed a multi-tenant recruitment CRM around the two workflows recruiters actually run: business development (winning clients) and sourcing & delivery (finding and placing talent), then directed AI tools to build it end to end on Next.js and Supabase (Postgres with Row-Level Security for per-user data isolation). The result includes a plain-English "Finder" search backed by live people-search data and AI extraction, one-click email discovery, drag-and-drop pipeline boards, and a KPI dashboard.',
    outcome:
      'Replaced four or more separate tools in my own recruiting workflow with a single platform, cutting the time spent finding and organizing people so more time goes to outreach itself. Currently private and in active development.',
    liveUrl: '',
    repoUrl: '',
  },
  {
    slug: 'wrap',
    title: 'Wrap',
    summary:
      'A folder-watching automation tool that compresses, transcribes, subtitles, and brands outreach videos the moment they’re recorded, no manual editing.',
    category: 'Automation Tool',
    domain: 'tech',
    status: 'delivered',
    tags: ['Automation', 'Video Processing', 'Scripting'],
    year: '2025',
    featured: true,
    cover: '/projects/wrap.png',
    gallery: ['/projects/wrap.png'],
    role: 'Solo build',
    problem:
      'Outreach videos had to stay under strict file-size limits for certain platforms, and manually compressing, subtitling, and branding each one before sending ate up time that should have gone toward outreach itself.',
    approach:
      'Built a watcher that detects a new recording as soon as it lands in a folder, then automatically compresses it, generates a transcript, burns in customized subtitles, adds a logo bug, renames the file based on the video\'s content, and saves the finished file to an output folder, ready to upload.',
    outcome:
      'Turned a multi-step manual process into a zero-touch one: record the video, and by the time you switch tabs the finished, subtitled, branded file is already waiting in the output folder.',
    liveUrl: '',
    repoUrl: '',
  },
  {
    slug: 'cut-and-go',
    title: 'Cut & Go',
    summary:
      'An online ordering platform for local butcher shops, letting customers order ahead and pay online so they can skip the line during rush hours.',
    category: 'Web App',
    domain: 'hybrid',
    status: 'delivered',
    tags: ['E-commerce', 'Web App'],
    year: '2024',
    featured: true,
    cover: '/projects/cut-and-go.png',
    gallery: ['/projects/cut-and-go.png'],
    role: 'Builder',
    problem:
      'During busy periods, customers were waiting 45+ minutes in line just to place an order in person, with no way to plan ahead or pay before arriving.',
    approach:
      'Built an online storefront where customers pick their cuts and specs, choose a pickup time, and pay in advance, so the order is ready and paid for by the time they walk in.',
    outcome:
      'Customers can now skip the line entirely: order online, walk in, and pick up, cutting a 45+ minute wait down to a quick pickup.',
    liveUrl: '',
    repoUrl: '',
  },
  {
    slug: 'glance',
    title: 'Glance',
    summary:
      'A personal, home-assistant-style dashboard surfacing everything I check every morning (weather, transit, news, scores, and more) on one screen.',
    category: 'Web App',
    domain: 'tech',
    status: 'delivered',
    tags: ['Dashboard', 'Personal Tool'],
    year: '2024',
    featured: false,
    cover: '/projects/glance.png',
    gallery: ['/projects/glance.png'],
    role: 'Solo build',
    problem: 'Checking the weather, bus times, news, and scores meant opening several different apps every morning.',
    approach:
      'Built a single always-on dashboard pulling together time, weather, local bus times, sports scores and news, world and local headlines, quotes, and a media player into one screen, fully customized to what I actually want to see.',
    outcome: 'One glance instead of five apps, showing only the information that\'s actually useful to me.',
    liveUrl: '',
    repoUrl: '',
  },
  {
    slug: 'foundry',
    title: 'Foundry',
    summary:
      'A tool that generates a working business website automatically from a short set of company details, using AI to handle layout, copy, and content.',
    category: 'AI Tool',
    domain: 'hybrid',
    status: 'delivered',
    tags: ['AI', 'Automation', 'Web Development'],
    year: '2024',
    featured: false,
    cover: '/projects/foundry.png',
    gallery: ['/projects/foundry.png'],
    role: 'Solo build',
    problem:
      'Building a simple website for a small business from scratch takes hours even with templates. Most small businesses just need something functional online, fast.',
    approach:
      'Built a tool that takes basic company details as input and uses AI to generate a complete, working website automatically, cutting out the manual layout and copywriting work.',
    outcome: 'Cut website turnaround for a simple business site from hours down to minutes.',
    liveUrl: '',
    repoUrl: '',
  },
  {
    slug: 'digital-twin',
    title: 'Digital Twin',
    summary:
      'A local-first personal operating system built around a structured model of who I am: journaling, self-assessment, and a chat twin that reasons from my real history instead of giving generic advice.',
    category: 'AI Tool',
    domain: 'tech',
    status: 'in-progress',
    tags: ['AI Memory Systems', 'Local-First', 'Next.js'],
    year: '2025',
    featured: true,
    cover: '/projects/digital-twin.png',
    gallery: ['/projects/digital-twin.png'],
    role: 'Solo build, in active development (AI-directed, local-first architecture)',
    problem:
      'Journaling, self-reflection, and tracking who I am and what matters to me were scattered across notes apps that never talked to each other, and none of them could reason about the full picture or push back on my thinking the way a person who actually knew me would.',
    approach:
      'Built a local-first system around a structured self-model: a 20-domain taxonomy of identity, values, and history captured through guided interviews, journaling, and a personal relationship map, all indexed into a full-text-searchable local database so nothing leaves my machine except the model calls themselves. On top of that sits a file-backed memory system the twin can read, write, and revise on its own, plus a chat interface with two grounded reasoning modes: a "what would I do" simulator that reasons strictly from stored history instead of generic advice, and a devil\'s advocate mode that challenges my stated position using my own past reasoning. A background organizer keeps the profile coherent and flags contradictions against things I\'ve said before.',
    outcome:
      'A system I actually use: structured self-assessments with retake comparisons over time, a decision log and habit tracker that feed real data back into the simulator, a life timeline pulling from journal entries and milestones, and a full data export and privacy center so everything stays inspectable and exportable. Still growing, and currently the project I use most for actually thinking things through.',
    liveUrl: '',
    repoUrl: '',
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}
