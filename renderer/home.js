(function () {
  'use strict';
  const api = window.volyxHome;
  const list = document.getElementById('home-list');
  const startBtn = document.getElementById('home-start');
  const startLabel = document.getElementById('home-start-label');
  const search = document.getElementById('home-search');
  let sessions = [];

  function startOfDay(ms) { const d = new Date(ms); d.setHours(0, 0, 0, 0); return d.getTime(); }
  function dayLabel(ms) {
    if (!Number.isFinite(ms)) return 'Earlier';
    const today = startOfDay(Date.now());
    const day = startOfDay(ms);
    if (day === today) return 'Today';
    if (day === today - 864e5) return 'Yesterday';
    return new Date(ms).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
  function clock(ms) {
    if (!Number.isFinite(ms)) return '';
    return new Date(ms).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).replace(' ', '').toLowerCase();
  }
  function duration(s) {
    const ms = Number(s.endedAt) - Number(s.startedAt);
    if (!Number.isFinite(ms) || ms <= 0) return '0:00';
    const t = Math.round(ms / 1000);
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const sec = String(t % 60).padStart(2, '0');
    return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`;
  }
  function title(s) {
    const first = (text) => String(text || '').split(/\n|(?<=[.!?])\s/)[0].trim();
    const value = first(s.title) || first(s.notesSummary) || (s.participant ? `Call with ${s.participant}` : '') || first(s.previewCleaned || s.preview);
    return (value.length > 90 ? `${value.slice(0, 89)}…` : value) || 'Untitled session';
  }

  function render() {
    const query = search.value.trim().toLowerCase();
    const shown = query
      ? sessions.filter((s) => [title(s), s.preview, s.notesSummary, s.participant].join(' ').toLowerCase().includes(query))
      : sessions;
    list.replaceChildren();
    if (!shown.length) {
      const empty = document.createElement('p');
      empty.className = 'home-empty';
      empty.textContent = sessions.length
        ? 'No sessions match this search.'
        : 'No sessions yet. Turn on "Save meeting history" in Settings → Listening, then start Listening.';
      list.appendChild(empty);
      return;
    }
    let lastDay = '';
    for (const s of shown) {
      const when = s.startedAt || s.endedAt;
      const day = dayLabel(when);
      if (day !== lastDay) {
        const h = document.createElement('h2');
        h.className = 'home-day';
        h.textContent = day;
        list.appendChild(h);
        lastDay = day;
      }
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'home-row';
      const name = document.createElement('span');
      name.className = 'home-row-title';
      name.textContent = title(s);
      const chip = document.createElement('span');
      chip.className = 'home-chip';
      chip.textContent = duration(s);
      const time = document.createElement('span');
      time.className = 'home-time';
      time.textContent = clock(when);
      row.append(name, chip, time);
      row.setAttribute('aria-label', `${name.textContent}, ${chip.textContent}, ${day} ${time.textContent}`);
      row.addEventListener('click', () => api.openSession(s.id));
      list.appendChild(row);
    }
  }

  async function loadSessions() {
    try { sessions = (await api.listSessions()) || []; } catch { sessions = []; }
    sessions.sort((a, b) => (b.startedAt || b.endedAt || 0) - (a.startedAt || a.endedAt || 0));
    render();
  }
  function renderCapture(active) {
    startBtn.classList.toggle('live', !!active);
    startLabel.textContent = active ? 'Stop Listening' : 'Start Listening';
  }

  startBtn.addEventListener('click', async () => {
    try { renderCapture((await api.toggleCapture()) === true); } catch {}
  });
  search.addEventListener('input', render);
  api.onChange((channel, data) => {
    if (channel === 'history:changed') loadSessions();
    if (channel === 'capture:state') renderCapture(data && data.active);
  });
  api.captureState().then(renderCapture).catch(() => {});
  loadSessions();
})();
