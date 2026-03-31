'use client';

import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Mail, Github, Phone, Award, Code, Database, BarChart3, Languages, Globe, Download, Menu, X, ChevronDown, Sparkles, Lock, RotateCcw, LogOut, BookOpen, ExternalLink, Plus, Trash2, Pencil, Sun, Moon, Eye, EyeOff } from 'lucide-react';
import ResumeExportModal from '@/components/ResumeExportModal';
import { STAR_DATA } from '@/lib/starData';
import { useAdminContent, useNotesStore, NoteItem, useNowStore, NowItem, useHiddenSections } from '@/lib/adminStore';

// ── Admin context ──────────────────────────────────────────────────────────
type AdminCtx = { isAdmin: boolean; get: (id: string, def: string) => string; save: (id: string, val: string) => void; };
const AdminContext = createContext<AdminCtx>({ isAdmin: false, get: (_, d) => d, save: () => {} });

/**
 * Editable text component — renders contenteditable in admin mode,
 * plain text otherwise. Wraps in the given HTML element (`as` prop).
 * Use `cls` for className.
 */
function E({ id, def, as = 'span', cls, style }: {
  id: string; def: string;
  as?: keyof JSX.IntrinsicElements; cls?: string; style?: React.CSSProperties;
}) {
  const { isAdmin, get, save } = useContext(AdminContext);
  const value = get(id, def);
  const Tag = as as any;
  if (!isAdmin) return <Tag className={cls} style={style}>{value}</Tag>;
  return (
    <Tag
      className={cls} style={style}
      contentEditable suppressContentEditableWarning
      data-admin-field="true"
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        const v = e.currentTarget.textContent ?? def;
        if (v !== get(id, def)) save(id, v);
      }}
    >
      {value}
    </Tag>
  );
}

// ============== TRANSLATION OBJECTS ==============
const translations = {
  zh: {
    nav: { about: '关于我', experience: '实习经历', projects: '研究项目', skills: '技能与证书', now: '现在', notes: '学习笔记', contact: '联系方式' },
    hero: { title: '你的姓名', subtitle: '你的方向 × 技术 | 数据分析 | 领域应用', description: '在这里填写你的个人简介，介绍你的学校、研究方向和核心技能。', contact: '联系我', github: 'GitHub' },
    about: { title: '关于我', education: '教育背景', intro: '在这里填写关于你自己的介绍，包括学校、研究方向和核心竞争力。', strengths: '核心优势：在这里填写你的核心优势，如专业背景 + 技术能力 + 实践经验。', degree: '硕士/学士', university: '你的大学（示例）', faculty: '你的学院', facultyEn: 'Your Faculty', major: '主修课程：课程1、课程2、课程3', period: '20xx.09 - 20xx.06（预计）', bachelor: '学士学位', bachelorUniv: '你的本科院校', bachelorFaculty: '你的本科学院', bachelorMajor: '主修课程：课程A、课程B、课程C', bachelorPeriod: '20xx.09 - 20xx.06', bachelorGpa: 'GPA: x.xx/5.0，专业前xx%' },
    experience: { title: '实习经历' },
    projects: { title: '研究项目', tech: '技术栈', objective: '研究目标', methodology: '研究方法', design: '研究设计', status: '状态' },
    skills: { title: '技能与证书', programming: '编程语言', dataTools: '数据分析工具', finance: '专业能力', certifications: '专业认证', languages: '语言能力' },
    now: { title: '最近在…', subtitle: '动态更新，记录当下在做的事' },
    notes: { title: '学习笔记', subtitle: '整理的备考笔记与错题复盘，持续更新中' },
    contact: {
      title: '联系方式', email: '邮箱', github: 'GitHub', phone: '电话', xiaohongshu: '小红书', bilibili: 'B站',
      message: '欢迎联系，期待交流合作！',
    },
  },
  en: {
    nav: { about: 'About', experience: 'Experience', projects: 'Projects', skills: 'Skills & Certs', now: 'Now', notes: 'Notes', contact: 'Contact' },
    hero: { title: 'Your Name', subtitle: 'Your Field × Technology | Data Analytics | Applications', description: "Write a short intro about yourself here — your university, research focus, and core skills.", contact: 'Contact Me', github: 'GitHub' },
    about: { title: 'About Me', education: 'Education', intro: "Write a short intro about yourself here, including your school, research direction, and core competencies.", strengths: 'Core strengths: Professional background + Technical skills + Practical experience.', degree: "Master's / Bachelor's", university: 'Your University', faculty: 'Your Faculty', major: 'Core Courses: Course 1, Course 2, Course 3', period: '20xx.09 - 20xx.06 (expected)', bachelor: 'Bachelor\'s Degree', bachelorUniv: 'Your Undergraduate University', bachelorFaculty: 'Your Faculty', bachelorMajor: 'Core Courses: Course A, Course B, Course C', bachelorPeriod: 'Sep 20xx - Jun 20xx', bachelorGpa: 'GPA: x.xx/5.0, Top xx% in major' },
    experience: { title: 'Internship Experience' },
    projects: { title: 'Research Projects', tech: 'Tech Stack', objective: 'Objective', methodology: 'Methodology', design: 'Research Design', status: 'Status' },
    skills: { title: 'Skills & Certifications', programming: 'Programming', dataTools: 'Data Tools', finance: 'Professional Skills', certifications: 'Certifications', languages: 'Languages' },
    now: { title: 'Now', subtitle: 'What I\'m currently into — updated live' },
    notes: { title: 'Study Notes', subtitle: 'Exam prep notes & mistake reviews — updated regularly' },
    contact: {
      title: 'Get In Touch', email: 'Email', github: 'GitHub', phone: 'Phone', xiaohongshu: 'Xiaohongshu', bilibili: 'Bilibili',
      message: 'Feel free to reach out — open to exchanges and collaboration!',
    },
  },
};

