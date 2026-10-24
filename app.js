// TODO: replace these dummy WhatsApp invites with the real Sapiens Campus interest-channel links.
const INVITE_LINKS = {
  tech: "https://chat.whatsapp.com/beyondcampus-tech",
  design: "https://chat.whatsapp.com/beyondcampus-design",
  entrepreneurship: "https://chat.whatsapp.com/beyondcampus-entrepreneurship",
  content: "https://chat.whatsapp.com/beyondcampus-content",
  community: "https://chat.whatsapp.com/beyondcampus-community",
};

const STORAGE_KEY = "beyondcampus.discover.v1";
const FOOTER = "Sapiens Campus ✦ Explore ✦ Evelve ✦ Engineer";
const SCREENS = ["landing", "question", "result", "quests", "confirm", "connect"];

const SECONDARY = {
  tech: "design",
  design: "content",
  entrepreneurship: "tech",
  content: "community",
  community: "entrepreneurship",
};

const CATEGORIES = {
  tech: {
    name: "Tech",
    emoji: "💻",
    line: "Build and code. You like making things that run.",
    order: 0,
  },
  design: {
    name: "Design",
    emoji: "🎨",
    line: "Visual, UX, creative. You care how things look and feel.",
    order: 1,
  },
  entrepreneurship: {
    name: "Entrepreneurship",
    emoji: "🚀",
    line: "Business and startups. You spot a problem and want it out in the world.",
    order: 2,
  },
  content: {
    name: "Content & Media",
    emoji: "🎬",
    line: "Writing, video, social. You tell stories people actually stay for.",
    order: 3,
  },
  community: {
    name: "Community & Leadership",
    emoji: "🤝",
    line: "Events, people, organising. You get the right humans in the same room.",
    order: 4,
  },
};

const WHY = {
  tech: "You kept choosing the version where something gets built: a tool, a demo, a thing you can open and poke.",
  design: "You kept choosing the look and the feel: the poster, the card, the moment a messy thing becomes clear.",
  entrepreneurship: "You kept choosing the leap: a problem, a person who might want it, a reason for it to exist beyond the assignment.",
  content: "You kept choosing the telling: the hook, the scene, the short version someone actually watches.",
  community: "You kept choosing the room: who should meet, who is left out, and how a group stays standing.",
};

function option(cat, label) {
  return {
    label,
    cat,
    points: { [cat]: 2, [SECONDARY[cat]]: 1 },
  };
}

const QUESTIONS = [
  {
    prompt: "Labs are done. You have one free hour. You actually…",
    options: [
      option("tech", "Open a half-finished project and tinker"),
      option("design", "Redo a poster or a messy slide"),
      option("entrepreneurship", "Text someone about an idea that could be real"),
      option("content", "Film a 30-second recap of your week"),
      option("community", "Decide who should meet at the next hangout"),
    ],
  },
  {
    prompt: "The college fest is short one person. You take…",
    options: [
      option("tech", "The site, the QR, the registration flow"),
      option("design", "Backdrop, merch, the whole look"),
      option("entrepreneurship", "Sponsor pitches and the money"),
      option("content", "Reels, captions, the hype"),
      option("community", "Crew, timing, getting people there"),
    ],
  },
  {
    prompt: "A junior is stuck the night before a review. You…",
    options: [
      option("tech", "Sit with the bug until it makes sense"),
      option("design", "Fix the slides so the work is easy to see"),
      option("entrepreneurship", "Help them say the idea in one sentence"),
      option("content", "Turn it into a story other juniors get"),
      option("community", "Introduce them to the right senior"),
    ],
  },
  {
    prompt: "Which compliment quietly fits?",
    options: [
      option("tech", "“Wait, you built that?”"),
      option("design", "“This finally looks like you.”"),
      option("entrepreneurship", "“You would actually start this.”"),
      option("content", "“I watched the whole thing.”"),
      option("community", "“It worked because you held it together.”"),
    ],
  },
  {
    prompt: "A blank Sunday. The project that tempts you is…",
    options: [
      option("tech", "A tiny tool that saves your class ten minutes"),
      option("design", "A redesign of something ugly you use daily"),
      option("entrepreneurship", "A one-page plan for a campus micro-business"),
      option("content", "A short video that explains one idea simply"),
      option("community", "A meetup for people who never speak in class"),
    ],
  },
  {
    prompt: "In a group, you become the one who…",
    options: [
      option("tech", "Sets up the repo and ships the demo"),
      option("design", "Makes the deck feel human"),
      option("entrepreneurship", "Decides what you're building and why anyone cares"),
      option("content", "Writes the script and records the walkthrough"),
      option("community", "Keeps the group alive and the deadline honest"),
    ],
  },
  {
    prompt: "You open your phone meaning to study. You stay for…",
    options: [
      option("tech", "A build log or a clever student repo"),
      option("design", "A before-and-after or a type experiment"),
      option("entrepreneurship", "A founder story from a college like yours"),
      option("content", "A sharp essay or a well-cut short"),
      option("community", "A recap of a meetup you wish you'd attended"),
    ],
  },
  {
    prompt: "Someone hands you two minutes on a Sapiens Campus mic.",
    options: [
      option("tech", "Live-code something small"),
      option("design", "Walk through a visual you made"),
      option("entrepreneurship", "Pitch a problem your college still ignores"),
      option("content", "Tell one campus scene in your own voice"),
      option("community", "Host, and pull three quiet people in"),
    ],
  },
  {
    prompt: "The line that sounds most like you:",
    options: [
      option("tech", "I want to make it work."),
      option("design", "I want it to feel right."),
      option("entrepreneurship", "I want someone to actually use it."),
      option("content", "I want people to get it."),
      option("community", "I want us in the same room."),
    ],
  },
];

