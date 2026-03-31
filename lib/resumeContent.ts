/**
 * Rich resume content — independent from website display text.
 * Each experience has 2 bullets; each project has 2 bullets.
 * Use **text** for bold phrases (parsed in ResumeExportModal).
 * Edit this file to customise what appears in the exported resume.
 *
 * Keys must match exp.company / proj.title (Chinese names) in page.tsx.
 */

export interface BulletPair {
  zh: [string, string];
  en: [string, string];
}

// ── Internship experience bullets ─────────────────────────────────────────
export const EXP_CONTENT: Record<string, BulletPair> = {
  // Example entry — replace '示例公司A' with your actual exp.company value
  '示例公司A': {
    zh: [
      '**第一条工作亮点（加粗关键词）：**在这里填写你在该公司的第一条核心工作成果，尽量包含具体的行动、方法和**量化结果**，如效率提升xx%、完成xx项任务。',
      '**第二条工作亮点（加粗关键词）：**在这里填写你在该公司的第二条核心工作成果，结合你使用的工具或框架，说明你的专业价值，突出**独立完成**或**团队协作**的能力。',
    ],
    en: [
      '**First Key Achievement (bold keywords):** Write your first core achievement at this company, including specific actions, methods, and **quantified results** such as improving efficiency by xx% or completing xx tasks.',
      '**Second Key Achievement (bold keywords):** Write your second core achievement, combining tools or frameworks used to demonstrate your professional value and highlight **independent** or **collaborative** capabilities.',
    ],
  },

  // '示例公司B': {
  //   zh: ['第一条...', '第二条...'],
  //   en: ['First bullet...', 'Second bullet...'],
  // },
};

// ── Research project bullets ───────────────────────────────────────────────
export const PROJ_CONTENT: Record<string, BulletPair> = {
  // Example entry — replace key with your actual proj.title value
  '示例研究项目（进行中）': {
    zh: [
      '**研究目标：**在这里填写这个研究项目的核心问题和研究意义，说明为什么这个研究有价值，预期解决什么问题，目前**研究进行中**。',
      '**研究方法：**在这里填写你使用的核心技术路线和方法，如对比了xx种模型，采用xx算法，初步结果显示**某关键指标优于基准**（如夏普比率x.xx）。',
    ],
    en: [
      '**Objective:** Describe the core research question and significance — why this research is valuable and what problem it aims to solve. Research is currently **ongoing**.',
      '**Methodology:** Describe your technical approach and methods, e.g., compared xx models, applied xx algorithm, preliminary results show **a key metric outperforming baseline** (e.g., Sharpe ratio x.xx).',
    ],
  },

  '示例已完成项目': {
    zh: [
      '**项目目标：**在这里填写已完成项目的研究背景和核心目标，说明这个项目要解决的问题及其实际意义，**项目已成功结项**。',
      '**技术实现：**在这里填写主要的技术方案和实现细节，如使用xx框架，将关键指标从xx提升至xx，**AUC/准确率/某指标达到xxx**，项目结果得到应用。',
    ],
    en: [
      '**Objective:** Describe the research background and core objective of the completed project, explaining the problem solved and its practical significance. **Project successfully completed.**',
      '**Implementation:** Describe the technical solution and key details, such as using xx framework, improving a key metric from xx to xx, **AUC/accuracy/metric reaching xxx**, with results applied in practice.',
    ],
  },
};
