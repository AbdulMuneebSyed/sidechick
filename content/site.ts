import { c } from "./copy";

/**
 * Every string rendered on the site. Each is checked against the indilabs.ai
 * snapshot by tests/content.test.ts. Numbers used for animation live in
 * components and must match the figures in these strings.
 */
export const site = {
  brand: {
    name: c("Indilabs.ai", "S1"),
    email: c("info@indilabs.ai", "S1"),
    phone: c("+919618111778", "S1"),
    linkedin: c("LinkedIn", "S1"),
  },

  nav: {
    home: c("Home", "S1"),
    about: c("About", "S1"),
    platform: c("Platform Capabilities", "S1"),
    demo: c("Book a Demo", "S1"),
    // Short menu labels; both words appear in the original copy.
    platformMenu: c("Platform", "S1"),
    solutionsMenu: c("Solutions", "S2"),
  },

  hero: {
    badges: [c("Secure", "S1"), c("Scalable", "S1"), c("World-Class", "S1")],
    title: c("AI-Powered Risk, Collections & Debt Sale Platform", "S1"),
    subtitle: c(
      "Maximize profitability across the entire lending lifecycle, from portfolio risk to post-write-off recovery.",
      "S1",
    ),
    secondaryCta: c("Explore More", "S1"),
    primaryCta: c("Book a Demo", "S1"),
  },

  why: {
    eyebrow: c("WHY INDILABS.AI?", "S1"),
    description: c(
      "An end-to-end AI platform that transforms profitability by driving intelligent strategy and execution across the entire lending lifecycle.",
      "S1",
    ),
    cta: c("Get in Touch", "S1"),
    pillars: [
      {
        id: "risk",
        title: c("Risk Monitoring & Diagnostics", "S1"),
        description: c(
          "Proactively mitigate risk with continuous portfolio surveillance, real-time diagnostics on performance drops, risk forecasting, and early warning signals.",
          "S1",
        ),
        figure: c("10–15%", "S1"),
        result: c("reduction in Portfolio loss rates.", "S1"),
      },
      {
        id: "collections",
        title: c("Collection Strategy Optimization", "S1"),
        description: c(
          "Maximize collections profitability with ML-based customer profiling, automated strategy testing (A/B/n), and intelligent decisioning to improve cost-efficiency and ROI.",
          "S1",
        ),
        figure: c("25–30%", "S1"),
        result: c("improvement in Collections RoI.", "S1"),
      },
      {
        id: "recovery",
        title: c("Recovery & Debt Sale", "S1"),
        description: c(
          "Turn write-offs into revenue with NPV-driven settlement optimization, recovery yield maximization, and an AI-powered marketplace for distressed debt trading.",
          "S1",
        ),
        figure: c("25–30%", "S1"),
        result: c("increase in Recovery yield.", "S1"),
      },
    ],
  },

  lifecycle: {
    engine: c("AI / ML Strategy Decision Engine", "S1"),
    engineNote: c("Optimizes decisions with learning models", "S1"),
    stages: [c("Origination", "S1"), c("Portfolio", "S1"), c("Collections", "S1"), c("Recoveries", "S1")],
    steps: [
      {
        id: "monitor",
        name: c("Monitor", "S1"),
        label: c("STEP 1: Monitoring & Diagnostics", "S1"),
        actions: [c("Scans Portfolio & Alerts Risks", "S1"), c("Runs Diagnostics", "S1")],
      },
      {
        id: "optimize",
        name: c("Optimize", "S1"),
        label: c("STEP 2: Strategy Optimisation", "S1"),
        actions: [
          c("Applies Risk based Treatments", "S1"),
          c("Deploys multiple A/B tests", "S1"),
          c("Runs Simulation", "S1"),
          c("Optimizes Allocation", "S1"),
        ],
      },
      {
        id: "execute",
        name: c("Execute", "S1"),
        label: c("STEP 3: Execution", "S1"),
        actions: [c("Enables Execution Partnerships", "S1"), c("Monitors Controls", "S1")],
      },
    ],
  },

  platform: {
    eyebrow: c("Platform Capabilities", "S1"),
    title: c("Quick Deployment. Powerful Results", "S1"),
    input: c("Multiple Data Types", "S1"),
    pipelines: c("Automated Pipelines", "S1"),
    engine: c("Riskube Engine", "S1"),
    engineTraits: [c("Secure", "S1"), c("Resilient", "S1")],
    architecture: c("Architecture", "S1"),
    capabilities: [
      c("Behavioural Profiling", "S1"),
      c("Champion/Challenger Tests", "S1"),
      c("Agency Allocations", "S1"),
      c("Performance Predictions", "S1"),
      c("Value at Risk", "S1"),
      c("Account Level Actions", "S1"),
      c("Offers and Settlements", "S1"),
    ],
  },

  segments: {
    eyebrow: c("Global Scale", "S1"),
    title: c("Built for the World. Customised to your Needs", "S1"),
    items: [
      {
        id: "digital-lenders",
        label: c("Digital Lenders", "S1"),
        body: c(
          "Grow Lending with confidence leveraging an industry best-in-class Credit Risk management infrastructure from Day 1, that gives you ability to experiment while keeping costs and losses in control, minimize IT investment and achieve strong governance over the full asset life cycle.",
          "S1",
        ),
      },
      {
        id: "financial-firms",
        label: c("Financial Firms", "S1"),
        body: c(
          "Grow Lending portfolios profitably with powerful algorithms that identify and mitigate losses early, cut costs by automating actions and increase Collections by optimizing treatments and agency allocation strategies.",
          "S3",
        ),
      },
      {
        id: "banks",
        label: c("Banks", "S1"),
        body: c(
          "Build competitive advantage in Lending by leveraging the power of AI/ML, visual analytics and data-driven strategies to mitigate Credit Risks early, improve customer experience and optimize Agency allocations while ensuring strong end-to-end operational Governance.",
          "S3",
        ),
      },
      {
        id: "insurance",
        label: c("Insurance Providers", "S1"),
        body: c(
          "Maximize Retention and positive customer experience by leveraging AI/ML insights and automated algorithms to drive high-performing engagement strategies and optimizing agency allocations, while keeping operational costs in control.",
          "S3",
        ),
      },
      {
        id: "agencies",
        label: c("Collection Agencies", "S1"),
        body: c(
          "Leverage the power of algorithms, advanced analytics, visual dashboards digital tools, and AI/ML powered strategies to improve customer experience and dramatically reduce operational costs, while maintaining focus on the right segments to deliver Collections performance.",
          "S3",
        ),
      },
    ],
  },

  marquee: [
    c("SMARTER", "S1"),
    c("FASTER", "S1"),
    c("PROFITABLE", "S1"),
    c("SECURE", "S1"),
    c("RELIABLE", "S1"),
    c("CLOUD", "S1"),
    c("INTELLIGENCE", "S1"),
  ],

  beforeAfter: {
    title: c("Be efficient and data-driven, forever.", "S1"),
    subtitle: c("Make every decision count and grow effortlessly.", "S1"),
    beforeEyebrow: c("Before", "S1"),
    beforeTitle: c("You are here.", "S1"),
    afterTitle: c("Riskube takes you here.", "S1"),
    pairs: [
      [c("Manual data analysis took hours and was inefficient.", "S1"), c("Data processing is automated and saves time.", "S1")],
      [c("Decisions were reactive, based on outdated reports.", "S1"), c("Risks are managed proactively with predictive tools.", "S1")],
      [c("Risk models lacked customization for specific needs.", "S1"), c("Risk models are tailored to unique requirements.", "S1")],
      [c("Manual workflows led to frequent errors.", "S1"), c("AI improves accuracy and reduces errors.", "S1")],
      [c("Real-time insights were unavailable for quick decisions.", "S1"), c("Real-time insights enable faster decisions.", "S1")],
      [c("Collaboration between teams was slow and siloed.", "S1"), c("Collaboration is smoother with cloud-based tools.", "S1")],
      [c("Missed chances to identify profitable opportunities.", "S1"), c("Profitability improves with better risk identification.", "S1")],
      [c("Reporting was time-consuming and required extra effort.", "S1"), c("Reports are effortless with dynamic dashboards.", "S1")],
    ],
  },

  closing: {
    title: c("Ready to Grow Profits with Indilabs.ai?", "S1"),
    body: c("Talk to us today to learn more or to test our solution.", "S1"),
    cta: c("Get in Touch", "S1"),
  },

  about: {
    title: c(
      "Fintech founded by experts in Risk management, Collections and AI/ML with decades of experience across Global markets.",
      "S2",
    ),
    body: c(
      "Our solutions harness the exponential power of Data, Cloud Computing and AI/ML to help lenders optimise risks and achieve profitable growth.",
      "S2",
    ),
    cta: c("Get in Touch", "S2"),
    values: [
      {
        title: c("Global Capabilities", "S2"),
        body: c(
          "Our team of experienced world class professionals brings best global practices, business knowhow and proven ideas at your service, right from the start.",
          "S2",
        ),
      },
      {
        title: c("Performance Focused", "S2"),
        body: c(
          "We are rooted in expertise and committed to delivering value to your business through strategies that adapt flexibly to your business model.",
          "S2",
        ),
      },
      {
        title: c("Experiment Based", "S2"),
        body: c(
          "Our solutions are engineered to continuously test and learn strategies and scale the winning ideas that enable profitable, long term growth for your business.",
          "S2",
        ),
      },
    ],
  },

  form: {
    title: c("Get in Touch", "S3"),
    intro: c("Fill out this form and our team will get in touch with you", "S3"),
    introEmphasis: c("within 24hrs", "S3"),
    heading: c("Ready to Get Started?", "S3"),
    name: c("Your Name", "S3"),
    company: c("Your Company’s Name", "S3"),
    email: c("Your Email", "S3"),
    message: c("Your Message", "S3"),
    submit: c("Send Message", "S3"),
    successTitle: c("Thank you for contacting us.", "S3"),
    successBody: c("Our team will get in touch with you within 24hrs.", "S3"),
    errEmail: c("Please enter a valid email address", "S3"),
    errEmailRequired: c("Email is required", "S3"),
    errCompany: c("Company name is required", "S3"),
    close: c("Close", "S3"),
  },

  footer: {
    home: c("Home", "S1"),
    about: c("About Us", "S1"),
    rights: c("All Rights Reserved.", "S1"),
  },
} as const;
