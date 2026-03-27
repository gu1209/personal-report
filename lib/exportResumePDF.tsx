'use client';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { ResumePDF } from './ResumePDFGenerator';

export async function exportResumeToPDF(experiences?: any[], projects?: any[]) {
  const data = {
    basic: {
      name: 'Your Name',
      jobTitle: 'Your Title',
      phone: '',
      email: 'your@email.com',
      location: '',
    },
    education: [],
    experiences: (experiences || []).map((exp: any) => ({
      position: exp.role || exp.roleEn || '',
      company:  exp.company || exp.companyEn || '',
      duration: exp.period || '',
      highlights: (exp.highlights || []).map((h: string) => ({ title: '', content: h })),
    })),
    projects: (projects || []).map((p: any) => ({
      role:     p.subtitle || '',
      name:     p.title || p.titleEn || '',
      duration: p.period || '',
      details: [
        ...(p.objective ? [{ title: '目标', content: p.objective }] : []),
        ...(p.findings  ? [{ title: '成果', content: p.findings  }] : []),
      ],
    })),
    skills: [],
  };
  const blob = await pdf(<ResumePDF data={data} language="zh" />).toBlob();
  saveAs(blob, 'resume.pdf');
}

export const exportResumePDF = exportResumeToPDF;
