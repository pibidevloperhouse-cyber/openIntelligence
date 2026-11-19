# WhatsApp voting setup

Create and get approval for a Meta WhatsApp message template named `showcase_voting_2026` with three positional body variables. Use a template language code that matches `WHATSAPP_TEMPLATE_LANGUAGE`.

```text
Hi {{1}},

Voting for the *National Innovation Showcase 2026* is now open! You can vote for your registered project, *{{2}}*, from *11 November through 30 November 2026*.

Voting contributes *5% of the final evaluation score*.

*Vote for your project*
{{3}}

Open the link, tap *Vote*, and enter your name and email to submit. Each email address can cast one vote.

— PiBi Foundation · Open Intelligence
```

The app supplies the student name, project name, and full voting URL in that order. Configure these server environment variables.

```dotenv
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
```

The defaults use Graph API `v23.0`, template `showcase_voting_2026` in English (`en`), and `https://www.pibiopenintelligence.com` for voting links. Override those values with `WHATSAPP_GRAPH_VERSION`, `WHATSAPP_VOTING_TEMPLATE`, `WHATSAPP_TEMPLATE_LANGUAGE`, or `PROJECT_VOTE_PUBLIC_URL` if your Meta or deployment settings differ. Link signing uses the existing server-side Supabase service role key by default. Set `PROJECT_VOTE_LINK_SECRET` before sending if you want voting links to survive service key rotation.

Sign out and sign back in with an account from the Supabase `admins` table to establish the signed campaign session. In Admin → Student Register, click **Send WhatsApp Voting Links** once. The campaign uses the saved phone number for every project registration, regardless of its Top 10 or review status. Ten-digit Indian mobile numbers receive the `91` prefix. WhatsApp API acceptance means Meta accepted the request for processing.

Re-running the campaign skips project messages already accepted or still pending. For an uncertain result, check the provider before clearing any corresponding `showcase_2026_whatsapp:<project-id>` marker in Supabase `app_settings`. Voting closes at the end of 30 November 2026 in IST. Ensure the global vote index in `scripts/ensure_unique_project_vote_email.sql` is present in Supabase before opening voting.