const QUESTS = {
  tech: [
    {
      id: "tech-1",
      minutes: 20,
      title: "Build a one-page HTML about yourself",
      detail: "Name, college, and one thing you're curious about. Save it and open it in a browser.",
    },
    {
      id: "tech-2",
      minutes: 20,
      title: "Code a tiny college helper",
      detail: "Attendance left, CGPA, or a mess-bill split. Twenty lines is enough. Run it once.",
    },
    {
      id: "tech-3",
      minutes: 15,
      title: "Read one student repo properly",
      detail: "Write three sentences: what it does, who it's for, and one thing you'd change.",
    },
    {
      id: "tech-4",
      minutes: 25,
      title: "Sketch three screens for a class app",
      detail: "Something your class actually needs. Boxes and labels on paper or in a notes app.",
    },
  ],
  design: [
    {
      id: "design-1",
      minutes: 30,
      title: "Redesign your college ID card",
      detail: "Use Figma or Canva. Keep the facts. Change the feeling.",
    },
    {
      id: "design-2",
      minutes: 20,
      title: "Redo one campus poster",
      detail: "One headline, one action, half the clutter. A photo of the original is enough reference.",
    },
    {
      id: "design-3",
      minutes: 15,
      title: "Shoot three campus contrasts",
      detail: "Photograph three spots. Note where the contrast works and where it fails.",
    },
    {
      id: "design-4",
      minutes: 25,
      title: "Wireframe your college homepage",
      detail: "On paper. Six boxes maximum. What should a first-year see first?",
    },
  ],
  entrepreneurship: [
    {
      id: "entrepreneurship-1",
      minutes: 20,
      title: "Write a campus problem statement",
      detail: "Who is stuck, how often, and what they do today. One short paragraph.",
    },
    {
      id: "entrepreneurship-2",
      minutes: 30,
      title: "Ask one classmate about a ₹100 problem",
      detail: "What would they pay ₹100 to make easier? Write down their exact words.",
    },
    {
      id: "entrepreneurship-3",
      minutes: 20,
      title: "Name a micro-service",
      detail: "A name, a one-line offer, and a price. Notes, prints, or project help all count.",
    },
    {
      id: "entrepreneurship-4",
      minutes: 15,
      title: "Map five nearby colleges",
      detail: "List five colleges near yours and one reason a student there has the same problem.",
    },
  ],
  content: [
    {
      id: "content-1",
      minutes: 25,
      title: "Write a 150-word campus scene",
      detail: "Your voice. One moment. No advice, no moral.",
    },
    {
      id: "content-2",
      minutes: 20,
      title: "Record a 45-second explainer",
      detail: "Explain one idea to a junior. Listen back once. Note what you'd cut.",
    },
    {
      id: "content-3",
      minutes: 15,
      title: "Draft three reel hooks",
      detail: "One sentence each. Only your department would get them.",
    },
    {
      id: "content-4",
      minutes: 20,
      title: "Rewrite a dull announcement",
      detail: "Take a real college notice and make a first-year actually read it.",
    },
  ],
  community: [
    {
      id: "community-1",
      minutes: 20,
      title: "List eight people who should meet",
      detail: "Pairs in your college who don't talk. One line on why each pair.",
    },
    {
      id: "community-2",
      minutes: 25,
      title: "Write a 10-line run-of-show",
      detail: "A 45-minute interest circle: welcome, one prompt, a few demos, a close.",
    },
    {
      id: "community-3",
      minutes: 15,
      title: "Draft the invite",
      detail: "Who it's for, where, when, and why it's worth showing up. Ready to paste.",
    },
    {
      id: "community-4",
      minutes: 20,
      title: "Ask what event is missing",
      detail: "Message one person you respect. Ask what event they wish existed. Save their answer.",
    },
  ],
};

