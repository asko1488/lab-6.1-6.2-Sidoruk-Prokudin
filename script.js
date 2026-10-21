const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const D = [['Mon',21,128],['Tue',22,142],['Wed',23,120],['Thu',24,105],['Fri',25,110],['Sat',26,132],['Sun',27,158]];
const F = [['07:25','11:50','3h 25m',120],['10:24','15:50','5h 45m',134],['08:25','11:50','2h 25m',150],['16:25','18:50','2h 25m',115]];
const P = [{n:'You',e:'🙂',on:1},{n:'Alex',e:'🧔',on:1},{n:'Reze',e:'👩',on:1},{n:'Mikke',e:'👨',on:1}];
const S = {day:3, f:3, sort:0, paid:{You:0,Alex:0,Reze:1,Mikke:1}, booked:0, done:0, sec:86399};
const N = () => P.filter(p => p.on).length || 1;
const mins = i => parseInt(F[i][2]) * 60 + parseInt(F[i][2].split(' ')[1]);
const code = id => $('#' + id).value.trim().split(' ')[0].toUpperCase();

function toast(m) {
  const t = $('#toast'); t.textContent = m; t.classList.add('show');
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2200);
}
function go(id) {
  $$('.screen').forEach(e => e.classList.toggle('on', e.id === id));
  $$('.nav button').forEach(b => b.classList.toggle('on', b.dataset.go === id));
  render(); scrollTo(0, 0);
}
function check() {
  if (!S.done && P.filter(p => p.on).every(p => S.paid[p.n])) {
    S.done = 1; S.booked++; toast('🎉 Все оплатили — билеты оформлены!');
  }
}
function render() {
  $('#days').innerHTML = D.map((d, i) => `<button class="d${i === S.day ? ' on' : ''}" data-day="${i}">${d[0]}<b>${d[1]}</b><small>$${d[2]}</small></button>`).join('');
  $('#who').innerHTML = P.map((p, i) => `<button class="av${p.on ? '' : ' off'}" data-p="${i}"><span>${p.e}</span>${p.n}</button>`).join('') + '<button class="av" data-add="1"><span>＋</span>Add</button>';
  const n = N(), f = F[S.f], a = f[3];
  const order = F.map((_, i) => i).sort((x, y) => S.sort === 1 ? F[x][3] - F[y][3] : S.sort === 2 ? mins(x) - mins(y) : x - y);
  $('#meta').textContent = `${code('from')} → ${code('to')} · Sep ${D[S.day][1]}, 2026 · ${n} pax`;
  $('#chip').textContent = '👥 Group of ' + n;
  $('#sort').textContent = 'Sorted by: ' + ['Best', 'Cheapest', 'Fastest'][S.sort] + ' ▾';
  $('#flights').innerHTML = order.map(i => { const x = F[i]; return `<button class="card fl${i === S.f ? ' sel' : ''}" data-f="${i}"><div class="fr"><b>${x[0]}</b><span class="m">${x[2]} · Direct</span><b>${x[1]}</b></div><div class="fr"><span class="p">$${x[3]} <small>per person</small></span><span class="p">$${x[3] * n} <small>total</small></span></div></button>`; }).join('');
  $('#glist').innerHTML = P.map((p, i) => `<div class="mrow"><span class="e">${p.e}</span><b>${p.n}</b><span class="m">${p.on ? 'летит' : 'не летит'}</span><button class="mini" data-p="${i}">${p.on ? 'Убрать' : 'Вернуть'}</button></div>`).join('');
  $('#pflight').innerHTML = `<div class="fr"><b>${f[0]}</b><span class="m">${f[2]} · Direct</span><b>${f[1]}</b></div>`;
  $('#tot').textContent = '$' + a * n; $('#my').textContent = '$' + a;
  $('#members').innerHTML = P.filter(p => p.on).map(p => `<div class="mrow" data-m="${p.n}"><span class="e">${p.e}</span><b>${p.n}</b><span class="${S.paid[p.n] ? 'ok' : 'wait'}">${S.paid[p.n] ? 'Paid' : 'Pending'}</span><b class="p" style="flex:none">$${a}</b><span>${S.paid[p.n] ? '✅' : '❌'}</span></div>`).join('');
  $('#payBtn').disabled = !!S.paid.You;
  $('#payBtn').textContent = S.paid.You ? 'Your share is paid ✓' : 'Pay your share · $' + a;
  $('#booked').textContent = S.booked;
}

document.addEventListener('click', e => {
  const t = e.target.closest('button,.mrow[data-m]'); if (!t) return;
  const d = t.dataset;
  if (d.go) return go(d.go);
  if (d.day) { S.day = +d.day; $('#date').value = '2026-09-' + D[S.day][1]; }
  else if (d.p !== undefined) P[d.p].on ^= 1;
  else if (d.add) {
    const n = (prompt('Имя друга:') || '').trim();
    if (n) { P.push({n, e:'😎', on:1}); S.paid[n] = 0; S.done = 0; }
  }
  else if (d.f) { S.f = +d.f; S.paid.You = 0; S.done = 0; return go('pay'); }
  else if (d.m) { if (!S.paid[d.m]) { S.paid[d.m] = 1; toast(d.m + ' оплатил(а) свою часть'); check(); } }
  else switch (t.id) {
    case 'swap': { const a = $('#from'), b = $('#to'); [a.value, b.value] = [b.value, a.value]; break; }
    case 'find': return go('results');
    case 'edit': return go('search');
    case 'sort': S.sort = (S.sort + 1) % 3; break;
    case 'payBtn': S.paid.You = 1; toast('Вы оплатили $' + F[S.f][3]); check(); break;
    case 'bell': $('#badge').style.display = 'none'; toast('Alex ещё не оплатил свою часть'); break;
    case 'menuBtn': return go('profile');
    case 'theme': document.body.classList.toggle('dark'); break;
  }
  render();
});
$('#date').addEventListener('change', e => {
  const i = D.findIndex(x => x[1] === +e.target.value.slice(8));
  if (i >= 0) { S.day = i; render(); }
});
setInterval(() => {
  const s = S.sec = Math.max(0, S.sec - 1);
  $('#timer').textContent = [s / 3600, s / 60 % 60, s % 60].map(v => String(Math.floor(v)).padStart(2, '0')).join(':');
}, 1000);
console.log('SkySplit запущен');
render();
