---
name: stod-engineering-standards
description: StoDの案件・製品・社内ツールを設計、実装、レビュー、監査、リリースするときに、利用承認された本人として現在のStoD技術規範を取得し、Tier・構成・実利用に応じた条項と証拠を適用する。StoD外の一般的なコーディング質問には使わない。
---

# StoD技術規範

規範の記憶や転載を正本にせず、作業時点の発効版をMCPから読む。AIの確認は人間承認、顧客UAT、実環境のread-back、期限付き例外を置き換えない。

## Installed behavior

通常はStoD Standards marketplaceのPluginからMCPとこのSkillを一括導入する。Pluginの版と、MCPから取得する技術規範の発効版は別々に記録する。初期設定または再認証が必要な場合だけ[references/integrations.md](references/integrations.md)を読む。MCPがブラウザ認証を開始したら、利用者本人がログインを完了する。

## Workflow

1. ローカルの`AGENTS.md`、案件カタログ、Issue、ADR、現在のコードと実環境から、目標Tier、案件段階、利用状態、適用flagを確認する。未知値を推測で埋めない。
2. `list_standards`で版、発効日、content SHA-256を取得する。
3. `get_applicable_clauses`でTier・flagから候補条項を取得し、`search_standards`で変更領域の条項を補う。
4. 判断に使う条項を`read_clause`または`read_standard_page`で本文まで確認する。検索snippetだけで合否を決めない。
5. 実装・レビューでは、条項ごとに「適合」「未達」「非該当」「未確認」を証拠へ結び付ける。案件段階、利用状態、確認時点、期限を別に判定する。
6. 最終候補または昇格対象treeで`list_standards`を再実行する。版またはhashが変わった場合は影響条項を再確認する。
7. 結果には規範版、条項ID、対象commit、確認した一次証拠、未確認、例外Issue・ADRを残す。

## Decision boundaries

- `get_applicable_clauses`は条項候補を構造的に選ぶ。案件段階、利用状態、証拠、期限、顧客条件まで自動で合格判定しない。
- Tierまたはflagが不明なら、既知値だけの結果を完全な適用一覧と呼ばない。未確認値と確認方法を示す。
- 規範取得が失敗したら「未確認」とし、古い回答、生成物、別チャットの記憶を現行版として扱わない。
- 規範と案件固有ADRが異なる場合は、条項の例外区分と期限付き例外記録を確認する。Skillが逸脱を承認しない。
- 規範を満たすためのIssue作成、コード変更、push、merge、deploy、権限変更は、それぞれユーザーの依頼範囲とrepository指示に従う。
- 顧客名、URL、project ID、秘密値、実データを規範MCPやこのSkillへ書き戻さない。

## MCP output

- `list_standards`で`version`、`effectiveAt`、`contentSha256`を確認する。
- `search_standards`のsnippetだけで判断せず、`read_clause`または`read_standard_page`で正本を読む。
- 取得本文を大量に転載せず、必要な条項と周辺だけを作業contextへ入れる。

