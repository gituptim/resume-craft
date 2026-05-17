# Resume Craft

一个纯前端的个人简历生成器。左侧编辑内容、选择模板，右侧实时预览，支持一键导出 PDF。

**主页预览**: https://gituptim.github.io/resume-craft/#welcome
**在线预览**: https://gituptim.github.io/resume-craft/

## 功能特性

- **8 种精美模板**：经典商务、现代简约、极简留白、创意个性、优雅学术、科技现代、时间轨迹、紧凑高效，切换时内容不丢失
- **实时预览**：右侧固定区域即时渲染，A4 纸张比例
- **内容编辑**：个人信息、工作经历、教育背景、技能、项目经验、荣誉奖项、自我评价，支持增删条目
- **自定义板块**：支持添加自定义内容板块，灵活编排简历结构
- **板块排序**：自由调整各板块的展示顺序
- **技能双模式**：简洁模式（一行展示）或详细模式（带描述和熟练度）
- **主题配色**：支持自定义主题色
- **字体与排版**：可调节正文字号、标题字号、板块间距、字体家族
- **数据导入导出**：支持 JSON 格式的数据导入和导出
- **本地持久化**：自动保存到 localStorage，刷新不丢数据
- **导出 PDF**：调用浏览器原生打印，通过 `@media print` 隐藏 UI，仅输出简历内容

## 技术栈

- React 19 + TypeScript + Vite
- Tailwind CSS 3 + shadcn/ui
- Lucide React
- Framer Motion

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 构建与部署

项目已配置 GitHub Pages 部署：

```bash
# 构建并部署到 GitHub Pages
npm run build
# 将 dist 目录内容推送到 gh-pages 分支
```

详见 `package.json` 中的 `homepage` 配置。

## 项目结构

```
src/
  components/       # 编辑器表单组件（编辑器面板、设置面板等）
  templates/        # 8 个简历模板组件
  context/          # 全局状态管理（React Context）
  hooks/            # 自定义 Hooks
  types/            # TypeScript 类型定义
  pages/            # 页面组件（Landing 落地页、Editor 编辑页等）
  lib/              # 工具函数和 UI 组件库
  App.tsx           # 应用入口
  main.tsx          # 渲染入口
```

## 数据模型

简历数据通过 `ResumeContext` 全局管理，结构如下：

```typescript
interface ResumeData {
  personal: {
    name: string
    title: string
    email: string
    phone: string
    location: string
    website?: string
    customFields: Array<{ id; label; value }>
  }
  summary: string
  experience: Array<{ id; company; position; startDate; endDate; description }>
  education: Array<{ id; school; degree; startDate; endDate }>
  skills: Array<{ id; name; description; level; showLevel }>
  projects: Array<{ id; name; description; link? }>
  awards: Array<{ id; name; issuer; date; description? }>
  customSections: Array<{ id; title; items: [...] }>
  sectionOrder: Array<{ type: 'builtin' | 'custom'; ... }>
  layout: { sectionSpacing; bodyFontSize; headingFontSize; fontFamily }
  color?: string
  skillDisplayMode: 'simple' | 'detailed'
}
```
