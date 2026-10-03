// All site content lives here. Edit this file to update the website.
window.PROFILE = {
  name: "Devin Ezekiel Purba",
  title: "Power System Engineer",
  tagline: "Control systems · Power system dynamics",
  location: "Jakarta, Indonesia",
  email: "ezekiel.devin@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/devin-ezekiel/",
    github: "https://github.com/DvEz373",
    instagram: "https://www.instagram.com/dvn.ezekiel/",
  },
  cv: "cv.pdf",

  stats: [
    { value: 3.84, decimals: 2, label: "GPA, Cum Laude" },
    { value: 5, suffix: "+", label: "Plant types modelled" },
    { value: 2, label: "Grid codes (AEMO, TRGC)" },
    { value: 7, label: "Certifications" },
  ],

  doors: [
    { href: "experience.html", title: "Experience", line: "Power systems, research and leadership", icon: "timeline" },
    { href: "projects.html", title: "Projects", line: "Reinforcement learning, IoT, vision", icon: "grid" },
    { href: "skills.html", title: "Skills", line: "RMS/EMT modelling, control, ML", icon: "bolt" },
    { href: "about.html", title: "About", line: "Education and contact", icon: "user" },
  ],

  bio: "Power System Engineer specializing in control systems and power system dynamics. I build RMS and EMT models of excitation systems, limiters, governors and power plant controllers, and run grid code compliance studies. Before that I studied control systems at Universitas Indonesia and worked on reinforcement learning for edge networks.",

  experience: [
    {
      type: "work", role: "Power System Engineer", org: "Lean Power Solutions Indonesia", place: "Jakarta",
      start: "Sep 2025", end: "Present",
      summary: "RMS and EMT modelling of generators, condensers and hybrid plants.",
      points: [
        "Synchronous generator (CCGT) and synchronous condenser models with OEL, UEL, SCL, V/Hz limiter, PSS, governors, and P/Q controllers, RTU and PPC.",
        "User-defined PPC for multi-unit hybrid PV and BESS plants with grid-following control, in RMS and EMT.",
        "RMS and EMT models for gas engine, CCGT, gas turbine, steam turbine and DFIG pumped-storage plants; OLTC models for two-winding transformers.",
        "DMAT studies against AEMO and Technical Requirements for Grid Connection (TRGC); load flow, short circuit and capability curve studies.",
        "Impedance-scanning GUI for PSCAD, Python automation, and an AI-based fault locator.",
      ],
      tags: ["PSS/E", "PSCAD/EMTDC", "MATLAB/Simulink", "Fortran", "Python"],
    },
    {
      type: "leadership", role: "Community and Development Staff", org: "Karya Salemba Empat UI", place: "Depok",
      start: "Sep 2023", end: "Sep 2025",
      summary: "Sustainability programmes and technical mentoring.",
      points: [
        "Led 3+ environmental SDG initiatives with 50+ participants.",
        "Managed IoT- and AI-based recycling programmes.",
        "Mentored 5+ teams in the Technology for Indonesia programme.",
      ],
      tags: ["Leadership", "Mentoring"],
    },
    {
      type: "work", role: "Laboratory Assistant", org: "Control Laboratory, Electrical Engineering UI", place: "Depok",
      start: "Jan 2024", end: "Jul 2025",
      summary: "Taught and supported control engineering labs.",
      points: [
        "Technical guidance for 150+ students in control engineering labs.",
        "Standardized lab protocols, achieving 100% on-time sessions.",
        "MATLAB training for 40+ students.",
      ],
      tags: ["MATLAB", "Control systems", "Teaching"],
    },
    {
      type: "research", role: "Expert Project Assistant", org: "UP2M DTE FTUI", place: "Depok",
      start: "Oct 2024", end: "Dec 2024",
      summary: "ML optimisation for ore smelting.",
      points: [
        "ML-based optimisation model for an Indonesian mining company: +18% efficiency in Rotary Kiln and Electric Furnace operations.",
        "Analysed 100+ process variables for a real-time decision-support framework.",
      ],
      tags: ["TensorFlow", "scikit-learn", "Pandas"],
    },
    {
      type: "research", role: "Taiwan Experience Education Program", org: "National Taiwan University of Science and Technology", place: "Taipei",
      start: "Jun 2024", end: "Aug 2024",
      summary: "Energy saving for 5G Open RAN.",
      points: [
        "Energy-saving algorithms for 5G Open RAN, 15% power reduction in simulation and lab tests.",
        "Python and C++ on srsRAN and OSC SMO with Docker, Kubernetes and ClearML.",
      ],
      tags: ["Python", "C++", "Kubernetes", "5G"],
    },
    {
      type: "work", role: "Network Planning Engineer Intern", org: "PLN ICON+", place: "Jakarta",
      start: "Jan 2024", end: "Apr 2024",
      summary: "Telecom planning for power distribution networks.",
      points: [
        "Compared 5+ radio PoC products; designed transmission layouts for distribution networks.",
      ],
      tags: ["Telecom", "Google Earth"],
    },
    {
      type: "leadership", role: "Training and Development Staff", org: "EXERCISE FTUI", place: "Depok",
      start: "Jan 2023", end: "Jan 2024",
      summary: "Software and hardware training for students.",
      points: ["Organized MATLAB, Proteus and DigSilent training for 100+ students."],
      tags: ["Training"],
    },
  ],

  projects: [
    {
      id: "marl", cat: "ai", title: "Multi-Agent RL for Edge Computing",
      context: "Bachelor thesis · 2024–2025",
      blurb: "Deep RL task offloading for digital-twin I-IoT edge networks.",
      problem: "Edge servers in industrial IoT get overloaded when tasks are offloaded without coordination.",
      approach: "Formulated offloading as a Markov Decision Process and trained multi-agent deep RL agents in a Python simulation of the edge network.",
      result: "Adaptive offloading policy that balances computational load under changing network conditions.",
      tags: ["TensorFlow", "PyTorch", "Python"],
      figures: 2,
    },
    {
      id: "sono", cat: "iot", title: "SonoDirect",
      context: "Capstone project · 2024",
      blurb: "AI-powered IoT room sound optimisation for small businesses.",
      problem: "Small venues tune speakers by ear, which gives uneven sound.",
      approach: "ESP32 with MEMS microphones streams room data; ML predicts speaker placement; Flutter web dashboard for control.",
      result: "+19% acoustic accuracy, −12% distortion, −23% setup time.",
      tags: ["ESP32", "Flutter", "scikit-learn"],
      link: "https://github.com/DvEz373/sonodirect-web-flutter",
      figures: 3,
    },
    {
      id: "scanocr", cat: "ai", title: "SCANOCR",
      context: "Lab assistant selection · 2023",
      blurb: "Real-time document scanner with computer vision and OCR.",
      problem: "Manual data entry from paper documents is slow and error-prone.",
      approach: "PyQt5 desktop app using OpenCV for page detection and Tesseract for text recognition.",
      result: "90%+ recognition accuracy, −25% data-entry errors.",
      tags: ["OpenCV", "Tesseract", "PyQt5"],
      link: "https://github.com/alexandermaxim8/SCANOCR",
      figures: 2,
    },
    {
      id: "ppc", cat: "power", title: "Hybrid PV-BESS Plant Controller",
      context: "Work sample · placeholder",
      blurb: "Grid-following PPC for multi-unit PV and battery plants.",
      problem: "Hybrid plants must meet grid code P/Q and voltage requirements as one unit.",
      approach: "User-defined PPC in PSS/E (RMS) and PSCAD (EMT) coordinating multiple PV and BESS units.",
      result: "Placeholder: replace with a non-confidential summary or remove.",
      tags: ["PSS/E", "PSCAD", "Fortran"],
      figures: 1,
    },
  ],

  skillGroups: [
    { name: "Power system dynamics", items: [["RMS/EMT modelling", 90], ["Excitation systems & limiters", 85], ["Power plant controllers", 85], ["Grid code compliance", 75]] },
    { name: "Tools", items: [["PSS/E", 90], ["PSCAD/EMTDC", 90], ["MATLAB/Simulink", 85], ["Fortran", 75]] },
    { name: "Programming & ML", items: [["Python", 90], ["TensorFlow / PyTorch", 75], ["C/C++", 65], ["Flutter, HTML/CSS/JS", 60]] },
  ],

  certs: [
    ["TensorFlow Developer Professional Certificate", "DeepLearning.AI", "2024", "https://coursera.org/share/0303786ebfb376c8c67fc7f9c3af14a4"],
    ["Reinforcement Learning Specialization", "University of Alberta", "2024", "https://coursera.org/share/5360f415cf7616da410084059e3bb31a"],
    ["Google IT Automation with Python", "Google", "2024", "https://coursera.org/share/41aaa60812a27a23cd6b35c4d035a933"],
    ["IBM AI Engineering", "IBM", "2023", "https://coursera.org/share/2cec23adffb2c7041f9b84fe34e226d6"],
    ["IBM Data Science", "IBM", "2023", "https://coursera.org/share/b23a8d7904b01ee98299b31c0db18b9f"],
    ["IBM Machine Learning", "IBM", "2023", "https://coursera.org/share/5a3fe4887b6105e8cae81dfeb1067ee5"],
    ["Deep Learning Specialization", "DeepLearning.AI", "2023", "https://coursera.org/share/483a4f1431dacdf4c2c279b29fde1627"],
  ],

  education: {
    school: "Universitas Indonesia", degree: "B.Eng. Electrical Engineering", focus: "Control Systems and Automation",
    years: "2021 – 2025", gpa: "3.84 / 4.00 · Cum Laude",
    notes: ["Thesis: multi-agent deep RL for digital-twin I-IoT edge networks", "Karya Salemba Empat scholarship", "Funded research internship at NTUST"],
  },
};