// ============== DATA ==============
// Replace the following with your own experience data
const experiences = [
  {
    company: '示例公司A',
    companyEn: 'Example Company A',
    role: '数据分析实习生',
    roleEn: 'Data Analysis Intern',
    period: '20xx年xx月 - 20xx年xx月',
    periodEn: 'Month 20xx - Month 20xx',
    highlights: [
      '在这里填写你的第一条工作亮点，描述你做了什么、用了什么工具、取得了什么成果',
      '在这里填写你的第二条工作亮点，尽量量化成果（如：效率提升xx%，处理xx条数据）',
      '在这里填写你的第三条工作亮点，突出你独立完成的工作或团队协作',
    ],
    highlightsEn: [
      'Write your first work highlight here — what you did, what tools you used, what results you achieved',
      'Write your second work highlight here, quantify where possible (e.g., improved efficiency by xx%, processed xx records)',
      'Write your third work highlight here, emphasizing independent work or collaboration',
    ],
    highlightsBold: [0, 1],
    logo: '/logos/company-a.svg',
  },
  {
    company: '示例公司B',
    companyEn: 'Example Company B',
    role: '研究实习生',
    roleEn: 'Research Intern',
    period: '20xx年xx月 - 20xx年xx月',
    periodEn: 'Month 20xx - Month 20xx',
    highlights: [
      '在这里填写你在这家公司的主要工作内容和职责',
      '在这里填写你参与的重要项目或研究，以及你的贡献',
      '在这里填写你使用的工具或方法，以及带来的业务价值',
    ],
    highlightsEn: [
      'Write your main responsibilities and work content at this company',
      'Describe important projects or research you participated in and your contribution',
      'Mention tools or methods you used and the business value created',
    ],
    highlightsBold: [1],
    logo: '/logos/company-b.svg',
  },
];

// Replace the following with your own project data
const projects = [
  {
    title: '示例研究项目（进行中）',
    titleEn: 'Example Research Project (Ongoing)',
    subtitle: '在这里填写项目的核心方法或技术路线',
    subtitleEn: 'Write the core methodology or technical approach here',
    tech: ['Python', 'Pandas', 'Scikit-learn', 'SQL'],
    objective: '在这里填写研究目标，说明你希望通过这个项目解决什么问题或验证什么假设。',
    objectiveEn: 'Write your research objective here — what problem you aim to solve or hypothesis to test.',
    methodology: '在这里填写研究方法，描述你的数据来源、分析框架和技术手段。',
    methodologyEn: 'Describe your methodology — data sources, analytical framework, and technical tools used.',
    design: '在这里填写研究设计，说明具体的实验步骤、评估指标和验证方式。',
    designEn: 'Describe your research design — specific experimental steps, evaluation metrics, and validation methods.',
    status: '进行中 (20xx年xx月 - 至今)',
    statusEn: 'Ongoing (Month 20xx - Present)',
  },
  {
    title: '示例已完成项目',
    titleEn: 'Example Completed Project',
    subtitle: '项目的核心方法简述',
    subtitleEn: 'Brief description of core methodology',
    tech: ['Python', 'BERT', 'Flask', 'MySQL'],
    objective: '在这里填写已完成项目的研究目标和背景动机。',
    objectiveEn: 'Write the research objective and motivation for this completed project.',
    methodology: '在这里填写你使用的主要方法、模型或框架。',
    methodologyEn: 'Describe the main methods, models, or frameworks you used.',
    design: '在这里填写项目的技术实现细节、评估结果和主要发现。',
    designEn: 'Describe the technical implementation, evaluation results, and key findings.',
    status: '已完成 (20xx年xx月 - 20xx年xx月)',
    statusEn: 'Completed (Month 20xx - Month 20xx)',
  },
];

// Replace with your own skills
const skillsData = {
  programming: ['Python', 'SQL', 'R'],
  dataTools: ['Pandas', 'NumPy', 'Scikit-learn', 'Tableau', 'Excel'],
  finance: ['技能一', '技能二', '技能三', '技能四'],
  certifications: [
    '在这里填写你的证书一（如：CPA会计科目）',
    '在这里填写你的证书二（如：基金从业资格）',
    '在这里填写你的证书三（如：CET-6英语六级）',
  ],
  certificationsEn: [
    'Certificate 1 (e.g., CPA - Accounting subject)',
    'Certificate 2 (e.g., Fund Practitioner Certificate)',
    'Certificate 3 (e.g., CET-6)',
  ],
  languages: ['中文（母语）', 'English（CET-x，工作语言）'],
};

const skillCategories = [
  { key: 'programming', icon: Code, label: '编程语言' },
  { key: 'dataTools', icon: Database, label: '数据分析工具' },
  { key: 'finance', icon: BarChart3, label: '专业能力' },
];

// ── Study notes default data ──────────────────────────────────────────────
const defaultNotes: NoteItem[] = [
  {
    id: 'default-1',
    title: '示例笔记标题（点击可跳转链接）',
    tag: '分类标签',
    href: 'https://example.com',
  },
];

// ── Xiaohongshu icon (inline SVG) ────────────────────────────────────────
function XhsIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="5" fill="#FF2442" />
      <path d="M11 5h2v6h3l-4 4-4-4h3V5z" fill="white" />
      <rect x="5" y="17" width="14" height="2" rx="1" fill="white" />
    </svg>
  );
}

// ── Bilibili icon (inline SVG) ───────────────────────────────────────────
function BiliIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="5" fill="#00AEEC" />
      <path d="M7.5 7.5h9a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1z" fill="white" />
      <circle cx="9.5" cy="11" r="1" fill="#00AEEC" />
      <circle cx="14.5" cy="11" r="1" fill="#00AEEC" />
      <path d="M9 7.5 7.5 6M15 7.5 16.5 6" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// ============== HELPER COMPONENTS ==============
function SectionHeading({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-10">
      <div className="w-1 h-7 bg-primary-600 rounded-full" />
      <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{label}</h2>
    </div>
  );
}

