/* ============================================================
   MENAHIL FATIMA: THE SERIES
   All seasons and episodes live here. The rows, the featured
   banner and the episode pages are all rendered from this file.

   To add an episode: add an entry to EPISODES, then add its id
   to the right season in SEASONS.

   Fields:
     kind     'project' | 'work' | 'leadership' | 'award' | 'research'
     poster   each episode's animated poster lives in posters.js under
              the same id. Without one, an optional `image` path is used,
              and otherwise a planet poster is generated using `hue` (0 to 360)
     plot     array of paragraphs
     points   array of bullet points
     tech     array of tools / stack
     cast     array of { name, role }
     award    optional award line shown on the episode page
     soon     true for "coming soon" episodes
   ============================================================ */

window.SERIES = (function () {
  'use strict';

  const EPISODES = {

    /* ---------------- SEASON 1 ---------------- */
    arcelia: {
      kind: 'project',
      title: 'Arcelia',
      tagline: 'A luxury hotel website. The very first deployment.',
      dates: 'Nov to Dec 2023',
      org: 'Website Development',
      match: 92,
      genres: ['Front-End', 'UI Design', 'Responsive'],
      plot: [
        'My first real website: a multi-page site for a fictional five-star hotel. Every layout choice, colour and hover state was deliberate.',
        'It was the project that taught me to think like a developer and a designer at the same time. How does a page make someone feel? Does it work on a phone? Are the buttons where a person expects them?'
      ],
      points: [
        'Sign up flow with form validation',
        'Restaurant and accommodation pages with a clear visual hierarchy',
        'Sustainability section and a validated contact form',
        'Responsive layout with a sticky header and smooth section links'
      ],
      tech: ['HTML', 'CSS'],
      learned: 'Design decisions are technical decisions. Padding, line height and contrast are user experience engineering, not decoration.',
      cast: [{ name: 'Manahil Tanweer', role: 'Collaborator' }, { name: 'Hania Atta', role: 'Collaborator' }]
    },

    /* ---------------- SEASON 2 ---------------- */
    dandelions: {
      kind: 'project',
      title: 'Dandelions',
      tagline: 'A botanical garden website that won Best Team Project.',
      dates: '2024',
      org: 'Website Development',
      match: 97,
      genres: ['Front-End', 'E-Commerce', 'Award Winner'],
      award: 'Best Team Project for Web Development, presented by NETSOL (2024)',
      plot: [
        'A full botanical garden website built to educate and engage: an e-shop, events, a gallery and learning modules about plants.',
        'It was the first project that stopped feeling like coursework and started feeling like something worth being proud of.'
      ],
      points: [
        'Sign in and register flow',
        'Plant e-shop with product pages and a cart',
        'Events listing, sustainability page and an interactive gallery',
        'Learning modules with plant profiles',
        'Responsive Bootstrap layout tested across screen sizes'
      ],
      tech: ['HTML', 'CSS', 'Bootstrap', 'JavaScript'],
      learned: 'Awards follow from caring about the user at every step. That lesson has held for every project since.',
      cast: [{ name: 'Manahil Tanweer', role: 'Collaborator' }, { name: 'Hania Atta', role: 'Collaborator' }]
    },

    gaminghub: {
      kind: 'project',
      title: 'Gaming Hub',
      tagline: 'A collection of single-player games in pure C++.',
      dates: '2024',
      org: 'Programming Fundamentals',
      match: 95,
      genres: ['C++', 'Game Dev', 'Award Winner'],
      award: 'Best Team Project for Programming, presented by NETSOL (2024)',
      plot: [
        'A console application that hosts several single-player games inside one hub. No engines and no libraries, just C++ and a terminal.',
        'The real challenge was structure: how do you organise the code so adding another game does not break the others?'
      ],
      points: [
        'Several games with their own rules and scoring',
        'Player accounts and profiles',
        'Difficulty levels, achievements and leaderboards',
        'Scores saved between runs with file I/O'
      ],
      tech: ['C++', 'File I/O', 'Terminal UI'],
      learned: 'Architecture matters more than features. Good structure lets you add the next game in an afternoon.'
    },

    senseai: {
      kind: 'work',
      title: 'sense.ai',
      subtitle: 'Software Development Intern',
      tagline: 'First internship. A real company website, designed and launched.',
      dates: 'Aug to Sep 2024',
      org: 'sense.ai · Remote',
      match: 96,
      genres: ['Internship', 'Front-End', 'Production'],
      plot: [
        'I designed and launched sense.ai\'s official website, which showcases the company\'s AI-driven products for productivity and personal growth.',
        'It was my first time building for a real brand and real visitors, from design through to launch.'
      ],
      points: [
        'Designed the website around the company\'s products and brand',
        'Built responsive pages in HTML, CSS, JavaScript and Bootstrap',
        'Took it from design to a live launch'
      ],
      tech: ['HTML', 'CSS', 'JavaScript', 'Bootstrap']
    },

    /* ---------------- SEASON 3 ---------------- */
    banking: {
      kind: 'project',
      title: 'Banking System',
      tagline: 'A banking management system built on object-oriented C++.',
      dates: 'Nov to Dec 2024',
      org: 'Object-Oriented Programming',
      match: 94,
      hue: 210,
      genres: ['C++', 'OOP', 'FinTech'],
      plot: [
        'A banking simulation covering accounts, logins, deposits, withdrawals and transaction history, built to put object-oriented design into practice.'
      ],
      points: [
        'Account creation and login',
        'Deposits, withdrawals and live balance updates',
        'Transaction history per account',
        'Class hierarchy using inheritance, polymorphism and encapsulation'
      ],
      tech: ['C++', 'OOP']
    },

    skinsations: {
      kind: 'project',
      title: 'Skinsations',
      subtitle: 'Clinic Database',
      tagline: 'A database for a real aesthetic clinic.',
      dates: 'Oct 2024 to Jan 2025',
      org: 'Database Systems',
      match: 96,
      genres: ['Databases', 'Real Client', 'ERD'],
      plot: [
        'A relational database designed for a real aesthetic clinic. Requirements came from talking to the clinic about how they actually work: patients, appointments, treatments, billing and stock.'
      ],
      points: [
        'Patient records and appointment scheduling',
        'Treatment logs, billing and inventory',
        'Normalised schema with a full ERD',
        'SQL scripts for reporting and data entry'
      ],
      tech: ['MySQL', 'ERD', 'SQL'],
      learned: 'A perfect schema the client cannot use is a failed project. Translating real workflows into tables is half the job.'
    },

    finnovation: {
      kind: 'project',
      title: 'Finnovation',
      tagline: 'A RAG chatbot that answers questions about finance documents.',
      dates: 'Nov 2024 to Jan 2025',
      org: 'Built with 4XPillars (Germany)',
      match: 96,
      genres: ['AI', 'RAG', 'FinTech'],
      plot: [
        'A retrieval-augmented chatbot, built with 4XPillars in Germany, that answers questions about finance documents.',
        'Documents are chunked, embedded and stored in a vector index, so answers are grounded in the source instead of guessed.'
      ],
      points: [
        'Document ingestion, chunking and embeddings',
        'FAISS vector search for retrieval',
        'Fast LLM responses through Groq',
        'Gradio interface for asking questions'
      ],
      tech: ['Groq', 'LangChain', 'Hugging Face', 'FAISS', 'Gradio'],
      learned: 'In finance a confident wrong answer is worse than no answer. Grounding is the product.'
    },

    ta: {
      kind: 'leadership',
      title: 'Teaching Assistant',
      subtitle: 'Four university labs',
      tagline: 'When you can teach it, you actually know it.',
      dates: 'Oct 2024 to Present',
      org: 'Beaconhouse National University',
      match: 98,
      hue: 265,
      genres: ['Teaching', 'Leadership', 'Ongoing'],
      plot: [
        'I TA four labs at BNU. In every lab I also work with the instructor on planning the material.'
      ],
      points: [
        'Programming Fundamentals Lab: for most students this is their first programming course, so a big part of my role is helping them when they get stuck on their code',
        'AI Lab: I support students during lab sessions and help prepare the material',
        'ICT Lab: I help students get comfortable with the basics of computing',
        'Applied Physics Lab: I guide students through experiments on circuits, semiconductors and logic gates, and grade their lab reports'
      ],
      tech: ['Teaching', 'Python', 'C++', 'Lab planning']
    },

    /* ---------------- SEASON 4 ---------------- */
    texteditor: {
      kind: 'project',
      title: 'Text Editor',
      subtitle: 'in 8086 Assembly',
      tagline: 'A command line text editor, written one register at a time.',
      dates: 'Apr 2025',
      org: 'Low-level programming',
      match: 90,
      hue: 150,
      genres: ['Assembly', 'Low-Level', 'CLI'],
      plot: [
        'A working command line text editor written entirely in 8086 Assembly.'
      ],
      points: [
        'Written entirely in 8086 Assembly',
        'Runs from the command line'
      ],
      tech: ['8086 Assembly']
    },

    afterlight: {
      kind: 'project',
      title: 'AfterLight',
      tagline: 'A narrative web game made for an art and design thesis.',
      dates: 'Apr to Jun 2025',
      org: 'BNU Connect',
      match: 93,
      hue: 20,
      genres: ['Game Dev', 'Narrative', 'Cross-Disciplinary'],
      award: 'Award of Excellence, BNU Connect 2025',
      plot: [
        'A narrative web game built for an art and design student\'s thesis. My job was to turn their story and visual world into something playable without losing what it meant.'
      ],
      points: [
        'Story-driven interactions and branching choices',
        'Interface designed to match the artist\'s atmosphere',
        'Close collaboration between computer science and visual arts'
      ],
      tech: ['JavaScript', 'HTML', 'CSS'],
      learned: 'The best technical work disappears into the experience.'
    },

    grantify: {
      kind: 'project',
      title: 'Grantify',
      tagline: 'Tracks about 280 funding sites so nobody has to check them by hand.',
      dates: 'May to Jul 2025',
      org: 'BNU Office of Research, Innovation & Partnerships',
      match: 97,
      genres: ['Automation', 'Scraping', 'Award Winner'],
      award: 'Project Showcase 2025 award',
      plot: [
        'An automated grant tracker for BNU\'s Office of Research, Innovation & Partnerships. It scrapes about 280 funding sites so the office doesn\'t have to check them by hand.'
      ],
      points: [
        'Scheduled scraping of around 280 funding sites',
        'Background jobs with Celery and Redis',
        'Grants stored and deduplicated in PostgreSQL',
        'Deployed on DigitalOcean'
      ],
      tech: ['FastAPI', 'Celery', 'Redis', 'PostgreSQL', 'BeautifulSoup', 'Selenium', 'DigitalOcean'],
      learned: 'Good automation does not replace people. It gives them their time back.',
      cast: [
        { name: 'Hania Atta', role: 'Collaborator' },
        { name: 'Abdul Hadi Jalal', role: 'Collaborator' },
        { name: 'Dr. Usman Nazir', role: 'Mentor' }
      ]
    },

    wet: {
      kind: 'work',
      title: 'Women Empowerment Training',
      subtitle: 'Research & Outreach Analyst',
      tagline: 'Measuring whether the training actually worked.',
      dates: 'Apr to Dec 2025',
      org: 'BNU with DigitalOcean · Lahore',
      match: 91,
      hue: 185,
      genres: ['Research', 'Data Analysis', 'Social Impact'],
      plot: [
        'The programme trained women-led startups. My role was to follow up with them afterwards and measure the programme\'s impact.'
      ],
      points: [
        'Followed up with women-led startups after their training',
        'Gathered and analysed data to measure the programme\'s impact',
        'Helped improve the training\'s feedback loops',
        'Represented the programme at Forman Christian College'
      ],
      tech: ['Research', 'Data Analysis', 'Reporting'],
      cast: [
        { name: 'Dr. Usman Nazir', role: 'Mentor' },
        { name: 'Mr. Nouman Ali', role: 'Mentor' }
      ]
    },

    /* ---------------- SEASON 5 ---------------- */
    osso: {
      kind: 'work',
      title: 'Osso.ai',
      subtitle: 'Full Stack Development Intern',
      tagline: 'MERN apps, REST APIs and AI features, shipped remotely.',
      dates: 'Sep to Nov 2025',
      org: 'Osso.ai · Remote',
      match: 98,
      hue: 230,
      genres: ['Internship', 'MERN', 'APIs'],
      plot: [
        'Three months building full-stack web apps on the MERN stack at Osso.ai.'
      ],
      points: [
        'Built full-stack web apps with MongoDB, Express.js, React and Node.js',
        'Built and maintained REST APIs',
        'Added basic AI features to the apps',
        'Improved database schemas and backend performance'
      ],
      tech: ['MongoDB', 'Express.js', 'React', 'Node.js', 'REST APIs']
    },

    apac: {
      kind: 'work',
      title: 'APAC Cybersecurity Clinic',
      subtitle: 'Cybersecurity Trainee',
      tagline: 'Part of the first cohort in Pakistan.',
      dates: 'Nov 2025 to May 2026',
      org: 'InnovAtrium, BNU · Lahore',
      match: 99,
      hue: 330,
      genres: ['Cybersecurity', 'Training', 'First Cohort'],
      plot: [
        'The clinic is run with Google.org, The Asia Foundation and the Global Cyber Alliance. I was part of the first cohort in Pakistan.'
      ],
      points: [
        'Went through the train-the-trainer programme, which prepared me to teach foundational cybersecurity to others',
        'Took part in the Spring 2026 Clinic of Clinics with the Consortium of Cybersecurity Clinics'
      ],
      tech: ['Cybersecurity', 'Train-the-Trainer', 'Security Awareness']
    },

    enmawae: {
      kind: 'project',
      title: 'Enmawae Studio',
      tagline: 'An e-commerce system for a formalwear brand.',
      dates: 'Oct 2025 to Jan 2026',
      org: 'Formalwear e-commerce',
      match: 92,
      hue: 300,
      genres: ['Software Engineering', 'Testing', 'E-Commerce'],
      plot: [
        'A full software engineering pass on an e-commerce system for a formalwear brand: from requirements and design through to testing and a working prototype.'
      ],
      points: [
        'UML diagrams for the system design',
        'Test cases written against the requirements',
        'A working prototype'
      ],
      tech: ['UML', 'Test Cases', 'Prototyping']
    },

    imagedetect: {
      kind: 'project',
      title: 'AI-Generated Image Detection',
      tagline: 'Telling real images apart from AI-generated ones.',
      dates: 'Dec 2025 to Jan 2026',
      org: 'Digital Forensics',
      match: 99,
      genres: ['Deep Learning', 'Forensics', 'Explainable AI'],
      plot: [
        'A digital forensics project that tells real images apart from AI-generated ones.',
        'I compared a baseline CNN with Xception and MobileNetV2, and used Grad-CAM to show what each model looks at, so the results can be explained and not just trusted.'
      ],
      points: [
        'Baseline CNN trained from scratch',
        'Transfer learning with Xception and MobileNetV2',
        'Side-by-side comparison of all three models',
        'Grad-CAM heatmaps showing which regions drive each prediction'
      ],
      tech: ['TensorFlow', 'Keras', 'CNNs', 'Transfer Learning', 'Grad-CAM'],
      learned: 'In forensics, a model you can explain beats a model you just have to trust.'
    },

    suid: {
      kind: 'research',
      title: 'SUID Misconfigurations',
      subtitle: 'in Linux',
      tagline: 'How one wrong permission bit hands over root.',
      dates: 'Nov 2025 to Jan 2026',
      org: 'Security Research',
      match: 95,
      hue: 95,
      genres: ['Security', 'Linux', 'Privilege Escalation'],
      plot: [
        'Security research on how misconfigured SUID permissions let users escalate their privileges on Linux.'
      ],
      points: [
        'Set up a vulnerable Ubuntu VM',
        'Reproduced privilege escalation through misconfigured SUID binaries',
        'Looked at how these misconfigurations are found and prevented'
      ],
      tech: ['Ubuntu VM', 'Linux', 'Bash']
    },

    /* ---------------- SEASON 6 ---------------- */
    umeed: {
      kind: 'project',
      title: 'Umeed-e-Zann',
      tagline: 'A safety, health and legal-help app for women, designed for low literacy.',
      dates: 'Mar to Jun 2026',
      org: 'English & Nastaliq Urdu',
      match: 98,
      hue: 340,
      genres: ['UX Research', 'Accessibility', 'Social Impact'],
      plot: [
        'A safety, health and legal-help app for women, designed in English and Nastaliq Urdu.',
        'It is icon-first and voice-guided, so it works for users with low literacy, and it has a 3-second SOS.'
      ],
      points: [
        'Bilingual design in English and Nastaliq Urdu',
        'Icon-first, voice-guided navigation for low-literacy users',
        '3-second SOS',
        'Shaped through usability testing'
      ],
      tech: ['Figma', 'Usability Testing']
    },

    cipherchain: {
      kind: 'project',
      title: 'CipherChain',
      tagline: 'A fully on-chain CTF puzzle game on Ethereum.',
      dates: 'May to Jun 2026',
      org: 'Ethereum Sepolia',
      match: 99,
      genres: ['Blockchain', 'Security', 'CTF'],
      plot: [
        'A fully on-chain CTF puzzle game on Ethereum (Sepolia). Players solve puzzles, and the first to finish wins 80% of the prize pool.',
        'I paid close attention to contract security, using reentrancy guards and keccak256-hashed answers.'
      ],
      points: [
        'Puzzles and prize pool live entirely on-chain',
        'First player to finish wins 80% of the pool',
        'Answers stored as keccak256 hashes, never in plain text',
        'Reentrancy guards to protect payouts',
        'React front end connected through ethers.js and MetaMask'
      ],
      tech: ['Solidity', 'React', 'ethers.js', 'MetaMask'],
      learned: 'On-chain, every bug is public and permanent. You test like an attacker before you deploy.'
    },

    neuralnova: {
      kind: 'leadership',
      title: 'Head of Neural Nova',
      subtitle: 'BTECH Fest 2026',
      tagline: '30 teams. 15+ universities. BNU\'s first tech fest.',
      dates: '2026',
      org: 'BTECH Fest, BNU',
      match: 97,
      hue: 280,
      genres: ['Leadership', 'AI/ML', 'Events'],
      plot: [
        'I was Head of Neural Nova, the AI/ML category at BTECH Fest 2026, BNU\'s first tech fest, with 30 teams from more than 15 universities.',
        'I was also a team head in the BTECH Fest Secretariat.'
      ],
      points: [
        'Ran the AI/ML category from planning through to judging',
        '30 teams from more than 15 universities',
        'Team head, BTECH Fest Secretariat'
      ],
      tech: ['Leadership', 'Event Management', 'AI/ML']
    },

    ctf: {
      kind: 'award',
      title: 'Cyber Fest CTF',
      subtitle: 'First place',
      tagline: 'My team took first place out of 26.',
      dates: '2026',
      org: 'Cyber Fest',
      match: 100,
      hue: 42,
      genres: ['CTF', 'Web Exploitation', 'Boot2Root'],
      award: 'First place, Cyber Fest CTF (out of 26 teams)',
      plot: [
        'My team placed first out of 26 teams at the Cyber Fest Capture the Flag competition, working through web exploitation and Boot2Root challenges.'
      ],
      points: [
        'First place out of 26 teams',
        'Web exploitation challenges',
        'Boot2Root: from initial foothold to root'
      ],
      tech: ['Web Exploitation', 'Linux Privilege Escalation', 'OWASP']
    },

    innovatrium: {
      kind: 'work',
      title: 'InnovAtrium',
      subtitle: 'Software Engineering Intern',
      tagline: 'Building the systems the university runs on.',
      dates: 'Jun to Aug 2026',
      org: 'InnovAtrium, BNU · Lahore',
      match: 98,
      genres: ['Internship', 'ERP', 'Laravel'],
      plot: [
        'InnovAtrium is BNU\'s innovation office. Over the summer I worked on the systems the university runs on.'
      ],
      points: [
        'Built parts of the university\'s ERP systems, including a Scholarship Management System',
        'Designed and built the InnovAtrium website'
      ],
      tech: ['Laravel', 'PHP', 'Oracle Database']
    },

    /* ---------------- SEASON 7 ---------------- */
    axionox: {
      kind: 'work',
      title: 'Axionox',
      subtitle: 'SQA Engineer & Project Manager',
      tagline: 'Making sure what we ship to clients actually works.',
      dates: 'Jul 2026 to Present',
      org: 'Axionox · Full-time, Remote',
      match: 99,
      genres: ['QA', 'Project Management', 'Now'],
      plot: [
        'Axionox is an AI automation and marketing agency. I look after quality assurance and project management.'
      ],
      points: [
        'Test the software and automations we deliver to clients before they go live',
        'Manage projects from planning through delivery, and keep the team and clients on the same page',
        'Test and manage client workflows in GoHighLevel and Make.com',
        'Built the Axionox website'
      ],
      tech: ['GoHighLevel', 'Make.com', 'QA', 'Project Management']
    },

    thesis: {
      kind: 'research',
      soon: true,
      title: 'Event-Driven Selective Scanning',
      subtitle: 'Final-year thesis',
      tagline: 'Making always-on heart monitoring cheaper to run.',
      dates: '2026 to 2027',
      org: 'Supervised by Dr. Muhammad Ali',
      match: 99,
      genres: ['Machine Learning', 'ECG', 'Healthcare'],
      plot: [
        'Hospital monitors and wearable heart recorders run machine learning on ECG signals around the clock. My thesis looks at making that kind of continuous monitoring more efficient, so models don\'t waste computation and can run on always-on, low-power devices.',
        'Alongside the research, I\'m building it into a tool for cardiologists in Pakistan.',
        'More details once the paper is out.'
      ],
      points: [
        'Machine learning on continuous ECG signals',
        'Less wasted computation for always-on, low-power devices',
        'Being built into a tool for cardiologists in Pakistan'
      ],
      tech: ['Python', 'PyTorch', 'ECG Signals'],
      cast: [{ name: 'Dr. Muhammad Ali', role: 'Supervisor' }]
    }
  };

  const SEASONS = [
    {
      n: 1, title: 'The Pilot', period: 'Fall 2023',
      desc: 'Where it started. One website, a lot of CSS and the first sense of what building things feels like.',
      episodes: ['arcelia']
    },
    {
      n: 2, title: 'The C++ Arc', period: 'Spring to Summer 2024',
      desc: 'Two NETSOL team awards and a first internship.',
      episodes: ['gaminghub', 'dandelions', 'senseai']
    },
    {
      n: 3, title: 'The Database Arc', period: 'Fall 2024',
      desc: 'Real data, a real client, a first RAG pipeline, and the start of four labs as a TA.',
      episodes: ['skinsations', 'finnovation', 'banking', 'ta']
    },
    {
      n: 4, title: 'The Automation Arc', period: 'Spring to Summer 2025',
      desc: 'An award-winning grant tracker, a game for an art thesis, and Assembly for good measure.',
      episodes: ['grantify', 'afterlight', 'wet', 'texteditor']
    },
    {
      n: 5, title: 'The Security Arc', period: 'Fall 2025',
      desc: 'Pakistan\'s first APAC Cybersecurity Clinic cohort, Linux privilege escalation, and catching AI-generated images.',
      episodes: ['imagedetect', 'apac', 'osso', 'suid', 'enmawae']
    },
    {
      n: 6, title: 'The Breakout Season', period: 'Spring to Summer 2026',
      desc: 'First place at a CTF, an on-chain puzzle game, running a category at BTECH Fest, and building university systems.',
      episodes: ['ctf', 'cipherchain', 'innovatrium', 'neuralnova', 'umeed']
    },
    {
      n: 7, title: 'Now Streaming', period: 'Fall 2026 onwards', live: true,
      desc: 'Full time at Axionox, and a thesis on making heart monitoring more efficient.',
      episodes: ['axionox', 'thesis'],
      finale: { label: 'Series finale', title: 'Graduation', when: 'Jul 2027' }
    }
  ];

  // Attach season / episode numbers to every episode
  SEASONS.forEach(season => {
    season.episodes.forEach((id, i) => {
      const ep = EPISODES[id];
      ep.id = id;
      ep.season = season.n;
      ep.episode = i + 1;
      ep.label = `S${season.n} · E${i + 1}`;
    });
  });

  // FEATURED is the episode shown in the big banner on the home page
  return { EPISODES, SEASONS, FEATURED: 'thesis' };
})();
