# SPEC.md — Resume Craft（简历生成器）

## Objective

构建一个纯前端个人简历生成器。用户在左侧面板选择模板并编辑内容，右侧实时预览 HTML 简历样式，支持一键打印/导出 PDF。

**目标用户**: 需要快速制作和美化个人简历的求职者。

---

## Core Features & Acceptance Criteria

### 1. 模板选择（Template Selector）
- [ ] 左侧顶部提供 3-4 种预设模板切换
- [ ] 模板风格：简约商务、现代卡片、经典学术、创意色块
- [ ] 切换模板时右侧预览即时刷新，已填内容不丢失

### 2. 内容编辑（Content Editor）
- [ ] 左侧下方分板块编辑：个人信息、工作经历、教育背景、技能、项目经验、自我评价
- [ ] 每个板块支持新增/删除条目（如多段工作经历）
- [ ] 实时保存到 localStorage，刷新页面数据不丢失
- [ ] 提供「重置」和「清空」按钮

### 3. 实时预览（Live Preview）
- [ ] 右侧固定区域实时渲染 HTML 简历
- [ ] 预览区域可缩放（适应屏幕/实际大小）
- [ ] 预览内容随左侧编辑即时更新，无明显延迟

### 4. 导出功能（Export）
- [ ] 「打印/导出 PDF」按钮调用浏览器原生 `window.print()`
- [ ] 通过 `@media print` CSS 隐藏编辑器 UI，仅输出简历内容
- [ ] A4 纸张比例预览，分页符合理

---

## Tech Stack

| 层级 | 技术 | 理由 |
|------|------|------|
| 框架 | React 19 + TypeScript + Vite | 团队熟悉，开发快，类型安全 |
| 样式 | Tailwind CSS 4 | 原子化样式，快速调整，打印样式友好 |
| 状态 | React Context + useReducer | 纯前端无需 Redux，数据流清晰 |
| 持久化 | localStorage | 无后端，数据本地保存 |
| 图标 | Lucide React | 轻量，风格统一 |
| 字体 | 系统字体栈（中文优先 PingFang SC / Microsoft YaHei）| 无需网络加载，打印稳定 |

---

## Project Structure

```
resume-craft/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types/
│   │   └── resume.ts          # 简历数据类型定义
│   ├── context/
│   │   └── ResumeContext.tsx  # 全局状态管理
│   ├── hooks/
│   │   └── useLocalStorage.ts # localStorage 持久化 Hook
│   ├── components/
│   │   ├── Layout.tsx         # 左右分栏布局
│   │   ├── Sidebar.tsx        # 左侧编辑器容器
│   │   ├── Preview.tsx        # 右侧预览容器
│   │   ├── TemplateSelector.tsx   # 模板切换
│   │   ├── EditorSection.tsx      # 通用编辑板块
│   │   ├── PersonalInfoForm.tsx   # 个人信息表单
│   │   ├── ExperienceForm.tsx     # 工作经历表单
│   │   ├── EducationForm.tsx      # 教育背景表单
│   │   ├── SkillsForm.tsx         # 技能表单
│   │   ├── ProjectsForm.tsx       # 项目经验表单
│   │   └── SummaryForm.tsx        # 自我评价表单
│   ├── templates/
│   │   ├── MinimalTemplate.tsx    # 简约商务
│   │   ├── ModernTemplate.tsx     # 现代卡片
│   │   ├── ClassicTemplate.tsx    # 经典学术
│   │   └── CreativeTemplate.tsx   # 创意色块
│   │   └── index.ts               # 模板注册
│   └── utils/
│       └── print.ts           # 打印相关工具
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.ts
```

---

## Commands

```bash
# 安装依赖
npm install

# 开发
npm run dev

# 类型检查
npx tsc --noEmit

# 构建
npm run build

# 预览生产构建
npm run preview
```

---

## Code Style

- **TypeScript**: 严格模式，优先用 `type` 定义数据结构
- **组件**: 函数组件 + Hooks，单一职责
- **样式**: Tailwind 为主，打印专用样式放在 `@media print` 中
- **命名**: 组件 PascalCase，函数/变量 camelCase，类型/接口 PascalCase

---

## Testing Strategy

- 纯前端 MVP 阶段暂不引入自动化测试
- 验收标准：Chrome/Firefox/Safari 最新两版正常渲染和打印
- 关键路径人工验证：编辑内容 → 切换模板 → 打印预览 → 导出 PDF

---

## Data Model

```typescript
type ResumeData = {
  personal: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
  }>;
  skills: string[];
  projects: Array<{
    id: string;
    name: string;
    description: string;
    link?: string;
  }>;
};

type TemplateId = 'minimal' | 'modern' | 'classic' | 'creative';
```

---

## Boundaries

### Always Do
- 编辑内容实时保存到 localStorage
- 打印样式独立，隐藏所有 UI 控件
- A4 比例预览（210mm x 297mm）

### Ask First About
- 接入后端保存/云端同步
- 增加更多模板（超过 4 个）
- 多语言支持（英文简历）

### Never Do
- MVP 阶段引入后端或数据库
- 使用复杂状态管理库（Redux/MobX）
- 引入重型 UI 组件库（Ant Design/Material UI）
