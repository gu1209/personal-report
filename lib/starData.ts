// STAR data for each experience — fill in your own data here

export interface StarEntry {
  title: string; titleEn: string;
  s: string; sEn: string;
  t: string; tEn: string;
  a: string; aEn: string;
  r: string; rEn: string;
}

/** Map keyed by exp.company (Chinese name) */
export const STAR_DATA: Record<string, StarEntry[]> = {
  // Example:
  // '公司名称': [
  //   {
  //     title: '项目名称', titleEn: 'Project Name',
  //     s: '背景描述', sEn: 'Situation',
  //     t: '任务', tEn: 'Task',
  //     a: '行动', aEn: 'Action',
  //     r: '结果', rEn: 'Result',
  //   }
  // ],
};
