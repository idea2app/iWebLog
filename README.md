# iWebLog

Light-weight **Personal Web App** (PWA) based on [Next.js][3], [MobX][10] & [Sequelize][6]

[![CI & CD](https://github.com/idea2app/iWebLog/actions/workflows/main.yml/badge.svg)][7]

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)][8]
[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)][9]

## Technology stack

- Language: [TypeScript v5][2]
- Component engine: [Nextjs v14][3]
- Component suite: [Bootstrap v5][4]
- PWA framework: [Workbox v6][5]
- State management: [MobX v6][10]
- CI / CD: GitHub [Actions][11] + [Vercel][12]

## Getting Started

First, run the development server:

```bash
npm i pnpm -g
pnpm dev
```

Open http://localhost:3000 with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes][13] can be accessed on http://localhost:3000/api/hello. This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes][13] instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation][14] - learn about Next.js features and API.
- [Learn Next.js][15] - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository][16] - your feedback and contributions are welcome!

## Deployment

### Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform][12] from the creators of Next.js.

Check out our [Next.js deployment documentation][17] for more details.

### Docker

```shell
pnpm pack-image
pnpm container
```

## User cases

1. https://father.tech-query.me/

[1]: https://react.dev/
[2]: https://www.typescriptlang.org/
[3]: https://nextjs.org/
[4]: https://getbootstrap.com/
[5]: https://developers.google.com/web/tools/workbox
[6]: https://sequelize.org/
[7]: https://github.com/idea2app/iWebLog/actions/workflows/main.yml
[8]: https://codespaces.new/idea2app/iWebLog
[9]: https://gitpod.io/?autostart=true#https://github.com/idea2app/iWebLog
[10]: https://mobx.js.org/
[11]: https://github.com/features/actions
[12]: https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme
[13]: https://nextjs.org/docs/api-routes/introduction
[14]: https://nextjs.org/docs
[15]: https://nextjs.org/learn
[16]: https://github.com/vercel/next.js/
[17]: https://nextjs.org/docs/deployment
