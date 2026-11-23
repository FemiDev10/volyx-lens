// Default global shortcut definitions shared between the main process and the
// settings store. Kept in its own module so both can validate against the same
// source of truth.
const DEFAULT_SHORTCUT_DEFS = [
  { id: 'assist', accelerator: 'CommandOrControl+Return', mac: '⌘↵', other: 'Ctrl+Enter', feature: 'Assist', fallback: 'Use Assist button' },
  { id: 'solve', accelerator: 'CommandOrControl+H', mac: '⌘H', other: 'Ctrl+H', feature: 'Solve screen', fallback: 'Use Solve button' },
  { id: 'task-context', accelerator: 'CommandOrControl+Shift+C', mac: '⌘⇧C', other: 'Ctrl+Shift+C', feature: 'Add screen', fallback: 'Use Add screen button' },
  { id: 'quit', accelerator: 'CommandOrControl+Shift+X', mac: '⌘⇧X', other: 'Ctrl+Shift+X', feature: 'Stop all and quit', fallback: 'Use power button' },
  { id: 'toggle-visibility', accelerator: 'CommandOrControl+\\', mac: '⌘\\', other: 'Ctrl+\\', feature: 'Hide or show overlay', fallback: 'Use Hide button' },
  { id: 'move-up', accelerator: 'CommandOrControl+Up', mac: '⌘↑', other: 'Ctrl+Up', feature: 'Move overlay up', fallback: 'Drag the bar' },
  { id: 'move-down', accelerator: 'CommandOrControl+Down', mac: '⌘↓', other: 'Ctrl+Down', feature: 'Move overlay down', fallback: 'Drag the bar' },
  { id: 'move-left', accelerator: 'CommandOrControl+Left', mac: '⌘←', other: 'Ctrl+Left', feature: 'Move overlay left', fallback: 'Drag the bar' },
  { id: 'move-right', accelerator: 'CommandOrControl+Right', mac: '⌘→', other: 'Ctrl+Right', feature: 'Move overlay right', fallback: 'Drag the bar' },
];

module.exports = { DEFAULT_SHORTCUT_DEFS };
