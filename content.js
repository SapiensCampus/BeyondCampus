/* Draft content for the Sapiens Campus Ikigai walkthrough.
   TODO: replace INVITE_LINKS with the real WhatsApp invite links. */
var INVITE_LINKS = {
  tech: "https://chat.whatsapp.com/beyondcampus-tech",
  data: "https://chat.whatsapp.com/beyondcampus-data",
  design: "https://chat.whatsapp.com/beyondcampus-design",
  content: "https://chat.whatsapp.com/beyondcampus-content",
  community: "https://chat.whatsapp.com/beyondcampus-community",
  entrepreneurship: "https://chat.whatsapp.com/beyondcampus-entrepreneurship",
  organising: "https://chat.whatsapp.com/beyondcampus-organising"
};

var JOURNEY = {
  tracks: [
    { id: "tech", name: "Tech", tone: "yellow", line: "Making things that work." },
    { id: "data", name: "Data and research", tone: "blue", line: "Questions, patterns, and why." },
    { id: "design", name: "Design", tone: "pink", line: "How something looks, feels, and reads." },
    { id: "content", name: "Content and media", tone: "purple", line: "Stories, words, and pictures." },
    { id: "community", name: "Community", tone: "green", line: "People finding each other." },
    { id: "entrepreneurship", name: "Entrepreneurship", tone: "yellow", line: "Starting something and bringing people in." },
    { id: "organising", name: "Organising", tone: "cream", line: "Plans, order, and follow-through." }
  ],
  characters: [
    {
      id: "builder",
      order: 0,
      name: "Builder",
      tone: "yellow",
      line: "You like making things work.",
      detail: "Tech, hardware, engineering.",
      tracks: ["tech", "data", "organising"]
    },
    {
      id: "thinker",
      order: 1,
      name: "Thinker",
      tone: "blue",
      line: "You like puzzles and the question why.",
      detail: "Data, AI, research.",
      tracks: ["data", "tech", "design"]
    },
    {
      id: "creator",
      order: 2,
      name: "Creator",
      tone: "pink",
      line: "You think in pictures and words.",
      detail: "Design, content, media.",
      tracks: ["design", "content", "community"]
    },
    {
      id: "helper",
      order: 3,
      name: "Helper",
      tone: "green",
      line: "You notice people.",
      detail: "Community, teaching, HR.",
      tracks: ["community", "content", "organising"]
    },
    {
      id: "leader",
      order: 4,
      name: "Leader",
      tone: "purple",
      line: "You start things and bring people with you.",
      detail: "Entrepreneurship, sales, product.",
      tracks: ["entrepreneurship", "community", "tech"]
    },
    {
      id: "organiser",
      order: 5,
      name: "Organiser",
      tone: "cream",
      line: "You like order and a plan that holds.",
      detail: "Operations, finance, project work.",
      tracks: ["organising", "entrepreneurship", "data"]
    }
  ],
  quiz: [
    {
      prompt: "Free hour. What do you grab?",
      options: [
        { type: "builder", label: "Something broken, and a way to fix it" },
        { type: "thinker", label: "A puzzle you have not solved" },
        { type: "creator", label: "A sketchbook, camera, or blank page" },
        { type: "helper", label: "A message from someone who needs a hand" },
        { type: "leader", label: "A group you want to rally" },
        { type: "organiser", label: "A list you can finally sort" }
      ]
    },
    {
      prompt: "A friend is stuck on a project. You…",
      options: [
        { type: "builder", label: "Open it and make a piece of it work" },
        { type: "thinker", label: "Ask the question they missed" },
        { type: "creator", label: "Redo how it looks" },
        { type: "helper", label: "Sit with them until it feels possible" },
        { type: "leader", label: "Tell them to ship a small version today" },
        { type: "organiser", label: "Split it into a checklist" }
      ]
    },
    {
      prompt: "The class group chat is a mess. You…",
      options: [
        { type: "builder", label: "Make a tiny form so answers land in one place" },
        { type: "thinker", label: "Spot the pattern hiding in the mess" },
        { type: "creator", label: "Turn the key point into a clear graphic" },
        { type: "helper", label: "Reply to the person who is lost" },
        { type: "leader", label: "Propose a plan and ask who is in" },
        { type: "organiser", label: "Pin the dates and the rules" }
      ]
    },
    {
      prompt: "What is already on your phone?",
      options: [
        { type: "builder", label: "A thing you made" },
        { type: "thinker", label: "Notes full of questions" },
        { type: "creator", label: "Photos, edits, or drawings" },
        { type: "helper", label: "Chats where you helped" },
        { type: "leader", label: "A group you started" },
        { type: "organiser", label: "A calendar that is actually under control" }
      ]
    },
    {
      prompt: "College fest. Which job do you take?",
      options: [
        { type: "builder", label: "Make the stall stand up" },
        { type: "thinker", label: "Work out why last year ran out of money" },
        { type: "creator", label: "Make the poster people save" },
        { type: "helper", label: "Help lost first-years find their people" },
        { type: "leader", label: "Pitch the idea to the principal" },
        { type: "organiser", label: "Write the run-of-show so nothing clashes" }
      ]
    },
    {
      prompt: "A teacher says “surprise us”. You bring…",
      options: [
        { type: "builder", label: "A working prototype" },
        { type: "thinker", label: "A sharp what-if" },
        { type: "creator", label: "A film, zine, or poster" },
        { type: "helper", label: "A session that helps the class" },
        { type: "leader", label: "A pitch with a name" },
        { type: "organiser", label: "A one-page plan anyone can follow" }
      ]
    },
    {
      prompt: "You lose track of time when you are…",
      options: [
        { type: "builder", label: "Building with your hands" },
        { type: "thinker", label: "Chasing an answer" },
        { type: "creator", label: "Shaping how it looks or sounds" },
        { type: "helper", label: "With someone who needed you" },
        { type: "leader", label: "Convincing a room" },
        { type: "organiser", label: "Lining the pieces up" }
      ]
    },
    {
      prompt: "In a group project you quietly become…",
      options: [
        { type: "builder", label: "The one who builds the thing" },
        { type: "thinker", label: "The one who checks the logic" },
        { type: "creator", label: "The one who makes it presentable" },
        { type: "helper", label: "The one who keeps the group kind" },
        { type: "leader", label: "The one who decides and pushes" },
        { type: "organiser", label: "The one who tracks who does what" }
      ]
    },
    {
      prompt: "Two minutes to show who you are. You say…",
      options: [
        { type: "builder", label: "Watch, it works." },
        { type: "thinker", label: "Here is the interesting part." },
        { type: "creator", label: "Look at this." },
        { type: "helper", label: "I made someone’s day easier." },
        { type: "leader", label: "We should do this. Who is in?" },
        { type: "organiser", label: "Here is the plan. Nothing falls through." }
      ]
    },
    {
      prompt: "A good week looks like…",
      options: [
        { type: "builder", label: "Something you made is in use" },
        { type: "thinker", label: "You understood something hard" },
        { type: "creator", label: "People saved what you made" },
        { type: "helper", label: "Someone felt less alone" },
        { type: "leader", label: "An idea you started is moving" },
        { type: "organiser", label: "The week went to plan" }
      ]
    }
  ],
  styles: [
    {
      id: "social",
      prompt: "You do your best work…",
      hint: "This does not change your interest. It shapes how the tasks feel.",
      options: [
        { id: "solo", label: "On my own" },
        { id: "team", label: "With a few people" }
      ]
    },
    {
      id: "structure",
      prompt: "You like the work to feel…",
      hint: "This does not change your interest. It shapes how the tasks feel.",
      options: [
        { id: "structure", label: "Planned, step by step" },
        { id: "freedom", label: "Free, with room to wander" }
      ]
    }
  ],
  levels: [
    { id: "taste", name: "Taste", time: "About 15 minutes" },
    { id: "try", name: "Try", time: "About 1 hour" },
    { id: "stretch", name: "Stretch", time: "A weekend" }
  ],
  tastes: {
    tech: "Picture one campus problem a tiny tool could fix.",
    data: "Name one question a campus survey should answer.",
    design: "Think of one screen you use that looks wrong.",
    content: "Think of one campus moment worth five lines.",
    community: "Think of four people who should meet and do not.",
    entrepreneurship: "Think of one person who is stuck, and the help they would accept.",
    organising: "Think of one messy hour a plan could calm."
  },
  tasks: {
    tech: {
      taste: "Change one line and one colour on a page about you. A doc is fine.",
      try: "Make a tiny page or sheet that adds two numbers.",
      stretch: "Describe three screens of a campus app, and show someone."
    },
    data: {
      taste: "Write three questions a campus survey should ask.",
      try: "Count one thing for a week, then write what it shows.",
      stretch: "Pick one public number about college or your city and explain it on a page."
    },
    design: {
      taste: "Redesign one screen of an app you use. Paper is fine.",
      try: "Make a poster for a college event.",
      stretch: "Sketch a 3-screen app idea and share it."
    },
    content: {
      taste: "Write one campus moment in five lines.",
      try: "Record thirty seconds on something you wish people knew.",
      stretch: "Outline three posts that tell one campus story."
    },
    community: {
      taste: "List four people who should meet, and why.",
      try: "Plan a thirty-minute meetup: who, where, and what you will do.",
      stretch: "Write the invite and a follow-up note for a tiny circle."
    },
    entrepreneurship: {
      taste: "Name one person who is stuck, and what they need.",
      try: "Ask one friend what help they would actually pay for.",
      stretch: "Name the idea, who it is for, and what the first week of trying it looks like."
    },
    organising: {
      taste: "Write tomorrow as five lines.",
      try: "Make a one-page plan for one hour of a college event.",
      stretch: "Write a weekend run-of-show for a small fest stall."
    }
  },
  careers: {
    tech: {
      roles: ["Junior software trainee", "Product engineer", "Senior engineer"],
      how: ["A portfolio of small things you made", "Campus builds and internships", "A degree or a certificate, if you take one"],
      ladder: [
        ["This semester", "Finish the little tasks and one more build you can show."],
        ["This year", "One project your peer group can open."],
        ["Before graduating", "An internship or a freelance brief for a real team."]
      ],
      early: ["Help a college club ship a small tool", "A campus internship", "A short freelance build for a local team"]
    },
    data: {
      roles: ["Research assistant", "Data analyst", "Research lead"],
      how: ["A notebook of questions and findings", "Campus surveys and internships", "A degree or a certificate, if you take one"],
      ladder: [
        ["This semester", "Run one tiny count and write what it means."],
        ["This year", "Explain one public dataset in plain language."],
        ["Before graduating", "Assist a lab, a newsroom, or a civic team."]
      ],
      early: ["Survey work for a college department", "A research internship", "A short brief that explains a public number"]
    },
    design: {
      roles: ["Junior designer", "Product designer", "Design lead"],
      how: ["A portfolio of screens and posters", "Campus work and internships", "A degree or a certificate, if you take one"],
      ladder: [
        ["This semester", "Redesign three real screens and say why."],
        ["This year", "A small case study your peer group can critique."],
        ["Before graduating", "An internship or a freelance identity for a real group."]
      ],
      early: ["Posters for college events", "A campus design internship", "A short freelance identity for a club"]
    },
    content: {
      roles: ["Junior writer or creator", "Content producer", "Editorial lead"],
      how: ["A public trail of pieces you made", "Campus media and internships", "A degree or a certificate, if you take one"],
      ladder: [
        ["This semester", "Publish three short pieces."],
        ["This year", "One series people can follow."],
        ["Before graduating", "An internship at a newsroom, studio, or brand team."]
      ],
      early: ["Campus newsletter or reels", "A media internship", "A short commission for a college fest"]
    },
    community: {
      roles: ["Community coordinator", "Programmes associate", "Community lead"],
      how: ["Proof that people showed up", "Campus circles and internships", "A degree or a certificate, if you take one"],
      ladder: [
        ["This semester", "Host one small meetup and write what happened."],
        ["This year", "A circle that meets more than once."],
        ["Before graduating", "An internship in programmes, teaching, or HR."]
      ],
      early: ["Paid help at a campus event", "A programmes internship", "Holding a circle for a local group"]
    },
    entrepreneurship: {
      roles: ["Founder's first hire", "Product or sales associate", "Founder or product lead"],
      how: ["A record of offers you tested", "Internships and customer conversations", "A degree or a certificate, if you take one"],
      ladder: [
        ["This semester", "Talk to five people who have the problem."],
        ["This year", "One small offer you actually tried."],
        ["Before graduating", "An internship at a young company, or a serious campus venture."]
      ],
      early: ["Sell a small campus service", "A startup internship", "Help a local shop try one new offer"]
    },
    organising: {
      roles: ["Operations assistant", "Project coordinator", "Operations or programme manager"],
      how: ["Plans you ran, not only wrote", "Event crews and internships", "A degree or a certificate, if you take one"],
      ladder: [
        ["This semester", "Run one event hour without a scramble."],
        ["This year", "Own a recurring campus process."],
        ["Before graduating", "An internship in operations, finance support, or programme delivery."]
      ],
      early: ["Run-of-show work for a fest", "An operations internship", "Keep a local team's week on track"]
    }
  },
  world: {
    tech: {
      challenges: [
        "Sample: small campuses still do admissions and club work on paper.",
        "Sample: tools that only work in English leave a lot of students out."
      ],
      coming: ["Sample: more building with AI as a helper, and more need for people who can tell if the result is right."],
      fading: ["Sample: treating memorised syntax as the whole job."],
      problem: "Sample problem of the month: one campus chore that a very small tool could shorten."
    },
    data: {
      challenges: [
        "Sample: public numbers about exams, crops, and cities are hard to read without a specialist.",
        "Sample: colleges collect feedback and then do not use it."
      ],
      coming: ["Sample: more demand for people who can question a model, not only plot a chart."],
      fading: ["Sample: reports that describe the past and suggest nothing."],
      problem: "Sample problem of the month: one public number students in your city should understand."
    },
    design: {
      challenges: [
        "Sample: college and public screens are still hard to use with one hand, low vision, or a slow connection.",
        "Sample: important instructions are designed for people who already know the system."
      ],
      coming: ["Sample: more interfaces that talk, listen, and sit inside tools students already open."],
      fading: ["Sample: decoration that does not help the task."],
      problem: "Sample problem of the month: one screen on your campus that people dread opening."
    },
    content: {
      challenges: [
        "Sample: students learn from creators, but local and regional stories are still thin.",
        "Sample: campus news dies in a poster nobody photographs."
      ],
      coming: ["Sample: short series, in more than one language, that explain real work."],
      fading: ["Sample: volume without a point of view."],
      problem: "Sample problem of the month: one campus story that deserves a calmer telling."
    },
    community: {
      challenges: [
        "Sample: new students spend a semester looking for their people.",
        "Sample: help exists on campus and still does not reach the person who needs it."
      ],
      coming: ["Sample: smaller trusted circles, and hosts who know how to hold them."],
      fading: ["Sample: huge events with no follow-up."],
      problem: "Sample problem of the month: one group on campus that should meet and does not."
    },
    entrepreneurship: {
      challenges: [
        "Sample: neighbourhood shops and campus services still rely on word of mouth alone.",
        "Sample: students have ideas and no short way to test them with a real person."
      ],
      coming: ["Sample: more tiny offers tested fast, and more first jobs inside young teams."],
      fading: ["Sample: pitch decks that never meet a customer."],
      problem: "Sample problem of the month: one recurring hassle a student would gladly hand to someone else."
    },
    organising: {
      challenges: [
        "Sample: fest week and exam week break the same way every year.",
        "Sample: good programmes fail because nobody owns the handoff."
      ],
      coming: ["Sample: people who can run a hybrid plan, with a calm record of what happened."],
      fading: ["Sample: heroics that only one person understands."],
      problem: "Sample problem of the month: one hour in the college calendar that always scrambles."
    }
  },
  story: "Someone on this path started with a campus project, kept a public record of the work, and later joined a team solving a similar problem. Name, employer, and dates are not filled in.",
  persona: {
    name: "Meera",
    year: "Second year",
    line: "Fictional sample student. Not a real person.",
    answers: [1, 1, 0, 1, 1, 0, 1, 1, 1, 0],
    social: "team",
    structure: "freedom",
    funNote: "She takes apart old earphones and watches explainers until the evening disappears.",
    ratings: {
      data: {
        taste: { love: 5, good: 2 },
        try: { love: 4, good: 3 },
        stretch: { love: 5, good: 2 }
      },
      tech: {
        taste: { love: 5, good: 5 },
        try: { love: 4, good: 5 },
        stretch: { love: 5, good: 4 }
      },
      design: {
        taste: { love: 2, good: 5 },
        try: { love: 2, good: 4 },
        stretch: { love: 3, good: 4 }
      }
    }
  }
};
