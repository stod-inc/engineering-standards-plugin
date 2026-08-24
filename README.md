# StoD Engineering Standards Plugin

CodexとClaude Codeから、現在発効中のStoD技術規範を参照するための公開配布repositoryです。

このrepositoryに規範本文、顧客・案件情報、認証情報は含まれません。Pluginは読み取り専用MCPとSkillだけを導入し、規範本文は利用承認を受けた本人がブラウザでログインした後に取得します。

AIへ設定を任せる場合は、[セットアッププロンプト](SETUP_PROMPT.md)をCodexまたはClaude Codeへ貼り付けてください。

## Codex

```bash
codex plugin marketplace add https://github.com/stod-inc/engineering-standards-plugin.git --ref main
codex plugin add stod-engineering-standards@stod-standards
```

Codexが`stod-standards`の認証を求めたら、ブラウザでログインを完了します。その後、Codexへ「現在のStoD技術規範の版を確認して」と依頼します。

## Claude Code

```bash
claude plugin marketplace add https://github.com/stod-inc/engineering-standards-plugin.git
claude plugin install stod-engineering-standards@stod-standards --scope user
```

Claude Codeが`stod-standards`の認証を求めたら、`/mcp`から認証を開始し、ブラウザでログインを完了します。その後、Claude Codeへ「現在のStoD技術規範の版を確認して」と依頼します。

## 旧StoD Internal版からの移行

`stod-engineering-standards@stod-internal`を導入済みの場合は、同名MCPの重複を避けるため、旧Pluginを削除してから上記の公開marketplace版を導入します。

Codex:

```bash
codex plugin remove stod-engineering-standards@stod-internal
codex plugin marketplace remove stod-internal
```

Claude Code:

```bash
claude plugin uninstall stod-engineering-standards@stod-internal --scope user
claude plugin marketplace remove stod-internal --scope user
```

削除前に、`stod-internal` marketplaceへ別のPluginが追加されていないことを確認します。ブラウザ認証が必要になった場合は、公開版の導入後に再認証します。

## 公開範囲

公開するのは次の情報だけです。

- Codex・Claude Code用のmarketplace manifest
- 読み取り専用MCPの接続定義
- 規範をいつ、どのように確認するかを定めるSkill
- 導入・検証・セキュリティ報告の手順

StoD社内専用Skillは別のprivate repositoryで管理し、このrepositoryへ複製しません。

## 更新

Pluginの版と、MCPが返す技術規範の発効版は別です。Plugin更新後も、作業開始時と最終確認時にMCPから規範版・発効日・content SHA-256を取得します。

## Security

脆弱性や認証境界の問題は、公開Issueへ詳細を書かず、GitHubのPrivate vulnerability reportingから報告してください。[SECURITY.md](SECURITY.md)も確認してください。
