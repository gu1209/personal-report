// STAR data for each experience — shared by website cards and resume modal
// Key must match exp.company (Chinese name) in page.tsx

export interface StarEntry {
  title: string;
  titleEn: string;
  s: string; sEn: string;
  t: string; tEn: string;
  a: string; aEn: string;
  r: string; rEn: string;
}

/** Map keyed by exp.company (Chinese name from page.tsx) */
export const STAR_DATA: Record<string, StarEntry[]> = {
  // Example entry — replace '示例公司A' with your actual exp.company value
  '示例公司A': [
    {
      title: '示例项目一标题',
      titleEn: 'Example Project One Title',
      s: '描述当时的背景和面临的问题或挑战（Situation）。',
      sEn: 'Describe the background and problem or challenge you faced (Situation).',
      t: '描述你需要完成的具体任务或目标（Task）。',
      tEn: 'Describe the specific task or goal you needed to accomplish (Task).',
      a: '描述你采取的具体行动和使用的方法工具（Action）。',
      aEn: 'Describe the specific actions you took and tools/methods used (Action).',
      r: '描述最终取得的可量化成果，如效率提升xx%（Result）。',
      rEn: 'Describe the quantifiable outcome achieved, e.g., efficiency improved xx% (Result).',
    },
    {
      title: '示例项目二标题',
      titleEn: 'Example Project Two Title',
      s: '在这里填写第二个STAR故事的背景。',
      sEn: 'Write the background for your second STAR story here.',
      t: '在这里填写你的任务目标。',
      tEn: 'Write your task objective here.',
      a: '在这里填写你采取的行动步骤。',
      aEn: 'Write the action steps you took here.',
      r: '在这里填写你取得的成果。',
      rEn: 'Write the results you achieved here.',
    },
  ],

  // Add more companies below:
  // '示例公司B': [
  //   {
  //     title: '项目名称', titleEn: 'Project Name',
  //     s: '情境', sEn: 'Situation',
  //     t: '任务', tEn: 'Task',
  //     a: '行动', aEn: 'Action',
  //     r: '结果', rEn: 'Result',
  //   }
  // ],
};
