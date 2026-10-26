// Guest name comes from the custom link: index.html?to=Bhathiya%20Heittiarachchi,%20DTM
const params = new URLSearchParams(location.search);
const guest = (params.get('to') || params.get('name') || '').trim();
if (guest) {
  document.getElementById('guest-name').textContent = guest;
  document.title = `${guest} – You're Invited | Reverberation 2026`;
}

const EVENT = {
  title: 'Reverberation 2026 – District 82 Mid Year Event',
  details: 'Toastmasters International District 82 Mid Year Event. Dress code: Business Casual (Deep Blue & Black). RSVP: Malka Abeyratne, Registration Chair +94 74 012 3634',
  location: 'Waters Edge, Colombo, Sri Lanka',
  start: '20261115T070000',
  end: '20261115T180000', // assumed end time – adjust if needed
  tz: 'Asia/Colombo'
};

document.getElementById('btn-google').href = 'https://calendar.google.com/calendar/render?' + new URLSearchParams({
  action: 'TEMPLATE', text: EVENT.title, dates: `${EVENT.start}/${EVENT.end}`,
  details: EVENT.details, location: EVENT.location, ctz: EVENT.tz
});

document.getElementById('btn-apple').addEventListener('click', e => {
  e.preventDefault();
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//D82//Reverberation 2026//EN',
    'BEGIN:VTIMEZONE', 'TZID:Asia/Colombo', 'BEGIN:STANDARD', 'DTSTART:19700101T000000',
    'TZOFFSETFROM:+0530', 'TZOFFSETTO:+0530', 'TZNAME:IST', 'END:STANDARD', 'END:VTIMEZONE',
    'BEGIN:VEVENT', 'UID:reverberation-2026@d82',
    'DTSTAMP:20261026T000000Z',
    `DTSTART;TZID=${EVENT.tz}:${EVENT.start}`, `DTEND;TZID=${EVENT.tz}:${EVENT.end}`,
    `SUMMARY:${EVENT.title}`, `LOCATION:${EVENT.location}`,
    `DESCRIPTION:${EVENT.details.replace(/,/g, '\\,')}`,
    'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:Reverberation 2026 tomorrow', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR'
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: 'Reverberation-2026.ics' });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
});

const msg = `Hello Malka, this is ${guest || 'a guest'} – I'm RSVPing for Reverberation 2026 (15 Nov, Waters Edge).`;
document.getElementById('btn-wa').href = 'https://wa.me/94740123634?text=' + encodeURIComponent(msg);

const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('in')), { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
