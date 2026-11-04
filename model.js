export const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
export const uid = () => globalThis.crypto.randomUUID();
export const emptyState = () => ({
  version: 1,
  school: '반곡초등학교', grade: '6학년',
  notices: [
    { id: 'notice1', title: '함께 확인해 주세요', body: '이곳에 우리 학년의 생활 안내와 전달 사항을 적어 주세요. 오른쪽 편집 버튼으로 자유롭게 수정할 수 있어요.', pinned: true },
    { id: 'notice2', title: '2학기 학년 운영', body: '전담 수업, 현장체험학습, 학년 공동 활동 등 함께 기억할 내용을 기록해 보세요.' }
  ],
  tasks: [], events: [], bookings: [], duties: [], transactions: [], info: [], archive: [],
  links: [ { id: 'link1', title: '졸업앨범 조편성', url: '' }, { id: 'link2', title: '학년 달력', url: '#calendar' }, { id: 'link3', title: '반별 시간표', url: '' }, { id: 'link4', title: '스포츠리그 대진표', url: '' } ]
});
const validDate = value => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value + 'T12:00:00Z')) && new Date(value + 'T12:00:00Z').toISOString().slice(0,10) === value;
export function validateState(s) {
  if (!s || s.version !== 1 || typeof s.school !== 'string' || typeof s.grade !== 'string' || !s.school.trim() || !s.grade.trim() || s.school.length > 160 || s.grade.length > 160) return false;
  const specs = { notices: ['id','title','body'], tasks: ['id','title','date'], events: ['id','title','date','kind','memo'], bookings: ['id','room','date','period','teacher'], duties: ['id','title','teacher','className','memo'], transactions: ['id','title','date','kind'], info: ['id','title','body'], archive: ['id','title','body'], links: ['id','title','url'] };
  return Object.entries(specs).every(([key, fields]) => Array.isArray(s[key]) && s[key].length <= 5000 && s[key].every(item => item && fields.every(field => typeof item[field] === 'string' && item[field].length <= 20000) && (!['events','bookings','transactions','tasks'].includes(key) || (key === 'tasks' && item.date === '') || validDate(item.date)) && (key !== 'tasks' || typeof item.done === 'boolean') && (key !== 'transactions' || Number.isFinite(item.amount) && item.amount > 0 && ['수입','지출'].includes(item.kind))));
}
export function bookingConflict(bookings, item) { return bookings.some(b => b.id !== item.id && b.room === item.room && b.date === item.date && b.period === item.period); }
export function balance(transactions) { return transactions.reduce((sum, t) => sum + (t.kind === '수입' ? t.amount : -t.amount), 0); }
export function safeUrl(url) { if (url === '#calendar') return url; try { const u = new URL(url); return ['https:', 'http:'].includes(u.protocol) ? u.href : ''; } catch { return ''; } }
