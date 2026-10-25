(function () {
  var STORAGE_KEY = "beyondcampus.presenter.v1";
  var ORDER = ["intro", "character", "interests", "tasks", "path", "profile", "peers", "paid", "world", "industry", "summary"];
  var LEVELS = ["taste", "try", "stretch"];
  var QUADS = {
    path: { title: "Your path", hint: "Loved it, and it went well." },
    grow: { title: "Grow this skill", hint: "Loved it. The skill can catch up." },
    useful: { title: "Useful, not a passion", hint: "Can do it. It does not pull her." },
    drop: { title: "Let it go", hint: "Did not love it, and it did not click." }
  };

  var state = load();

  function fresh() {
    return {
      slide: "intro",
      tryMode: false,
      focus: "tech",
      self: {
        qIndex: 0,
        answers: [],
        social: null,
        structure: null,
        offset: 0,
        reactions: {},
        funNote: "",
        ratings: {}
      }
    };
  }

  function load() {
    var next = fresh();
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return next;
      var data = JSON.parse(raw);
      if (!data || typeof data !== "object") return next;
      if (ORDER.indexOf(data.slide) !== -1) next.slide = data.slide;
      next.tryMode = data.tryMode === true;
      if (typeof data.focus === "string") next.focus = data.focus;
      if (data.self && typeof data.self === "object") {
        var self = data.self;
        if (typeof self.qIndex === "number") next.self.qIndex = Math.max(0, Math.min(12, self.qIndex));
        if (Array.isArray(self.answers)) next.self.answers = self.answers.slice(0, 10);
        if (self.social === "solo" || self.social === "team") next.self.social = self.social;
        if (self.structure === "structure" || self.structure === "freedom") next.self.structure = self.structure;
        if (typeof self.offset === "number") next.self.offset = self.offset;
        if (self.reactions && typeof self.reactions === "object") next.self.reactions = self.reactions;
        if (typeof self.funNote === "string") next.self.funNote = self.funNote.slice(0, 280);
        if (self.ratings && typeof self.ratings === "object") next.self.ratings = self.ratings;
      }
    } catch (err) {
      return fresh();
    }
    return next;
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      /* This browser may block storage. The slide still moves. */
    }
  }

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function slideCopy(id) {
    return PRESENTER.slides.filter(function (slide) { return slide.id === id; })[0];
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

  function topTypes(answers) {
    var scores = {};
    JOURNEY.characters.forEach(function (type) { scores[type.id] = 0; });
    (answers || []).forEach(function (choice, index) {
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

  function suggestions(answers, offset) {
    var ids = [];
    topTypes(answers).forEach(function (type) {
      typeById(type.id).tracks.forEach(function (id) {
        if (ids.indexOf(id) === -1) ids.push(id);
      });
    });
    if (!ids.length) return [];
    var start = (offset || 0) % ids.length;
    var out = [];
    var i;
    for (i = 0; i < ids.length && out.length < 3; i += 1) out.push(ids[(start + i) % ids.length]);
    return out;
  }

  function cellOk(cell) {
    return cell && cell.love >= 1 && cell.love <= 5 && cell.good >= 1 && cell.good <= 5;
  }

  function placement(ratings, id) {
    var bag = (ratings || {})[id];
    if (!bag) return null;
    var love = 0;
    var good = 0;
    var count = 0;
    LEVELS.forEach(function (level) {
      if (!cellOk(bag[level])) return;
      love += bag[level].love;
      good += bag[level].good;
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

  function confirmedId(model) {
    var best = null;
    model.shortlist.forEach(function (id) {
      var place = placement(model.ratings, id);
      if (!place || place.quad !== "path") return;
      var score = place.love + place.good;
      if (!best || score > best.score) best = { id: id, score: score };
    });
    return best ? best.id : null;
  }

  function tasksDone(model) {
    if (model.shortlist.length < 2) return false;
    return model.shortlist.every(function (id) {
      var bag = model.ratings[id] || {};
      return LEVELS.every(function (level) { return cellOk(bag[level]); });
    });
  }

  function meera() {
    var answers = JOURNEY.persona.answers.slice();
    var suggested = suggestions(answers, 0);
    var reactions = {};
    suggested.forEach(function (id) { reactions[id] = "keep"; });
    return {
      sample: true,
      you: false,
      answers: answers,
      social: JOURNEY.persona.social,
      structure: JOURNEY.persona.structure,
      characterDone: true,
      qIndex: 12,
      suggested: suggested,
      reactions: reactions,
      shortlist: suggested.slice(),
      funNote: JOURNEY.persona.funNote,
      ratings: JOURNEY.persona.ratings
    };
  }

  function yours() {
    var self = state.self;
    var done = self.answers.length >= 10 && self.social && self.structure;
    var suggested = done ? suggestions(self.answers, self.offset) : [];
    var shortlist = suggested.filter(function (id) { return self.reactions[id] === "keep"; });
    return {
      sample: false,
      you: true,
      answers: self.answers,
      social: self.social,
      structure: self.structure,
      characterDone: !!done,
      qIndex: self.qIndex,
      suggested: suggested,
      reactions: self.reactions,
      shortlist: shortlist,
      funNote: self.funNote,
      ratings: self.ratings
    };
  }

  function model() {
    return state.tryMode ? yours() : meera();
  }

  function focusTrack(current) {
    if (current.shortlist.indexOf(state.focus) !== -1) return state.focus;
    return confirmedId(current) || current.shortlist[0] || "";
  }

  function styleSentence(current) {
    if (!current.social || !current.structure) return "";
    var person = current.you ? "You" : "She";
    var share = current.social === "team"
      ? person + " would share the result with one person."
      : person + " can do this alone.";
    var plan = current.structure === "freedom"
      ? " The brief can change if a better version shows up."
      : " The brief stays as written.";
    return share + plan;
  }

  function mark(love, good) {
    var loved = love >= 4 ? "Loved it" : "Did not love it";
    var skilled = good >= 4 ? "it went well" : "still learning";
    return loved + ", " + skilled + ".";
  }

  function go(id) {
    if (ORDER.indexOf(id) === -1) return;
    state.slide = id;
  }

  function step(delta) {
    var index = ORDER.indexOf(state.slide);
    var next = index + delta;
    if (next < 0 || next >= ORDER.length) return;
    state.slide = ORDER[next];
  }

  function draftTag() {
    return '<span class="tag">Draft</span>';
  }

  function phoneIntro() {
    return '<div class="splash">' +
      '<p class="eyebrow">Your path</p>' +
      '<h2>Find what makes you, you.</h2>' +
      '<ol class="four">' +
      '<li class="wash-love"><span>1</span><strong>What you love</strong><em>Character, then the interests that pull you.</em></li>' +
      '<li class="wash-good"><span>2</span><strong>What you are good at</strong><em>Little tasks, then a clear place for each interest.</em></li>' +
      '<li class="wash-paid"><span>3</span><strong>What you will be paid for</strong><em>Sapiens Campus shows the roles.</em></li>' +
      '<li class="wash-world"><span>4</span><strong>What the world needs</strong><em>Sapiens Campus shows the problems.</em></li>' +
      '</ol></div>';
  }

  function phoneCharacter(current) {
    if (current.you && !current.characterDone) return phoneQuiz(current);
    var types = topTypes(current.answers);
    var cards = types.map(function (type, index) {
      var info = typeById(type.id);
      return '<article class="wash-' + info.tone + ' type">' +
        '<p class="eyebrow">' + (index === 0 ? "Closest" : "Also you") + '</p>' +
        '<h2>' + esc(info.name) + '</h2>' +
        '<p>' + esc(info.line) + '</p>' +
        '<p class="quiet">' + esc(info.detail) + '</p></article>';
    }).join("");
    var social = current.social === "team" ? "With a few people" : "Mostly alone";
    var structure = current.structure === "freedom" ? "Room to wander" : "A clear plan";
    var again = current.you ? '<button type="button" class="text" data-action="retake">Answer again</button>' : "";
    return '<div class="stack"><p class="eyebrow">Who you are</p>' + cards +
      '<article class="plain-card"><h2>How you like to work</h2><p>' + esc(social) + '</p><p>' + esc(structure) + '</p>' +
      '<p class="quiet">Work style does not change the interest.</p></article>' + again + '</div>';
  }

  function phoneQuiz(current) {
    var index = Math.max(0, Math.min(current.qIndex, 11));
    var styleQ = index >= 10;
    var question = styleQ ? JOURNEY.styles[index - 10] : JOURNEY.quiz[index];
    var options = question.options.map(function (option, optionIndex) {
      return '<button type="button" class="choice" data-action="choose" data-index="' + optionIndex + '">' + esc(option.label) + '</button>';
    }).join("");
    var back = index > 0 ? '<button type="button" class="text" data-action="scene-back">Previous scene</button>' : "";
    return '<div class="stack"><div class="row"><p class="eyebrow">Scene ' + (index + 1) + ' of 12</p>' + draftTag() + '</div>' +
      '<h2>' + esc(question.prompt) + '</h2>' +
      (question.hint ? '<p class="quiet">' + esc(question.hint) + '</p>' : '') +
      '<div class="choices">' + options + '</div>' + back + '</div>';
  }

  function phoneInterests(current) {
    if (current.you && !current.characterDone) {
      return needFirst("Answer the character scenes first.", "character");
    }
    var cards = current.suggested.map(function (id) {
      var track = trackById(id);
      var kept = current.reactions[id] === "keep";
      var control = current.you
        ? '<button type="button" class="choice' + (kept ? " is-on" : "") + '" data-action="keep" data-track="' + id + '">' + (kept ? "Kept" : "This pulls me") + '</button>'
        : '<p class="kept">' + (kept ? "Kept" : "Not kept") + '</p>';
      return '<article class="plain-card' + (kept ? " is-kept" : "") + '"><h2>' + esc(track.name) + '</h2><p>' + esc(track.line) + '</p>' +
        '<p class="taste"><span>Thirty-second taste</span>' + esc(JOURNEY.tastes[id]) + '</p>' + control + '</article>';
    }).join("");
    var note = current.funNote ? '<p class="quiet">Already for fun: ' + esc(current.funNote) + '</p>' : "";
    var field = current.you
      ? '<label class="field">Already for fun?<textarea id="fun-note" maxlength="280" placeholder="Optional.">' + esc(current.funNote) + '</textarea></label>'
      : note;
    var count = current.you ? '<p class="quiet">' + current.shortlist.length + ' of 2 or 3 kept.</p>' : "";
    return '<div class="stack"><p class="eyebrow">What pulls you</p><h2>Keep two or three.</h2>' + cards + field + count + '</div>';
  }

  function phoneTasks(current) {
    if (current.you && current.shortlist.length < 2) {
      return needFirst("Keep two or three interests first.", "interests");
    }
    var id = focusTrack(current);
    if (!id) return needFirst("Keep two or three interests first.", "interests");
    var tabs = current.shortlist.map(function (trackId) {
      var on = trackId === id;
      return '<button type="button" class="chip' + (on ? " is-on" : "") + '" data-action="focus" data-track="' + trackId + '">' + esc(trackById(trackId).name) + '</button>';
    }).join("");
    var rows = LEVELS.map(function (levelId) {
      var level = levelById(levelId);
      var cell = ((current.ratings[id] || {})[levelId]) || {};
      var scales = current.you ? scale(id, levelId, "love", "Did you love it?", cell.love) + scale(id, levelId, "good", "Did it go well?", cell.good) : '<p class="score">' + (cellOk(cell) ? esc(mark(cell.love, cell.good)) : "Not rated yet.") + '</p>';
      return '<article class="plain-card"><div class="row"><h2>' + esc(level.name) + '</h2>' + draftTag() + '</div>' +
        '<p class="quiet">' + esc(level.time) + '</p><p>' + esc(JOURNEY.tasks[id][levelId]) + '</p>' + scales + '</article>';
    }).join("");
    var style = styleSentence(current);
    return '<div class="stack"><p class="eyebrow">Try it for real</p><div class="chips">' + tabs + '</div>' +
      (style ? '<p class="quiet">' + esc(style) + '</p>' : '') + rows + '</div>';
  }

  function scale(trackId, levelId, axis, label, value) {
    var buttons = [1, 2, 3, 4, 5].map(function (n) {
      var on = value === n;
      return '<button type="button" class="num' + (on ? " is-on" : "") + '" data-action="rate" data-track="' + trackId + '" data-level="' + levelId + '" data-axis="' + axis + '" data-value="' + n + '" aria-pressed="' + (on ? "true" : "false") + '">' + n + '</button>';
    }).join("");
    return '<div class="scale"><p>' + esc(label) + '</p><div class="nums">' + buttons + '</div></div>';
  }

  function phonePath(current) {
    if (!tasksDone(current)) return needFirst("Rate the little tasks to place each interest.", "tasks");
    var groups = { path: [], grow: [], useful: [], drop: [] };
    current.shortlist.forEach(function (id) {
      var place = placement(current.ratings, id);
      if (place) groups[place.quad].push(trackById(id).name);
    });
    function cell(quad) {
      var names = groups[quad].map(function (name) { return '<em>' + esc(name) + '</em>'; }).join("");
      return '<div class="place place-' + quad + '" data-quad="' + quad + '"><strong>' + esc(QUADS[quad].title) + '</strong><span>' + esc(current.you ? QUADS[quad].hint.replace("her", "you") : QUADS[quad].hint) + '</span>' + (names || '<span class="quiet">None</span>') + '</div>';
    }
    var confirmed = confirmedId(current);
    var line = confirmed
      ? '<p class="call">' + esc(trackById(confirmed).name) + ' is the path.</p>'
      : '<p class="call">Nothing landed as a path.</p>';
    var retry = current.you ? '<button type="button" class="choice" data-action="retry">Not a fit, try the next interests</button>' : '<p class="quiet">If nothing lands as a path, she goes back to interests.</p>';
    return '<div class="stack"><p class="eyebrow">Where it landed</p>' + line +
      '<div class="places">' + cell("grow") + cell("path") + cell("drop") + cell("useful") + '</div>' + retry + '</div>';
  }

  function phoneProfile(current) {
    if (!current.characterDone) return needFirst("Answer the character scenes first.", "character");
    var confirmed = confirmedId(current);
    var types = topTypes(current.answers).map(function (type) { return typeById(type.id).name; }).join(" · ");
    var strengths = current.shortlist.filter(function (id) {
      var place = placement(current.ratings, id);
      return place && place.good >= 4;
    }).map(function (id) { return trackById(id).name; });
    var rated = 0;
    current.shortlist.forEach(function (id) {
      var bag = current.ratings[id] || {};
      LEVELS.forEach(function (level) { if (cellOk(bag[level])) rated += 1; });
    });
    return '<article class="profile"><p class="eyebrow">Profile v1</p><h2>' + (current.you ? "Your card" : esc(JOURNEY.persona.name)) + '</h2>' +
      row("Character", types || "Not yet") +
      row("Work style", current.social ? (current.social === "team" ? "With people" : "Alone") + " · " + (current.structure === "freedom" ? "Freedom" : "A plan") : "Not yet") +
      row("Confirmed path", confirmed ? trackById(confirmed).name : "None yet") +
      row("Tasks rated", String(rated)) +
      row("Already strong", strengths.join(", ") || "Still forming") +
      '</article>';
  }

  function row(label, value) {
    return '<p class="fact"><span>' + esc(label) + '</span>' + esc(value) + '</p>';
  }

  function phonePeers(current) {
    var confirmed = confirmedId(current);
    if (!confirmed) return needFirst("Confirm a path to open the group.", "path");
    var track = trackById(confirmed);
    return '<div class="stack"><p class="pg">PG</p><p class="eyebrow">Students on the same path</p>' +
      '<h2>The ' + esc(track.name) + ' group</h2>' +
      '<ul class="bullets"><li>A weekly challenge</li><li>A place to show work</li><li>A monthly meetup</li></ul>' +
      '<a class="join" href="' + esc(INVITE_LINKS[track.id]) + '" target="_blank" rel="noopener noreferrer">Open the ' + esc(track.name) + ' invite</a>' +
      '<p class="quiet">Placeholder. The real WhatsApp invite is not in yet.</p></div>';
  }

  function phonePaid(current) {
    var confirmed = confirmedId(current);
    if (!confirmed) return needFirst("Confirm a path to see the career picture.", "path");
    var track = trackById(confirmed);
    var career = JOURNEY.careers[track.id];
    return '<div class="stack"><p class="eyebrow">' + esc(track.name) + '</p><h2>Roles on this path</h2>' +
      '<p class="sample-line">Sample, to be researched. No pay figures in this draft.</p>' +
      '<ol class="ladder">' + career.roles.map(function (role, index) {
        return '<li><span>' + ["Starting", "Further in", "Later"][index] + '</span>' + esc(role) + '</li>';
      }).join("") + '</ol>' +
      '<h2>How people get there</h2><ul class="bullets">' + career.how.map(function (item) { return '<li>' + esc(item) + '</li>'; }).join("") + '</ul>' +
      '<h2>This semester, this year, before graduating</h2><ol class="ladder">' + career.ladder.map(function (item) {
        return '<li><span>' + esc(item[0]) + '</span>' + esc(item[1]) + '</li>';
      }).join("") + '</ol>' +
      '<h2>Ways to start</h2><ul class="bullets">' + career.early.map(function (item) { return '<li>' + esc(item) + '</li>'; }).join("") + '</ul></div>';
  }

  function phoneWorld(current) {
    var confirmed = confirmedId(current);
    if (!confirmed) return needFirst("Confirm a path to see the problems.", "path");
    var track = trackById(confirmed);
    var world = JOURNEY.world[track.id];
    return '<div class="stack"><p class="eyebrow">' + esc(track.name) + '</p><h2>Problems on this path</h2>' +
      '<p class="sample-line">Sample, to be researched.</p>' +
      '<ul class="bullets">' + world.challenges.map(function (item) { return '<li>' + esc(item) + '</li>'; }).join("") + '</ul>' +
      '<h2>Someone who walked it</h2><p class="sample-line">Sample story, to be researched. Not a real person.</p><p>' + esc(JOURNEY.story) + '</p>' +
      '<h2>Coming</h2><ul class="bullets">' + world.coming.map(function (item) { return '<li>' + esc(item) + '</li>'; }).join("") + '</ul>' +
      '<h2>Fading</h2><ul class="bullets">' + world.fading.map(function (item) { return '<li>' + esc(item) + '</li>'; }).join("") + '</ul>' +
      '<h2>Problem of the month</h2><p>' + esc(world.problem) + '</p></div>';
  }

  function phoneIndustry() {
    var items = [
      ["Expert talks", "A monthly conversation. Coming next."],
      ["Mentor hours", "Short time with people in the work. Coming next."],
      ["Live briefs", "Real projects, when a partner is ready. Coming next."],
      ["Internships", "Introductions, not a promise. Coming next."]
    ];
    return '<div class="stack"><p class="soon">Coming next</p><h2>People who do the work</h2><p>Paid for and world needs meet here.</p>' +
      items.map(function (item) {
        return '<article class="plain-card"><h2>' + item[0] + '</h2><p class="quiet">' + item[1] + '</p></article>';
      }).join("") + '</div>';
  }

  function phoneSummary(current) {
    if (current.you && !confirmedId(current)) {
      return '<div class="stack"><p class="eyebrow">Your try</p><h2>Still in progress.</h2><p>Finish the earlier slides to see your own card. The notes stay with Meera.</p></div>';
    }
    var confirmed = confirmedId(current);
    var types = topTypes(current.answers).map(function (type) { return typeById(type.id).name; }).join(" and ");
    var kept = current.shortlist.map(function (id) { return trackById(id).name; }).join(", ");
    var pathName = confirmed ? trackById(confirmed).name : "None yet";
    return '<div class="stack"><p class="eyebrow">' + (current.you ? "Your try" : "Her path") + '</p><h2>' + esc(pathName) + '</h2><ol class="recap">' +
      '<li><span>Character</span>' + esc(types) + '</li>' +
      '<li><span>Kept</span>' + esc(kept || "None yet") + '</li>' +
      '<li><span>Path</span>' + esc(pathName) + '</li>' +
      '<li><span>Peers</span>' + esc(confirmed ? pathName + " group" : "Waiting on a path") + '</li>' +
      '<li><span>Campus</span>Sample careers and sample problems</li>' +
      '<li><span>Industry</span>Coming next</li></ol></div>';
  }

  function needFirst(text, slide) {
    return '<div class="stack"><p class="eyebrow">Not there yet</p><h2>' + esc(text) + '</h2>' +
      '<button type="button" class="choice" data-action="go" data-slide="' + slide + '">Go to that slide</button></div>';
  }

  function phone(current) {
    var id = state.slide;
    if (id === "intro") return phoneIntro();
    if (id === "character") return phoneCharacter(current);
    if (id === "interests") return phoneInterests(current);
    if (id === "tasks") return phoneTasks(current);
    if (id === "path") return phonePath(current);
    if (id === "profile") return phoneProfile(current);
    if (id === "peers") return phonePeers(current);
    if (id === "paid") return phonePaid(current);
    if (id === "world") return phoneWorld(current);
    if (id === "industry") return phoneIndustry();
    return phoneSummary(current);
  }

  function map() {
    function button(id) {
      var on = state.slide === id;
      return '<button type="button" data-action="go" data-slide="' + id + '"' + (on ? ' class="is-on" aria-current="step"' : "") + '>' + esc(PRESENTER.labels[id]) + '</button>';
    }
    var groups = PRESENTER.groups.map(function (group) {
      return '<li class="group tone-' + group.tone + '"><p><span>' + esc(group.kicker) + '</span><em>' + esc(group.who) + '</em></p><div>' +
        group.slides.map(button).join("") + '</div></li>';
    }).join("");
    return '<nav class="map" aria-label="Journey map"><p class="legend">Student drives steps 1 and 2. Sapiens Campus provides steps 3 and 4. No fit returns to interests. Paid for and world needs meet at industry connect.</p>' +
      '<div class="map-row">' + button("intro") + '<ol>' + groups + '</ol>' + button("summary") + '</div></nav>';
  }

  function narration() {
    var copy = slideCopy(state.slide);
    var who = copy.who.map(function (name) {
      var tone = name === "Sapiens Campus" ? "campus" : name.toLowerCase();
      return '<span class="who who-' + tone + '">' + esc(name) + '</span>';
    }).join("");
    return '<article class="narration"><p class="kicker">' + esc(copy.kicker) + '</p><h1>' + esc(copy.title) + '</h1>' +
      '<p class="happening">' + esc(copy.happening) + '</p><dl>' +
      '<div><dt>Why it matters</dt><dd>' + esc(copy.why) + '</dd></div>' +
      '<div><dt>Who drives it</dt><dd>' + who + '</dd></div>' +
      '<div><dt>Output</dt><dd>' + esc(copy.output) + '</dd></div></dl></article>';
  }

  function render() {
    var root = document.getElementById("app");
    if (!root) return;
    var current = model();
    var index = ORDER.indexOf(state.slide);
    var label = state.tryMode ? "Your try · this browser only" : "Meera · fictional sample student";
    root.innerHTML = '<p class="draft-strip" role="status">Draft mock for core-team review. Questions, tasks and content are drafts.</p>' +
      '<div class="frame">' +
      '<header class="topbar"><div class="brand"><button type="button" data-action="go" data-slide="intro">BeyondCampus</button><p>Sapiens Campus</p></div>' +
      '<button type="button" class="switch' + (state.tryMode ? " is-on" : "") + '" data-action="try" aria-pressed="' + (state.tryMode ? "true" : "false") + '"><span></span>Try it yourself</button></header>' +
      map() +
      '<main class="stage" data-slide="' + esc(state.slide) + '">' +
      '<div class="device"><p class="mock-label">' + esc(label) + '</p><div class="handset"><div class="screen">' + phone(current) + '</div></div></div>' +
      narration() +
      '</main></div>' +
      '<div class="dock"><button type="button" data-action="back"' + (index === 0 ? " disabled" : "") + '>Back</button>' +
      '<p>' + (index + 1) + ' of ' + ORDER.length + '<span>Arrow keys</span></p>' +
      '<button type="button" class="next" data-action="next"' + (index === ORDER.length - 1 ? " disabled" : "") + '>Next</button></div>';
  }

  function onClick(event) {
    var target = event.target.closest("[data-action]");
    if (!target || !document.getElementById("app").contains(target)) return;
    if (target.disabled) return;
    var action = target.getAttribute("data-action");
    if (action === "next") step(1);
    else if (action === "back") step(-1);
    else if (action === "go") go(target.getAttribute("data-slide"));
    else if (action === "try") state.tryMode = !state.tryMode;
    else if (action === "choose" && state.tryMode) {
      var pick = Number(target.getAttribute("data-index"));
      if (state.self.qIndex < 10) state.self.answers[state.self.qIndex] = pick;
      else if (state.self.qIndex === 10) state.self.social = JOURNEY.styles[0].options[pick].id;
      else if (state.self.qIndex === 11) state.self.structure = JOURNEY.styles[1].options[pick].id;
      if (state.self.qIndex < 12) state.self.qIndex += 1;
    } else if (action === "scene-back" && state.tryMode && state.self.qIndex > 0) {
      state.self.qIndex -= 1;
    } else if (action === "retake" && state.tryMode) {
      state.self.qIndex = 0;
      state.self.answers = [];
      state.self.social = null;
      state.self.structure = null;
    } else if (action === "keep" && state.tryMode) {
      var id = target.getAttribute("data-track");
      if (state.self.reactions[id] === "keep") delete state.self.reactions[id];
      else state.self.reactions[id] = "keep";
    } else if (action === "focus") {
      state.focus = target.getAttribute("data-track");
    } else if (action === "rate" && state.tryMode) {
      var trackId = target.getAttribute("data-track");
      var level = target.getAttribute("data-level");
      var axis = target.getAttribute("data-axis");
      if (!state.self.ratings[trackId]) state.self.ratings[trackId] = {};
      if (!state.self.ratings[trackId][level]) state.self.ratings[trackId][level] = {};
      state.self.ratings[trackId][level][axis] = Number(target.getAttribute("data-value"));
    } else if (action === "retry" && state.tryMode) {
      state.self.offset += 3;
      state.self.reactions = {};
      state.self.ratings = {};
      state.slide = "interests";
    } else return;
    save();
    render();
  }

  function onInput(event) {
    if (event.target.id !== "fun-note" || !state.tryMode) return;
    state.self.funNote = event.target.value.slice(0, 280);
    save();
  }

  function onKey(event) {
    if (event.repeat || event.altKey || event.metaKey || event.ctrlKey) return;
    var tag = event.target && event.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    } else return;
    save();
    render();
  }

  document.addEventListener("click", onClick);
  document.addEventListener("input", onInput);
  document.addEventListener("keydown", onKey);
  render();
})();
