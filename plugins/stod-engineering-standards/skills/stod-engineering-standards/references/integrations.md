# Plugin・MCP接続

読み取り専用のMCPは利用承認を受けた本人のブラウザログインを要求する。通常は公開されているStoD Standards marketplaceからPluginを導入し、MCPとSkillを一括設定する。接続先はPluginの版管理された`.mcp.json`を正本とし、各案件repositoryへURLやtokenを埋め込まない。

## Codex

```bash
codex plugin marketplace add stod-inc/engineering-standards-plugin --ref main
codex plugin add stod-engineering-standards@stod-standards
```

CodexがMCPの認証を表示したら、`stod-standards`をAuthenticateする。ブラウザで本人のログインを完了し、最初に`list_standards`を呼んで版とcontent SHA-256を確認する。

## Claude Code

```bash
claude plugin marketplace add stod-inc/engineering-standards-plugin
claude plugin install stod-engineering-standards@stod-standards --scope user
```

Claude CodeがMCP認証を要求したら、`/mcp`から`stod-standards`を選んでAuthenticateする。ブラウザで本人のログインを完了し、最初に`list_standards`を呼んで版とcontent SHA-256を確認する。

## 失敗時

- ブラウザ認証が始まらない場合: clientのmarketplaceとPlugin版、MCP接続状態を確認する。
- 302、401、403: Authenticateをやり直し、利用承認、期限、失効を管理者へ確認する。
- 404: Pluginの最新版とserver deploy状態を確認する。
- 版・hash不一致: 応答を使用せず、server deployと生成物同期を確認する。
- 接続できない状態を規範適合として扱わず、別の非公式経路へ切り替えない。

