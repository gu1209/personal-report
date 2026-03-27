'use client';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { ResumePDF } from './ResumePDFGenerator';

export async function exportResumeToPDF(experiences?: any[], projects?: any[]) {
  const data = {
    basic: {
      name: 'Your Name', nameEn: 'Your Name',
      title: 'Your Title', email: 'your@email.com',
      phone: '', github: '',
      university: 'Your University', degree: 'Your Degree',
      period: '20xx - 20xx', gpa: '',
    },
    experiences: experiences || [],
    projects: projects || [],
    skills: [],
  };
  const blob = await pdf(<ResumePDF data={data} language="zh" />).toBlob();
  saveAs(blob, 'resume.pdf');
}

export const exportResumePDF = exportResumeToPDF;
