# WorkBuddy 皮肤工坊 · 官网

产品展示网站，介绍两款 WorkBuddy 皮肤相关产品，并托管于 GitHub Pages。

## 两款产品

| 产品 | 仓库 | 作用 |
|---|---|---|
| **skin-generator** | [workbuddy-skin-generator](https://github.com/dreamsoldierwang-spec/workbuddy-skin-generator) | 安装在 WorkBuddy 里的 AI Skill，看图/配色一键生成 `.wbskin` 皮肤包 |
| **WorkBuddy 皮肤管理器** | [workbuddy-skin-manager](https://github.com/dreamsoldierwang-spec/workbuddy-skin-manager) | macOS 桌面应用（`.app` / `.dmg`），导入/应用/导出/恢复皮肤 |

## 网站内容

- 产品展示风格首页
- 两款产品功能介绍
- 四步使用流程（安装 Skill → 生成皮肤 → 管理器应用 → 恢复默认）
- 下载区：两款产品 + 已生成皮肤
- 踩坑指南：Apple 未签名（ad-hoc）的三种解决方式 + Developer ID 签名/公证命令
- 页脚导航

## 本地预览

纯静态站点，无需构建。直接打开 `index.html`，或用任意静态服务器：

```bash
python3 -m http.server 8080
# 浏览器访问 http://localhost:8080
```

> 注意：`assets/js/main.js` 通过 `fetch('downloads/skins/manifest.json')` 动态渲染皮肤卡片，
> 用 `file://` 直接打开时浏览器可能因 CORS 拦截 fetch，请用本地静态服务器预览。

## 目录结构

```
workbuddy-skin-studio/
├── index.html
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   └── img/{favicon.svg, og.svg}
├── downloads/
│   ├── skin-generator.zip        # skin-generator Skill 压缩包
│   └── skins/
│       ├── manifest.json         # 已生成皮肤清单（页面动态读取）
│       └── *.wbskin              # 已生成的皮肤包
└── README.md
```

## 部署

通过 GitHub Pages 托管：仓库 `dreamsoldierwang-spec/workbuddy-skin-studio`，
从 `main` 分支根目录构建，访问地址：

**https://dreamsoldierwang-spec.github.io/workbuddy-skin-studio/**

## 更新皮肤

把新的 `.wbskin` 放进 `downloads/skins/`，并在 `downloads/skins/manifest.json`
中追加一条 `{file, name, theme, accent, surface, desc}` 记录即可，页面会自动渲染。

---

© 2026 dreamsoldierwang-spec · 基于 WorkBuddy 桌面端构建
