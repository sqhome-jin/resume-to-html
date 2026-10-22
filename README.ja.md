# 履歴書アシスタント

[简体中文](README.md) · [English](README.en.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md)

SQHOME のローカル履歴書レイアウト・書き出しツールです。対応する履歴書 JSON をブラウザー内で表示・編集します。バックエンドは不要で、架空の多言語サンプルが初期表示されます。

## 機能

- ビジネス向け2段組とクラシックな1段組、標準ヘッダーと中央アバターのヘッダー。
- 簡体字中国語、英語、日本語、韓国語、スペイン語、フランス語の6言語に対応。
- 内蔵サンプルを直接編集するか、自分の JSON を読み込み可能。変更はリアルタイムでプレビューされ、ページ内メモリに保持されます。
- HTML、編集済み JSON、1ページ PDF、ブラウザー標準の複数ページ PDF を書き出し。
- セクション表示切替、テーマカラー、写真表示、プレビュー拡大縮小。

### スクリーンショット

**履歴書ワークスペース**

![設定とライブプレビュー](docs/images/app-overview.png)

**履歴書エディター**

![履歴書の内容編集画面](docs/images/editor.png)

## ローカルで実行

Node.js 18 以降が必要です。

```sh
npm install
npm run dev
```

Vite が表示するローカル URL を開きます。テストとビルドは `npm test` と `npm run build` で実行できます。

## サンプルを編集

起動時に表示される多言語サンプルは、そのまま編集できます。「内容を編集」を選び、変更を保存してください。「JSON をダウンロード」で自分用のコピーを保存できます。サンプル利用中に言語を切り替えると、その言語の初期サンプルに切り替わります。自分の JSON を読み込んだ後は、言語を切り替えても履歴書の内容は置き換わりません。

## Resume.io の JSON を取得

ログイン中の Resume.io セッションから、自分の履歴書 JSON を取得できます。

1. [Resume.io](https://resume.io/) にログインします。
2. 同じブラウザーで [`https://resume.io/api/app/resumes`](https://resume.io/api/app/resumes) を開き、対象履歴書の `id` を確認します。
3. `{id}` をその値に置き換えて `https://resume.io/api/app/resumes/{id}` を開きます。レスポンスに JSON が含まれます。
4. レスポンスを `resume.json` として保存し、このアプリで「JSON を読み込む」を選びます。

この API はログインセッションを使用します。個人情報やアカウントメタデータを含むレスポンスを共有しないでください。`renderingToken` だけでは履歴書を復元できず、Resume.io の画像エンドポイントが返すのは1ページ目のみです。

`firstName`、`lastName`、`position`、`profile`、`workExperiences`、`educations`、`skills`、`languages`、`customSections`、`sectionsOrder` などに対応しています。全体の構造は [`examples/resume.sample.json`](examples/resume.sample.json) を参照してください。

## PDF について

1ページ PDF は履歴書全体を A4 1枚に縮小するため、長い場合は文字が小さくなります。複数ページ PDF はブラウザー標準の印刷を使用します。ファイル名には氏名、役職、`Resume`、日付が含まれます。1ページ PDF の文字は画像化され、選択できません。

処理はすべてブラウザー内で行われます。アバターの URL 表示にはインターネット接続が必要です。共有前に JSON の内容を確認してください。編集済み JSON には元データの未知フィールドも保持されます。

## ライセンス

[MIT License](LICENSE)。依存パッケージとフォントは各ライセンスに従います。SQHOME の名称・ブランドの使用権は含まれません。