function emptyScores() {
  return {
    tech: 0,
    design: 0,
    entrepreneurship: 0,
    content: 0,
    community: 0,
  };
}

function fresh() {
  return {
    screen: "landing",
    returnTo: null,
    qIndex: 0,
    answers: [],
    scores: emptyScores(),
    ranking: [],
    chosen: null,
    rejected: [],
    quests: {},
    enjoyment: null,
    stuck: false,
    nudge: false,
  };
}

let state = fresh();

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function countAnswers(source) {
  const answers = (source || state).answers || [];
  return answers.filter((answer) => Number.isInteger(answer)).length;
}

function recompute() {
  const scores = emptyScores();
  state.answers.forEach((optIndex, qi) => {
    if (!Number.isInteger(optIndex)) return;
    const current = QUESTIONS[qi] && QUESTIONS[qi].options[optIndex];
    if (!current) return;
    Object.entries(current.points).forEach(([cat, points]) => {
      if (scores[cat] != null) scores[cat] += points;
    });
  });
  state.scores = scores;
}

function rankIds(scores) {
  return Object.keys(CATEGORIES).sort((a, b) => {
    const diff = scores[b] - scores[a];
    if (diff) return diff;
    return CATEGORIES[a].order - CATEGORIES[b].order;
  });
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    /* Private mode can block storage. The quiz still runs in memory. */
  }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") return null;
    return normalize(data);
  } catch (error) {
    return null;
  }
}

function normalize(data) {
  const next = fresh();
  next.screen = SCREENS.includes(data.screen) ? data.screen : "landing";
  next.returnTo = SCREENS.includes(data.returnTo) ? data.returnTo : null;
  next.qIndex = Number.isInteger(data.qIndex) ? data.qIndex : 0;
  next.answers = Array.isArray(data.answers) ? data.answers.slice(0, QUESTIONS.length) : [];
  next.answers = next.answers.map((answer) => (Number.isInteger(answer) ? answer : null));
  next.chosen = CATEGORIES[data.chosen] ? data.chosen : null;
  next.rejected = Array.isArray(data.rejected) ? data.rejected.filter((id) => CATEGORIES[id]) : [];
  next.quests = data.quests && typeof data.quests === "object" ? data.quests : {};
  next.enjoyment = ["yes", "kindof", "no"].includes(data.enjoyment) ? data.enjoyment : null;
  next.stuck = Boolean(data.stuck);
  next.nudge = Boolean(data.nudge);
  state = next;
  recompute();
  if (countAnswers() === QUESTIONS.length) {
    state.ranking = rankIds(state.scores);
  } else {
    state.ranking = [];
    if (["result", "quests", "confirm", "connect"].includes(state.screen)) {
      state.screen = countAnswers() ? "question" : "landing";
    }
  }
  if (state.qIndex < 0 || state.qIndex >= QUESTIONS.length) state.qIndex = 0;
  if (["quests", "confirm", "connect"].includes(state.screen) && !state.chosen && state.ranking[0]) {
    state.chosen = state.ranking[0];
  }
  if (state.returnTo === "landing") state.returnTo = null;
  return state;
}

function canResume() {
  return Boolean(state.returnTo && state.returnTo !== "landing");
}

