/* =============================================================================
 *  content.js  —  THE ONLY FILE YOU NEED TO EDIT
 * =============================================================================
 *  Everything visible on the site is defined here: text, numbers, projects,
 *  skills, certificates, links. Change a value, save, and the site updates.
 *
 *  Tips:
 *   - Keep the quotes " " around text.
 *   - Separate list items with commas.
 *   - Lines starting with // are notes and are ignored by the site.
 *   - After editing, the dev server (npm run dev) refreshes automatically.
 * ========================================================================== */

export const content = {
  /* ---------------------------------------------------------------------------
   *  1. PROFILE  —  the hero, nav, contact + clock
   * ------------------------------------------------------------------------- */
  profile: {
    name: 'Muzamil Masood',
    brand: 'Strategies by Maddy',
    role: 'Digital Marketer & Social Media Manager',
    available: 'Open for new projects',

    // Big hero headline is split into 3 lines so it stacks nicely.
    headlineTop: 'Paid ads &',
    headlineMid: 'content',
    headlineBot: 'that perform.',

    lede:
      "I'm Maddy — a digital marketer and social media manager with 3+ years " +
      'growing brands on social, creating content that gets engagement, and running ' +
      'Meta & Google ad campaigns that deliver real results.',

    email: 'strategiesbymaddy@gmail.com',
    mailto:
      'mailto:strategiesbymaddy@gmail.com?subject=Project%20enquiry&body=Hi%20Maddy%2C%0A%0A',
    phone: '+92 312 3209782',

    availabilityWindow: 'available now',

    // shown vertically on the right of the hero
    coordinates: '28.42°N / 70.30°E',
    localLabel: 'Pakistan',
    // IANA timezone for the live clock:
    timezone: 'Asia/Karachi',
  },

  /* ---------------------------------------------------------------------------
   *  2. STRIP  —  the scrolling ticker under the hero
   * ------------------------------------------------------------------------- */
  strip: [
    'Social Media Management',
    'Meta Ads',
    'Google Ads',
    'Content Creation',
    'Meme Marketing',
    'Email Marketing',
    'Video Editing',
    'Graphic Design',
    'AI & Automation',
    'Brand Strategy',
  ],

  /* ---------------------------------------------------------------------------
   *  3. IMPACT  —  the big animated numbers
   *     prefix + value + suffix  =>  e.g.  "$"  "5"  "K+"
   * ------------------------------------------------------------------------- */
  stats: [
    { prefix: '$', value: 5, suffix: 'K+', label: 'Revenue generated for clients through paid ad campaigns' },
    { prefix: '', value: 70, suffix: '+', label: 'Social media accounts managed with consistent growth' },
    { prefix: '+', value: 300, suffix: '%', label: 'Bookings for a salon client from one campaign' },
    { prefix: '', value: 3, suffix: '+ yrs', label: 'Hands-on social media & performance marketing' },
    { prefix: '', value: 65, suffix: '', label: 'Featured brand projects across food, beauty & e-commerce' },
    { prefix: '', value: 100, suffix: '%', label: 'Client satisfaction across projects & internships' },
  ],

  /* ---------------------------------------------------------------------------
   *  4. WORK  —  selected projects
   *     Add or remove blocks freely. `metric` is the headline result.
   * ------------------------------------------------------------------------- */
  projects: [
    {
      name: 'Gelato Bar — social & marketing',
      client: 'Gelato Bar · RYK',
      category: 'Food & Beverage',
      year: '2024',
      metric: 'Footfall up',
      metricSub: '+ brand awareness · RYK',
      summary:
        'Ran social media and digital marketing for Gelato Bar RYK — engaging content, ' +
        'targeted local ad campaigns, and a consistent posting rhythm that grew brand ' +
        'awareness and drove in-store visits.',
      tags: ['Meta Ads', 'Content', 'Local', 'Community'],
    },
    {
      name: 'Hair salon growth campaign',
      client: 'Hair salon client',
      category: 'Beauty & Grooming',
      year: '2023',
      metric: '+300%',
      metricSub: 'salon bookings',
      summary:
        'Planned and executed social media campaigns for a hair salon. A clear content ' +
        'strategy plus paid advertising increased bookings by 300% over the campaign period.',
      tags: ['Strategy', 'Meta Ads', 'Content', 'Reels'],
    },
    {
      name: 'Etsy store marketing',
      client: 'Etsy seller',
      category: 'E-commerce',
      year: '2023',
      metric: 'Sales up',
      metricSub: 'visits + conversions up',
      summary:
        'Promoted an Etsy store with Meta Ads and product-focused content. Targeted ' +
        'campaigns increased store visits, conversions and overall sales.',
      tags: ['Meta Ads', 'Product Content', 'CRO'],
    },
    {
      name: 'Puff Lab — social media management',
      client: 'Puff Lab',
      category: 'Lifestyle brand',
      year: '2024',
      metric: 'Engagement up',
      metricSub: 'loyal audience built',
      summary:
        'Handled full social media management and content creation for Puff Lab — improved ' +
        'engagement, sharpened the brand voice, and built a loyal, active audience.',
      tags: ['SMM', 'Content', 'Community', 'Design'],
    },
  ],

  /* ---------------------------------------------------------------------------
   *  5. CAPABILITIES  —  the hover list
   * ------------------------------------------------------------------------- */
  capabilities: [
    {
      title: 'Social Media Management',
      desc: 'End-to-end account management — content calendars, posting cadence, community engagement and growth across Instagram, Facebook and TikTok.',
      stack: ['Instagram', 'Facebook', 'TikTok', 'Scheduling'],
    },
    {
      title: 'Content Creation',
      desc: 'Scroll-stopping graphics, reels, short-form video and meme marketing — creative that fits the brand and earns engagement.',
      stack: ['Canva', 'CapCut', 'Reels', 'Memes'],
    },
    {
      title: 'Paid Advertising',
      desc: 'Meta & Google Ads for reach, leads and sales. Audience research, creative testing, retargeting and ongoing optimisation.',
      stack: ['Meta Ads Manager', 'Google Ads', 'Retargeting'],
    },
    {
      title: 'Email Marketing & Automation',
      desc: 'Newsletters, campaigns and automated flows that nurture an audience and bring customers back.',
      stack: ['Mailchimp', 'Flows', 'Newsletters'],
    },
    {
      title: 'AI-Powered Marketing',
      desc: 'AI prompt engineering for ideas, captions, ad copy and strategy; Midjourney for visuals; and automation to speed up repetitive work.',
      stack: ['Prompt Engineering', 'Midjourney', 'Automation'],
    },
    {
      title: 'Brand & Strategy',
      desc: 'Market research, positioning, content strategy and analytics & reporting — so the work ladders up to real business goals.',
      stack: ['Research', 'Analytics', 'Positioning'],
    },
  ],

  /* ---------------------------------------------------------------------------
   *  6. ABOUT
   * ------------------------------------------------------------------------- */
  about: {
    lead:
      'I help businesses build their brand presence and connect with the right audience — ' +
      'through social media management, content creation, community engagement and performance marketing.',
    paragraphs: [
      'Over 3+ years I have managed and grown 20+ social media accounts, created content ' +
        'that people actually engage with, and run paid ad campaigns that deliver real results. ' +
        'I work with local and international brands across food, beauty, retail and e-commerce.',
      'On the paid side I run Meta and Google campaigns to generate leads and sales, then ' +
        'analyse performance and keep optimising for better results — reach, engagement and revenue.',
      'I am also heavily into AI tools: prompt engineering for content and strategy, AI designs ' +
        'with Midjourney, and automating repetitive marketing tasks to improve creativity and efficiency.',
    ],
    facts: [
      { k: 'Based in', v: 'Pakistan · working GMT+5' },
      { k: 'Brand', v: 'Strategies by Maddy · since 2021' },
      { k: 'Works with', v: 'Founders, small businesses & e-commerce brands' },
      { k: 'Tools', v: 'Meta & Google Ads · GA4 · Mailchimp · Canva · CapCut · Midjourney' },
    ],
  },

  /* ---------------------------------------------------------------------------
   *  7. PROCESS
   * ------------------------------------------------------------------------- */
  process: [
    { title: 'Audit', desc: 'A close look at the accounts, competitors and past content & ad performance to find the gaps and the quick wins.' },
    { title: 'Strategy', desc: 'Positioning, content pillars, a posting cadence and a paid plan — all tied to clear business goals.' },
    { title: 'Create', desc: 'Scroll-stopping content: graphics, reels, memes and ad creative, produced in a consistent weekly rhythm.' },
    { title: 'Publish & engage', desc: 'Consistent posting plus real community management — replies, DMs and conversations that build loyalty.' },
    { title: 'Advertise', desc: 'Meta & Google campaigns for reach, leads and sales. Test creatives and audiences, then scale what works.' },
    { title: 'Analyse', desc: 'Clear reporting on what moved the numbers, with the learnings fed straight into the next cycle.' },
  ],

  /* ---------------------------------------------------------------------------
   *  8. CERTIFICATES  —  training & recognition
   * ------------------------------------------------------------------------- */
  certificates: [
    { title: 'Digital Marketing — ICR IT Centre', year: '2023', note: 'Specialised in social media management' },
    { title: 'Fundamentals of Digital Marketing', year: '', note: 'Certified by Google Digital Garage' },
    { title: 'Skill Development — Appreciation', year: '', note: 'For participating in the Project Gala' },
    { title: 'Alpha Harbour Project — Completion', year: '', note: 'Successful completion of a digital marketing project' },
  ],

  /* ---------------------------------------------------------------------------
   *  9. SOCIAL LINKS  —  shown in the footer / contact
   *     Remove any you do not want. Keep label + url.
   *     >>> Replace the # / handles below with your real profile links. <<<
   * ------------------------------------------------------------------------- */
  socials: [
    { label: 'Instagram', url: 'https://www.instagram.com/strategiesbymaddy/' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/muzamil-masood-a5095629a/' },
    { label: 'WhatsApp', url: 'https://wa.me/923123209782' },
    { label: 'Call · +92 312 3209782', url: 'tel:+923123209782' },
    { label: 'Email', url: 'mailto:strategiesbymaddy@gmail.com' },
  ],
};

export default content;
