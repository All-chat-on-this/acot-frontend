# ACOT前端UI设计文档

## 1. 整体设计理念

ACOT（All Chat On This）作为一个高度自定义化的AI API调用平台，UI设计需遵循以下原则：

1. **简洁直观**：界面简洁、功能直观，降低用户学习成本
2. **高度自定义**：支持多种主题、界面布局可调整
3. **响应式设计**：适配不同设备尺寸，从手机到桌面端
4. **视觉美观**：提供现代化UI设计，支持多种主题风格

## 2. 页面风格设计

### 2.1 主题类型

根据用户不同需求与使用场景，提供以下主题风格：

1. **明亮主题 (Light)**
   - 主色调：白色背景 (#FFFFFF)，蓝色主题色 (#1890FF)
   - 字体颜色：深灰 (#333333)
   - 边框与分隔线：浅灰 (#E8E8E8)
   - 适合日间使用，降低眼部疲劳

2. **暗黑主题 (Dark)**
   - 主色调：深灰背景 (#1F1F1F)，蓝色主题色 (#1890FF)
   - 字体颜色：浅灰 (#E0E0E0)
   - 边框与分隔线：灰色 (#444444)
   - 适合夜间使用，降低屏幕亮度对眼睛的刺激

3. **毛玻璃梦幻主题 (DreamlikeColor)**
   - 用户若没有配置主题则默认使用该主题
   - 背景：渐变的多彩色彩，带有模糊效果，营造梦幻流淌般的视觉感受
   - 明亮模式：淡色系渐变 (如 `linear-gradient(120deg, rgba(224, 195, 252, 0.7), rgba(142, 197, 252, 0.7))`)
   - 暗黑模式：深色系渐变 (如 `linear-gradient(120deg, rgba(50, 25, 79, 0.8), rgba(20, 30, 90, 0.8))`)
   - 模糊值：12px-15px，创造朦胧梦幻效果
   - 界面元素：半透明容器，让背景色微妙流淌其中
   - 视觉体验：如同在彩色河流中漂流，界面元素像是浮在水面上的浮标

4. **自定义主题**
   - 允许用户自定义颜色、透明度、字体等
   - 支持导入/导出自定义主题配置

### 2.2 字体与排版

- 主要字体：系统默认字体（无衬线）
- 代码字体：等宽字体（如Consolas, Menlo）
- 默认字号：16px（正文），可在设置中调整
- 行高：1.5倍字号，提高可读性

### 2.3 交互设计

- 按钮、输入框等交互元素具有明确的悬停、点击反馈
- 动画：简洁轻量的过渡效果，不过度干扰用户体验
- 消息气泡：用户与AI的对话采用不同方向的气泡区分

## 3. 页面结构与功能

### 3.1 登录/注册页面

![登录页面示意图]

**功能与元素：**
- 用户名/密码登录表单
- 第三方登录选项（QQ、微信）
- 注册入口
- 忘记密码链接
- 主题切换按钮（右上角）

### 3.2 主页/对话页面

![主页示意图]

**功能与元素：**
- 左侧边栏：
  - 历史对话列表
  - 新建对话按钮
  - 对话历史记录检索
- 中央对话区域：
  - 对话历史记录展示
  - 支持富文本与代码块展示
  - 可选思考链（Chain-of-Thought）展示区域
- 底部输入区：
  - 消息输入框（支持多行）
  - 发送按钮
  - 附加功能按钮（上传、清空等）
- 右侧功能面板（可折叠）：
  - 当前会话配置快速访问
  - 上下文管理
  - 导出对话按钮
  - 配置中心入口
  - 用户信息与设置入口

### 3.3 配置中心页面

![配置中心示意图]

**功能与元素：**
- 配置列表：
  - 已保存的API配置列表
  - 新建配置按钮
  - 导入/导出配置按钮
- 配置编辑区域：
  - API基础设置（URL、Key、代理等）
  - 请求格式自定义区域（JSON编辑器）
  - 响应格式自定义区域（JSON编辑器）
  - 字段映射设置（角色、对话文本、思考链等）
  - 测试连接按钮
  - 保存按钮

### 3.4 个人中心页面

![个人中心示意图]

**功能与元素：**
- 用户基本信息展示与编辑
- 密码修改
- 第三方账号绑定管理
- 主题设置面板
- 语言设置
- 数据管理选项（导出全部数据、清空历史等）
- 隐私设置（是否保存对话、思考链等）

### 3.5 搜索结果页面

![搜索结果示意图]

**功能与元素：**
- 搜索框与条件筛选
- 搜索结果列表
  - 匹配的对话片段预览
  - 所属会话信息
  - 时间信息
- 点击跳转至原对话功能

## 4. 主题切换实现方案

### 4.1 技术实现

使用**Styled Components**与**Context API**实现主题系统：

```typescript
// 主题定义
const themes = {
  light: {
    primary: '#1890FF',
    background: '#FFFFFF',
    text: '#333333',
    border: '#E8E8E8',
    // 其他样式变量
  },
  dark: {
    primary: '#1890FF',
    background: '#1F1F1F',
    text: '#E0E0E0',
    border: '#444444',
    // 其他样式变量
  },
  dreamlikeColorLight: {
    primary: '#1890FF',
    background: 'linear-gradient(120deg, rgba(224, 195, 252, 0.7), rgba(142, 197, 252, 0.7))',
    text: '#333333',
    border: 'rgba(255, 255, 255, 0.18)',
    blurAmount: '15px',
    // 其他样式变量
  },
  dreamlikeColorDark: {
    primary: '#3DACFF',
    background: 'linear-gradient(120deg, rgba(50, 25, 79, 0.8), rgba(20, 30, 90, 0.8))',
    text: '#E0E0E0',
    border: 'rgba(255, 255, 255, 0.08)',
    blurAmount: '15px',
    // 其他样式变量
  },
  // 更多主题...
};

// 创建主题上下文
const ThemeContext = React.createContext({
  theme: themes.light,
  setTheme: () => {},
});

// 主题提供者组件
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.light);
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ThemeWrapper theme={theme}>
        {children}
      </ThemeWrapper>
    </ThemeContext.Provider>
  );
};

// 在样式组件中使用主题
const Button = styled.button`
  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.background};
  // 其他样式
`;
```

- 支持动态切换主题，无需刷新页面
- 主题配置保存至用户配置表，登录后自动应用
- 提供默认主题与用户自定义主题

### 4.2 毛玻璃梦幻效果实现

使用CSS的backdrop-filter和渐变背景实现梦幻炫彩效果：

```css
/* 明亮梦幻炫彩 */
.dreamlikeColor-light {
  background: linear-gradient(120deg, rgba(224, 195, 252, 0.7), rgba(142, 197, 252, 0.7));
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
}

/* 暗黑梦幻炫彩 */
.dreamlikeColor-dark {
  background: linear-gradient(120deg, rgba(50, 25, 79, 0.8), rgba(20, 30, 90, 0.8));
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* 主容器背景 - 明亮模式 */
.app-container.dreamlikeColor-light {
  background: linear-gradient(135deg, 
    rgba(176, 229, 208, 0.7) 0%, 
    rgba(224, 195, 252, 0.7) 25%, 
    rgba(142, 197, 252, 0.7) 50%, 
    rgba(224, 195, 252, 0.7) 75%, 
    rgba(176, 229, 208, 0.7) 100%);
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}

/* 主容器背景 - 暗黑模式 */
.app-container.dreamlikeColor-dark {
  background: linear-gradient(135deg, 
    rgba(32, 32, 72, 0.8) 0%, 
    rgba(50, 25, 79, 0.8) 25%, 
    rgba(20, 30, 90, 0.8) 50%, 
    rgba(50, 25, 79, 0.8) 75%, 
    rgba(32, 32, 72, 0.8) 100%);
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}

/* 动画效果 - 让颜色流动 */
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

### 4.3 响应式设计

使用CSS Grid和Media Queries实现响应式布局：

```css
.app-container {
  display: grid;
  grid-template-columns: 250px 1fr 300px;
  grid-template-areas: "sidebar main rightpanel";
}

@media (max-width: 992px) {
  .app-container {
    grid-template-columns: 1fr;
    grid-template-areas: 
      "main"
      "sidebar"
      "rightpanel";
  }
  
  .sidebar, .rightpanel {
    position: fixed;
    z-index: 100;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .sidebar.active, .rightpanel.active {
    transform: translateX(0);
  }
}
```

## 5. 主题设置面板

### 5.1 位置与访问方式

主题设置面板可通过以下方式访问：

1. **全局快速访问**：
   - 页面右上角的主题切换图标
   - 点击后显示简化的主题选择器弹窗

2. **个人中心详细设置**：
   - 在个人中心页面的"外观设置"部分
   - 提供完整的主题自定义选项

### 5.2 交互逻辑

**快速主题切换**：
1. 用户点击右上角主题图标
2. 弹出简洁主题选择器（浅色/深色/梦幻炫彩/极简）
3. 用户选择后立即应用，并自动保存至用户配置
4. 提供"更多设置"入口，跳转至个人中心

**详细主题设置（个人中心）**：
1. 预设主题列表，点击即可预览与应用
2. 自定义主题区域：
   - 颜色选择器（主色调、背景色、文本色等）
   - 透明度调节滑块（针对毛玻璃效果）
   - 模糊度调节滑块（针对毛玻璃效果）
   - 渐变色选择器（针对梦幻炫彩主题）
   - 字体大小调整
   - 布局密度选择
3. 保存/重置/导出按钮
4. 实时预览当前设置效果

### 5.3 用户偏好保存

- 主题设置保存在用户配置表中（`user_config`的`config_key`为`"theme_settings"`）
- 本地也使用localStorage缓存，提高加载速度
- 未登录用户的主题偏好仅保存在localStorage
- 用户登录后自动同步云端配置

## 6. 消息气泡与思考链设计

### 6.1 基本消息气泡

- 用户消息：右侧对齐，蓝色背景
- AI消息：左侧对齐，灰色背景
- 系统消息：中间对齐，淡黄色背景
- 支持markdown格式化、代码高亮、表格等富文本

### 6.2 思考链展示

根据用户配置，可选择显示AI的思考过程：

- 思考链开关：在对话界面右上角提供开关按钮
- 思考链展示方式：**内联模式**：思考文本嵌入在AI回复中，使用特殊样式区分

## 7. 文件/配置导入导出

### 7.1 UI设计

- 导出按钮：清晰的下载图标
- 导入区域：支持拖放文件或点击选择
- 导入验证：上传后进行格式检查，显示预览
- 导入选项：提供"覆盖现有"或"作为新配置"的选择

### 7.2 交互流程

**导出流程**：
1. 用户点击导出按钮
2. 询问是否包含敏感信息（可选）
3. 生成JSON文件并触发下载

**导入流程**：
1. 用户上传JSON文件
2. 前端进行基础验证
3. 显示导入预览和选项
4. 确认后提交至后端处理
5. 显示成功/失败反馈

## 8. 移动端适配

### 8.1 布局调整

- 侧边栏转为抽屉菜单
- 对话区域最大化
- 输入框自适应高度
- 功能按钮集中至底部导航栏

### 8.2 手势支持

- 左滑显示历史对话列表
- 右滑显示配置面板
- 下拉刷新对话
- 长按消息显示操作菜单

## 10. UI组件库与资源

推荐使用以下技术与资源：

1. **UI组件库**：
   - Ant Design（https://ant.design/）
   - Material-UI（https://mui.com/）

2. **图标资源**：
   - Phosphor Icons（https://phosphoricons.com/）
   - Heroicons（https://heroicons.com/）

3. **插件与工具**：
   - React Monaco Editor（代码编辑器）
   - React Markdown（Markdown渲染）
   - Framer Motion（动画效果）
   - React Color（颜色选择器）

## 11. 国际化支持

系统支持多语言，通过i18next实现国际化支持：

### 11.1 支持的语言

- 英语（默认）
- 中文
- 更多语言可扩展

### 11.2 实现方式

使用i18next和react-i18next库实现国际化：

```typescript
// i18n实例配置
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en';
import zhTranslation from './locales/zh';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      zh: { translation: zhTranslation }
    },
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
```

### 11.3 语言切换组件

在头部导航栏添加语言切换组件，允许用户快速切换语言：

- 显示当前语言
- 点击后弹出支持的语言列表
- 选择后立即应用并保存到用户配置

### 11.4 翻译范围

国际化覆盖全部UI元素，包括但不限于：

- 导航菜单和按钮文本
- 表单标签和占位符
- 提示和错误消息
- 设置面板和选项
- 系统消息和通知
- 模态框和对话框
- JSONEditor路径编辑器字段和提示

### 11.5 动态内容

对于动态生成的内容（如AI回复）不进行翻译，保持原样展示。

## 12. 项目文件结构

```
src/
├── assets/                 # 静态资源（图片、图标等）
├── components/             # 通用组件
│   ├── Layout/             # 布局组件
│   ├── ThemeProvider/      # 主题提供者
│   ├── ChatBubble/         # 对话气泡组件
│   ├── CodeBlock/          # 代码块组件 
│   └── ThemeSelector/      # 主题选择器组件
├── pages/                  # 页面组件
│   ├── Login/              # 登录页
│   ├── Register/           # 注册页
│   ├── Chat/               # 对话页
│   ├── Config/             # 配置中心页
│   ├── Profile/            # 个人中心页
│   └── Search/             # 搜索结果页
├── hooks/                  # 自定义钩子
│   ├── useTheme.ts         # 主题钩子
│   └── useLocalStorage.ts  # 本地存储钩子
├── styles/                 # 样式文件
│   ├── themes.ts           # 主题定义
│   └── global.css          # 全局样式
├── utils/                  # 工具函数
├── services/               # API服务
└── store/                  # 状态管理
```