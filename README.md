# Resume Craft

一个纯前端的个人简历生成器。左侧编辑内容、选择模板，右侧实时预览，支持一键导出 PDF。

## 功能

- **模板切换**：4 种预设模板（简约商务、现代卡片、经典学术、创意色块），切换时内容不丢失
- **内容编辑**：个人信息、工作经历、教育背景、技能、项目经验、自我评价，支持增删条目
- **实时预览**：右侧固定区域即时渲染，A4 纸张比例
- **本地持久化**：自动保存到 localStorage，刷新不丢数据
- **导出 PDF**：调用浏览器原生打印，通过 `@media print` 隐藏 UI，仅输出简历内容

## 技术栈

- React 19 + TypeScript + Vite
- Tailwind CSS 4
- Lucide React

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
src/
  components/       # 编辑器表单组件
  templates/        # 简历模板
  context/          # 全局状态 (React Context)
  hooks/            # 自定义 Hooks
  types/            # TypeScript 类型定义
  utils/            # 工具函数
```

## 数据模型

简历数据通过 `ResumeContext` 全局管理，结构如下：

```typescript
interface ResumeData {
  personal: { name; title; email; phone; location; website? };
  summary: string;
  experience: Array<{ id; company; position; startDate; endDate; description }>;
  education: Array<{ id; school; degree; startDate; endDate }>;
  skills: string[];
  projects: Array<{ id; name; description; link? }>;
}
```
