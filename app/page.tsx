'use client';
import { useState } from 'react';

const content = {
  zh: {
    nav: { about: '关于我', experience: '实习经历', projects: '项目经历', skills: '技能证书', contact: '联系方式' },
    hero: { name: '你的姓名', title: '专业方向', description: '在这里填写你的个人简介。', email: 'your@email.com' },
    about: { title: '关于我', intro: '在这里填写关于你自己的介绍。', education: { school: '你的学校', degree: '你的学位', period: '20xx.09 - 20xx.06', gpa: '', honors: '' } },
    experience: { title: '实习经历', items: [] },
    projects: { title: '项目经历', items: [] },
    skills: { title: '技能 & 证书', categories: [] },
    contact: { title: '联系方式', email: 'your@email.com', phone: '', github: '', linkedin: '' },
  },
  en: {
    nav: { about: 'About', experience: 'Experience', projects: 'Projects', skills: 'Skills', contact: 'Contact' },
    hero: { name: 'Your Name', title: 'Your Field', description: 'Write a short intro about yourself here.', email: 'your@email.com' },
    about: { title: 'About Me', intro: 'Write a short intro about yourself here.', education: { school: 'Your University', degree: 'Your Degree', period: '20xx.09 - 20xx.06', gpa: '', honors: '' } },
    experience: { title: 'Experience', items: [] },
    projects: { title: 'Projects', items: [] },
    skills: { title: 'Skills & Certifications', categories: [] },
    contact: { title: 'Contact', email: 'your@email.com', phone: '', github: '', linkedin: '' },
  },
};

type Lang = 'zh' | 'en';
type Content = typeof content.zh;

export default function HomePage() {
  const [lang, setLang] = useState<Lang>('zh');
  const t: Content = content[lang];
  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="font-bold text-lg">{t.hero.name}</span>
          <div className="flex items-center gap-6">
            <a href="#about" className="text-sm text-gray-600 hover:text-gray-900">{t.nav.about}</a>
            <a href="#experience" className="text-sm text-gray-600 hover:text-gray-900">{t.nav.experience}</a>
            <a href="#projects" className="text-sm text-gray-600 hover:text-gray-900">{t.nav.projects}</a>
            <a href="#skills" className="text-sm text-gray-600 hover:text-gray-900">{t.nav.skills}</a>
            <a href="#contact" className="text-sm text-gray-600 hover:text-gray-900">{t.nav.contact}</a>
            <button onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')} className="text-sm px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200">
              {lang === 'zh' ? 'EN' : '中文'}
            </button>
          </div>
        </div>
      </nav>
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">{t.hero.name}</h1>
          <p className="text-xl text-gray-600 mb-6">{t.hero.title}</p>
          <p className="text-gray-600 max-w-2xl">{t.hero.description}</p>
        </div>
      </section>
      <section id="about" className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t.about.title}</h2>
          <p className="text-gray-600 mb-8">{t.about.intro}</p>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-4">🎓 {t.about.education.school}</h3>
            <p className="text-gray-600">{t.about.education.degree} · {t.about.education.period}</p>
          </div>
        </div>
      </section>
      <section id="contact" className="py-20 px-6 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">{t.contact.title}</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {t.contact.email && <a href={`mailto:${t.contact.email}`} className="text-gray-300 hover:text-white">📧 {t.contact.email}</a>}
          </div>
        </div>
      </section>
      <footer className="py-6 text-center text-gray-400 text-sm">Built with Personal Report · Next.js</footer>
    </div>
  );
}