function questBag(cat) {
  if (!state.quests[cat] || typeof state.quests[cat] !== "object") state.quests[cat] = {};
  return state.quests[cat];
}

function questState(cat, id) {
  const bag = questBag(cat);
  const current = bag[id] || {};
  return {
    done: Boolean(current.done),
    note: typeof current.note === "string" ? current.note : "",
  };
}

function whyFor(id) {
  const top = state.ranking[0];
  const runner = state.ranking[1];
  let text = WHY[id] || "";
  if (!runner) return text;
  if (id === top) {
    const tied = state.scores[top] === state.scores[runner];
    text += tied
      ? ` ${CATEGORIES[runner].name} tied this round, so it stays beside you.`
      : ` Closest beside it: ${CATEGORIES[runner].name}.`;
  } else {
    text += ` Your answers leaned ${CATEGORIES[top].name} first. You can still walk this path.`;
  }
  return text;
}

function tagsFor(id) {
  const tags = [];
  if (id === state.ranking[0]) tags.push("Top match");
  else if (id === state.ranking[1]) tags.push("Runner-up");
  if (id === state.chosen && id !== state.ranking[0]) tags.push("Selected");
  return tags;
}

function ticker() {
  const line = "Curious looks good on you  ✦  A place to become  ✦  Explore  ✦  Evelve  ✦  Engineer  ✦  No grades. Just you  ✦  Find your people  ✦  ";
  return `
    <div class="ticker" aria-hidden="true">
      <div class="ticker-track">
        <span>${line}</span><span>${line}</span>
      </div>
    </div>
  `;
}

function shell(body) {
  const restart = state.screen !== "landing"
    ? `<button type="button" class="texty" data-action="restart">Start again</button>`
    : "";
  return `
    ${ticker()}
    <div class="sheet">
      <header class="top">
        <button type="button" class="brandbtn" data-action="home">
          <span class="brand">BeyondCampus</span>
          <span class="by">Sapiens Campus</span>
        </button>
        ${restart}
      </header>
      <main id="screen" data-screen="${esc(state.screen)}"${state.chosen ? ` data-category="${esc(state.chosen)}"` : ""}>${body}</main>
      <footer class="footer">${esc(FOOTER)}</footer>
    </div>
  `;
}

function renderLanding() {
  const resume = canResume()
    ? `<button type="button" class="btn primary" data-action="resume">Continue where you left off</button>`
    : "";
  return shell(`
    <p class="eyebrow"><span class="faces" aria-hidden="true"><i>:)</i><i>:D</i><i>;)</i></span> a different kind of campus</p>
    <h1>Your campus. <span class="mark tilt">Without the limits.</span></h1>
    <p class="lede">Find what makes you, you. Meet your people across colleges. Build the things you wish existed.</p>
    <div class="stickers">
      <span class="sticker s-green tilt-l">About 2 minutes</span>
      <span class="sticker s-pink tilt-r">a little more you</span>
      <span class="sticker s-blue">no email needed</span>
    </div>
    <aside class="poster">
      <span class="corner-sticker">you, somewhere new</span>
      <p class="poster-kicker">12.0° curious / 100% you</p>
      <p class="poster-title">A place to become</p>
      <p>By the students, for the students. One curious campus for engineering colleges across Tamil Nadu.</p>
      <p class="poster-stats"><span>3000+ students</span><span>50+ colleges</span><span>20+ meetups</span></p>
    </aside>
    <ol class="phases">
      <li class="phase phase-discover is-now">
        <div class="phase-top">
          <span class="num">01</span>
          <span class="badge">active</span>
        </div>
        <h2>Discover</h2>
        <p>Find your kind of curious.</p>
      </li>
      <li class="phase phase-connect">
        <div class="phase-top">
          <span class="num">02</span>
          <span class="badge">next</span>
        </div>
        <h2>Connect</h2>
        <p>Good people. New perspectives.</p>
      </li>
      <li class="phase phase-grow">
        <div class="phase-top">
          <span class="num">03</span>
          <span class="badge">next</span>
        </div>
        <h2>Grow</h2>
        <p>Small starts. Real things. Learn with experts.</p>
      </li>
    </ol>
    <p class="note">Free to explore. Curious looks good on you.</p>
    <div class="actions">
      ${resume}
      <button type="button" class="btn ${resume ? "" : "primary"}" data-action="start">Start discovering</button>
    </div>
  `);
}

