import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

/**
 * ResumeConverter — converts portfolio data to DOCX using STAR format.
 * Fill in your own experience/project data here, or extend convertExperience
 * and convertProject to match your companies/projects by name.
 */
export class ResumeConverter {

  static getBasicInfo(lang: 'zh' | 'en') {
    return lang === 'zh'
      ? {
          name: '你的姓名',
          title: '你的职位方向',
          email: 'your@email.com',
          phone: '',
          github: '',
          location: '你的城市',
          education: '你的学校 学位',
        }
      : {
          name: 'Your Name',
          title: 'Your Target Role',
          email: 'your@email.com',
          phone: '',
          github: '',
          location: 'Your City',
          education: 'Your University — Your Degree',
        };
  }

  static getObjective(lang: 'zh' | 'en') {
    return lang === 'zh'
      ? '在这里填写你的求职意向。'
      : 'Write your career objective here.';
  }

  /**
   * Convert a single experience to STAR entries.
   * Add your own company-specific logic here by matching exp.company.
   */
  static convertExperience(exp: any, lang: 'zh' | 'en'): any[] {
    const isZh = lang === 'zh';
    const highlights: string[] = isZh ? (exp.highlights || []) : (exp.highlightsEn || exp.highlights || []);
    return highlights.map((h: string, idx: number) => ({
      title: `${exp.company} — 工作成果 ${idx + 1}`,
      company: isZh ? exp.company : (exp.companyEn || exp.company),
      period: isZh ? exp.period : (exp.periodEn || exp.period),
      star: {
        situation: '',
        task: '',
        action: h,
        result: '',
      },
    }));
  }

  /**
   * Convert a single project to STAR entries.
   * Add your own project-specific logic here by matching proj.title.
   */
  static convertProject(proj: any, lang: 'zh' | 'en'): any[] {
    const isZh = lang === 'zh';
    const title = isZh ? proj.title : (proj.titleEn || proj.title);
    const objective = isZh ? (proj.objective || '') : (proj.objectiveEn || proj.objective || '');
    const findings  = isZh ? (proj.findings  || '') : (proj.findingsEn  || proj.findings  || '');
    return [{
      title: title,
      project: title,
      period: proj.period || '',
      star: {
        situation: '',
        task: objective,
        action: proj.methodology || '',
        result: findings,
      },
    }];
  }

  static async generateResume(
    selectedExperiences: any[],
    selectedProjects: any[],
    lang: 'zh' | 'en' = 'zh'
  ): Promise<Blob> {
    const basic = this.getBasicInfo(lang);
    const objective = this.getObjective(lang);
    const isZh = lang === 'zh';

    const starExperiences: any[] = [];
    selectedExperiences.forEach(exp => starExperiences.push(...this.convertExperience(exp, lang)));

    const starProjects: any[] = [];
    selectedProjects.forEach(proj => starProjects.push(...this.convertProject(proj, lang)));

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({ text: basic.name, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
          new Paragraph({ text: basic.title, heading: HeadingLevel.HEADING_2, alignment: AlignmentType.CENTER }),
          new Paragraph({ text: [basic.email, basic.phone, basic.github, basic.location].filter(Boolean).join(' | '), alignment: AlignmentType.CENTER }),
          new Paragraph({ text: '' }),

          new Paragraph({ text: isZh ? '求职意向' : 'Career Objective', heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: objective }),
          new Paragraph({ text: '' }),

          new Paragraph({ text: isZh ? '实习经历' : 'Experience', heading: HeadingLevel.HEADING_2 }),
          ...starExperiences.flatMap((exp, idx) => [
            new Paragraph({ text: `${exp.company} | ${exp.title} | ${exp.period}`, heading: HeadingLevel.HEADING_3 }),
            ...(exp.star.action ? [new Paragraph({ children: [new TextRun({ text: isZh ? '工作内容：' : 'Action: ', bold: true }), new TextRun({ text: exp.star.action })] })] : []),
            ...(exp.star.result ? [new Paragraph({ children: [new TextRun({ text: isZh ? '成果：' : 'Result: ', bold: true }), new TextRun({ text: exp.star.result })] })] : []),
          ]),
          new Paragraph({ text: '' }),

          new Paragraph({ text: isZh ? '项目经历' : 'Projects', heading: HeadingLevel.HEADING_2 }),
          ...starProjects.flatMap((proj) => [
            new Paragraph({ text: proj.title, heading: HeadingLevel.HEADING_3 }),
            ...(proj.star.task   ? [new Paragraph({ children: [new TextRun({ text: isZh ? '目标：' : 'Objective: ', bold: true }), new TextRun({ text: proj.star.task })] })] : []),
            ...(proj.star.result ? [new Paragraph({ children: [new TextRun({ text: isZh ? '成果：' : 'Result: ', bold: true }), new TextRun({ text: proj.star.result })] })] : []),
          ]),
        ],
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    return new Blob([new Uint8Array(buffer)], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
  }
}