/** Counts from 0 → target when scrolled into view. */
function AnimatedStat({ target, decimals = 0, suffix = '', prefix = '', label }: {
  target: number; decimals?: number; suffix?: string; prefix?: string; label: string;
}) {
  const [display, setDisplay] = useState(decimals > 0 ? (0).toFixed(decimals) : '0');
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 1200;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const val = eased * target;
      setDisplay(decimals > 0 ? val.toFixed(decimals) : Math.round(val).toString());
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, target, decimals]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1">
      <span className="text-3xl md:text-4xl font-bold text-primary-600 tabular-nums leading-none">
        {prefix}{display}{suffix}
      </span>
      <span className="text-xs md:text-sm text-gray-500 font-medium text-center leading-tight">{label}</span>
    </div>
  );
}

// Replace with your own metrics
const METRICS_ZH = [
  { target: 2,   decimals: 0, suffix: '',  prefix: '', label: '段实习经历' },
  { target: 2,   decimals: 0, suffix: '',  prefix: '', label: '个研究项目' },
  { target: 3,   decimals: 0, suffix: '',  prefix: '', label: '项专业证书' },
  { target: 3.9, decimals: 1, suffix: '',  prefix: '', label: 'GPA（示例）' },
  { target: 90,  decimals: 0, suffix: '%', prefix: '', label: '某项效率提升' },
];
const METRICS_EN = [
  { target: 2,   decimals: 0, suffix: '',  prefix: '', label: 'Internships' },
  { target: 2,   decimals: 0, suffix: '',  prefix: '', label: 'Research Projects' },
  { target: 3,   decimals: 0, suffix: '',  prefix: '', label: 'Certifications' },
  { target: 3.9, decimals: 1, suffix: '',  prefix: '', label: 'GPA (example)' },
  { target: 90,  decimals: 0, suffix: '%', prefix: '', label: 'Efficiency Gain' },
];

// ── "Now" default items ───────────────────────────────────────────────────
const defaultNow: NowItem[] = [
  { emoji: '📚', category: '在读', categoryEn: 'Reading',  content: '点击编辑，填写你在读的书' },
  { emoji: '🎬', category: '在看', categoryEn: 'Watching', content: '点击编辑，填写在看的剧或番' },
  { emoji: '💬', category: '在聊', categoryEn: 'Thinking', content: '点击编辑，填写最近在思考的话题' },
];

