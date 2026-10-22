# 简历助手

[简体中文](README.md) · [English](README.en.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md)

SQHOME 旗下的简历排版应用。将兼容的简历 JSON 渲染为商务风格的简历网页。默认加载内置示例简历，所有文件均在浏览器本地处理，不需要后端。

示例中的人物、联系方式、公司、学校、工作经历和项目均为虚构内容，不包含真实头像、账号 ID 或渲染令牌。原始个人简历不会被应用默认加载或打包；发布源码时仍需自行排除私人 JSON 文件。

## 运行

需要 Node.js 18+。

```sh
npm install
npm run dev
```

打开终端输出的本地地址。

```sh
npm test
npm run build
npm run preview
```

## 功能

- 商务双栏、经典单栏正文排版；标准与头像居中两种头部样式；五种莫兰迪主题色。
- 界面支持简体中文、英语、日语、韩语、西班牙语和法语。语言选择保存在本地；使用内置示例时切换语言会切换到对应语言的示例，导入自己的 JSON 后只切换界面语言，不会替换简历内容。
- 内置示例可直接作为模板：打开应用后点击「编辑内容」，修改示例简历并保存；再点击「下载 JSON」即可保存自己的副本。编辑示例时切换语言会载入对应语言的原始示例。
- 多色章节图标、工作经历时间线、项目序号和联系方式图标；无头像时显示姓名缩写，导出 HTML 和打印同样保留图标样式。
- JSON 文件导入、章节显隐、头像开关、预览缩放。
- 页面编辑：修改个人资料和头像地址，通过富文本编辑器调整简介、工作和项目描述，增删经历条目及自定义章节，实时预览；支持保存或取消本轮修改。
- 下载 JSON：将当前修改导出为新的 .edited.json 文件，保留未编辑的原始字段，不覆盖导入文件。
- HTML 导出：CSS 已内嵌，无需运行此应用即可直接打开导出的文件。
- PDF 导出：单页 PDF 会将完整简历缩放到一张 A4；分页 PDF 使用浏览器原生打印，适合较长简历。两种方式均使用姓名、职位、Resume 和日期组成文件名。
- 保留原始描述、列表、强调、项目和自定义章节；空项不显示；HTML 由 DOMPurify 过滤。
- 不使用 renderingToken、userId 等内部元数据，不修改源 JSON。

## 产品截图

### 简历工作区

![简历工作区：设置栏、主题和实时预览](docs/images/app-overview.png)

### 内容编辑器

![内容编辑器：编辑示例简历字段](docs/images/editor.png)

编辑内容仅保存在当前页面内存中，不会上传或写入浏览器持久存储。保存修改后请下载 JSON；尚未下载时离开页面会提示。HTML 和 PDF 导出使用已保存的编辑结果。下载 JSON 会保留导入文件中的未知字段和元数据，分享前请自行检查隐私内容。

## 排版说明

预览和导出的 HTML 是连续页面，不会删减内容。单页 PDF 会把完整简历等比缩放到一张 A4，内容很多时字号会相应变小；分页 PDF 则使用浏览器原生分页。双栏模板将技能、教育、语言放在侧栏，其余章节按 `sectionsOrder` 排列；分页 PDF 打印时改为单栏，避免长侧栏导致分页异常。

导出 HTML 的正文与样式可离线使用；Google Fonts 不可用时使用本机字体。头像保留源 JSON 的远程 URL，显示时需要网络及有效的图片地址。若需要完全离线的文件，可关闭头像。

支持 resume.io 数据结构：firstName / lastName / name、position、email、phoneNumber、city、countryName、avatar、profile、workExperiences、educations、skills、languages、socialProfiles、customSections、sectionsOrder 等。自定义章节通过 externalId 与 sectionsOrder 的 custom:ID 对应。

## 从 Resume.io 导入

在已登录 Resume.io 的同一浏览器会话中访问其简历 API，即可获取 JSON。

1. 登录自己的 [Resume.io](https://resume.io/) 账户。
2. 在同一浏览器中打开 [`https://resume.io/api/app/resumes`](https://resume.io/api/app/resumes)，在返回的简历列表中找到目标简历的 `id`。
3. 将该 ID 填入 `https://resume.io/api/app/resumes/{id}` 并在同一浏览器中打开，例如 `https://resume.io/api/app/resumes/abc123`。页面会返回该简历的 JSON 数据。
4. 使用浏览器的「另存为」将响应保存为 `resume.json`，然后在本应用点击「导入 JSON」。此接口依赖当前登录会话，只用于获取自己账户中的简历，不要分享包含个人信息或账户元数据的响应文件。

仅有 `renderingToken` 已不足以恢复简历；Resume.io 的图片接口目前只会返回第一页。请以简历 API 返回的完整 JSON 为准，不要依赖 rendering token 单独还原内容或多页图像。

导入前请检查并删除不希望保留或分享的个人信息。应用不会上传简历，但下载修改后的 JSON 会保留源文件中的未知字段。

## 许可证

本项目采用 [MIT License](LICENSE)，允许商用、修改、分发及闭源使用，须保留版权和许可声明；软件按现状提供，不附带担保。

本许可不授予 SQHOME 名称及标识的商标使用权。第三方依赖及字体仍遵循各自的许可证；用户导入的个人简历内容不因使用本应用而适用 MIT 许可。