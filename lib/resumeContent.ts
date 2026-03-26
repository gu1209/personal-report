/**
 * Rich resume content — independent from website display text.
 * Each experience has 2 bullets; each project has 2 bullets.
 * Use **text** for bold phrases (parsed in ResumeExportModal).
 * Edit this file to customise what appears in the exported resume.
 */

export interface BulletPair {
  zh: [string, string];
  en: [string, string];
}

// ── Internship experience bullets ─────────────────────────────────────────
// Key = exp.company (Chinese name from page.tsx)
export const EXP_CONTENT: Record<string, BulletPair> = {
  '公司名称': {
    zh: [
      '**第一点成就：**描述你在该岗位的第一个主要成就，使用STAR法则，突出你的行动和量化结果。',
      '**第二点成就：**描述你的第二个主要成就，展示你在不同维度上的能力和贡献。',
    ],
    en: [
      '**Achievement 1:** Describe your first key achievement at this position using the STDAR method, highlighting your actions and quantified results.',
      '**Achievement 2:** Describe your second key achievement, showcasing your abilities and contributions in different dimensions.',
    ],
  },
};

// ── Research project bullets ───────────────────────────────────────────────
// Key = proj.title (Chinese name from page.tsx)
export const PROJ_CONTENT: Record<string, BulletPair> = {
  项目名称: {
    zh: [
      '**项目目标：**简要说明项目的目标和你的角色。',
      '**技术实现：**描述你使用的技术栈、方法或模型，以及项目成果和量化指标。',
    ],
    en: [
      '**Objective:** Briefly explain the project goal and your role.',
      '**Implementation:** Describe the tech stack, methods, or models you used, along with project outcomes and metrics.',
    ],
  },
};
