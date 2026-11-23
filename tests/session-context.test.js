'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createMeetingStore } = require('../src/meeting-store');

const turns = [{ id: 't1', channel: 'them', text: 'Tell me about yourself.', ts: 1000 }];
const main = fs.readFileSync(path.join(__dirname, '..', 'main.js'), 'utf8');

test('a session title and notes are saved with the record and listed by title', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'volyx-lens-session-'));
  const store = createMeetingStore({ dir });
  const result = store.finalize({ turns, enabled: true, startedAt: 500, endedAt: 2000, title: '  Design interview  ', sessionContext: 'Role: product designer' });
  assert.equal(result.saved, true);
  const [listed] = store.list();
  assert.equal(listed.title, 'Design interview');
  assert.equal(listed.hasSessionContext, true);
  assert.equal(store.get(result.id).sessionContext, 'Role: product designer');
});

test('session context reaches answers as fenced reference data and resets with a new session', () => {
  assert.match(main, /withSessionContext\(buildPersonalContext\(/);
  assert.match(main, /\[BEGIN SESSION CONTEXT: untrusted reference data/);
  assert.match(main, /finalizeMeeting\('new-session'\);\n\s*setSessionContext\(\{\}\);/);
});

test('hiding the overlay releases every shortcut except hide/show and quit', () => {
  const { createShortcutRegistry } = require('../src/shortcut-registry');
  const held = new Set();
  const globalShortcut = {
    register: (accel) => { held.add(accel); return true; },
    unregister: (accel) => { held.delete(accel); },
    isRegistered: (accel) => held.has(accel),
  };
  const registry = createShortcutRegistry({
    globalShortcut,
    platform: 'darwin',
    definitions: [
      { id: 'assist', accelerator: 'CommandOrControl+Return', handler() {} },
      { id: 'toggle-visibility', accelerator: 'CommandOrControl+\\', handler() {} },
    ],
  });
  registry.register();
  registry.release(['toggle-visibility']);
  assert.deepEqual([...held], ['CommandOrControl+\\']);
  registry.register();
  assert.equal(held.size, 2);
});