function renderQuestion() {
  const question = QUESTIONS[state.qIndex];
  const current = state.qIndex + 1;
  const total = QUESTIONS.length;
  const width = Math.round((current / total) * 100);
  const picked = state.answers[state.qIndex];
  const back = state.qIndex > 0
    ? `<button type="button" class="texty" data-action="back">Back</button>`
    : "";
  const options = question.options.map((item, index) => `
    <button type="button" class="opt ${picked === index ? "is-picked" : ""}" data-action="option" data-option="${index}">
      ${esc(item.label)}
    </button>
  `).join("");
  return shell(`
    <div class="progress-row">
      <span>Discover</span>
      <span>${current} of ${total}</span>
    </div>
    <div class="bar" role="progressbar" aria-valuemin="1" aria-valuemax="${total}" aria-valuenow="${current}" aria-label="Question ${current} of ${total}">
      <span class="bar-fill" style="width:${width}%"></span>
    </div>
    <div class="qstack">
      <article class="qcard">
        <p class="kicker">A gut feeling. A single tap.</p>
        <h1>${esc(question.prompt)}</h1>
      </article>
    </div>
    <p class="hint">Pick what feels like you. Not what sounds impressive.</p>
    <div class="stack">${options}</div>
    <div class="actions">${back}</div>
  `);
}

function renderResult() {
  const chosen = CATEGORIES[state.chosen] ? state.chosen : state.ranking[0];
  const cat = CATEGORIES[chosen];
  const runner = state.ranking[1];
  const banner = state.stuck
    ? `<p class="banner">You've tried every path. Pick the closest one, or start again.</p>`
    : "";
  const picks = state.ranking.map((id) => {
    const item = CATEGORIES[id];
    const tags = tagsFor(id).map((tag) => `<span class="tag">${esc(tag)}</span>`).join("");
    return `
      <button type="button" class="pick ${id === chosen ? "is-on" : ""}" data-action="pick" data-category="${esc(id)}" aria-pressed="${id === chosen}">
        <span class="emoji" aria-hidden="true">${item.emoji}</span>
        <span>
          <strong>${esc(item.name)}</strong>${tags}
          <span class="desc pick-line">${esc(item.line)}</span>
        </span>
      </button>
    `;
  }).join("");
  return shell(`
    ${banner}
    <p class="kicker">A starting point, not a box.</p>
    <article class="hero-result tone-${esc(chosen)}">
      <span class="sticker s-paper tilt-r">curious looks good on you</span>
      <p class="emoji" aria-hidden="true">${cat.emoji}</p>
      <h1 id="top-name">${esc(cat.name)}</h1>
      <p class="desc">${esc(cat.line)}</p>
    </article>
    <p class="why" id="why">${esc(whyFor(chosen))}</p>
    <p class="meta-line">Top match <strong id="top-match">${esc(CATEGORIES[state.ranking[0]].name)}</strong>. Runner-up <strong id="runner-up">${esc(CATEGORIES[runner].name)}</strong>.</p>
    <p class="hint">No grades. Just you. Switch if another path feels closer.</p>
    <div class="stack">${picks}</div>
    <div class="actions">
      <button type="button" class="btn primary" data-action="quests">See these quests</button>
    </div>
  `);
}

function renderQuests() {
  const cat = CATEGORIES[state.chosen];
  const list = QUESTS[state.chosen] || [];
  const banner = state.nudge
    ? `<p class="banner">That path wasn't it. Try these ${esc(cat.name)} quests.</p>`
    : "";
  const cards = list.map((quest) => {
    const saved = questState(state.chosen, quest.id);
    return `
      <li class="quest ${saved.done ? "is-done" : ""}">
        <p class="time">About ${quest.minutes} min</p>
        <h2>${esc(quest.title)}</h2>
        <p>${esc(quest.detail)}</p>
        <label class="check">
          <input type="checkbox" data-quest="${esc(quest.id)}" ${saved.done ? "checked" : ""}>
          <span>Mark done</span>
        </label>
        <label class="reflect-label" for="note-${esc(quest.id)}">Reflection, if you want</label>
        <textarea id="note-${esc(quest.id)}" data-reflect="${esc(quest.id)}" maxlength="280" rows="2" placeholder="Optional. One line on how it felt.">${esc(saved.note)}</textarea>
      </li>
    `;
  }).join("");
  return shell(`
    ${banner}
    <p class="kicker">Try it. See how it feels.</p>
    <h1><span class="emoji" aria-hidden="true">${cat.emoji}</span> ${esc(cat.name)} quests</h1>
    <p class="lede">${esc(cat.line)}</p>
    <p class="note">Small experiments, not big commitments.</p>
    <ul class="quests">${cards}</ul>
    <div class="actions">
      <button type="button" class="btn primary" data-action="confirm">Continue</button>
    </div>
  `);
}

