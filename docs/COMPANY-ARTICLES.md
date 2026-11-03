# Company articles

## Author workflow

Open the admin page, choose 公司文章, choose a company, write a title and plain-text body, and save a draft or publish. Published articles appear on the corresponding merchant/company page and have a permanent `/:language/articles/:uuid` link. Readers do not need an account. Copy the link from the editor or article page. Reverting to draft removes public access without deleting content. Editing preserves the UUID and source language so shared links stay stable.

## Activation prerequisites

1. Apply `supabase/migrations/20261030_company_articles.sql` to the correct project. It creates only a new table and policies; existing freight/delivery tables are untouched.
2. In Supabase Auth, identify the owner's actual website user (not their GitHub account). A trusted operator must merge `article_admin: true` into that user's **app_metadata**, preserving other metadata. Do not put this in user_metadata. Do not enable this for arbitrary users or grant anonymous writes. The owner must sign in again to refresh the JWT.
3. Verify public SELECT only returns published articles, unauthenticated INSERT/UPDATE fails, ordinary authenticated users cannot see drafts or write, and the designated editor can create/edit/unpublish. RLS is the enforcement boundary; the existing localStorage admin gate is not trusted by the article service.
4. Test a draft, publish, open the permanent link in a signed-out browser, edit without changing its link, unpublish and confirm signed-out access is removed. Do not insert fabricated content into production for testing.
5. Only deploy after database activation and permission checks succeed. If activation is unavailable, leave the PR unmerged.

## Boundaries

Plain text is rendered as React text, never injected HTML. Content language is selected explicitly and is not auto-translated. Article routes omit hreflang siblings that do not represent translations. Clipboard failure exposes a selectable URL. Remote save/read errors remain errors, with no localStorage success fallback. Drafts and unavailable articles have noindex in the client; published articles have self-canonical and client-rendered sharing metadata. Social preview cards and search indexing are not guaranteed: this version is a client-rendered article page, not server-rendered per-article metadata. Add server rendering before promising rich link previews.

The existing data model contains two separate directories: dynamic merchants and static freight companies. The selector labels each explicitly, and articles attach to the selected entry only. No automatic name-based merging is performed.
