// Запасная мини-версия cowsay: используется, только если пакет cowsay не установлен (npm install cowsay).
const bubble = t => {
  const L = String(t).split('\n'), w = Math.max(...L.map(l => l.length));
  const m = L.length === 1 ? [['<', '>']] : L.map((_, i) => i === 0 ? ['/', '\\'] : i === L.length - 1 ? ['\\', '/'] : ['|', '|']);
  return [' ' + '_'.repeat(w + 2), ...L.map((l, i) => m[i][0] + ' ' + l.padEnd(w) + ' ' + m[i][1]), ' ' + '-'.repeat(w + 2)].join('\n');
};
const cow = (k, e, T) =>
  `\n        ${k}   ^__^\n         ${k}  (${e})\\_______\n            (__)\\       )\\/\\\n              ${T}||----w |\n                ||     ||`;
exports.say = o => bubble(o.text) + cow('\\', o.e || 'oo', o.T || '  ');
exports.think = o => bubble(o.text).replace(/[<(\/|\\]/g, c => c) + cow('o', o.e || 'oo', o.T || '  ');
