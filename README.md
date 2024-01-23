## Project Structure



[![More on Astro](./public/astro-icon-light-gradient.svg)](https://astro.build/)

```lua
/
├── .gitattributes
├── .gitignore
├── .vscode/
│   ├── extensions.json
│   └── launch.json
├── README.md
├── astro.config.mjs
├── drizzle.config.ts
├── drizzle/
│   ├── migrations/
│   │   ├── meta/
│   │   │   └── _journal.json
│   │   └── tables.sql
│   └── schema/
│       └── schema.ts
├── package-lock.json
├── package.json
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── astro-components/
│   │   │   ├── BottomNav.astro
│   │   │   ├── CurrentUser.astro
│   │   │   ├── Navbar.astro
│   │   │   └── SideMenuWrapper.astro
│   │   ├── blocks/
│   │   │   ├── Avatar.tsx
│   │   │   ├── BottomNavTransitionWrapper.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── SideMenuTransitionWrapper.tsx
│   │   │   ├── TimeSince.tsx
│   │   │   ├── User.tsx
│   │   │   └── thing.tsx
│   │   └── react-components/
│   │       ├── AdminSearchFeed.tsx
│   │       ├── AdminSearchPage.tsx
│   │       ├── CommentForm.tsx
│   │       ├── CommentsList.tsx
│   │       ├── CreateForm.tsx
│   │       ├── DeleteUser.tsx
│   │       ├── LoginForm.tsx
│   │       ├── PostForm.tsx
│   │       ├── PostList.tsx
│   │       ├── PostPage.tsx
│   │       ├── SearchFeed.tsx
│   │       ├── SearchPage.tsx
│   │       ├── SideMenu.tsx
│   │       ├── TestFeed.tsx
│   │       └── UpdateUser.tsx
│   │   └── react-components/
│   │       └── icons/
│   │           ├── Avatar.tsx
│   │           ├── CommentsIcon.tsx
│   │           ├── Home.tsx
│   │           ├── Icon.tsx
│   │           ├── InfoIcon.tsx
│   │           ├── PostsIcon.tsx
│   │           ├── Search.tsx
│   │           ├── Settings.tsx
│   │           └── UserIcon.tsx
│   ├── templates/
│   │   ├── Comment.tsx
│   │   ├── CommentAdminPage.tsx
│   │   ├── Post.tsx
│   │   ├── PostAdminPage.tsx
│   │   ├── User.tsx
│   │   └── UserAdminPage.tsx
│   ├── env.d.ts
│   ├── layouts/
│   │   ├── Layout.astro
│   │   ├── Login.astro
│   │   └── Userpage.astro
│   ├── middleware/
│   │   └── index.ts
│   ├── pages/
│   │   ├── 404.astro
│   │   ├── admin/
│   │   │   └── index.astro
│   │   │   └── manage.astro
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   ├── admin-search.ts
│   │   │   │   ├── force-deletecomment.ts
│   │   │   │   ├── force-deletepost.ts
│   │   │   │   ├── force-deleteuser.ts
│   │   │   │   ├── force-updateuser.ts
│   │   │   ├── comments/
│   │   │   │   └── createcomment.ts
│   │   │   ├── posts/
│   │   │   │   ├── createpost.ts
│   │   │   │   ├── deletepost.ts
│   │   │   │   ├── page.ts
│   │   │   │   ├── search.ts
│   │   │   │   └── singlePost.ts
│   │   │   └── users/
│   │   │       ├── createuser.ts
│   │   │       ├── deleteuser.ts
│   │   │       ├── getuser.ts
│   │   │       ├── loggedinuser.ts
│   │   │       ├── loginuser.ts
│   │   │       ├── logoutuser.ts
│   │   │       └── updateuser.ts
│   │   ├── create.astro
│   │   ├── index.astro
│   │   ├── login.astro
│   │   ├── logout.astro
│   │   └── post/
│   │       └── [post].astro
│   │   ├── search.astro
│   │   └── settings/
│   │       ├── _SettingsTabs.astro
│   │       ├── account.astro
│   │       └── index.astro
│   │   
│   ├── server/
│   │   ├── db.ts
│   │   ├── misc.ts
│   │   ├── posts.ts
│   │   └── users.ts
│   └── store.ts
├── utils/
│   └── fetchJson.ts
├── utils/
│   └── types.ts
├── tailwind.config.cjs
├── tsconfig.json
├── yarn.lock
└── .vscode/
    ├── extensions.json
    └── launch.json
```