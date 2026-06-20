/* ═══════════════════════════════════════════════════════════
   SRUTAM Learn — Seed Data (dummy content for demo)
   All content is original/adapted; images are royalty-free
   (Unsplash CDN) with a branded SVG fallback in ui.js.
═══════════════════════════════════════════════════════════ */
window.App = window.App || {};

App.seed = (function () {
  const categories = [
    { id: "dev",        name: "Web Development",            icon: "code-2",        color: "#0178CF" },
    { id: "data",       name: "Data Science & AI",          icon: "brain-circuit", color: "#7C3AED" },
    { id: "design",     name: "Design",                     icon: "palette",       color: "#EC4899" },
    { id: "marketing",  name: "Marketing",                  icon: "megaphone",     color: "#F59E0B" },
    { id: "elearning",  name: "Instructional Design",       icon: "graduation-cap",color: "#00B2F5" },
    { id: "business",   name: "Business & Analytics",       icon: "trending-up",   color: "#10B981" },
  ];

  const instructors = [
    { id: "i1", name: "Aarav Sharma",     title: "Full-Stack Engineer & Educator",       students: 184500, courses: 8, rating: 4.7 },
    { id: "i2", name: "Dr. Meera Krishnan",title: "Data Scientist, PhD (Machine Learning)",students: 132900, courses: 6, rating: 4.6 },
    { id: "i3", name: "Sofia Alvarez",    title: "Lead Product Designer",                 students: 96200,  courses: 5, rating: 4.8 },
    { id: "i4", name: "Daniel Okeke",     title: "Growth & Performance Marketer",         students: 121400, courses: 7, rating: 4.5 },
    { id: "i5", name: "Priya Nair",       title: "Senior Instructional Designer",         students: 41800,  courses: 4, rating: 4.7 },
    { id: "i6", name: "James Carter",     title: "Business Analytics Consultant",         students: 88700,  courses: 5, rating: 4.6 },
  ];

  // Helper to build a curriculum section
  const sec = (title, lectures) => ({ title, lectures });
  const lec = (title, duration, preview = false) => ({ title, duration, preview });

  const courses = [
    {
      id: "c1",
      slug: "complete-web-development-bootcamp",
      title: "The Complete Web Development Bootcamp 2026",
      subtitle: "Become a full-stack developer: HTML, CSS, JavaScript, React, Node.js, APIs and databases — build 12 real projects.",
      categoryId: "dev",
      instructorId: "i1",
      price: 12.99, oldPrice: 84.99,
      rating: 4.7, ratingsCount: 12540, students: 184500,
      level: "Beginner to Advanced", language: "English",
      hours: 52, lectures: 410, articles: 38, resources: 64,
      updated: "May 2026",
      bestseller: true,
      image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=900&q=80",
      whatYouLearn: [
        "Build responsive websites with semantic HTML5 and modern CSS",
        "Master JavaScript ES2024, the DOM and asynchronous programming",
        "Create single-page apps with React, hooks and state management",
        "Build REST APIs with Node.js, Express and MongoDB",
        "Deploy production apps with Git, CI/CD and cloud hosting",
        "Work with authentication, payments and third-party APIs",
      ],
      requirements: [
        "No prior coding experience needed — we start from zero",
        "A computer (Windows, macOS or Linux) with internet access",
        "Enthusiasm and willingness to practice",
      ],
      curriculum: [
        sec("Getting Started", [
          lec("Welcome & how to get the most out of this course", "6:12", true),
          lec("How the web works: clients, servers & HTTP", "11:40", true),
          lec("Setting up your developer environment", "9:05"),
        ]),
        sec("HTML & CSS Foundations", [
          lec("Semantic HTML structure", "14:22"),
          lec("CSS box model & flexbox", "18:30"),
          lec("Responsive design with media queries & grid", "21:10"),
          lec("Project: build a landing page", "27:45"),
        ]),
        sec("JavaScript Deep Dive", [
          lec("Variables, types & functions", "16:50"),
          lec("The DOM & event handling", "19:15"),
          lec("Fetch, promises & async/await", "22:33"),
          lec("Project: interactive quiz app", "31:08"),
        ]),
        sec("React & Modern Front-End", [
          lec("Thinking in components", "15:40"),
          lec("Hooks: useState & useEffect", "20:12"),
          lec("Routing & global state", "23:55"),
          lec("Project: course dashboard UI", "29:30"),
        ]),
        sec("Back-End with Node.js", [
          lec("Express fundamentals & routing", "18:20"),
          lec("MongoDB & data modelling", "21:44"),
          lec("Authentication with JWT", "24:18"),
          lec("Capstone: full-stack app & deployment", "38:02"),
        ]),
      ],
      reviews: [
        { user: "Rohan Mehta",   rating: 5, date: "2 weeks ago",  text: "Hands down the best bootcamp I've taken. The projects are practical and the instructor explains everything clearly." },
        { user: "Emily Watson",  rating: 5, date: "1 month ago",  text: "Went from zero to landing a junior dev role in 6 months. The React section alone is worth the price." },
        { user: "Karthik R.",    rating: 4, date: "1 month ago",  text: "Great depth and structure. Would love a TypeScript module, but everything else is excellent." },
      ],
    },
    {
      id: "c2",
      slug: "data-science-machine-learning",
      title: "Data Science & Machine Learning A–Z",
      subtitle: "Learn Python, statistics, data visualisation, machine learning and deep learning — with real datasets and hands-on labs.",
      categoryId: "data",
      instructorId: "i2",
      price: 14.99, oldPrice: 94.99,
      rating: 4.6, ratingsCount: 8210, students: 132900,
      level: "Intermediate", language: "English",
      hours: 44, lectures: 360, articles: 42, resources: 80,
      updated: "April 2026",
      bestseller: true,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
      whatYouLearn: [
        "Analyse and visualise data with Python, Pandas and Matplotlib",
        "Apply statistics and probability to real problems",
        "Build and evaluate machine-learning models with scikit-learn",
        "Understand neural networks and deep learning with TensorFlow",
        "Tackle classification, regression and clustering tasks",
        "Communicate insights with compelling data stories",
      ],
      requirements: [
        "Basic Python is helpful but a refresher module is included",
        "High-school level mathematics",
        "Anaconda / Jupyter (free) — setup guide provided",
      ],
      curriculum: [
        sec("Python for Data Science", [
          lec("Course roadmap & toolkit", "7:30", true),
          lec("NumPy & Pandas essentials", "24:10", true),
          lec("Cleaning messy real-world data", "26:48"),
        ]),
        sec("Statistics & Visualisation", [
          lec("Descriptive statistics", "19:22"),
          lec("Hypothesis testing", "22:05"),
          lec("Storytelling with charts", "20:40"),
        ]),
        sec("Machine Learning", [
          lec("Regression models", "25:18"),
          lec("Classification & decision trees", "27:55"),
          lec("Model evaluation & tuning", "23:30"),
          lec("Project: predict customer churn", "34:12"),
        ]),
        sec("Deep Learning", [
          lec("Neural network fundamentals", "26:44"),
          lec("Building a model with TensorFlow", "29:18"),
          lec("Capstone: image classifier", "41:05"),
        ]),
      ],
      reviews: [
        { user: "Ananya Gupta", rating: 5, date: "3 weeks ago", text: "Perfect balance of theory and practice. The churn-prediction project is something I now use at work." },
        { user: "Marco Rossi",  rating: 4, date: "1 month ago", text: "Dr. Krishnan is a fantastic teacher. The deep-learning part could be a bit slower, but overall superb." },
        { user: "Sara Lee",     rating: 5, date: "2 months ago",text: "Best ML course for the price. Datasets are realistic and the labs really cement the concepts." },
      ],
    },
    {
      id: "c3",
      slug: "ui-ux-design-masterclass",
      title: "UI/UX Design Masterclass: Figma to Prototype",
      subtitle: "Design beautiful, user-centred interfaces. Master Figma, design systems, wireframing, prototyping and usability testing.",
      categoryId: "design",
      instructorId: "i3",
      price: 11.99, oldPrice: 74.99,
      rating: 4.8, ratingsCount: 5930, students: 96200,
      level: "All Levels", language: "English",
      hours: 28, lectures: 240, articles: 22, resources: 45,
      updated: "May 2026",
      bestseller: false,
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=900&q=80",
      whatYouLearn: [
        "Apply the core principles of UX and visual design",
        "Master Figma: components, auto-layout and variables",
        "Build scalable design systems and style guides",
        "Create wireframes, mockups and interactive prototypes",
        "Run usability tests and iterate on feedback",
        "Build a portfolio with 3 case-study projects",
      ],
      requirements: [
        "No design experience required",
        "A free Figma account (we'll set it up together)",
        "A curious, detail-oriented mindset",
      ],
      curriculum: [
        sec("Design Foundations", [
          lec("What makes great UX", "8:40", true),
          lec("Colour, type & layout basics", "18:12", true),
          lec("Accessibility & contrast", "15:30"),
        ]),
        sec("Mastering Figma", [
          lec("Frames, components & auto-layout", "22:18"),
          lec("Design tokens & variables", "19:55"),
          lec("Building a reusable UI kit", "24:40"),
        ]),
        sec("From Wireframe to Prototype", [
          lec("Low to high-fidelity wireframes", "20:05"),
          lec("Interactive prototyping", "23:48"),
          lec("Usability testing 101", "17:22"),
          lec("Capstone: design a mobile app", "33:15"),
        ]),
      ],
      reviews: [
        { user: "Priyanka S.", rating: 5, date: "1 week ago",  text: "Sofia's eye for detail is incredible. My portfolio looks 10x more professional after this course." },
        { user: "Tom Becker",  rating: 5, date: "3 weeks ago", text: "The Figma deep-dive is the best I've seen anywhere. Auto-layout finally clicked for me." },
        { user: "Lina Park",   rating: 4, date: "1 month ago", text: "Loved the case-study approach. A few sections move fast, but the resources help you catch up." },
      ],
    },
    {
      id: "c4",
      slug: "digital-marketing-seo-mastery",
      title: "Digital Marketing & SEO Mastery 2026",
      subtitle: "Grow any business online: SEO, content, social media, Google Ads, email and analytics — a complete marketing system.",
      categoryId: "marketing",
      instructorId: "i4",
      price: 9.99, oldPrice: 64.99,
      rating: 4.5, ratingsCount: 9870, students: 121400,
      level: "Beginner", language: "English",
      hours: 33, lectures: 300, articles: 30, resources: 55,
      updated: "March 2026",
      bestseller: false,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
      whatYouLearn: [
        "Build a complete digital-marketing strategy from scratch",
        "Rank higher on Google with on-page and technical SEO",
        "Create content that attracts and converts customers",
        "Run profitable Google and Meta ad campaigns",
        "Grow and nurture an email list that sells",
        "Measure everything with Google Analytics 4",
      ],
      requirements: [
        "No marketing experience needed",
        "A computer with internet access",
        "Optional: a website or business to practice on",
      ],
      curriculum: [
        sec("Marketing Strategy", [
          lec("The modern marketing funnel", "9:18", true),
          lec("Finding your audience & positioning", "17:40", true),
          lec("Building your brand message", "16:05"),
        ]),
        sec("Search Engine Optimisation", [
          lec("Keyword research that works", "21:30"),
          lec("On-page & technical SEO", "24:12"),
          lec("Link building & authority", "19:48"),
        ]),
        sec("Paid Ads & Social", [
          lec("Google Ads fundamentals", "22:55"),
          lec("Meta ads & creative testing", "23:20"),
          lec("Organic social growth", "18:30"),
        ]),
        sec("Email & Analytics", [
          lec("Email automation that converts", "20:15"),
          lec("Google Analytics 4 deep dive", "21:40"),
          lec("Capstone: 90-day growth plan", "28:50"),
        ]),
      ],
      reviews: [
        { user: "Neha Verma",  rating: 5, date: "2 weeks ago",  text: "Doubled my store's traffic in two months using the SEO framework. Super actionable." },
        { user: "Chris Hall",  rating: 4, date: "1 month ago",  text: "Great for beginners. The Google Ads section saved me a lot of wasted budget." },
        { user: "Aisha Khan",  rating: 4, date: "2 months ago", text: "Daniel keeps it practical and no-fluff. The 90-day plan is a brilliant finish." },
      ],
    },
    {
      id: "c5",
      slug: "instructional-design-scorm-elearning",
      title: "Instructional Design Pro: Build SCORM eLearning",
      subtitle: "Design and build engaging, LMS-ready eLearning. Master ADDIE, storyboarding, scenario-based learning and SCORM publishing.",
      categoryId: "elearning",
      instructorId: "i5",
      price: 13.99, oldPrice: 79.99,
      rating: 4.7, ratingsCount: 3420, students: 41800,
      level: "All Levels", language: "English",
      hours: 21, lectures: 180, articles: 26, resources: 60,
      updated: "May 2026",
      bestseller: true,
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80",
      whatYouLearn: [
        "Apply the ADDIE model to real learning projects",
        "Write measurable learning objectives that work",
        "Create storyboards and scenario-based learning",
        "Build interactive modules with multimedia",
        "Publish SCORM packages for Moodle, Canvas & Blackboard",
        "Measure training outcomes and learner engagement",
      ],
      requirements: [
        "Interest in corporate training or education",
        "No authoring-tool experience required",
        "Access to a free authoring tool (guidance provided)",
      ],
      curriculum: [
        sec("Foundations of Instructional Design", [
          lec("What instructional designers actually do", "8:55", true),
          lec("The ADDIE model explained", "16:20", true),
          lec("Writing learning objectives", "18:10"),
        ]),
        sec("Designing the Learning", [
          lec("Storyboarding your module", "21:05"),
          lec("Scenario-based & microlearning", "19:35"),
          lec("Designing assessments", "17:48"),
        ]),
        sec("Building & Publishing", [
          lec("Multimedia & interactivity", "22:12"),
          lec("Packaging SCORM for any LMS", "24:30"),
          lec("Capstone: build a compliance module", "30:18"),
        ]),
      ],
      reviews: [
        { user: "Deepa Iyer",     rating: 5, date: "1 week ago",  text: "Exactly what I needed to move into L&D. The SCORM publishing module is gold." },
        { user: "Robert Nguyen",  rating: 5, date: "1 month ago", text: "Priya brings real corporate experience. My storyboards are far stronger now." },
        { user: "Hana Suzuki",    rating: 4, date: "1 month ago", text: "Very practical and well-paced. Would love more authoring-tool examples." },
      ],
    },
    {
      id: "c6",
      slug: "business-analytics-excel-power-bi",
      title: "Business Analytics with Excel & Power BI",
      subtitle: "Turn raw data into decisions. Master advanced Excel, dashboards, DAX and Power BI to deliver insights leaders trust.",
      categoryId: "business",
      instructorId: "i6",
      price: 10.99, oldPrice: 69.99,
      rating: 4.6, ratingsCount: 7150, students: 88700,
      level: "Beginner to Intermediate", language: "English",
      hours: 26, lectures: 220, articles: 28, resources: 50,
      updated: "April 2026",
      bestseller: false,
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
      whatYouLearn: [
        "Master advanced Excel formulas, PivotTables and Power Query",
        "Design clean, interactive dashboards",
        "Model data and write DAX measures in Power BI",
        "Tell data stories that drive business decisions",
        "Automate reporting workflows",
        "Build a portfolio dashboard project",
      ],
      requirements: [
        "Basic familiarity with spreadsheets",
        "Excel 2019+ or Microsoft 365",
        "Power BI Desktop (free download)",
      ],
      curriculum: [
        sec("Advanced Excel", [
          lec("Formulas that save hours", "9:40", true),
          lec("PivotTables & dashboards", "20:18", true),
          lec("Power Query for clean data", "22:05"),
        ]),
        sec("Power BI Essentials", [
          lec("Connecting & modelling data", "21:30"),
          lec("DAX measures made simple", "24:48"),
          lec("Designing interactive reports", "20:12"),
        ]),
        sec("Analytics in Practice", [
          lec("KPIs & business storytelling", "18:22"),
          lec("Automating reports", "16:55"),
          lec("Capstone: sales analytics dashboard", "29:40"),
        ]),
      ],
      reviews: [
        { user: "Vikram Joshi", rating: 5, date: "2 weeks ago", text: "Finally understand DAX. The dashboard project impressed my manager." },
        { user: "Olivia Brown", rating: 4, date: "1 month ago", text: "Clear, practical and well structured. Power Query alone changed how I work." },
        { user: "Sanjay P.",    rating: 5, date: "2 months ago",text: "James explains complex ideas simply. Great value for money." },
      ],
    },
    {
      id: "c7",
      slug: "python-for-beginners",
      title: "Python for Beginners: From Zero to Hero",
      subtitle: "Learn Python programming from scratch — syntax, data structures, OOP and automation, with dozens of hands-on exercises.",
      categoryId: "dev", instructorId: "i1",
      price: 9.99, oldPrice: 59.99,
      rating: 4.6, ratingsCount: 15870, students: 210300,
      level: "Beginner", language: "English",
      hours: 30, lectures: 250, articles: 30, resources: 48,
      updated: "May 2026", bestseller: true,
      image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=900&q=80",
      whatYouLearn: [
        "Write clean Python code with confidence",
        "Work with lists, dictionaries, functions and files",
        "Understand object-oriented programming",
        "Automate boring tasks with scripts",
        "Build small real-world projects",
      ],
      requirements: ["No programming experience required", "A computer with internet access", "Python 3 (free) — install guide included"],
      curriculum: [
        sec("Python Basics", [lec("Why Python & setup", "8:10", true), lec("Variables & data types", "16:20", true), lec("Control flow", "18:05")]),
        sec("Core Python", [lec("Functions & modules", "20:12"), lec("Lists & dictionaries", "22:40"), lec("Working with files", "17:33")]),
        sec("Going Further", [lec("Intro to OOP", "21:18"), lec("Error handling", "15:52"), lec("Project: automation script", "26:40")]),
      ],
      reviews: [
        { user: "Grace Liu", rating: 5, date: "2 weeks ago", text: "The clearest intro to Python I've found. Exercises after each lesson really help." },
        { user: "Ahmed Z.", rating: 4, date: "1 month ago", text: "Great pace for absolute beginners. The automation project was fun." },
      ],
    },
    {
      id: "c8",
      slug: "sql-database-design-bootcamp",
      title: "SQL & Database Design Bootcamp",
      subtitle: "Master SQL queries, joins, indexing and relational database design — from beginner to job-ready with real datasets.",
      categoryId: "data", instructorId: "i2",
      price: 11.99, oldPrice: 69.99,
      rating: 4.7, ratingsCount: 6420, students: 78400,
      level: "Beginner to Intermediate", language: "English",
      hours: 24, lectures: 200, articles: 24, resources: 40,
      updated: "April 2026", bestseller: false,
      image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=900&q=80",
      whatYouLearn: [
        "Write SQL queries from simple to advanced",
        "Master JOINs, subqueries and aggregations",
        "Design normalised relational databases",
        "Optimise queries with indexes",
        "Work with PostgreSQL and MySQL",
      ],
      requirements: ["No database experience needed", "A computer (any OS)", "Free database tools — setup included"],
      curriculum: [
        sec("SQL Foundations", [lec("Databases & SQL overview", "9:30", true), lec("SELECT, WHERE & ORDER BY", "19:10", true), lec("Filtering & functions", "17:25")]),
        sec("Relationships", [lec("JOINs explained", "23:40"), lec("Subqueries & CTEs", "21:18"), lec("Aggregations & GROUP BY", "20:05")]),
        sec("Design & Performance", [lec("Normalisation & schema design", "22:30"), lec("Indexes & optimisation", "19:48"), lec("Project: analytics queries", "28:12")]),
      ],
      reviews: [
        { user: "Diego M.", rating: 5, date: "3 weeks ago", text: "Finally understand JOINs and indexing. The design section is excellent." },
        { user: "Wei Chen", rating: 5, date: "1 month ago", text: "Practical and to the point. Helped me pass a technical interview." },
      ],
    },
    {
      id: "c9",
      slug: "graphic-design-bootcamp",
      title: "Graphic Design Bootcamp: Photoshop & Illustrator",
      subtitle: "Master the principles of graphic design and the Adobe tools to create logos, posters, social media graphics and brand identities.",
      categoryId: "design", instructorId: "i3",
      price: 12.99, oldPrice: 79.99,
      rating: 4.5, ratingsCount: 4810, students: 64200,
      level: "All Levels", language: "English",
      hours: 32, lectures: 270, articles: 20, resources: 52,
      updated: "March 2026", bestseller: false,
      image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=900&q=80",
      whatYouLearn: [
        "Apply colour theory, typography and composition",
        "Master Photoshop for photo editing & graphics",
        "Create vector art and logos in Illustrator",
        "Design social media and marketing assets",
        "Build a complete brand identity",
      ],
      requirements: ["No design experience needed", "Adobe Photoshop & Illustrator (free trial works)", "A creative mindset"],
      curriculum: [
        sec("Design Principles", [lec("Colour, type & layout", "10:20", true), lec("Composition & hierarchy", "18:40", true), lec("Design briefs", "14:10")]),
        sec("Photoshop", [lec("Workspace & layers", "21:05"), lec("Photo editing essentials", "23:30"), lec("Compositing & effects", "22:18")]),
        sec("Illustrator & Branding", [lec("Vectors & the pen tool", "20:44"), lec("Logo design", "24:12"), lec("Project: brand identity", "30:05")]),
      ],
      reviews: [
        { user: "Maya Patel", rating: 5, date: "2 weeks ago", text: "Loved building a full brand identity. My logos look professional now." },
        { user: "Liam O.", rating: 4, date: "1 month ago", text: "Solid Photoshop and Illustrator coverage. Great for switching careers." },
      ],
    },
    {
      id: "c10",
      slug: "social-media-marketing-strategy",
      title: "Social Media Marketing & Content Strategy",
      subtitle: "Grow real audiences on Instagram, TikTok, LinkedIn and YouTube with a repeatable content system and analytics.",
      categoryId: "marketing", instructorId: "i4",
      price: 9.99, oldPrice: 59.99,
      rating: 4.4, ratingsCount: 7320, students: 99100,
      level: "Beginner", language: "English",
      hours: 22, lectures: 190, articles: 26, resources: 38,
      updated: "May 2026", bestseller: false,
      image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?auto=format&fit=crop&w=900&q=80",
      whatYouLearn: [
        "Build a social-media strategy that fits your brand",
        "Create scroll-stopping content consistently",
        "Grow audiences on Instagram, TikTok & LinkedIn",
        "Plan content with calendars and batching",
        "Measure what works with analytics",
      ],
      requirements: ["No marketing experience needed", "A social media account to practice on", "A smartphone or computer"],
      curriculum: [
        sec("Strategy & Branding", [lec("Choosing your platforms", "9:50", true), lec("Brand voice & positioning", "17:20", true), lec("Content pillars", "15:40")]),
        sec("Content Creation", [lec("Hooks & storytelling", "20:10"), lec("Short-form video that converts", "22:30"), lec("Design tools for creators", "16:48")]),
        sec("Growth & Analytics", [lec("Posting cadence & batching", "18:15"), lec("Reading your analytics", "19:05"), lec("Project: 30-day content plan", "24:30")]),
      ],
      reviews: [
        { user: "Zoe Adams", rating: 4, date: "3 weeks ago", text: "The content calendar system changed how I post. Gained 5k followers." },
        { user: "Raj Malhotra", rating: 5, date: "1 month ago", text: "Practical and current. The short-form video tips are gold." },
      ],
    },
    {
      id: "c11",
      slug: "project-management-pmp-prep",
      title: "Project Management Masterclass (PMP-aligned)",
      subtitle: "Lead projects with confidence — scope, schedule, budget, risk and agile — aligned to the PMP and CAPM exam frameworks.",
      categoryId: "business", instructorId: "i6",
      price: 13.99, oldPrice: 84.99,
      rating: 4.6, ratingsCount: 5210, students: 71800,
      level: "Intermediate", language: "English",
      hours: 28, lectures: 230, articles: 34, resources: 58,
      updated: "April 2026", bestseller: true,
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80",
      whatYouLearn: [
        "Apply the full project life cycle",
        "Plan scope, schedule and budget",
        "Manage risk, quality and stakeholders",
        "Use agile and hybrid approaches",
        "Prepare for the PMP / CAPM exams",
      ],
      requirements: ["Some workplace experience helps", "No formal PM background required", "A notebook for exercises"],
      curriculum: [
        sec("Foundations", [lec("What project managers do", "8:40", true), lec("Project life cycle", "17:10", true), lec("Stakeholders & charters", "16:30")]),
        sec("Planning & Execution", [lec("Scope & WBS", "21:20"), lec("Scheduling & critical path", "23:05"), lec("Budgeting & EVM", "22:40")]),
        sec("Agile & Exam Prep", [lec("Agile & Scrum essentials", "20:18"), lec("Risk & quality", "19:30"), lec("Project: project plan", "27:15")]),
      ],
      reviews: [
        { user: "Helen Park", rating: 5, date: "2 weeks ago", text: "Clear, structured and exam-focused. The EVM section finally made sense." },
        { user: "Tunde A.", rating: 4, date: "1 month ago", text: "Great blend of theory and practice. Useful even outside exam prep." },
      ],
    },
    {
      id: "c12",
      slug: "articulate-storyline-interactive-courses",
      title: "Articulate Storyline 360: Build Interactive Courses",
      subtitle: "Build professional, interactive eLearning with Articulate Storyline 360 — triggers, variables, quizzes and SCORM publishing.",
      categoryId: "elearning", instructorId: "i5",
      price: 12.99, oldPrice: 74.99,
      rating: 4.7, ratingsCount: 2980, students: 33600,
      level: "All Levels", language: "English",
      hours: 18, lectures: 160, articles: 22, resources: 54,
      updated: "May 2026", bestseller: false,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=900&q=80",
      whatYouLearn: [
        "Navigate Storyline 360 with confidence",
        "Build slides, layers and interactions",
        "Use triggers and variables for interactivity",
        "Create quizzes and assessments",
        "Publish SCORM packages for any LMS",
      ],
      requirements: ["Interest in eLearning development", "Articulate Storyline 360 (free trial)", "Basic computer skills"],
      curriculum: [
        sec("Getting Started", [lec("Storyline 360 tour", "8:30", true), lec("Slides, layers & states", "18:50", true), lec("Working with media", "16:20")]),
        sec("Interactivity", [lec("Triggers explained", "21:40"), lec("Variables & conditions", "23:15"), lec("Interactive scenarios", "20:30")]),
        sec("Assessment & Publishing", [lec("Building quizzes", "19:25"), lec("SCORM & LMS publishing", "22:10"), lec("Project: interactive module", "25:40")]),
      ],
      reviews: [
        { user: "Carla Núñez", rating: 5, date: "1 week ago", text: "Best Storyline course out there. Triggers and variables finally clicked." },
        { user: "Ben Foster", rating: 4, date: "1 month ago", text: "Very practical. The SCORM publishing walkthrough saved me hours." },
      ],
    },
  ];

  // A pre-seeded demo learner + a couple of extra users for the admin user list
  const users = [
    { id: "u1", name: "Demo Student", email: "student@demo.com", password: "demo1234", role: "student", joined: "2026-01-12", avatarSeed: "Demo Student" },
    { id: "u2", name: "Olivia Brown", email: "olivia@example.com", password: "password", role: "student", joined: "2026-02-03", avatarSeed: "Olivia Brown" },
    { id: "u3", name: "Vikram Joshi", email: "vikram@example.com", password: "password", role: "student", joined: "2026-02-21", avatarSeed: "Vikram Joshi" },
    { id: "u4", name: "Sara Lee",     email: "sara@example.com",   password: "password", role: "student", joined: "2026-03-09", avatarSeed: "Sara Lee" },
  ];

  // Some enrollments already in the system (for admin analytics realism)
  const enrollments = [
    { id: "e1",  userId: "u1", courseId: "c2",  date: "2026-01-20", price: 14.99 },
    { id: "e2",  userId: "u1", courseId: "c7",  date: "2026-01-20", price: 9.99 },
    { id: "e3",  userId: "u2", courseId: "c1",  date: "2026-02-05", price: 12.99 },
    { id: "e4",  userId: "u2", courseId: "c3",  date: "2026-02-18", price: 11.99 },
    { id: "e5",  userId: "u3", courseId: "c2",  date: "2026-02-25", price: 14.99 },
    { id: "e6",  userId: "u4", courseId: "c5",  date: "2026-03-11", price: 13.99 },
    { id: "e7",  userId: "u3", courseId: "c1",  date: "2026-03-15", price: 12.99 },
    { id: "e8",  userId: "u4", courseId: "c6",  date: "2026-03-20", price: 10.99 },
    { id: "e9",  userId: "u2", courseId: "c10", date: "2026-04-04", price: 9.99 },
    { id: "e10", userId: "u3", courseId: "c8",  date: "2026-04-12", price: 11.99 },
    { id: "e11", userId: "u4", courseId: "c11", date: "2026-05-02", price: 13.99 },
    { id: "e12", userId: "u2", courseId: "c12", date: "2026-05-09", price: 12.99 },
  ];

  // Past orders (for order history). New checkouts append here.
  const orders = [
    { id: "ORD-100128", userId: "u1", date: "2026-01-20", items: ["c2", "c7"], subtotal: 24.98, discount: 0, total: 24.98, coupon: null },
  ];

  // Demo coupon codes
  const coupons = [
    { code: "SRUTAM50",  type: "percent", value: 50, label: "50% off everything" },
    { code: "WELCOME20", type: "percent", value: 20, label: "20% off your order" },
    { code: "LEARN10",   type: "flat",    value: 10, label: "$10 off your order" },
  ];

  const admin = { email: "admin@srutam.in", password: "admin1234", name: "SRUTAM Admin" };

  // Sample video used by the course player (public-domain sample clip)
  const sampleVideo = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  return { categories, instructors, courses, users, enrollments, orders, coupons, admin, sampleVideo };
})();