/** Mouse cursor sparkle effect */
function CursorSparkle() {
  useEffect(() => {
    let frame = 0;
    const handle = (e: MouseEvent) => {
      // Throttle: only create a star every 3rd event
      frame++;
      if (frame % 3 !== 0) return;
      const star = document.createElement('div');
      star.className = 'cursor-star';
      star.style.left = `${e.clientX}px`;
      star.style.top  = `${e.clientY}px`;
      // Random size 3–7px and random hue for variety
      const size = 3 + Math.random() * 4;
      const hues = ['#60a5fa','#a78bfa','#34d399','#f472b6','#fbbf24'];
      star.style.width  = `${size}px`;
      star.style.height = `${size}px`;
      star.style.background = hues[Math.floor(Math.random() * hues.length)];
      document.body.appendChild(star);
      setTimeout(() => star.remove(), 700);
    };
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, []);
  return null;
}

// ============== MAIN COMPONENT ==============
export default function Home() {
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [mounted, setMounted] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedProject, setExpandedProject] = useState<number | null>(0);
  const [expandedStarExp, setExpandedStarExp] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const [typedSubtitle, setTypedSubtitle] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);
  const t = translations[lang];

  // Admin mode
  const { isAdmin, get, save, reset, login, logout } = useAdminContent();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPwInput, setAdminPwInput] = useState('');
  const [adminPwError, setAdminPwError] = useState(false);
  const adminCtx: AdminCtx = { isAdmin, get, save };

  // Dark mode
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem('portfolio_dark') === '1';
    setIsDark(saved);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('portfolio_dark', isDark ? '1' : '0');
  }, [isDark]);

  // Notes store (localStorage-backed)
  const { notes, addNote, removeNote, updateNote } = useNotesStore(defaultNotes);

  // "Now" store
  const { items: nowItems, updateItem: updateNowItem } = useNowStore(defaultNow);

  // Section visibility (admin can hide sections from visitors)
  const { isHidden: secHidden, toggle: toggleSec } = useHiddenSections();
  // Returns null for non-admin when section is hidden; dims content for admin
  const Veil = ({ id }: { id: string }) => !isAdmin ? null : (
    <button
      onClick={() => toggleSec(id)}
      title={secHidden(id) ? '点击恢复显示' : '点击隐藏此区块'}
      className={`absolute top-5 right-6 z-20 flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border shadow-sm transition
        ${secHidden(id) ? 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100' : 'bg-white/80 border-gray-200 text-gray-400 hover:bg-gray-50'}`}
    >
      {secHidden(id) ? <><EyeOff size={10} /><span>已隐藏</span></> : <><Eye size={10} /><span>隐藏</span></>}
    </button>
  );
  const dim = (id: string) => isAdmin && secHidden(id) ? 'opacity-40 pointer-events-none select-none' : '';

  // 每日一言 (Hitokoto)
  const [hitokoto, setHitokoto] = useState<{ hitokoto: string; from: string; from_who: string } | null>(null);
  useEffect(() => {
    fetch('https://v1.hitokoto.cn/')
      .then(r => r.json())
      .then(setHitokoto)
      .catch(() => {});
  }, []);
  type NoteForm = { mode: 'add' | 'edit'; id?: string; title: string; tag: string; href: string };
  const [noteForm, setNoteForm] = useState<NoteForm | null>(null);
  const openAddNote  = () => setNoteForm({ mode: 'add',  title: '', tag: '', href: '' });
  const openEditNote = (n: NoteItem) => setNoteForm({ mode: 'edit', id: n.id, title: n.title, tag: n.tag, href: n.href });
  const submitNoteForm = () => {
    if (!noteForm || !noteForm.title.trim() || !noteForm.href.trim()) return;
    if (noteForm.mode === 'add') addNote({ title: noteForm.title.trim(), tag: noteForm.tag.trim(), href: noteForm.href.trim() });
    else if (noteForm.id) updateNote(noteForm.id, { title: noteForm.title.trim(), tag: noteForm.tag.trim(), href: noteForm.href.trim() });
    setNoteForm(null);
  };

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) (e.target as HTMLElement).dataset.visible = '1'; }),
      { threshold: 0.07 }
    );
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [mounted]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const sectionObs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold: 0.25, rootMargin: '-64px 0px -40% 0px' }
    );
    document.querySelectorAll('section[id]').forEach(el => sectionObs.observe(el));
    return () => sectionObs.disconnect();
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const subtitle = t.hero.subtitle;
    setTypedSubtitle('');
    setIsTypingDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTypedSubtitle(subtitle.slice(0, i));
      if (i >= subtitle.length) { clearInterval(id); setIsTypingDone(true); }
    }, 55);
    return () => clearInterval(id);
  }, [mounted, lang]);

  const toggleLanguage = () => setLang(lang === 'zh' ? 'en' : 'zh');

  return (
    <AdminContext.Provider value={adminCtx}>
    <div className={`min-h-screen bg-white selection:bg-primary-200 selection:text-primary-900${isAdmin ? ' admin-mode' : ''}`} style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>

      {/* ── Scroll progress bar ── */}
      <div id="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {/* ── Navigation ── */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <a href="#" className="flex items-center gap-2.5 hover:opacity-80 transition">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md">YN</div>
              <span className="font-semibold text-gray-900 tracking-tight">{t.hero.title}</span>
            </a>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-7">
              {(['about', 'experience', 'projects', 'skills', 'now', 'notes', 'contact'] as const).map(item => (
                <a key={item} href={`#${item}`} className={`text-sm font-medium transition-colors relative group ${activeSection === item ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}>
                  {t.nav[item]}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary-500 transition-all duration-300 ${activeSection === item ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </a>
              ))}
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="flex items-center gap-1.5 bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200 px-4 py-2 rounded-full text-sm font-medium transition hover:shadow-sm"
              >
                <Download size={15} />
                <span>{lang === 'zh' ? '导出简历' : 'Resume'}</span>
              </button>
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 text-gray-500 hover:text-primary-600 border border-gray-200 px-3 py-1.5 rounded-full text-xs font-medium transition hover:border-primary-400"
              >
                <Globe size={13} />
                <span>{lang === 'en' ? '中文' : 'EN'}</span>
              </button>
              <button
                onClick={() => setIsDark(d => !d)}
                title={isDark ? '切换浅色' : '切换深色'}
                className="p-1.5 rounded-full text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition"
              >
                {isDark ? <Sun size={14} /> : <Moon size={14} />}
              </button>
              <button
                onClick={() => isAdmin ? logout() : setShowAdminLogin(true)}
                title={isAdmin ? '退出管理模式' : '管理员登录'}
                className={`p-1.5 rounded-full transition ${isAdmin ? 'text-amber-600 bg-amber-100 hover:bg-amber-200' : 'text-gray-300 hover:text-gray-500'}`}
              >
                <Lock size={13} />
              </button>
            </div>

            {/* Mobile controls */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 text-gray-500 border border-gray-200 px-2.5 py-1.5 rounded-full text-xs font-medium"
              >
                <Globe size={12} />
                {lang === 'en' ? '中文' : 'EN'}
              </button>
              <button
                onClick={() => setIsDark(d => !d)}
                className="p-1.5 text-gray-400 hover:text-primary-600 transition"
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-primary-600 transition"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-6 pt-4 pb-5">
            <div className="space-y-1 mb-4">
              {(['about', 'experience', 'projects', 'skills', 'now', 'notes', 'contact'] as const).map(item => (
                <a
                  key={item}
                  href={`#${item}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-2 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:text-primary-600 transition-colors"
                >
                  {t.nav[item]}
                </a>
              ))}
            </div>
            <button
              onClick={() => { setIsExportModalOpen(true); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-700 transition"
            >
              <Download size={16} />
              {lang === 'zh' ? '导出简历' : 'Export Resume'}
            </button>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="pt-28 pb-20 px-6 relative bg-white">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.4]"
            style={{
              backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent" />
          <div className="absolute top-0 left-0 w-[600px] h-[400px] bg-gradient-to-br from-primary-50/70 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[350px] bg-gradient-to-tl from-violet-50/60 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative">
          <div className="flex flex-col md:flex-row gap-14 items-center">
            {/* Left content */}
            <div className="flex-1 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-xs font-medium border border-primary-100">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                {lang === 'zh' ? '欢迎访问我的个人主页' : 'Welcome to my portfolio'}
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
                <E id={`hero.${lang}.title`} def={t.hero.title} />
              </h1>
              <h2 className="text-xl md:text-2xl font-medium leading-relaxed">
                {isAdmin ? (
                  <E id={`hero.${lang}.subtitle`} def={t.hero.subtitle} cls="text-primary-600" />
                ) : (
                  <span className={`gradient-text-animated${!isTypingDone ? ' typing-cursor' : ''}`}>
                    {typedSubtitle}
                  </span>
                )}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed max-w-lg">
                <E id={`hero.${lang}.description`} def={t.hero.description} />
              </p>

              {/* Quick-stat chips — replace with your own */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                {[
                  lang === 'zh' ? '2段实习经历' : '2 Internships',
                  lang === 'zh' ? '2个研究项目' : '2 Research Projects',
                  lang === 'zh' ? '3项专业证书' : '3 Certifications',
                ].map((chip, i) => (
                  <span key={i} className="stat-chip text-sm text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg font-medium cursor-default">
                    {chip}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition shadow-md hover:shadow-lg hover:-translate-y-0.5 transform duration-200 font-medium"
                >
                  <Mail size={18} />
                  {t.hero.contact}
                </a>
                <a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:border-primary-400 hover:text-primary-600 transition font-medium"
                >
                  <Github size={18} />
                  GitHub
                </a>
              </div>
            </div>

            {/* Right: profile photo */}
            <div className="flex-shrink-0">
              <div className="relative float-animate">
                <div className="w-72 h-72 md:w-80 md:h-80 rounded-2xl overflow-hidden border-2 border-primary-100 shadow-2xl" style={{ boxShadow: '0 0 40px rgba(59,130,246,0.15), 0 25px 50px rgba(0,0,0,0.12)' }}>
                  <img src="/images/profile.jpg" alt="Profile" className="w-full h-full object-cover" />
                </div>
                {/* Status badge */}
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      {lang === 'zh' ? '开放工作机会' : 'Open to opportunities'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Metrics strip ── */}
      {(!secHidden('metrics') || isAdmin) && (
        <div className="bg-white border-y border-gray-100 py-10 px-6 relative">
          <Veil id="metrics" />
          <div className={`max-w-4xl mx-auto grid grid-cols-3 md:grid-cols-5 gap-8 ${dim('metrics')}`}>
            {(lang === 'zh' ? METRICS_ZH : METRICS_EN).map((m, i) => (
              <AnimatedStat key={i} {...m} />
            ))}
          </div>
        </div>
      )}

      {/* ── About & Education ── */}
      {(!secHidden('about') || isAdmin) && (
      <section id="about" className="py-20 px-6 scroll-mt-24 bg-gray-50/50 relative">
        <Veil id="about" />
        <div className={dim('about')}><div className="max-w-4xl mx-auto">
          <SectionHeading label={t.about.title} />
          <div className="space-y-6">
            {/* Intro card */}
            <div className="card-glow bg-white rounded-2xl p-7 border border-gray-100 shadow-sm animate-on-scroll">
              <E id={`about.${lang}.intro`} def={t.about.intro} as="p" cls="text-gray-700 leading-relaxed mb-4" />
              <div className="flex items-start gap-3 bg-primary-50 border border-primary-100 rounded-xl px-4 py-3">
                <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-500" />
                <E id={`about.${lang}.strengths`} def={t.about.strengths} as="p" cls="text-primary-800 text-sm font-medium leading-relaxed" />
              </div>
            </div>

            {/* Education cards */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 px-1">{t.about.education}</p>
              <div className="grid md:grid-cols-2 gap-5">
                {/* Master's / Graduate */}
                <div className="card-glow bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-on-scroll" style={{ transitionDelay: '60ms' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl flex items-center justify-center border border-primary-100 p-1.5">
                      <img
                        src="/logos/university-logo.svg"
                        alt="University"
                        className="w-full h-full object-contain"
                        onError={e => { e.currentTarget.style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement | null)!.style.display = 'flex'; }}
                      />
                      <div className="hidden w-full h-full items-center justify-center text-primary-700 font-bold text-xs">大学</div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{t.about.university}</h3>
                      <p className="text-xs text-primary-600 mt-0.5">{t.about.faculty}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold text-gray-900">{t.about.degree}</p>
                    <p className="text-gray-500 leading-relaxed">{t.about.major}</p>
                    <p className="text-gray-400 text-xs">{t.about.period}</p>
                  </div>
                </div>

                {/* Bachelor's */}
                <div className="card-glow bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-on-scroll" style={{ transitionDelay: '120ms' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl flex items-center justify-center border border-primary-100 p-1.5">
                      <img
                        src="/logos/bachelor-university-logo.svg"
                        alt="Bachelor University"
                        className="w-full h-full object-contain"
                        onError={e => { e.currentTarget.style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement | null)!.style.display = 'flex'; }}
                      />
                      <div className="hidden w-full h-full items-center justify-center text-primary-700 font-bold text-xs">本科</div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{t.about.bachelorUniv}</h3>
                      <p className="text-xs text-primary-600 mt-0.5">{t.about.bachelorFaculty}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold text-gray-900">{t.about.bachelor}</p>
                    <p className="text-gray-500 leading-relaxed">{t.about.bachelorMajor}</p>
                    <p className="text-gray-400 text-xs">{t.about.bachelorPeriod}</p>
                    <p className="text-gray-400 text-xs">{t.about.bachelorGpa}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div></div>
      </section>
      )}

      {/* ── Experience — Timeline ── */}
      {(!secHidden('experience') || isAdmin) && (
      <section id="experience" className="py-20 px-6 scroll-mt-24 relative">
        <Veil id="experience" />
        <div className={dim('experience')}><div className="max-w-4xl mx-auto">
          <SectionHeading label={t.experience.title} />

          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-5 top-5 bottom-5 w-px bg-gradient-to-b from-primary-400 via-primary-200 to-primary-50 hidden md:block" />

            <div className="space-y-5">
              {experiences.map((exp, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-5 animate-on-scroll"
                  style={{ transitionDelay: `${idx * 60}ms` }}
                >
                  {/* Timeline node — logo circle on the line */}
                  <div className="hidden md:flex flex-shrink-0 w-10 h-10 rounded-xl bg-white border-2 border-primary-200 shadow-sm items-center justify-center p-1.5 relative z-10 mt-4">
                    {exp.logo && (
                      <img
                        src={exp.logo}
                        alt={exp.company}
                        className="w-full h-full object-contain"
                        onError={e => { e.currentTarget.style.display = 'none'; }}
                      />
                    )}
                  </div>

                  {/* Card */}
                  <div className="card-glow flex-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
                      <div className="flex items-center gap-3">
                        {/* Mobile logo */}
                        <div className="flex md:hidden w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm items-center justify-center p-1.5 flex-shrink-0">
                          {exp.logo && (
                            <img
                              src={exp.logo}
                              alt={exp.company}
                              className="w-full h-full object-contain"
                              onError={e => { e.currentTarget.style.display = 'none'; }}
                            />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg leading-tight">
                            <E id={`exp.${idx}.${lang === 'en' ? 'companyEn' : 'company'}`} def={lang === 'en' ? exp.companyEn : exp.company} />
                          </h3>
                          <p className="text-primary-600 font-medium text-sm mt-0.5">
                            <E id={`exp.${idx}.${lang === 'en' ? 'roleEn' : 'role'}`} def={lang === 'en' ? exp.roleEn : exp.role} />
                          </p>
                        </div>
                      </div>
                      <span className="bg-gray-50 text-gray-500 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 whitespace-nowrap self-start">
                        <E id={`exp.${idx}.${lang === 'en' ? 'periodEn' : 'period'}`} def={lang === 'en' ? exp.periodEn : exp.period} />
                      </span>
                    </div>

                    <ul className="space-y-2.5">
                      {(lang === 'en' ? exp.highlightsEn : exp.highlights).map((highlight, i) => (
                        <li
                          key={i}
                          className={`flex items-start gap-2.5 text-sm leading-relaxed ${
                            exp.highlightsBold?.includes(i) ? 'font-medium text-gray-800' : 'text-gray-600'
                          }`}
                        >
                          <span className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-400" />
                          <E id={`exp.${idx}.h.${lang}.${i}`} def={highlight} />
                        </li>
                      ))}
                    </ul>

                    {/* STAR detail toggle */}
                    {STAR_DATA[exp.company] && (
                      <div className="mt-4">
                        <button
                          onClick={() => setExpandedStarExp(expandedStarExp === idx ? null : idx)}
                          className="flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 border border-primary-200 hover:border-primary-400 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-full transition-all"
                        >
                          <Sparkles size={12} />
                          {expandedStarExp === idx
                            ? (lang === 'zh' ? '收起 STAR 详情' : 'Hide STAR Details')
                            : (lang === 'zh' ? '查看 STAR 详情' : 'View STAR Details')}
                          <ChevronDown size={12} className={`transition-transform duration-200 ${expandedStarExp === idx ? 'rotate-180' : ''}`} />
                        </button>

                        {expandedStarExp === idx && (
                          <div className="mt-3 space-y-4 border-t border-primary-100 pt-4 accordion-body">
                            {STAR_DATA[exp.company].map((entry, ei) => (
                              <div key={ei} className="bg-primary-50/50 rounded-xl p-4 border border-primary-100">
                                <p className="text-sm font-semibold text-primary-800 mb-3">
                                  {lang === 'zh' ? entry.title : entry.titleEn}
                                </p>
                                <div className="space-y-2">
                                  {[
                                    { label: 'S', labelFull: lang === 'zh' ? '情境' : 'Situation', content: lang === 'zh' ? entry.s : entry.sEn, color: 'bg-blue-100 text-blue-700' },
                                    { label: 'T', labelFull: lang === 'zh' ? '任务' : 'Task', content: lang === 'zh' ? entry.t : entry.tEn, color: 'bg-purple-100 text-purple-700' },
                                    { label: 'A', labelFull: lang === 'zh' ? '行动' : 'Action', content: lang === 'zh' ? entry.a : entry.aEn, color: 'bg-amber-100 text-amber-700' },
                                    { label: 'R', labelFull: lang === 'zh' ? '结果' : 'Result', content: lang === 'zh' ? entry.r : entry.rEn, color: 'bg-green-100 text-green-700' },
                                  ].map(({ label, labelFull, content, color }) => (
                                    <div key={label} className="flex items-start gap-2.5">
                                      <span className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${color}`}>
                                        {label}
                                      </span>
                                      <div className="flex-1 min-w-0">
                                        <span className="text-xs font-semibold text-gray-500 mr-1.5">{labelFull}</span>
                                        <span className="text-sm text-gray-700 leading-relaxed">{content}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div></div>
      </section>
      )}

      {/* ── Projects — Accordion ── */}
      {(!secHidden('projects') || isAdmin) && (
      <section id="projects" className="py-20 px-6 scroll-mt-24 bg-gray-50/50 relative">
        <Veil id="projects" />
        <div className={dim('projects')}><div className="max-w-4xl mx-auto">
          <SectionHeading label={t.projects.title} />
          <div className="space-y-3">
            {projects.map((project, idx) => {
              const isExpanded = expandedProject === idx;
              const title = lang === 'en' ? project.titleEn : project.title;
              const subtitle = lang === 'en' ? project.subtitleEn : project.subtitle;
              const status = lang === 'en' ? project.statusEn : project.status;
              const isOngoing = status.includes('进行') || status.includes('Ongoing');

              return (
                <div
                  key={idx}
                  className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-200 animate-on-scroll ${
                    isExpanded ? 'border-primary-200 shadow-md' : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
                  }`}
                  style={{ transitionDelay: `${idx * 70}ms` }}
                >
                  {/* Header — always visible, click to expand */}
                  <button
                    className="w-full text-left p-6 flex items-start gap-4 hover:bg-gray-50/60 transition-colors"
                    onClick={() => setExpandedProject(isExpanded ? null : idx)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2.5">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                          isOngoing
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-gray-50 text-gray-500 border-gray-200'
                        }`}>
                          {status}
                        </span>
                        <span className="text-xs text-gray-300 font-mono tracking-wider">0{idx + 1}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1 leading-snug">
                        <E id={`proj.${idx}.${lang === 'en' ? 'titleEn' : 'title'}`} def={title} />
                      </h3>
                      <p className="text-primary-600/80 text-sm mb-3">
                        <E id={`proj.${idx}.${lang === 'en' ? 'subtitleEn' : 'subtitle'}`} def={subtitle} />
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tech.map((tech: string, i: number) => (
                          <span
                            key={i}
                            className="skill-tag-hover text-xs bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full font-medium border border-primary-100 cursor-default"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`flex-shrink-0 mt-1 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 px-6 pb-6 pt-5 accordion-body">
                      <div className="grid md:grid-cols-3 gap-5">
                        {[
                          { label: t.projects.objective, key: lang === 'en' ? 'objectiveEn' : 'objective', content: lang === 'en' ? project.objectiveEn : project.objective },
                          { label: t.projects.methodology, key: lang === 'en' ? 'methodologyEn' : 'methodology', content: lang === 'en' ? project.methodologyEn : project.methodology },
                          { label: t.projects.design, key: lang === 'en' ? 'designEn' : 'design', content: lang === 'en' ? project.designEn : project.design },
                        ].map(({ label, content, key: contentKey }) => (
                          <div key={label}>
                            <h4 className="font-semibold text-gray-800 text-sm mb-2.5 flex items-center gap-1.5">
                              <span className="w-1 h-3.5 bg-primary-500 rounded-full flex-shrink-0" />
                              {label}
                            </h4>
                            <E id={`proj.${idx}.${contentKey}`} def={content} as="p" cls="text-gray-600 text-sm leading-relaxed" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div></div>
      </section>
      )}

      {/* ── Skills ── */}
      {(!secHidden('skills') || isAdmin) && (
      <section id="skills" className="py-20 px-6 scroll-mt-24 relative">
        <Veil id="skills" />
        <div className={dim('skills')}><div className="max-w-6xl mx-auto">
          <SectionHeading label={t.skills.title} />

          {/* 3-column skill categories */}
          <div className="grid md:grid-cols-3 gap-5 mb-5">
            {skillCategories.map((cat, i) => (
              <div
                key={cat.key}
                className="card-glow bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-on-scroll"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <cat.icon className="text-primary-600" size={20} />
                  <h3 className="font-semibold text-gray-900 text-sm">{t.skills[cat.key as keyof typeof t.skills]}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(skillsData[cat.key as keyof typeof skillsData] as string[]).map((skill, j) => (
                    <span
                      key={j}
                      className="skill-tag-hover bg-gray-50 px-3 py-1.5 rounded-lg text-gray-700 text-xs font-medium border border-gray-200 hover:border-primary-300 hover:bg-primary-50 cursor-default"
                    >
                      <E id={`skill.${cat.key}.${j}`} def={skill} />
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="card-glow bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-5 animate-on-scroll">
            <div className="flex items-center gap-2.5 mb-4">
              <Award className="text-primary-600" size={20} />
              <h3 className="font-semibold text-gray-900 text-sm">{t.skills.certifications}</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {(lang === 'zh' ? skillsData.certifications : skillsData.certificationsEn).map((cert, i) => (
                <div key={i} className="flex items-start gap-2.5 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                  <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-400" />
                  <E id={`cert.${lang}.${i}`} def={cert} cls="text-gray-700 text-sm leading-relaxed" />
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="card-glow bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-on-scroll">
            <div className="flex items-center gap-2.5 mb-4">
              <Languages className="text-primary-600" size={20} />
              <h3 className="font-semibold text-gray-900 text-sm">{t.skills.languages}</h3>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {skillsData.languages.map((langItem, i) => (
                <span key={i} className="bg-gray-50 px-4 py-2.5 rounded-xl text-gray-700 text-sm border border-gray-200 font-medium">
                  <E id={`lang.item.${i}`} def={langItem} />
                </span>
              ))}
            </div>
          </div>
        </div></div>
      </section>
      )}

      {/* ── Now ── */}
      {(!secHidden('now') || isAdmin) && (
      <section id="now" className="py-20 px-6 scroll-mt-24 relative">
        <Veil id="now" />
        <div className={dim('now')}><div className="max-w-6xl mx-auto">
          <SectionHeading label={t.now.title} />
          <p className="text-gray-500 text-sm mb-8 -mt-6">{t.now.subtitle}</p>
          <div className="grid sm:grid-cols-3 gap-5">
            {nowItems.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-xs font-semibold text-primary-600 bg-primary-50 border border-primary-100 px-2.5 py-1 rounded-lg">
                    {lang === 'zh' ? item.category : item.categoryEn}
                  </span>
                </div>
                {isAdmin ? (
                  <textarea
                    value={item.content}
                    onChange={e => updateNowItem(i, e.target.value)}
                    rows={3}
                    className="text-sm text-gray-700 border border-dashed border-primary-300 rounded-xl px-3 py-2 resize-none focus:outline-none focus:border-primary-500 bg-primary-50/30 leading-relaxed"
                  />
                ) : (
                  <p className="text-sm text-gray-700 leading-relaxed">{item.content}</p>
                )}
              </div>
            ))}
          </div>
        </div></div>
      </section>
      )}

      {/* ── Notes ── */}
      {(!secHidden('notes') || isAdmin) && (
      <section id="notes" className="py-20 px-6 bg-gray-50 scroll-mt-24 relative">
        <Veil id="notes" />
        <div className={dim('notes')}><div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between mb-2">
            <SectionHeading label={t.notes.title} />
            {isAdmin && (
              <button
                onClick={openAddNote}
                className="flex items-center gap-1.5 text-sm bg-primary-600 text-white px-3 py-2 rounded-xl hover:bg-primary-700 transition font-medium mt-1"
              >
                <Plus size={15} /> 添加笔记
              </button>
            )}
          </div>
          <p className="text-gray-500 text-sm mb-8 -mt-6">{t.notes.subtitle}</p>

          {/* Add / Edit form */}
          {noteForm && (
            <div className="bg-white border border-primary-200 rounded-2xl p-5 mb-6 shadow-sm">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                {noteForm.mode === 'add' ? '添加笔记' : '编辑笔记'}
              </p>
              <div className="flex flex-col gap-2.5">
                <input
                  value={noteForm.title}
                  onChange={e => setNoteForm(f => f && { ...f, title: e.target.value })}
                  placeholder="笔记标题 *"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-primary-400"
                />
                <input
                  value={noteForm.tag}
                  onChange={e => setNoteForm(f => f && { ...f, tag: e.target.value })}
                  placeholder="分类标签（如：CTA 税法二）"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-primary-400"
                />
                <input
                  value={noteForm.href}
                  onChange={e => setNoteForm(f => f && { ...f, href: e.target.value })}
                  placeholder="文档链接 * （https://...）"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-primary-400"
                />
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={submitNoteForm}
                  disabled={!noteForm.title.trim() || !noteForm.href.trim()}
                  className="px-4 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  保存
                </button>
                <button
                  onClick={() => setNoteForm(null)}
                  className="px-4 py-1.5 text-gray-500 hover:bg-gray-100 rounded-lg text-sm transition"
                >
                  取消
                </button>
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {notes.map(note => (
              <div key={note.id} className="relative group">
                <a
                  href={note.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-3 h-full"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0">
                      <BookOpen size={18} className="text-primary-600" />
                    </div>
                    <ExternalLink size={14} className="text-gray-300 group-hover:text-primary-400 transition-colors flex-shrink-0 mt-1" />
                  </div>
                  <p className="flex-1 text-gray-800 font-medium text-sm leading-snug">{note.title}</p>
                  {note.tag && (
                    <span className="self-start text-xs font-medium bg-primary-50 text-primary-600 border border-primary-100 px-2.5 py-1 rounded-lg">
                      {note.tag}
                    </span>
                  )}
                </a>
                {/* Admin controls */}
                {isAdmin && (
                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={e => { e.preventDefault(); openEditNote(note); }}
                      className="w-6 h-6 bg-white border border-gray-200 rounded-md flex items-center justify-center hover:bg-primary-50 hover:border-primary-300 shadow-sm transition"
                      title="编辑"
                    >
                      <Pencil size={11} className="text-gray-500" />
                    </button>
                    <button
                      onClick={e => { e.preventDefault(); if (confirm('删除这条笔记？')) removeNote(note.id); }}
                      className="w-6 h-6 bg-white border border-gray-200 rounded-md flex items-center justify-center hover:bg-red-50 hover:border-red-300 shadow-sm transition"
                      title="删除"
                    >
                      <Trash2 size={11} className="text-red-400" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div></div>
      </section>
      )}

      {/* ── Contact ── */}
      <section id="contact" className="py-20 px-6 bg-gradient-to-br from-primary-600 to-primary-800 text-white scroll-mt-24">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{t.contact.title}</h2>
          <p className="text-primary-100 mb-12 max-w-xl mx-auto leading-relaxed">
            <E id={`contact.${lang}.message`} def={t.contact.message} />
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <a
              href="mailto:your@email.com"
              className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 hover:scale-[1.03] transition-all duration-200"
            >
              <Mail className="mx-auto mb-3" size={26} />
              <h3 className="font-semibold mb-1 text-sm">{t.contact.email}</h3>
              <p className="text-primary-100 text-xs">your@email.com</p>
            </a>
            <a
              href="https://github.com/yourusername"
              target="_blank" rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 hover:scale-[1.03] transition-all duration-200"
            >
              <Github className="mx-auto mb-3" size={26} />
              <h3 className="font-semibold mb-1 text-sm">{t.contact.github}</h3>
              <p className="text-primary-100 text-xs">yourusername</p>
            </a>
            <a
              href="#"
              target="_blank" rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 hover:scale-[1.03] transition-all duration-200"
            >
              <div className="flex justify-center mb-3"><XhsIcon size={26} /></div>
              <h3 className="font-semibold mb-1 text-sm">{t.contact.xiaohongshu}</h3>
              <p className="text-primary-100 text-xs">填写你的小红书</p>
            </a>
            <a
              href="#"
              target="_blank" rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 hover:scale-[1.03] transition-all duration-200"
            >
              <div className="flex justify-center mb-3"><BiliIcon size={26} /></div>
              <h3 className="font-semibold mb-1 text-sm">{t.contact.bilibili}</h3>
              <p className="text-primary-100 text-xs">填写你的B站</p>
            </a>
            <a
              href="tel:+86xxxxxxxxxx"
              className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 hover:scale-[1.03] transition-all duration-200"
            >
              <Phone className="mx-auto mb-3" size={26} />
              <h3 className="font-semibold mb-1 text-sm">{t.contact.phone}</h3>
              <p className="text-primary-100 text-xs">+86 xxx xxxx xxxx</p>
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-950 text-white py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-5">
          {/* 每日一言 */}
          {hitokoto && (
            <div className="text-center max-w-lg">
              <p className="text-gray-300 text-sm italic leading-relaxed">&ldquo;{hitokoto.hitokoto}&rdquo;</p>
              <p className="text-gray-600 text-xs mt-1.5">
                — {hitokoto.from_who ? `${hitokoto.from_who}，` : ''}{hitokoto.from}
              </p>
            </div>
          )}
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-3 border-t border-gray-800 pt-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white text-sm font-bold">YN</div>
              <span className="font-medium">{t.hero.title}</span>
            </div>
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} · Built with Next.js & Tailwind CSS</p>
          </div>
        </div>
      </footer>

      <CursorSparkle />

      <ResumeExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        experiences={experiences}
        projects={projects}
        lang={lang}
      />

      {/* Admin login dialog */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200]">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-80">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Lock size={16} /> 管理员登录</h3>
            <input
              type="password" value={adminPwInput}
              onChange={e => { setAdminPwInput(e.target.value); setAdminPwError(false); }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  if (login(adminPwInput)) { setShowAdminLogin(false); setAdminPwInput(''); }
                  else { setAdminPwError(true); setAdminPwInput(''); }
                }
              }}
              autoFocus placeholder="密码"
              className={`w-full border rounded-xl px-3 py-2 text-sm mb-3 focus:outline-none ${adminPwError ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-primary-400'}`}
            />
            {adminPwError && <p className="text-xs text-red-500 mb-2">密码错误</p>}
            <div className="flex gap-2">
              <button
                onClick={() => { if (login(adminPwInput)) { setShowAdminLogin(false); setAdminPwInput(''); } else { setAdminPwError(true); setAdminPwInput(''); } }}
                className="flex-1 bg-primary-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-primary-700 transition"
              >进入</button>
              <button onClick={() => { setShowAdminLogin(false); setAdminPwInput(''); setAdminPwError(false); }} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl text-sm transition">取消</button>
            </div>
          </div>
        </div>
      )}

      {/* Admin mode banner */}
      {isAdmin && (
        <div className="fixed bottom-0 left-0 right-0 z-[150] bg-amber-400 text-amber-900 px-6 py-2.5 flex items-center justify-between shadow-xl">
          <span className="text-sm font-semibold">⚙ 管理员编辑模式 — 点击任意高亮文字即可编辑，失焦自动保存到 localStorage</span>
          <div className="flex items-center gap-3">
            <button onClick={reset} className="flex items-center gap-1 text-xs font-medium underline hover:no-underline">
              <RotateCcw size={12} /> 重置所有修改
            </button>
            <button onClick={logout} className="flex items-center gap-1.5 bg-amber-900 text-amber-100 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-amber-800 transition">
              <LogOut size={12} /> 退出
            </button>
          </div>
        </div>
      )}
    </div>
    </AdminContext.Provider>
  );
}