function renderConfirm() {
  const cat = CATEGORIES[state.chosen];
  const done = (QUESTS[state.chosen] || []).filter((quest) => questState(state.chosen, quest.id).done).length;
  const total = (QUESTS[state.chosen] || []).length;
  return shell(`
    <p class="kicker">Be honest. It's your call.</p>
    <h1>Did you enjoy this? Is this what you love?</h1>
    <p class="lede">You just looked at ${esc(cat.name)}. ${done} of ${total} quests marked done.</p>
    <p class="note">Yes keeps going. Not really tries the next closest path.</p>
    <div class="actions">
      <button type="button" class="btn primary" data-action="enjoy" data-enjoy="yes">Yes</button>
      <button type="button" class="btn" data-action="enjoy" data-enjoy="kindof">Kind of</button>
      <button type="button" class="btn" data-action="enjoy" data-enjoy="no">Not really</button>
    </div>
  `);
}

function renderConnect() {
  const cat = CATEGORIES[state.chosen];
  const href = INVITE_LINKS[state.chosen];
  const kind = state.enjoyment === "kindof"
    ? `<p class="note">You said kind of. Stay if it fits. Start again if you want another read.</p>`
    : `<p class="note">You said this is it. The channel is the next step.</p>`;
  return shell(`
    <p class="kicker">Connect</p>
    <h1>Found a little more you?</h1>
    <p class="lede">Now find your people. Your ${esc(cat.name)} channel is students across colleges who get the same itch.</p>
    <aside class="poster">
      <span class="corner-sticker">${cat.emoji} your tribe</span>
      <p class="poster-kicker">good people. new perspectives.</p>
      <p class="poster-title">Join the ${esc(cat.name)} room</p>
      <p>Same campus energy. A different college on the other side of the chat.</p>
    </aside>
    ${kind}
    <div class="actions">
      <a class="btn primary join" id="join-tribe" href="${esc(href)}" target="_blank" rel="noopener noreferrer">Join your ${esc(cat.name)} tribe</a>
    </div>
    <aside class="grow" id="grow">
      <span class="badge badge-hot">in progress</span>
      <h2>Learn with experts: coming next</h2>
      <p>Workshops and sessions with people who've already built this. Same campus energy, a little further down the road.</p>
    </aside>
  `);
}

function render() {
  const app = document.getElementById("app");
  const previous = app.querySelector("main") && app.querySelector("main").dataset.screen;
  let body = "";
  if (state.screen === "question") body = renderQuestion();
  else if (state.screen === "result") body = renderResult();
  else if (state.screen === "quests") body = renderQuests();
  else if (state.screen === "confirm") body = renderConfirm();
  else if (state.screen === "connect") body = renderConnect();
  else body = renderLanding();
  app.innerHTML = body;
  const next = app.querySelector("main") && app.querySelector("main").dataset.screen;
  if (previous && next && previous !== next) window.scrollTo(0, 0);
  const titles = {
    landing: "BeyondCampus · Sapiens Campus",
    question: `Question ${state.qIndex + 1} · BeyondCampus`,
    result: "Your starting point · BeyondCampus",
    quests: `${CATEGORIES[state.chosen] ? CATEGORIES[state.chosen].name : "Quests"} · BeyondCampus`,
    confirm: "Did you enjoy this? · BeyondCampus",
    connect: "Find your people · BeyondCampus",
  };
  document.title = titles[state.screen] || titles.landing;
}

