This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Admin registration editing

With `npm run dev -- --hostname 127.0.0.1`, open `http://127.0.0.1:3000/admin/login` and sign in with `admin@gmail.com` and `root123`. Use a development Supabase project when testing registration edits.

Sign in using an account in the Supabase `admins` table or configure a server-side admin login. For the configured login, set `ADMIN_PASSWORD` to a unique password of at least 16 characters. Set `ADMIN_EMAIL` to choose the login email, which defaults to `admin@gmail.com`. Keep the password in the server environment.

The signed admin session uses the server's `SUPABASE_SERVICE_ROLE_KEY`. After deploying the login changes, sign out and sign in again to get a session that can save registration edits.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
