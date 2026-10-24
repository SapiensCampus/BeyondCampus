// TODO: replace these dummy WhatsApp invites with the real interest-channel links.
const INVITE_LINKS = {
  tech: "https://chat.whatsapp.com/beyondcampus-tech",
  design: "https://chat.whatsapp.com/beyondcampus-design",
  entrepreneurship: "https://chat.whatsapp.com/beyondcampus-entrepreneurship",
  content: "https://chat.whatsapp.com/beyondcampus-content",
  community: "https://chat.whatsapp.com/beyondcampus-community",
};

const STORAGE_KEY = "beyondcampus.discover.v1";
const FOOTER = "BeyondCampus";
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
    prompt: "Free hour. What do you actually do?",
    options: [
      option("tech", "Tinker with a small app or website"),
      option("design", "Fix how something looks"),
      option("entrepreneurship", "Jot an idea that could make money"),
      option("content", "Film or write something short"),
      option("community", "Text people and plan a hangout"),
    ],
  },
  {
    prompt: "Your class needs one helper. You take…",
    options: [
      option("tech", "The form, the site, or the bot"),
      option("design", "The poster and the slides"),
      option("entrepreneurship", "Sponsors, tickets, or the pitch"),
      option("content", "The posts and the hype"),
      option("community", "Getting people to show up"),
    ],
  },
  {
    prompt: "A friend is stuck. You help by…",
    options: [
      option("tech", "Fixing the bug or the setup"),
      option("design", "Cleaning up the layout"),
      option("entrepreneurship", "Saying who it is for, in one line"),
      option("content", "Writing the caption or the script"),
      option("community", "Introducing the right person"),
    ],
  },
  {
    prompt: "Which win feels best?",
    options: [
      option("tech", "It works when you click it"),
      option("design", "It finally looks right"),
      option("entrepreneurship", "Someone would actually pay"),
      option("content", "People watched or shared it"),
      option("community", "The right people showed up"),
    ],
  },
  {
    prompt: "Pick a 20-minute task.",
    options: [
      option("tech", "A one-page site about you"),
      option("design", "A new look for your ID card"),
      option("entrepreneurship", "A price and a one-line offer"),
      option("content", "Three hooks for a short video"),
      option("community", "A guest list for a tiny meetup"),
    ],
  },
  {
    prompt: "In a group, you quietly become the one who…",
    options: [
      option("tech", "Makes the demo run"),
      option("design", "Makes the deck look good"),
      option("entrepreneurship", "Says why anyone should care"),
      option("content", "Writes it and hits record"),
      option("community", "Keeps everyone on track"),
    ],
  },
  {
    prompt: "You open your phone and stay for…",
    options: [
      option("tech", "A build, a repo, a how-it-works"),
      option("design", "A before-and-after"),
      option("entrepreneurship", "Someone who started a small thing"),
      option("content", "A short video or a sharp post"),
      option("community", "Photos from a hangout"),
    ],
  },
  {
    prompt: "Two minutes to show something. You show…",
    options: [
      option("tech", "A tiny thing you built"),
      option("design", "A visual you made"),
      option("entrepreneurship", "A problem people would pay to fix"),
      option("content", "A short story from campus"),
      option("community", "How you’d get people in a room"),
    ],
  },
  {
    prompt: "A good week looks like…",
    options: [
      option("tech", "I shipped something small"),
      option("design", "I made something look better"),
      option("entrepreneurship", "I tried an idea on a real person"),
      option("content", "I posted something people finished"),
      option("community", "I got people in the same place"),
    ],
  },
];

const TRY_WHY = {
  tech: "The quiz only guessed. Do one small build. If making it run feels good, this is what you love.",
  design: "The quiz only guessed. Do one small visual fix. If making it look right feels good, this is what you love.",
  entrepreneurship: "The quiz only guessed. Do one small idea check. If testing it on a real person feels good, this is what you love.",
  content: "The quiz only guessed. Do one small story. If telling it feels good, this is what you love.",
  community: "The quiz only guessed. Do one small people task. If bringing them together feels good, this is what you love.",
};