function scrapeNotes() {
  if (!state.chosen) return;
  document.querySelectorAll("textarea[data-reflect]").forEach((box) => {
    const bag = questBag(state.chosen);
    const prev = bag[box.dataset.reflect] || {};
    bag[box.dataset.reflect] = {
      done: Boolean(prev.done),
      note: box.value.slice(0, 280),
    };
  });
}

function startDiscovering() {
  state = fresh();
  state.screen = "question";
  state.qIndex = 0;
  save();
  render();
}

function restart() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    /* ignore */
  }
  state = fresh();
  render();
}

function goHome() {
  if (state.screen !== "landing") state.returnTo = state.screen;
  state.screen = "landing";
  save();
  render();
}

function resume() {
  if (!state.returnTo || state.returnTo === "landing") return;
  state.screen = state.returnTo;
  state.returnTo = null;
  save();
  render();
}

function choose(index) {
  const question = QUESTIONS[state.qIndex];
  if (!question || !question.options[index]) return;
  state.answers[state.qIndex] = index;
  recompute();
  if (state.qIndex < QUESTIONS.length - 1) {
    state.qIndex += 1;
    state.screen = "question";
  } else {
    state.ranking = rankIds(state.scores);
    state.chosen = state.ranking[0];
    state.rejected = [];
    state.enjoyment = null;
    state.stuck = false;
    state.nudge = false;
    state.screen = "result";
    state.returnTo = null;
  }
  save();
  render();
}

function pickCategory(id) {
  if (!CATEGORIES[id]) return;
  state.chosen = id;
  state.stuck = false;
  save();
  render();
}

function seeQuests() {
  if (!state.chosen) state.chosen = state.ranking[0];
  if (!state.chosen) return;
  state.rejected = state.rejected.filter((id) => id !== state.chosen);
  state.nudge = false;
  state.stuck = false;
  state.screen = "quests";
  save();
  render();
}

function toConfirm() {
  scrapeNotes();
  state.screen = "confirm";
  save();
  render();
}

function enjoy(value) {
  scrapeNotes();
  if (value === "no") {
    state.enjoyment = "no";
    state.rejected = [...new Set(state.rejected.concat(state.chosen))];
    const next = (state.ranking || []).find((id) => !state.rejected.includes(id));
    if (!next) {
      state.stuck = true;
      state.nudge = false;
      state.chosen = state.ranking[0] || state.chosen;
      state.screen = "result";
    } else {
      state.chosen = next;
      state.nudge = true;
      state.stuck = false;
      state.screen = "quests";
    }
  } else if (value === "yes" || value === "kindof") {
    state.enjoyment = value;
    state.nudge = false;
    state.screen = "connect";
  }
  save();
  render();
}

function onClick(event) {
  const btn = event.target.closest("[data-action]");
  if (!btn) return;
  const action = btn.dataset.action;
  if (action === "start") startDiscovering();
  else if (action === "restart") restart();
  else if (action === "home") goHome();
  else if (action === "resume") resume();
  else if (action === "back" && state.qIndex > 0) {
    state.qIndex -= 1;
    save();
    render();
  } else if (action === "option") choose(Number(btn.dataset.option));
  else if (action === "pick") pickCategory(btn.dataset.category);
  else if (action === "quests") seeQuests();
  else if (action === "confirm") toConfirm();
  else if (action === "enjoy") enjoy(btn.dataset.enjoy);
}

function onChange(event) {
  const box = event.target;
  if (!(box instanceof HTMLInputElement) || !box.dataset.quest || !state.chosen) return;
  scrapeNotes();
  const bag = questBag(state.chosen);
  const prev = bag[box.dataset.quest] || { note: "" };
  bag[box.dataset.quest] = {
    done: box.checked,
    note: typeof prev.note === "string" ? prev.note : "",
  };
  save();
  render();
}

function onInput(event) {
  const box = event.target;
  if (!(box instanceof HTMLTextAreaElement) || !box.dataset.reflect || !state.chosen) return;
  const bag = questBag(state.chosen);
  const prev = bag[box.dataset.reflect] || {};
  bag[box.dataset.reflect] = {
    done: Boolean(prev.done),
    note: box.value.slice(0, 280),
  };
  save();
}

function boot() {
  state = load() || fresh();
  const app = document.getElementById("app");
  app.addEventListener("click", onClick);
  app.addEventListener("change", onChange);
  app.addEventListener("input", onInput);
  render();
}

boot();
