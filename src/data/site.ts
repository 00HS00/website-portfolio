// -----------------------------------------------------------------
// Single source of truth for all personal content on the site.
// Fields marked [Add ...] still need your input; everything
// else is already filled in from what you've told me.
// -----------------------------------------------------------------

export const site = {
  name: 'Hamza Syed',
  initials: 'HS',
  title: 'Business Technologist',
  tagline:
    'I sit between business problems and technical solutions, turning tedious, manual work into tools that just handle it.',
  location: 'Toronto, ON',
  availability: {
    open: true,
    label: 'Building & open to connect',
  },
  email: 'hamza@razr.io',
  photoUrl: '/photo.jpg',

  socials: {
    linkedin: { label: 'LinkedIn', handle: 'hamza-syed', url: 'https://www.linkedin.com/in/hamza-syed' },
  },

  about: {
    headline: 'Nothing gets past me. Nothing stays broken.',
    facts: [
      { label: 'Based in', value: 'Toronto, ON' },
      { label: 'Studying', value: 'BTM, Toronto Metropolitan University' },
      { label: 'Outside work', value: 'Baseball, pickleball, martial arts' },
      { label: 'Building', value: 'Clinder, an AI CRM for recruiters' },
    ],
    qa: [
      {
        q: "What do you notice that other people don't?",
        a: "Most people look at a room and register the largest object in it. I register what's slightly crooked: a frame hung a few degrees off level, a cable that should have been tucked away, the one detail nobody thought anyone would look closely enough to catch. I do. It isn't a party trick, it's closer to a discomfort. Disorder registers to me the way a wrong note registers to a musician, immediate and hard to ignore. So I've built a habit out of it: keep the essential, remove everything else, and put what's left exactly where it belongs. That instinct doesn't stay confined to a desk. It shows up in how I read a business, a process, or a room full of people who all think the problem is something other than what it actually is.",
      },
      {
        q: "What's something you can't just let go?",
        a: "Waste. Not the obvious kind, the quiet kind: an hour spent doing by hand what should take a minute, a process everyone tolerates because nobody's stopped to ask why it still works that way. I notice it faster than most people, and once I've noticed it, I can't unsee it. It sits there, nagging, until I've either fixed it myself or built something that fixes it for me. That's less a professional skill than a personality trait that happened to become useful. I'm not patient with broken systems, including my own.",
      },
      {
        q: 'What does success actually look like to you?',
        a: "Not what people usually assume. I've watched enough people chase scale for its own sake to know I don't want that particular trophy. I'd rather build something real, useful, and modest than something impressive and hollow. If it works for the people it was built for, that's success, whether ten people use it or ten thousand. If it doesn't, I've learned something and I move to the next problem. I think the fear of building something small is often just a fear of being seen clearly, and I'd rather be seen clearly than seen big.",
      },
      {
        q: 'Were you always this comfortable putting yourself out there?',
        a: "No. Left to my own instincts, I'd stay quiet, stay in the background, let the moment pass to someone else. But I don't think comfort is something you wait to feel, I think it's something you manufacture, by doing the uncomfortable thing enough times that it stops being uncomfortable. So I've made a habit of choosing situations that force the issue: ones where I have to hold a room, make a call nobody wants to hear, or stand my ground with someone who has every reason to think I shouldn't. Each time, the discomfort gets a little smaller. I'm still introverted. I've just stopped letting it decide what I do.",
      },
    ],
  },

  skills: {
    business: [
      'Sourcing & Business Development',
      'Executive Relationship Management',
      'Needs Analysis & Requirements Gathering',
      'Marketing & Outreach',
      'Project Management',
    ],
    build: [
      'AI-Assisted Product Development',
      'Rapid Prototyping',
      'Automation & Workflow Design',
      'UX / UI Thinking',
    ],
  },

  tools: {
    business: ['LinkedIn', 'Gmail', 'Google Sheets', 'Notion', 'Calendly', 'Zoom'],
    build: ['VS Code', 'Claude Code', 'Supabase', 'Vercel', 'Figma', 'Git / GitHub'],
  },

  principles: {
    business: [
      'Ask before assuming',
      'Understand the mandate, not just the request',
      'Every conversation earns the next one',
      'Follow up like it matters, because it does',
      'The relationship outlasts the deal',
    ],
    build: [
      'Working beats perfect',
      'Automate the annoying part first',
      'AI directs, judgment decides',
      'Ship it, then improve it',
      "If it's tedious twice, fix it for good",
    ],
  },

  experience: [
    {
      type: 'work' as const,
      period: 'April 2026 - August 2026',
      title: 'Client Relations Associate',
      org: 'Shikari Group, Recruitment (Finance & Accounting)',
      desc: 'Owned sourcing and outreach for a finance & accounting recruitment desk: finding candidates and clients, running discovery meetings with senior executives, and understanding their mandates well enough to fill them. Picked up marketing and other technical work on the side.',
    },
    {
      type: 'education' as const,
      period: 'Fall 2025 - Present',
      title: 'B.Comm, Business Technology Management (BTM)',
      org: 'Toronto Metropolitan University',
      desc: 'Studying at the intersection of business strategy and technology. Coursework spans systems thinking, business analysis, and software development, alongside building Clinder and other independent projects on the side.',
    },
    {
      type: 'work' as const,
      period: 'December 2022 - January 2025',
      title: 'Founder',
      org: 'The WoodPrint',
      desc: 'Founded and ran an Ontario-based custom wood design and 3D-printing business, owning the full order lifecycle: operations, sales, and customer relations, end to end.',
    },
  ],

  contact: {
    headline: "Let's connect.",
    body: "I'm always up for talking about recruiting tech, small business tools, or software/UX in general, whether that's a project, an opportunity, or just a good conversation. Reach out and I'll get back to you soon.",
    confirmation: "Message sent. I'll get back to you soon.",
    formspreeId: 'xoeqglqq',
  },
} as const;
