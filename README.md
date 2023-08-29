# UltimateComic

UltimateComic is a free, no-ad comic reading application built with Next.js 12. It _was_ live until my domain expired (I'm broke and open to job offers). Because of that I wanted to open source it.

Without a database UltimateComic would not work (maybe works, it's been a long time lol). That's why you need a MySQL database. I've used PlanetScale's free tier and it was really great. If you want to deploy this you can safely use PlanetScale.

## How to Use?

To deploy this project, just go into your Vercel account and select your forked repository. Before deploying, you should set some environment variables. In my new projects, I normally put this environment variables into `.env.example` file but this project is kinda old, so I'll just write in `README.md` and hope for you to read this file.

```
DATABASE_URL=
REVALIDATION_SECRET=
NEXT_PUBLIC_GA_ID=
```

### Environment Variables

- `DATABASE_URL`: This is your PlanetScale database URL. It should follow following URL structure: `mysql://USERNAME:PASSWORD@HOST/DB_NAME?ssl={"rejectUnauthorized":true}`. When I tried to deploy this project, it threw SSL certificate error. This is probably happened because I've used Windows while developing this and the database adapter couldn't find the certificates. This will not trigger an error because I've put the related certificate file in `certs/cacert.pem` file. This is not ideal but it was a fix.
- `REVALIDATION_SECRET`: In [UltimateScraper](https://www.github.com/Stradi/ultimatescraper), after we scraped new comics from various websites, we had to tell Next.js application to generate (or regenerate) the relevant pages. This is done by [Next.js's On-Demand Revalidation](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#on-demand-revalidation) feature. You should set a secure password for this environment variable. You should also set the same environment variable in UltimateScraper.
- `NEXT_PUBLIC_GA_ID`: This is the Google Analytics tracking id. You can find it in your Google Analytics dashboard.

After setting these environment variables, you should be able to deploy this project on Vercel.

## Blog

Normally, I've also added blog sections to this application but later I wanted to move it into Ghost and then WordPress. To do the migration, I've added redirection rules to `next.config.js` file (at the bottom). I've also deleted all the blog related helper functions. If you want to use the blog, you can either redirect it to another domain in `next.config.js` or follow the other helper functions in [`lib/utils/blog.ts`](https://github.com/Stradi/ultimate-comic/blob/main/lib/utils/blog.ts) and write your blog posts in `_blog` directory. You also need to create pages for `/blog` and `/blog/[slug]` routes.

---

This project doesn't have a license. You can do whatever you want. You can improve it, convert it to a template and sell it, build your own comic website and become a multi-millionaire, I don't care... After the expiry of my domain, I've lost all the fricking hope in this project.