const QUESTS = {
  tech: [
    {
      id: "tech-1",
      minutes: 20,
      title: "Make a one-page page about you",
      detail: "Name, college, one thing you like. Open it in a browser.",
    },
    {
      id: "tech-2",
      minutes: 15,
      title: "Make a tiny calculator",
      detail: "Attendance left, or split a bill. Run it once.",
    },
    {
      id: "tech-3",
      minutes: 15,
      title: "Draw three app screens",
      detail: "An app your class needs. Boxes and words only.",
    },
  ],
  design: [
    {
      id: "design-1",
      minutes: 20,
      title: "Redo your college ID card",
      detail: "Canva or Figma. Same facts. Nicer look.",
    },
    {
      id: "design-2",
      minutes: 15,
      title: "Fix one messy poster",
      detail: "One headline. One thing to do. Less clutter.",
    },
    {
      id: "design-3",
      minutes: 15,
      title: "Sketch your college homepage",
      detail: "Six boxes. What should a new student see first?",
    },
  ],
  entrepreneurship: [
    {
      id: "entrepreneurship-1",
      minutes: 15,
      title: "Write who is stuck",
      detail: "Four lines. Who, and what they do today.",
    },
    {
      id: "entrepreneurship-2",
      minutes: 15,
      title: "Ask one friend",
      detail: "What would they pay ₹100 to make easier? Write their words.",
    },
    {
      id: "entrepreneurship-3",
      minutes: 10,
      title: "Name it and price it",
      detail: "A name, what it does in one line, and a price.",
    },
  ],
  content: [
    {
      id: "content-1",
      minutes: 15,
      title: "Write one campus moment",
      detail: "Half a page. Just what happened.",
    },
    {
      id: "content-2",
      minutes: 10,
      title: "Record 30 seconds",
      detail: "Explain one idea out loud. Listen once.",
    },
    {
      id: "content-3",
      minutes: 10,
      title: "Write three opening lines",
      detail: "For a short video. One sentence each.",
    },
  ],
  community: [
    {
      id: "community-1",
      minutes: 10,
      title: "List four people who should meet",
      detail: "One reason for each pair.",
    },
    {
      id: "community-2",
      minutes: 10,
      title: "Plan a 30-minute meetup",
      detail: "Five lines: hello, one question, share, close.",
    },
    {
      id: "community-3",
      minutes: 10,
      title: "Write the invite",
      detail: "Who it is for, where, and when.",
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

function shell(body) {
  const restart = state.screen !== "landing"
    ? `<button type="button" class="texty" data-action="restart">Start again</button>`
    : "";
  return `
    <div class="sheet">
      <header class="top">
        <button type="button" class="brandbtn" data-action="home">
          <span class="brand">BeyondCampus</span>
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
    <p class="eyebrow"><span class="faces" aria-hidden="true"><i>:)</i><i>:D</i><i>;)</i></span> a platform in three steps</p>
    <h1>Start with <span class="mark tilt">what you love.</span></h1>
    <p class="lede">Find what makes you, you. Meet your people across colleges. Grow with expert guidance.</p>
    <div class="actions hero-cta">
      <button type="button" class="btn primary" data-action="start">Start discovering</button>
      ${resume}
    </div>
    <p class="meta">2 minutes · no sign-up</p>
    <ol class="phases">
      <li class="phase phase-discover is-now">
        <span class="num">01</span>
        <h2>Discover</h2>
        <span class="badge">active</span>
      </li>
      <li class="phase phase-connect">
        <span class="num">02</span>
        <h2>Connect</h2>
        <span class="badge">next</span>
      </li>
      <li class="phase phase-grow">
        <span class="num">03</span>
        <h2>Grow</h2>
        <span class="badge">next</span>
      </li>
    </ol>
    <div class="dock">
      <button type="button" class="btn primary" data-action="start">Start discovering →</button>
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
        <p class="kicker">Quick pick. First feeling wins.</p>
        <h1>${esc(question.prompt)}</h1>
      </article>
    </div>
    <p class="hint">Don’t overthink it. Pick the one that sounds fun.</p>
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
      <span class="sticker s-paper tilt-r">a starting point</span>
      <p class="emoji" aria-hidden="true">${cat.emoji}</p>
      <h1 id="top-name">${esc(cat.name)}</h1>
      <p class="desc">${esc(cat.line)}</p>
    </article>
    <p class="why" id="why">${esc(whyFor(chosen))}</p>
    <p class="meta-line">Top match <strong id="top-match">${esc(CATEGORIES[state.ranking[0]].name)}</strong>. Runner-up <strong id="runner-up">${esc(CATEGORIES[runner].name)}</strong>.</p>
    <p class="hint">No grades. Just you. Switch if another path feels closer.</p>
    <div class="stack">${picks}</div>
    <div class="actions">
      <button type="button" class="btn primary" data-action="quests">Try one small task</button>
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
    const note = saved.done
      ? `<textarea id="note-${esc(quest.id)}" data-reflect="${esc(quest.id)}" maxlength="280" rows="2" placeholder="Optional. Did this feel like you?">${esc(saved.note)}</textarea>`
      : "";
    return `
      <li class="quest ${saved.done ? "is-done" : ""}">
        <div class="quest-top">
          <h2>${esc(quest.title)}</h2>
          <span class="time">${quest.minutes} min</span>
        </div>
        <p>${esc(quest.detail)}</p>
        <label class="check">
          <input type="checkbox" data-quest="${esc(quest.id)}" ${saved.done ? "checked" : ""}>
          <span>Mark done</span>
        </label>
        ${note}
      </li>
    `;
  }).join("");
  return shell(`
    ${banner}
    <p class="kicker">${esc(cat.name)}</p>
    <h1 class="task-title"><span class="emoji" aria-hidden="true">${cat.emoji}</span> Try one. See if you love it.</h1>
    <p class="why-brief">${esc(TRY_WHY[state.chosen] || "")}</p>
    <ul class="quests">${cards}</ul>
    <div class="actions">
      <button type="button" class="btn primary" data-action="confirm">How did it feel?</button>
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
    <p class="lede">Doing it is the real check. ${done} of ${total} tasks marked done.</p>
    <p class="note">Yes means this fits. Not really tries the next closest.</p>
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
    <h1>Found your lane?</h1>
    <p class="lede">Connect is the next step. Your ${esc(cat.name)} channel is for students who picked the same path.</p>
    <aside class="poster">
      <span class="corner-sticker">${cat.emoji} your people</span>
      <p class="poster-kicker">Connect</p>
      <p class="poster-title">Join the ${esc(cat.name)} room</p>
      <p>Same interest. Other colleges. A chat, not a signup on this page.</p>
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
    landing: "BeyondCampus",
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
