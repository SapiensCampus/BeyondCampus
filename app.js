(function () {
  var STORAGE_KEY = "beyondcampus.journey.v1";
  var SCREENS = ["landing", "character", "interests", "tasks", "path", "profile", "peers", "paid", "world", "industry", "overview"];
  var LEVELS = ["taste", "try", "stretch"];
  var QUADS = {
    path: { title: "Your path", hint: "You loved it, and it went well." },
    grow: { title: "Grow this skill", hint: "You loved it. The skill can catch up." },
    useful: { title: "Useful skill, not passion", hint: "You can do it. It did not pull you." },
    drop: { title: "Drop it", hint: "It did not pull you, and it did not click." }
  };
  var STAGES = [
    { id: "character", short: "Character", name: "Character", node: "Who you are" },
    { id: "interests", short: "Interests", name: "Interests", node: "What pulls you" },
    { id: "tasks", short: "Tasks", name: "Little tasks", node: "Try it for real" },
    { id: "path", short: "Path", name: "Confirmed path", node: "Love and good-at" },
    { id: "profile", short: "Profile", name: "Profile v1", node: "Your checkpoint" },
    { id: "peers", short: "Peers", name: "Peer group", node: "Students on the same path" },
    { id: "paid", short: "Paid", name: "Paid for", node: "Career paths we show" },
    { id: "world", short: "World", name: "World needs", node: "Challenges and future" },
    { id: "industry", short: "Industry", name: "Industry connect", node: "Coming next" }
  ];

  var state = load();

  function fresh() {
    return {
      screen: "landing",
      resume: "character",
      qIndex: 0,
      answers: [],
      social: null,
      structure: null,
      suggestOffset: 0,
      reactions: {},
      funNote: "",
      shortlist: [],
      ratings: {},
      taskFocus: "",
      sampleSteps: {},
      persona: false
    };
  }

  function load() {
    var next = fresh();
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return next;
      var data = JSON.parse(raw);
      if (!data || typeof data !== "object") return next;
      if (SCREENS.indexOf(data.screen) !== -1) next.screen = data.screen;
      if (SCREENS.indexOf(data.resume) !== -1) next.resume = data.resume;
      if (typeof data.qIndex === "number" && data.qIndex >= 0 && data.qIndex <= 12) next.qIndex = data.qIndex;
      if (Array.isArray(data.answers)) next.answers = data.answers.slice(0, 10);
      if (data.social === "solo" || data.social === "team") next.social = data.social;
      if (data.structure === "structure" || data.structure === "freedom") next.structure = data.structure;
      if (typeof data.suggestOffset === "number" && data.suggestOffset >= 0) next.suggestOffset = data.suggestOffset;
      if (data.reactions && typeof data.reactions === "object") next.reactions = data.reactions;
      if (typeof data.funNote === "string") next.funNote = data.funNote.slice(0, 280);
      if (Array.isArray(data.shortlist)) next.shortlist = data.shortlist.slice(0, 3);
      if (data.ratings && typeof data.ratings === "object") next.ratings = data.ratings;
      if (typeof data.taskFocus === "string") next.taskFocus = data.taskFocus;
      if (data.sampleSteps && typeof data.sampleSteps === "object") next.sampleSteps = data.sampleSteps;
      next.persona = data.persona === true;
    } catch (err) {
      return fresh();
    }
    return next;
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      /* Private mode can refuse storage. The walk still runs. */
    }
  }

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function trackById(id) {
    return JOURNEY.tracks.filter(function (track) { return track.id === id; })[0];
  }

  function typeById(id) {
    return JOURNEY.characters.filter(function (type) { return type.id === id; })[0];
  }

  function levelById(id) {
    return JOURNEY.levels.filter(function (level) { return level.id === id; })[0];
  }

  function characterComplete() {
    if (!state.answers || state.answers.length < 10) return false;
    var i;
    for (i = 0; i < 10; i += 1) {
      if (typeof state.answers[i] !== "number") return false;
    }
    if (state.social !== "solo" && state.social !== "team") return false;
    if (state.structure !== "structure" && state.structure !== "freedom") return false;
    return true;
  }

  function topTypes() {
    var scores = {};
    JOURNEY.characters.forEach(function (type) { scores[type.id] = 0; });
    state.answers.forEach(function (choice, index) {
      var question = JOURNEY.quiz[index];
      if (!question || typeof choice !== "number") return;
      var option = question.options[choice];
      if (option) scores[option.type] += 1;
    });
    return JOURNEY.characters.map(function (type) {
      return { id: type.id, score: scores[type.id], order: type.order };
    }).sort(function (a, b) {
      return b.score - a.score || a.order - b.order;
    }).slice(0, 2);
  }

  function leans() {
    var ids = [];
    if (!characterComplete()) return ids;
    topTypes().forEach(function (type) {
      typeById(type.id).tracks.forEach(function (id) {
        if (ids.indexOf(id) === -1) ids.push(id);
      });
    });
    return ids;
  }

  function suggestions() {
    var all = leans();
    if (!all.length) return [];
    var start = state.suggestOffset % all.length;
    var out = [];
    var i;
    for (i = 0; i < all.length && out.length < 3; i += 1) out.push(all[(start + i) % all.length]);
    return out;
  }

  function syncShortlist() {
    var suggested = suggestions();
    state.shortlist = suggested.filter(function (id) { return state.reactions[id] === "keep"; }).slice(0, 3);
  }

  function cellOk(cell) {
    return cell && cell.love >= 1 && cell.love <= 5 && cell.good >= 1 && cell.good <= 5;
  }

  function tasksComplete() {
    if (state.shortlist.length < 2) return false;
    return state.shortlist.every(function (id) {
      var ratings = state.ratings[id] || {};
      return LEVELS.every(function (level) { return cellOk(ratings[level]); });
    });
  }

  function placement(id) {
    var ratings = state.ratings[id];
    if (!ratings) return null;
    var love = 0;
    var good = 0;
    var count = 0;
    LEVELS.forEach(function (level) {
      var cell = ratings[level];
      if (!cellOk(cell)) return;
      love += cell.love;
      good += cell.good;
      count += 1;
    });
    if (!count) return null;
    love /= count;
    good /= count;
    var quad = "drop";
    if (love >= 4 && good >= 4) quad = "path";
    else if (love >= 4) quad = "grow";
    else if (good >= 4) quad = "useful";
    return { love: love, good: good, quad: quad };
  }

  function liveConfirmed() {
    var best = null;
    state.shortlist.forEach(function (id) {
      var place = placement(id);
      if (!place || place.quad !== "path") return;
      var score = place.love + place.good;
      if (!best || score > best.score) best = { id: id, score: score };
    });
    return best ? best.id : null;
  }

  function displayTrack() {
    return liveConfirmed() || state.shortlist[0] || "tech";
  }

  function fallbackRating(index) {
    if (index === 0) {
      return { taste: { love: 5, good: 5 }, try: { love: 4, good: 5 }, stretch: { love: 5, good: 4 } };
    }
    if (index === 1) {
      return { taste: { love: 5, good: 2 }, try: { love: 4, good: 3 }, stretch: { love: 5, good: 2 } };
    }
    return { taste: { love: 2, good: 5 }, try: { love: 2, good: 4 }, stretch: { love: 3, good: 4 } };
  }

  function applyPersonaCharacter(mark) {
    state.answers = JOURNEY.persona.answers.slice();
    state.social = JOURNEY.persona.social;
    state.structure = JOURNEY.persona.structure;
    state.qIndex = 12;
    state.persona = true;
    if (mark) state.sampleSteps.character = true;
  }

  function applySampleInterests(mark) {
    if (!characterComplete()) applyPersonaCharacter(true);
    var tracks = suggestions();
    state.reactions = {};
    tracks.forEach(function (id) { state.reactions[id] = "keep"; });
    syncShortlist();
    state.funNote = state.persona
      ? JOURNEY.persona.funNote
      : "Sample note: they already disappear into this for fun.";
    if (mark) state.sampleSteps.interests = true;
  }

  function applySampleRatings(mark, force) {
    if (state.shortlist.length < 2) applySampleInterests(true);
    state.shortlist.forEach(function (id, index) {
      var preset = JSON.parse(JSON.stringify(JOURNEY.persona.ratings[id] || fallbackRating(index)));
      if (!state.ratings[id]) state.ratings[id] = {};
      LEVELS.forEach(function (level) {
        if (force || !cellOk(state.ratings[id][level])) state.ratings[id][level] = preset[level];
      });
    });
    if (!state.taskFocus || state.shortlist.indexOf(state.taskFocus) === -1) state.taskFocus = state.shortlist[0];
    if (mark) state.sampleSteps.tasks = true;
  }

  function ensureUpTo(screen) {
    var need = { interests: 1, tasks: 2, path: 3, profile: 3, peers: 3, paid: 3, world: 3, industry: 3 }[screen] || 0;
    if (need >= 1 && !characterComplete()) applyPersonaCharacter(true);
    if (need >= 2 && state.shortlist.length < 2) applySampleInterests(true);
    if (need >= 3 && !tasksComplete()) applySampleRatings(true, false);
  }

  function go(screen) {
    if (screen === "landing") {
      if (state.screen !== "landing") state.resume = state.screen;
      state.screen = "landing";
      return;
    }
    state.screen = screen;
    state.resume = screen;
  }

  function hasProgress() {
    return state.qIndex > 0 || state.answers.length > 0 || state.shortlist.length > 0 || state.persona || Object.keys(state.ratings).length > 0;
  }

  function restart() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (err) { /* ignore */ }
    state = fresh();
  }

  function fullJourney() {
    state = fresh();
    state.persona = true;
    applyPersonaCharacter(true);
    applySampleInterests(true);
    applySampleRatings(true);
    STAGES.forEach(function (stage) { state.sampleSteps[stage.id] = true; });
    go("path");
  }

  function skip() {
    var screen = state.screen;
    if (screen === "character") {
      if (!characterComplete()) applyPersonaCharacter(true);
      go("interests");
    } else if (screen === "interests") {
      if (state.shortlist.length < 2) applySampleInterests(true);
      go("tasks");
    } else if (screen === "tasks") {
      if (!tasksComplete()) applySampleRatings(true);
      go("path");
    } else if (screen === "path") {
      if (!tasksComplete()) applySampleRatings(true);
      go("profile");
    } else if (screen === "profile") {
      ensureUpTo("peers");
      go("peers");
    } else if (screen === "peers") {
      ensureUpTo("paid");
      go("paid");
    } else if (screen === "paid") {
      go("world");
    } else if (screen === "world") {
      go("industry");
    } else if (screen === "industry" || screen === "overview") {
      go("overview");
    } else {
      go("character");
    }
  }

  function simulate() {
    var screen = state.screen;
    if (screen === "landing" || screen === "overview") {
      fullJourney();
      return;
    }
    if (screen === "character") {
      applyPersonaCharacter(true);
      go("character");
      return;
    }
    if (screen === "interests") {
      applySampleInterests(true);
      go("interests");
      return;
    }
    if (screen === "tasks" || screen === "path") {
      applySampleRatings(true, true);
      state.sampleSteps.path = true;
      go("path");
      return;
    }
    ensureUpTo(screen);
    state.sampleSteps[screen] = true;
    go(screen);
  }

  function jump(screen) {
    if (SCREENS.indexOf(screen) === -1) return;
    if (screen === "landing" || screen === "overview") {
      go(screen);
      return;
    }
    ensureUpTo(screen);
    if (screen === "character" && characterComplete()) state.qIndex = 12;
    if (screen === "tasks" && state.shortlist.length && state.shortlist.indexOf(state.taskFocus) === -1) {
      state.taskFocus = state.shortlist[0];
    }
    go(screen);
  }

  function retryInterests() {
    var all = leans();
    state.suggestOffset += all.length ? 3 : 0;
    state.reactions = {};
    state.shortlist = [];
    state.ratings = {};
    state.taskFocus = "";
    state.sampleSteps.interests = false;
    state.sampleSteps.tasks = false;
    state.sampleSteps.path = false;
    go("interests");
  }

  function choose(index) {
    if (state.qIndex < 10) {
      state.answers[state.qIndex] = index;
      state.qIndex += 1;
    } else if (state.qIndex === 10) {
      state.social = JOURNEY.styles[0].options[index].id;
      state.qIndex = 11;
    } else if (state.qIndex === 11) {
      state.structure = JOURNEY.styles[1].options[index].id;
      state.qIndex = 12;
    }
    state.sampleSteps.character = false;
    state.persona = false;
  }

  function ratedCount() {
    var count = 0;
    state.shortlist.forEach(function (id) {
      var ratings = state.ratings[id] || {};
      LEVELS.forEach(function (level) { if (cellOk(ratings[level])) count += 1; });
    });
    return count;
  }

  function styleLine() {
    var bits = [];
    if (state.social === "solo") bits.push("You can do this on your own.");
    if (state.social === "team") bits.push("Share the result with one person.");
    if (state.structure === "structure") bits.push("Follow the brief as written.");
    if (state.structure === "freedom") bits.push("Change the brief if a better version shows up.");
    return bits.join(" ");
  }

  function styleSummary() {
    var social = state.social === "team" ? "With a few people" : "Mostly on your own";
    var structure = state.structure === "freedom" ? "Room to wander" : "A clear plan";
    return social + " · " + structure;
  }

  function phaseLabel(screen) {
    if (screen === "character" || screen === "interests") return "Step 1 · What you love";
    if (screen === "tasks" || screen === "path") return "Step 2 · What you are good at";
    if (screen === "profile") return "Checkpoint · Profile v1";
    if (screen === "peers") return "Connect · Peer group";
    if (screen === "paid") return "Step 3 · What you will be paid for";
    if (screen === "world") return "Step 4 · What the world needs";
    if (screen === "industry") return "Then · Industry connect";
    return "";
  }

  function draftTag() {
    return '<span class="draft-tag">Draft</span>';
  }

  function personaNote() {
    if (!state.persona) return "";
    return '<p class="persona-flag">Walking as ' + esc(JOURNEY.persona.name) + ', a fictional ' + esc(JOURNEY.persona.year.toLowerCase()) + ' student. ' + esc(JOURNEY.persona.line) + '</p>';
  }

  function sampleFlag(step) {
    if (!state.sampleSteps[step]) return "";
    return '<p class="sample-flag">Sample fill, so this step has something to show.</p>';
  }

  function stepActions(skipLabel) {
    return '<div class="step-actions">' +
      '<button type="button" class="btn ghost" data-action="skip">' + esc(skipLabel || "Skip to next step") + '</button>' +
      '<button type="button" class="btn ghost" data-action="simulate">Simulate</button>' +
      '</div>';
  }

  function continueBtn(label, action) {
    return '<button type="button" class="btn primary" data-action="' + action + '">' + label + '</button>';
  }

  function shell(main) {
    var stepper = "";
    if (state.screen !== "landing") {
      stepper = '<nav class="stepper" aria-label="Journey stages"><ol>' + STAGES.map(function (stage) {
        var on = stage.id === state.screen;
        return '<li><button type="button" data-action="jump" data-screen="' + stage.id + '" class="' + (on ? "is-on" : "") + '"' +
          (on ? ' aria-current="step"' : "") + '>' + esc(stage.short) + '</button></li>';
      }).join("") + '</ol></nav>';
    }
    return '<p class="draft-banner" role="status">Draft preview, for closed-group testing. Questions, tasks and content are drafts.</p>' +
      '<div class="sheet" data-screen="' + esc(state.screen) + '">' +
      '<header class="top">' +
      '<div class="brand">' +
      '<button type="button" class="wordmark" data-action="home">BeyondCampus</button>' +
      '<p class="byline">Sapiens Campus</p>' +
      '</div>' +
      '<button type="button" class="text-btn" data-action="restart">Restart</button>' +
      '</header>' +
      stepper +
      '<main class="view">' + main + '</main>' +
      '<footer class="foot">Sapiens Campus ✦ Discover ✦ Connect ✦ Grow<p>By the students, for the students. No grades. Nothing is uploaded.</p></footer>' +
      '</div>';
  }

  function diagram() {
    function node(screen, title, text, extra) {
      return '<button type="button" class="node ' + (extra || "") + '" data-action="jump" data-screen="' + screen + '"><strong>' + title + '</strong><span>' + text + '</span></button>';
    }
    return '<div class="glance">' +
      node("character", "Character", "Who you are") +
      '<span class="flow" aria-hidden="true">↓</span>' +
      node("interests", "Interests", "What pulls you") +
      '<span class="flow" aria-hidden="true">↓</span>' +
      node("tasks", "Little tasks", "Try it for real") +
      '<span class="flow" aria-hidden="true">↓</span>' +
      '<button type="button" class="diamond" data-action="jump" data-screen="path"><span><strong>Confirmed path</strong></span></button>' +
      '<p class="loop">Not a fit, try next</p>' +
      '<p class="yes-label">Yes</p>' +
      node("peers", "Peer group", "Students on the same path", "with-badge") +
      '<div class="branch">' +
      node("paid", "Paid for", "Career paths we show") +
      node("world", "World needs", "Challenges and future") +
      '</div>' +
      '<span class="flow" aria-hidden="true">↓</span>' +
      node("industry", "Industry connect", "Coming next") +
      '</div>';
  }

  function viewLanding() {
    var resume = hasProgress()
      ? '<button type="button" class="btn ghost" data-action="resume">Continue where you left off</button>'
      : "";
    return '<section class="hero">' +
      '<p class="eyebrow">A place to become :)</p>' +
      '<h1>Find what makes you, you.</h1>' +
      '<p class="lede">Meet your people across colleges. Grow with expert guidance.</p>' +
      '<p class="meta">About 2 minutes with simulate · no sign-up · curious looks good on you</p>' +
      '<div class="hero-actions">' +
      '<button type="button" class="btn primary" data-action="start">Start the journey</button>' +
      '<button type="button" class="btn secondary" data-action="full">Simulate full journey</button>' +
      resume +
      '</div>' +
      '<p class="fine">Simulate full journey walks as Meera, a fictional second-year student. Not a real person.</p>' +
      '</section>' +
      '<section class="block">' +
      '<h2>Four steps of Ikigai</h2>' +
      '<ol class="ikigai">' +
      '<li class="tone-pink"><span>01</span><strong>What you love</strong><em>You do this. Character, then interests.</em></li>' +
      '<li class="tone-yellow"><span>02</span><strong>What you are good at</strong><em>You test it with little tasks.</em></li>' +
      '<li class="tone-blue"><span>03</span><strong>What you will be paid for</strong><em>Sapiens Campus shows the paths.</em></li>' +
      '<li class="tone-green"><span>04</span><strong>What the world needs</strong><em>Sapiens Campus shows the problems.</em></li>' +
      '</ol>' +
      '</section>' +
      '<section class="block">' +
      '<div class="section-head"><h2>The journey at a glance</h2><button type="button" class="text-btn" data-action="jump" data-screen="overview">Open the map</button></div>' +
      diagram() +
      '</section>';
  }

  function viewCharacter() {
    if (state.qIndex >= 12 && characterComplete()) return viewCharacterResult();
    var index = Math.min(state.qIndex, 11);
    var styleQ = index >= 10;
    var question = styleQ ? JOURNEY.styles[index - 10] : JOURNEY.quiz[index];
    var chosen = null;
    if (!styleQ && typeof state.answers[index] === "number") chosen = state.answers[index];
    if (styleQ && index === 10) chosen = question.options.findIndex(function (option) { return option.id === state.social; });
    if (styleQ && index === 11) chosen = question.options.findIndex(function (option) { return option.id === state.structure; });
    var options = question.options.map(function (option, optionIndex) {
      var on = chosen === optionIndex ? " is-on" : "";
      return '<button type="button" class="option' + on + '" data-action="choose" data-index="' + optionIndex + '">' +
        '<span class="tick" aria-hidden="true">' + (optionIndex + 1) + '</span><span>' + esc(option.label) + '</span></button>';
    }).join("");
    var back = index > 0 ? '<button type="button" class="text-btn" data-action="back">Back</button>' : '<span></span>';
    return '<section>' +
      '<p class="eyebrow">' + esc(phaseLabel("character")) + '</p>' +
      '<div class="title-row"><h1>' + (styleQ ? "How you like to work" : "Who you are") + '</h1>' + draftTag() + '</div>' +
      personaNote() + sampleFlag("character") + stepActions() +
      '<p class="progress">Question ' + (index + 1) + ' of 12</p>' +
      '<article class="qcard" data-draft="question">' +
      '<h2>' + esc(question.prompt) + '</h2>' +
      (question.hint ? '<p class="fine">' + esc(question.hint) + '</p>' : '') +
      '<div class="options">' + options + '</div>' +
      '</article>' +
      '<div class="row-between">' + back + '<span class="fine">Ten scenes, then two work-style questions.</span></div>' +
      '</section>';
  }

  function viewCharacterResult() {
    var types = topTypes();
    var cards = types.map(function (type, index) {
      var info = typeById(type.id);
      return '<article class="type-card tone-' + info.tone + '"><p class="kicker">' + (index === 0 ? "Closest" : "Also you") + '</p><h2>' + esc(info.name) + '</h2><p>' + esc(info.line) + '</p><p class="fine">' + esc(info.detail) + '</p></article>';
    }).join("");
    return '<section>' +
      '<p class="eyebrow">' + esc(phaseLabel("character")) + '</p>' +
      '<div class="title-row"><h1>This is your lean</h1>' + draftTag() + '</div>' +
      personaNote() + sampleFlag("character") + stepActions() +
      '<div class="type-grid">' + cards + '</div>' +
      '<article class="panel"><h2>Work style</h2><p>' + esc(styleSummary()) + '</p><p class="fine">Work style does not change the interest. It only shapes the tasks and the profile.</p></article>' +
      continueBtn("Continue to interests", "continue") +
      '<button type="button" class="text-btn review" data-action="retake">Review questions</button>' +
      '</section>';
  }

  function viewInterests() {
    var suggested = suggestions();
    var sameLoop = state.suggestOffset > 0 && leans().length <= 3;
    var note = "";
    if (state.suggestOffset > 0) {
      note = sameLoop
        ? '<p class="sample-flag">These are still your strongest leans. Keep a different pair, or restart the quiz.</p>'
        : '<p class="sample-flag">Not a fit last time. Here is the next set from your character.</p>';
    }
    var cards = suggested.map(function (id) {
      var track = trackById(id);
      var kept = state.reactions[id] === "keep";
      return '<article class="track-card' + (kept ? " is-kept" : "") + '">' +
        '<div class="title-row"><h2>' + esc(track.name) + '</h2>' + draftTag() + '</div>' +
        '<p>' + esc(track.line) + '</p>' +
        '<p class="taste"><span>30-second taste</span>' + esc(JOURNEY.tastes[id]) + '</p>' +
        '<button type="button" class="btn ' + (kept ? "primary" : "secondary") + '" data-action="keep" data-track="' + id + '">' +
        (kept ? "Kept" : "This pulls me") + '</button></article>';
    }).join("");
    var ready = state.shortlist.length >= 2 && state.shortlist.length <= 3;
    return '<section>' +
      '<p class="eyebrow">' + esc(phaseLabel("interests")) + '</p>' +
      '<div class="title-row"><h1>What pulls you</h1>' + draftTag() + '</div>' +
      '<p class="lede">From your top two character types. Keep 2 or 3.</p>' +
      personaNote() + sampleFlag("interests") + note + stepActions() +
      cards +
      '<label class="field" for="fun-note">What do you already do for fun?<textarea id="fun-note" maxlength="280" placeholder="Optional. A hobby, a habit, a rabbit hole.">' + esc(state.funNote) + '</textarea></label>' +
      '<p class="fine" data-shortlist="' + state.shortlist.length + '">' + state.shortlist.length + ' of 2 or 3 kept.</p>' +
      (ready ? continueBtn("These are my interests", "continue") : '<p class="hint">Keep two or three, then you can continue.</p>') +
      '</section>';
  }

  function viewTasks() {
    if (state.shortlist.length < 2) {
      return '<section><p class="eyebrow">' + esc(phaseLabel("tasks")) + '</p><h1>Try it for real</h1>' +
        stepActions() + '<p class="hint">Keep 2 or 3 interests first.</p>' +
        '<button type="button" class="btn secondary" data-action="jump" data-screen="interests">Back to interests</button></section>';
    }
    if (state.shortlist.indexOf(state.taskFocus) === -1) state.taskFocus = state.shortlist[0];
    var tabs = state.shortlist.map(function (id) {
      var track = trackById(id);
      var on = id === state.taskFocus;
      return '<button type="button" class="tab' + (on ? " is-on" : "") + '" data-action="tasktab" data-track="' + id + '"' +
        (on ? ' aria-selected="true"' : ' aria-selected="false"') + '>' + esc(track.name) + '</button>';
    }).join("");
    var id = state.taskFocus;
    var cards = LEVELS.map(function (levelId) {
      var level = levelById(levelId);
      var ratings = (state.ratings[id] || {})[levelId] || {};
      return '<article class="task-card" data-draft="task">' +
        '<div class="title-row"><h2>' + esc(level.name) + '</h2>' + draftTag() + '</div>' +
        '<p class="time">' + esc(level.time) + '</p>' +
        '<p>' + esc(JOURNEY.tasks[id][levelId]) + '</p>' +
        scale(id, levelId, "love", "Did you enjoy it?", ratings.love, ["Didn't", "Loved it"]) +
        scale(id, levelId, "good", "How did the result go?", ratings.good, ["Weak", "Strong"]) +
        '</article>';
    }).join("");
    var done = ratedCount();
    var total = state.shortlist.length * 3;
    return '<section>' +
      '<p class="eyebrow">' + esc(phaseLabel("tasks")) + '</p>' +
      '<div class="title-row"><h1>Try it for real</h1>' + draftTag() + '</div>' +
      '<p class="lede">The quiz only guessed. Do a small piece of the work. Taste, then Try, then Stretch.</p>' +
      personaNote() + sampleFlag("tasks") + stepActions() +
      '<p class="panel style-note">' + esc(styleLine() || "Work style shows up once the character step is done.") + '</p>' +
      '<div class="tabs" role="tablist">' + tabs + '</div>' +
      cards +
      '<p class="fine">' + done + ' of ' + total + ' tasks rated. Love 4–5 and good-at 4–5 lands in Your path.</p>' +
      (tasksComplete() ? continueBtn("See the love vs good-at map", "continue") : '<p class="hint">Rate love and good-at on every task, including the other interests.</p>') +
      '</section>';
  }

  function scale(trackId, levelId, axis, label, value, ends) {
    var buttons = [1, 2, 3, 4, 5].map(function (n) {
      var on = value === n ? " is-on" : "";
      return '<button type="button" class="scale-btn' + on + '" data-action="rate" data-track="' + trackId + '" data-level="' + levelId + '" data-axis="' + axis + '" data-value="' + n + '"' +
        (value === n ? ' aria-pressed="true"' : ' aria-pressed="false"') + '>' + n + '</button>';
    }).join("");
    return '<div class="scale"><p>' + esc(label) + '</p><div class="scale-row" role="group" aria-label="' + esc(label) + '">' + buttons + '</div><p class="scale-ends"><span>' + ends[0] + '</span><span>' + ends[1] + '</span></p></div>';
  }

  function viewPath() {
    var confirmed = liveConfirmed();
    var groups = { path: [], grow: [], useful: [], drop: [] };
    var rows = state.shortlist.map(function (id) {
      var place = placement(id);
      var track = trackById(id);
      if (!place) return "";
      groups[place.quad].push(track.name);
      return '<li data-result="' + id + '" data-quad="' + place.quad + '"><strong>' + esc(track.name) + '</strong> · ' + esc(QUADS[place.quad].title) + '</li>';
    }).join("");
    function cell(quad) {
      var names = groups[quad];
      var chips = names.length
        ? names.map(function (name) { return '<span class="chip">' + esc(name) + '</span>'; }).join("")
        : '<span class="empty">None</span>';
      return '<div class="cell quad-' + quad + '" data-quad-cell="' + quad + '"><h2>' + esc(QUADS[quad].title) + '</h2><p>' + esc(QUADS[quad].hint) + '</p>' + chips + '</div>';
    }
    var yes = confirmed
      ? '<button type="button" class="btn primary" data-action="yes">Yes, this path</button>'
      : '<p class="hint">Nothing landed in Your path. Loved it means 4 or 5. Good at it means 4 or 5.</p>';
    return '<section>' +
      '<p class="eyebrow">' + esc(phaseLabel("path")) + '</p>' +
      '<div class="title-row"><h1>Confirmed path</h1>' + draftTag() + '</div>' +
      '<p class="lede">Love is the vertical. Good-at is the horizontal. Averages of Taste, Try, and Stretch.</p>' +
      personaNote() + sampleFlag("path") + sampleFlag("tasks") + stepActions() +
      '<div class="matrix" aria-label="Love versus good at">' +
      '<div class="axis corner"></div><div class="axis">Weak at it</div><div class="axis">Good at it</div>' +
      '<div class="axis side">Loved it</div>' + cell("grow") + cell("path") +
      '<div class="axis side">Did not enjoy</div>' + cell("drop") + cell("useful") +
      '</div>' +
      '<ul class="result-list">' + rows + '</ul>' +
      (confirmed ? '<article class="panel confirm-path"><p class="kicker">Yes</p><h2>' + esc(trackById(confirmed).name) + '</h2><p>This is the strongest interest in Your path.</p></article>' : '') +
      (tasksComplete() ? '' : '<p class="hint">Rate every little task to place each interest.</p><button type="button" class="btn secondary" data-action="jump" data-screen="tasks">Back to little tasks</button>') +
      yes +
      '<button type="button" class="btn ghost" data-action="retry">Not a fit, try next</button>' +
      '</section>';
  }

  function viewProfile() {
    var types = characterComplete() ? topTypes() : [];
    var confirmed = liveConfirmed();
    var track = trackById(displayTrack());
    var strengths = state.shortlist.filter(function (id) {
      var place = placement(id);
      return place && place.good >= 4;
    }).map(function (id) { return trackById(id).name; });
    var tasks = ratedCount();
    var preview = !confirmed
      ? '<p class="sample-flag">No path confirmed yet. ' + esc(track.name) + ' is only a preview so the tour can continue.</p>'
      : '';
    return '<section>' +
      '<p class="eyebrow">' + esc(phaseLabel("profile")) + '</p>' +
      '<div class="title-row"><h1>Profile v1</h1>' + draftTag() + '</div>' +
      personaNote() + sampleFlag("profile") + preview + stepActions() +
      '<article class="profile-card">' +
      '<p class="kicker">Ikigai profile v1</p>' +
      '<h2>' + (state.persona ? esc(JOURNEY.persona.name) : "Your profile") + '</h2>' +
      '<dl>' +
      '<div><dt>Character</dt><dd>' + esc(types.map(function (type) { return typeById(type.id).name; }).join(" · ") || "Not set") + '</dd></div>' +
      '<div><dt>Work style</dt><dd>' + (characterComplete() ? esc(styleSummary()) : "Not set") + '</dd></div>' +
      '<div><dt>Confirmed interest</dt><dd>' + (confirmed ? esc(trackById(confirmed).name) : "None yet") + '</dd></div>' +
      '<div><dt>Tasks rated</dt><dd>' + tasks + '</dd></div>' +
      '<div><dt>Strengths</dt><dd>' + esc(strengths.join(", ") || "Still forming") + '</dd></div>' +
      (state.funNote ? '<div><dt>Already for fun</dt><dd>' + esc(state.funNote) + '</dd></div>' : '') +
      '</dl></article>' +
      (confirmed ? continueBtn("Join your peer group", "to-peers") : '') +
      '<button type="button" class="btn ghost" data-action="retry">Not a fit, try next</button>' +
      (!confirmed ? '<button type="button" class="btn secondary" data-action="to-peers">Continue the tour with the preview</button>' : '') +
      '</section>';
  }

  function viewPeers() {
    ensureUpTo("peers");
    var confirmed = liveConfirmed();
    var track = trackById(displayTrack());
    var href = INVITE_LINKS[track.id];
    var preview = !confirmed ? '<p class="sample-flag">Preview track, because no path is confirmed yet.</p>' : '';
    return '<section>' +
      '<p class="eyebrow">' + esc(phaseLabel("peers")) + '</p>' +
      '<div class="title-row"><h1>Peer group</h1>' + draftTag() + '</div>' +
      personaNote() + sampleFlag("peers") + preview + stepActions() +
      '<article class="invite">' +
      '<p class="pg">PG</p>' +
      '<h2>Join your ' + esc(track.name) + ' peer group</h2>' +
      '<p>Students on the same path.</p>' +
      '<a class="btn primary" href="' + esc(href) + '" target="_blank" rel="noopener noreferrer">Open the ' + esc(track.name) + ' invite</a>' +
      '<p class="fine">Placeholder link. The real WhatsApp invite is not in yet.</p>' +
      '</article>' +
      '<article class="panel"><h2>How the group lives</h2><ul class="plain"><li>A weekly challenge</li><li>A show-your-work thread</li><li>A monthly meetup at Sapiens Campus events</li></ul></article>' +
      '<p class="fine">Paid for and World needs both start from here, then meet at industry connect.</p>' +
      continueBtn("See what this path can pay", "to-paid") +
      '</section>';
  }

  function viewPaid() {
    ensureUpTo("paid");
    var confirmed = liveConfirmed();
    var track = trackById(displayTrack());
    var career = JOURNEY.careers[track.id];
    var preview = !confirmed ? '<p class="sample-flag">Preview track, because no path is confirmed yet.</p>' : '';
    return '<section>' +
      '<p class="eyebrow">' + esc(phaseLabel("paid")) + '</p>' +
      '<div class="title-row"><h1>What you will be paid for</h1>' + draftTag() + '</div>' +
      '<p class="lede">Sapiens Campus shows this for ' + esc(track.name) + '. It branches from the peer group.</p>' +
      '<p class="sample-flag">Sample, to be researched. This draft does not include pay figures.</p>' +
      personaNote() + sampleFlag("paid") + preview + stepActions() +
      '<article class="panel" data-draft="career"><div class="title-row"><h2>Roles</h2>' + draftTag() + '</div><ol class="ladder">' +
      career.roles.map(function (role, index) {
        var stage = ["Entry", "Mid", "Senior"][index] || "Path";
        return '<li><span>' + stage + '</span>' + esc(role) + '</li>';
      }).join("") + '</ol></article>' +
      '<article class="panel" data-draft="career"><div class="title-row"><h2>How people get there</h2>' + draftTag() + '</div><ul class="plain">' +
      career.how.map(function (item) { return '<li>' + esc(item) + '</li>'; }).join("") + '</ul></article>' +
      '<article class="panel" data-draft="career"><div class="title-row"><h2>Skill ladder</h2>' + draftTag() + '</div><ol class="ladder">' +
      career.ladder.map(function (item) { return '<li><span>' + esc(item[0]) + '</span>' + esc(item[1]) + '</li>'; }).join("") + '</ol></article>' +
      '<article class="panel" data-draft="career"><div class="title-row"><h2>Ways to earn early</h2>' + draftTag() + '</div><ul class="plain">' +
      career.early.map(function (item) { return '<li>' + esc(item) + '</li>'; }).join("") + '</ul></article>' +
      continueBtn("See what the world needs", "to-world") +
      '</section>';
  }

  function viewWorld() {
    ensureUpTo("world");
    var confirmed = liveConfirmed();
    var track = trackById(displayTrack());
    var world = JOURNEY.world[track.id];
    var preview = !confirmed ? '<p class="sample-flag">Preview track, because no path is confirmed yet.</p>' : '';
    return '<section>' +
      '<p class="eyebrow">' + esc(phaseLabel("world")) + '</p>' +
      '<div class="title-row"><h1>What the world needs</h1>' + draftTag() + '</div>' +
      '<p class="lede">Sapiens Campus shows this for ' + esc(track.name) + '. It branches from the peer group and meets Paid for at industry connect.</p>' +
      '<p class="sample-flag">Sample, to be researched.</p>' +
      personaNote() + sampleFlag("world") + preview + stepActions() +
      '<article class="panel" data-draft="world"><div class="title-row"><h2>Challenges</h2>' + draftTag() + '</div><ul class="plain">' +
      world.challenges.map(function (item) { return '<li>' + esc(item) + '</li>'; }).join("") + '</ul></article>' +
      '<article class="panel" data-draft="world"><div class="title-row"><h2>Someone who walked it</h2>' + draftTag() + '</div><p class="sample-flag">Sample story, to be researched. Not a real person.</p><p>' + esc(JOURNEY.story) + '</p></article>' +
      '<article class="panel" data-draft="world"><div class="title-row"><h2>Coming in the next few years</h2>' + draftTag() + '</div><ul class="plain">' +
      world.coming.map(function (item) { return '<li>' + esc(item) + '</li>'; }).join("") + '</ul><h3>What is fading</h3><ul class="plain">' +
      world.fading.map(function (item) { return '<li>' + esc(item) + '</li>'; }).join("") + '</ul></article>' +
      '<article class="panel" data-draft="world"><div class="title-row"><h2>Problem of the month</h2>' + draftTag() + '</div><p>' + esc(world.problem) + '</p></article>' +
      continueBtn("Industry connect", "to-industry") +
      '</section>';
  }

  function viewIndustry() {
    ensureUpTo("industry");
    return '<section>' +
      '<p class="eyebrow">' + esc(phaseLabel("industry")) + '</p>' +
      '<div class="title-row"><h1>Industry connect</h1><span class="soon">Coming next</span></div>' +
      '<p class="lede">Paid for and World needs meet here. Sapiens Campus will open this. It is not live in the draft.</p>' +
      personaNote() + sampleFlag("industry") +
      '<div class="step-actions"><button type="button" class="btn ghost" data-action="skip">Skip to the map</button><button type="button" class="btn ghost" data-action="simulate">Simulate</button></div>' +
      '<ol class="soon-list">' +
      '<li><strong>Expert talks</strong><span>A monthly ask-me-anything. Coming next.</span></li>' +
      '<li><strong>Mentor office hours</strong><span>Short slots with people in the work. Coming next.</span></li>' +
      '<li><strong>Live briefs</strong><span>Real projects, when the partners are ready. Coming next.</span></li>' +
      '<li><strong>Internships and referrals</strong><span>Introductions, not a promise. Coming next.</span></li>' +
      '</ol>' +
      '<button type="button" class="btn secondary" data-action="jump" data-screen="overview">Back to the journey map</button>' +
      '</section>';
  }

  function viewOverview() {
    var items = STAGES.map(function (stage) {
      return '<li><button type="button" data-action="jump" data-screen="' + stage.id + '"><strong>' + esc(stage.name) + '</strong><span>' + esc(stage.node) + '</span></button></li>';
    }).join("");
    return '<section>' +
      '<p class="eyebrow">Step jumper</p>' +
      '<h1>The journey at a glance</h1>' +
      '<p class="lede">Open any stage. Saved answers stay saved. Empty stages get a marked sample so the screen can render.</p>' +
      personaNote() +
      '<div class="hero-actions">' +
      '<button type="button" class="btn primary" data-action="full">Simulate full journey</button>' +
      '<button type="button" class="btn ghost" data-action="restart">Restart</button>' +
      '</div>' +
      diagram() +
      '<ol class="jump-list">' + items + '</ol>' +
      '</section>';
  }

  function view() {
    if (state.screen === "character") return viewCharacter();
    if (state.screen === "interests") return viewInterests();
    if (state.screen === "tasks") return viewTasks();
    if (state.screen === "path") return viewPath();
    if (state.screen === "profile") return viewProfile();
    if (state.screen === "peers") return viewPeers();
    if (state.screen === "paid") return viewPaid();
    if (state.screen === "world") return viewWorld();
    if (state.screen === "industry") return viewIndustry();
    if (state.screen === "overview") return viewOverview();
    return viewLanding();
  }

  function render() {
    var app = document.getElementById("app");
    if (!app) return;
    var before = JSON.stringify(state);
    if (state.screen === "interests" && !characterComplete()) applyPersonaCharacter(true);
    if (["tasks", "path", "profile", "peers", "paid", "world", "industry"].indexOf(state.screen) !== -1) ensureUpTo(state.screen);
    if (JSON.stringify(state) !== before) save();
    app.innerHTML = shell(view());
  }

  function onClick(event) {
    var target = event.target.closest("[data-action]");
    if (!target || !document.getElementById("app").contains(target)) return;
    var action = target.getAttribute("data-action");
    if (action === "start") {
      state.qIndex = characterComplete() ? 12 : state.qIndex;
      go("character");
    } else if (action === "home") {
      go("landing");
    } else if (action === "restart") {
      restart();
    } else if (action === "resume") {
      var dest = state.resume && state.resume !== "landing" ? state.resume : "character";
      jump(dest);
    } else if (action === "full") {
      fullJourney();
    } else if (action === "skip") {
      skip();
    } else if (action === "simulate") {
      simulate();
    } else if (action === "jump") {
      jump(target.getAttribute("data-screen"));
    } else if (action === "choose") {
      choose(Number(target.getAttribute("data-index")));
    } else if (action === "back") {
      if (state.qIndex > 0) state.qIndex -= 1;
    } else if (action === "retake") {
      state.qIndex = 0;
      state.sampleSteps.character = false;
      state.persona = false;
    } else if (action === "keep") {
      var id = target.getAttribute("data-track");
      if (state.reactions[id] === "keep") delete state.reactions[id];
      else state.reactions[id] = "keep";
      syncShortlist();
      state.sampleSteps.interests = false;
      state.persona = false;
    } else if (action === "rate") {
      var trackId = target.getAttribute("data-track");
      var level = target.getAttribute("data-level");
      var axis = target.getAttribute("data-axis");
      var value = Number(target.getAttribute("data-value"));
      if (!state.ratings[trackId]) state.ratings[trackId] = {};
      if (!state.ratings[trackId][level]) state.ratings[trackId][level] = {};
      state.ratings[trackId][level][axis] = value;
      state.sampleSteps.tasks = false;
      state.sampleSteps.path = false;
      state.persona = false;
    } else if (action === "tasktab") {
      state.taskFocus = target.getAttribute("data-track");
    } else if (action === "continue") {
      if (state.screen === "character" && characterComplete()) go("interests");
      else if (state.screen === "interests" && state.shortlist.length >= 2) go("tasks");
      else if (state.screen === "tasks" && tasksComplete()) go("path");
    } else if (action === "yes" || action === "to-peers") {
      ensureUpTo("peers");
      go("peers");
    } else if (action === "to-paid") {
      go("paid");
    } else if (action === "to-world") {
      go("world");
    } else if (action === "to-industry") {
      go("industry");
    } else if (action === "retry") {
      retryInterests();
    } else {
      return;
    }
    save();
    render();
  }

  function onInput(event) {
    if (event.target.id !== "fun-note") return;
    state.funNote = event.target.value.slice(0, 280);
    state.sampleSteps.interests = false;
    save();
  }

  document.addEventListener("click", onClick);
  document.addEventListener("input", onInput);
  render();
})();
