# 简历助手

SQHOME 旗下的简历排版应用。将 resume.io 导出的 JSON 渲染为商务风格的单页简历网页。默认加载 examples/resume.sample.json，所有文件均在浏览器本地处理，不需要后端。

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

- 商务双栏、经典单栏排版，五种主题色。
- JSON 文件导入、章节显隐、头像开关、预览缩放。
- 页面编辑：修改个人资料和头像地址，通过富文本编辑器调整简介、工作和项目描述，增删经历条目及自定义章节，实时预览；支持保存或取消本轮修改。
- 下载 JSON：将当前修改导出为新的 .edited.json 文件，保留未编辑的原始字段，不覆盖导入文件。
- HTML 导出：CSS 已内嵌，无需运行此应用即可直接打开导出的文件。
- 打印 / PDF：调用浏览器打印对话框，选择「另存为 PDF」。建议关闭浏览器页眉和页脚。
- 保留原始描述、列表、强调、项目和自定义章节；空项不显示；HTML 由 DOMPurify 过滤。
- 不使用 renderingToken、userId 等内部元数据，不修改源 JSON。

编辑内容仅保存在当前页面内存中，不会上传或写入浏览器持久存储。保存修改后请下载 JSON；尚未下载时离开页面会提示。HTML 和 PDF 导出使用已保存的编辑结果。下载 JSON 会保留导入文件中的未知字段和元数据，分享前请自行检查隐私内容。

## 排版说明

「单页」指连续的单个 HTML 页面，不会删减内容以硬塞进一张 A4。样例包含完整的多年项目经历，打印时自动分页。双栏模板将技能、教育、语言放在侧栏，其余章节按 sectionsOrder 排列；打印时改为单栏，避免长侧栏导致分页异常。

导出 HTML 的正文与样式可离线使用；Google Fonts 不可用时使用本机字体。头像保留源 JSON 的远程 URL，显示时需要网络及有效的图片地址。若需要完全离线的文件，可关闭头像。

支持 resume.io 数据结构：firstName / lastName / name、position、email、phoneNumber、city、countryName、avatar、profile、workExperiences、educations、skills、languages、socialProfiles、customSections、sectionsOrder 等。自定义章节通过 externalId 与 sectionsOrder 的 custom:ID 对应。