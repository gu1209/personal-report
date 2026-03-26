// STAR data for each experience — shared by website cards and resume modal

export interface StarEntry {
  title: string;
  titleEn: string;
  s: string; sEn: string;
  t: string; tEn: string;
  a: string; aEn: string;
  r: string; rEn: string;
}

/** Map keyed by exp.company (Chinese name) */
export const STAR_DATA: Record<string, StarEntry[]> = {
  '公司名称': [
    {
      title: '示例STAR项目一',
      titleEn: 'Example STAR Project 1',
      s: '描述情境（Situation）：当时面临的背景、挑战或问题是什么？',
      sEn: 'Describe the situation: What was the background, challenge, or problem you faced?',
      t: '描述任务（Task）：你需要完成的具体任务或目标是什么？',
      tEn: 'Describe the task: What specific task or goal did you need to accomplish?',
      a: '描述行动（Action）：你采取了哪些具体行动和步骤？使用了什么工具或方法？',
      aEn: 'Describe the action: What specific actions and steps did you take? What tools or methods did you use?',
      r: '描述结果（Result）：最终取得了什么成果？最好有量化数据。',
      rEn: 'Describe the result: What was the final outcome? Quantifiable results are best.',
    },
    {
      title: '示例STAR项目二',
      titleEn: 'Example STAR Project 2',
      s: '另一个情境描述：面临的背景、挑战或问题是什么？',
      sEn: 'Another situation: What was the background, challenge, or problem?',
      t: '另一个任务描述：需要完成的具体任务或目标是什么？',
      tEn: 'Another task: What specific task or goal needed to be accomplished?',
      a: '另一个行动描述：采取的具体行动和步骤，使用的工具或方法。',
      aEn: 'Another action: Specific actions and steps taken, tools or methods used.',
      r: '另一个结果描述：取得的成果，最好有量化数据。',
      rEn: 'Another result: The achieved outcome, preferably with quantifiable data.',
    },
  ],
};
