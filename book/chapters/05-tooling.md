# অধ্যায় ৫: Tools — যেগুলো ছাড়া project চলে না

Code লেখার আগে জানতে হবে project-এ কোন কোন tool আছে, আর প্রতিটা কী কাজ করে। এই অধ্যায়ে কোনো React নেই, শুধু tool।

---

## ৫.১ Node.js আর npm

- **Node.js** হলো browser-এর বাইরে, তোমার computer-এ JavaScript চালানোর environment। আমাদের frontend চলে browser-এ, কিন্তু তাকে **বানানোর tool-গুলো** (Vite, TypeScript, ESLint) চলে Node-এ।
- **npm** (Node Package Manager) দিয়ে অন্যদের লেখা library ডাউনলোড করা হয়। এই library-গুলোকে বলে **package**।

| Command | কাজ |
|---|---|
| `npm install` | `package.json`-এ লেখা সব package ডাউনলোড করে `node_modules/` folder-এ রাখে |
| `npm install react-router` | নতুন একটা package যোগ করে |
| `npm run dev` | `package.json`-এর `"scripts"`-এ লেখা `dev` command চালায় |

### `package.json`
এটা project-এর পরিচয়পত্র। এতে থাকে project-এর নাম, কোন কোন package লাগবে, আর কোন কোন command আছে। `frontend/package.json` (সংক্ষেপে):
```json
{
    "scripts": {
        "dev": "vite",
        "build": "tsc -b && vite build",
        "lint": "eslint .",
        "typecheck": "tsc -b",
        "format": "dprint fmt",
        "format:check": "dprint check"
    },
    "dependencies": {
        "react": "^19.2.8",
        "react-router": "^8.4.0",
        "@reduxjs/toolkit": "^2.13.0",
        ...
    },
    "devDependencies": {
        "typescript": "~6.0.2",
        "vite": "^8.3.0",
        "eslint": "^10.10.0",
        ...
    }
}
```
- **`scripts`**: ছোট নামে লম্বা command। `npm run typecheck` লিখলে আসলে চলে `tsc -b`।
- **`dependencies`**: যা app চালাতে লাগে, যেমন React।
- **`devDependencies`**: যা শুধু development-এর সময় লাগে, যেমন TypeScript আর ESLint। User-এর browser-এ এগুলো কখনো যায় না।
- **`^19.2.8`** মানে 19.x.x-এর যেকোনো নতুন version চলবে, কিন্তু 20 না।
- **`~6.0.2`** আরও কড়া: শুধু 6.0.x-এর নতুন version চলবে, 6.1 না।
- **`package-lock.json`** প্রতিটা package-এর **হুবহু** version লিখে রাখে, যাতে সবার computer-এ একই জিনিস install হয়।

### আমাদের project-এর scripts
| Command | ভেতরে কী চলে | কাজ |
|---|---|---|
| `npm run dev` | `vite` | Development server চালু করে (৫.২) |
| `npm run build` | `tsc -b && vite build` | আগে type-check, তারপর production build (**production** মানে আসল user-রা যে version ব্যবহার করবে, server-এ বসানো) |
| `npm run typecheck` | `tsc -b` | পুরো project-এর type error খোঁজে (৫.৩) |
| `npm run lint` | `eslint .` | Code-এর ভুল আর খারাপ অভ্যাস খোঁজে (৫.৪) |
| `npm run format` | `dprint fmt` | সব file একই style-এ সাজায় (৫.৫) |

`&&` মানে "আগেরটা সফল হলে তবেই পরেরটা চালাও"। তাই type error থাকলে build হবেই না।

### আমাদের project-এর মূল package
| Package | কাজ |
|---|---|
| `react`, `react-dom` | React নিজে, আর browser-এ দেখানোর অংশ |
| `react-router` | Page আর URL (অধ্যায় ৯) |
| `@reduxjs/toolkit`, `react-redux` | পুরো app-এর shared data রাখা (অধ্যায় ১০–১১) |
| `@tiptap/react`, `@tiptap/starter-kit` | Rich text editor (অধ্যায় ১৩) |
| `tailwindcss` | Style (৫.৬) |
| `typescript` | Type-check |
| `vite` | Dev server আর build |
| `eslint` | Code-এর ভুল আর খারাপ অভ্যাস ধরা |
| `dprint` | Code format করা |

---

## ৫.২ Vite: Development server আর build tool

Browser TypeScript বা JSX বোঝে না (JSX হলো React-এ HTML-এর মতো করে লেখা, অধ্যায় ৬)। **Vite** দুটো কাজ করে:

1. **`npm run dev`**: একটা local server (http://localhost:5173) চালু করে। File save করলে browser-এ সাথে সাথে পরিবর্তন দেখা যায়, পুরো page reload না করেই। একে বলে **HMR** (Hot Module Replacement)।
2. **`npm run build`**: পুরো app-কে ছোট, দ্রুত সাধারণ JavaScript/CSS file-এ convert করে `dist/` folder-এ রাখে। আসল server-এ এটাই বসানো হয়।

### Vite type-check করে না
এটা নতুনদের জন্য খুব গুরুত্বপূর্ণ। `npm run dev` চলার সময় Vite TypeScript file থেকে শুধু type-গুলো মুছে ফেলে (strip করে), কিন্তু type ঠিক আছে কিনা **check করে না**। মানে type error থাকলেও page দিব্যি চলবে।

Type error দেখার দুটো উপায়:
- VS Code-এ লাল দাগ।
- Terminal-এ `npm run typecheck`।

### `frontend/vite.config.ts`
```ts
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        port: 5173,
        proxy: {
            '/api': 'http://localhost:3000',
        },
    },
});
```
(উপরের `import` লাইনগুলো বাদ দেওয়া হয়েছে।)

| অংশ | কাজ |
|---|---|
| `plugins` | Vite-কে React (JSX) আর Tailwind বোঝার ক্ষমতা দেয় |
| `alias '@'` | `@/shared/utils` লিখলে মানে হয় `src/shared/utils` (নিচে বিস্তারিত) |
| `server.port` | Dev server চলবে 5173 port-এ |
| `proxy` | `/api` দিয়ে শুরু হওয়া request backend-এ (3000 port-এ) পাঠিয়ে দেয় |

`fileURLToPath(new URL('./src', import.meta.url))` লাইনটা শুধু `src` folder-এর পুরো path বের করে। মুখস্থ করার দরকার নেই।

### Proxy কেন?
Frontend চলে 5173 port-এ, আর backend 3000 port-এ। Port আলাদা মানে browser-এর চোখে এরা আলাদা **origin** (origin = protocol + domain + port)।

Browser-এর একটা security নিয়ম আছে, যার নাম **CORS** (Cross-Origin Resource Sharing)। এক origin-এর page অন্য origin-এ request পাঠালে request ঠিকই যায়, কিন্তু server স্পষ্টভাবে অনুমতি না দিলে browser সেই **response JavaScript-কে পড়তে দেয় না**, block করে দেয়।

Proxy থাকলে frontend request পাঠায় নিজের origin-এই: `http://localhost:5173/api/...`। Vite server সেটা চুপচাপ backend-এ পাঠিয়ে দেয়, আর উত্তর ফেরত আনে। Browser দেখে সব একই origin থেকে আসছে, তাই কোনো CORS সমস্যা হয় না।

### `@/` alias কেন?
Alias ছাড়া গভীর folder থেকে import করতে লিখতে হতো:
```ts
import { api } from '../../../shared/api';
```
Alias দিয়ে লেখা হয়:
```ts
import { api } from '@/shared/api';
```
File যে folder-এই থাকুক, import লাইন একই থাকে। Alias দুই জায়গায় বলতে হয়: TypeScript-কে `tsconfig.app.json`-এর `paths`-এ, আর Vite-কে `vite.config.ts`-এর `resolve.alias`-এ।

---

## ৫.৩ `tsconfig`: TypeScript-এর নিয়মবই

Frontend-এ তিনটা file আছে:
- `tsconfig.json`: নিজে কোনো নিয়ম রাখে না, শুধু বাকি দুটোকে দেখিয়ে দেয়।
- `tsconfig.app.json`: `src/` folder-এর app code-এর নিয়ম।
- `tsconfig.node.json`: `vite.config.ts`-এর নিয়ম (কারণ এটা browser-এ না, Node-এ চলে)।

`tsconfig.app.json`-এর গুরুত্বপূর্ণ setting (সংক্ষেপে)। খেয়াল করো, সব নিয়ম থাকে `"compilerOptions"`-এর ভেতরে:
```json
{
    "compilerOptions": {
        "jsx": "react-jsx",
        "verbatimModuleSyntax": true,
        "noEmit": true,
        "paths": {
            "@/*": ["./src/*"]
        },
        "strict": true,
        "noUncheckedIndexedAccess": true,
        "noImplicitReturns": true,
        "noUnusedLocals": true,
        ...
    },
    "include": ["src"]
}
```
| Setting | মানে |
|---|---|
| `jsx: "react-jsx"` | JSX-কে React-এর function call-এ convert করার নিয়ম |
| `verbatimModuleSyntax` | শুধু type import করলে `import type` লিখতে বাধ্য করে (অধ্যায় ৪.৯) |
| `noEmit` | TypeScript নিজে কোনো JavaScript file বানাবে না, শুধু check করবে। File বানানোর কাজ Vite-এর |
| `paths` | `@/` alias TypeScript-কে জানানো |
| `strict` | সব কড়া check চালু (অধ্যায় ৪.১১) |
| `noUncheckedIndexedAccess` | `array[0]` লিখলে type হয় `T \| undefined`, কারণ array খালি হতে পারে |
| `noImplicitReturns` | Function-এর কোনো পথে `return` বাদ পড়লে error |
| `noUnusedLocals` | Declare করে ব্যবহার না করা variable থাকলে error |
| `include: ["src"]` | শুধু `src` folder-এর file check হবে |

### `tsc -b` কী?
`tsc` হলো TypeScript-এর নিজের command। **`-b`** মানে "build mode": `tsconfig.json` যে file-গুলো দেখিয়ে দেয় (app আর node দুটোই), সবগুলো একসাথে check করে। `noEmit` থাকায় কোনো file তৈরি হয় না, শুধু error থাকলে দেখায়। তোমাকে সরাসরি `tsc -b` লিখতে হবে না, `npm run typecheck` দিলেই হবে।

---

## ৫.৪ ESLint: code-এর ভুল ধরার tool

TypeScript ধরে **type-এর** ভুল। **ESLint** ধরে **খারাপ অভ্যাস আর সম্ভাব্য bug**, যেগুলো type-এর দিক থেকে ঠিক হলেও সমস্যা করতে পারে। চালানোর command: `npm run lint` (ভেতরে চলে `eslint .`, মানে পুরো folder check করো)।

`switch` হলো অনেকগুলো `if`/`else`-এর ছোট লেখা; একটা value-এর সাথে কয়েকটা case মেলায়।

প্রতিটা check-কে বলে একটা **rule**। আমাদের `frontend/eslint.config.js`-এর কিছু rule:

| Rule | কী বলে |
|---|---|
| `explicit-function-return-type` | প্রতিটা function-এর return type লিখতে হবে (অধ্যায় ৪.২) |
| `no-explicit-any` | `any` ব্যবহার নিষেধ |
| `no-non-null-assertion` | `value!` নিষেধ (`!` দিয়ে "বিশ্বাস করো, এটা null না" বলে TypeScript-কে জোর করা যাবে না) |
| `consistent-type-imports` | শুধু type import করলে `import type` |
| `switch-exhaustiveness-check` | `switch`-এ enum-এর সব case ধরতে হবে |
| `no-floating-promises` | Promise ফেলে রাখা যাবে না, তাই ইচ্ছা করে ফেলে দিলে `void` লিখি (অধ্যায় ৩.৭) |
| `react-hooks/rules-of-hooks` | Hook-এর নিয়ম মানতে হবে। Hook শুরু হবে অধ্যায় ৭-এ (`useState`), নিয়ম অধ্যায় ৮-এ |
| `react-hooks/exhaustive-deps` | `useEffect`-এর dependency list ঠিক আছে কিনা (অধ্যায় ৮) |

শেষের দুটো rule এখন পুরো বোঝার দরকার নেই, পরে এগুলোর কাছে ফিরে আসব। প্রথম পাঁচটা rule আমরা নিজেরা config file-এর `rules`-এ লিখেছি। শেষ তিনটা নিজেরা লিখিনি, এগুলো আসে `tseslint.configs.strictTypeChecked` আর `reactHooks.configs.flat.recommended` নামের তৈরি rule-set থেকে।

---

## ৫.৫ dprint: code format করা

সবাই আলাদা style-এ code লিখলে পড়তে কষ্ট হয়। **dprint** নিজে থেকেই সব file একই style-এ সাজায়। Setting থাকে `frontend/dprint.json`-এ। আমাদের style C# ভাষার মতো:
- ৪ space indentation (`"indentWidth": 4`)
- `{` নতুন লাইনে (`"bracePosition": "nextLine"`)
- String-এ single quote `'...'`, কিন্তু JSX attribute-এ double quote `"..."`
- সব statement-এর শেষে `;`
- Import-গুলো alphabetically sort করা

| Command | কাজ |
|---|---|
| `npm run format` | সব file format করো |
| `npm run format:check` | শুধু check করো, কিছু বদলিও না |

এই বইয়ের সব code snippet এই style-এ লেখা, তাই `{` নতুন লাইনে দেখলে অবাক হয়ো না।

---

## ৫.৬ Tailwind CSS: class দিয়ে style

সাধারণ CSS-এ আলাদা file-এ class বানিয়ে style লিখতে হয়। **Tailwind**-এ আগে থেকে তৈরি ছোট ছোট class সরাসরি element-এ বসিয়ে দাও।

নিচের উদাহরণটা React-এর JSX-এ লেখা। এখানে শুধু একটা জিনিস জেনে রাখো: React-এ HTML-এর `class` attribute-কে লিখতে হয় `className` (কারণ অধ্যায় ৬-এ)।
```tsx
<button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
    Log in
</button>
```
ফলাফল: indigo background color-এর, সাদা লেখার, rounded corner-ওয়ালা একটা button। Mouse উপরে নিলে রং আরেকটু গাঢ় হয়।

| Class | মানে |
|---|---|
| `bg-indigo-600` | Background color indigo (600 = কতটা গাঢ়; সংখ্যা যত বড়, তত গাঢ়) |
| `text-white` | লেখার রং সাদা |
| `px-4` / `py-2` | বাম-ডানে / উপর-নিচে ভেতরের ফাঁকা জায়গা (padding) |
| `m-4`, `mt-2` | বাইরের ফাঁকা জায়গা (margin); `t` = top |
| `rounded-md` | Rounded corner |
| `text-sm`, `text-2xl` | Font size |
| `font-medium`, `font-bold` | Font weight |
| `hover:bg-indigo-700` | Mouse উপরে গেলে background color আরও গাঢ় |
| `flex`, `items-center`, `justify-between`, `gap-4` | পাশাপাশি সাজানো (flexbox) |
| `grid`, `sm:grid-cols-3` | Grid layout; screen width ৬৪০px বা বেশি হলে ৩টা column |
| `w-full`, `max-w-md`, `min-h-screen` | Width আর height |
| `shadow` | Shadow |
| `space-y-4` | ভেতরের প্রতিটা element-এর মাঝে উপর-নিচে ফাঁক |

### Responsive
`sm:`, `md:`, `lg:` prefix মানে "screen width এই মাপের বা তার বেশি হলে তবেই এই class কাজ করবে"।

| Prefix | কখন কাজ করে |
|---|---|
| (কিছু না) | সব screen-এ |
| `sm:` | width ≥ 640px |
| `md:` | width ≥ 768px |
| `lg:` | width ≥ 1024px |

যেমন `grid sm:grid-cols-3`: mobile-এ এক column (একটার নিচে আরেকটা), আর ৬৪০px বা বড় screen-এ পাশাপাশি ৩ column। আবেদনের form-এর salary অংশ ঠিক এভাবে সাজানো।

### Tailwind চালু করা
`frontend/src/index.css`-এর প্রথম লাইন:
```css
@import "tailwindcss";
```
সাথে `vite.config.ts`-এর `plugins`-এ `tailwindcss()`। আর কিছু লাগে না।

---

## সারসংক্ষেপ
- **npm** package install করে, আর **package.json**-এ থাকে package-এর তালিকা আর scripts।
- **Vite** dev server চালায় (HMR, proxy) আর production build বানায়। কিন্তু Vite **type-check করে না**।
- Type error দেখতে `npm run typecheck`, code-এর খারাপ অভ্যাস ধরতে `npm run lint`, আর format করতে `npm run format`।
- **tsconfig**-এর সব setting থাকে `compilerOptions`-এর ভেতরে।
- **Tailwind**-এ ছোট class বসিয়ে style দেওয়া হয়; `sm:` মানে ৬৪০px বা বড় screen।

## ইন্টারভিউ প্রশ্ন

**প্রশ্ন: dependencies আর devDependencies-এর পার্থক্য কী?**
উত্তর: dependencies হলো যা app চালাতে লাগে, যেমন react, react-dom। devDependencies হলো যা শুধু development আর build-এর সময় লাগে, যেমন typescript, eslint, vite। Production-এ user-এর browser-এ devDependencies-এর code যায় না।

**প্রশ্ন: package-lock.json কেন দরকার?**
উত্তর: এটা প্রতিটা package-এর, আর সেই package যেগুলোর উপর নির্ভর করে সেগুলোরও, হুবহু version লিখে রাখে। এতে সব developer-এর computer-এ আর server-এ একই code install হয়। তাই এই file git-এ commit করতে হয়। (**git** হলো code-এর সব পরিবর্তনের ইতিহাস রাখার tool, আর **commit** মানে সেই ইতিহাসে file-এর বর্তমান version save করা।)

**প্রশ্ন: CORS কী? Development-এ কীভাবে সামলাও?**
উত্তর: CORS হলো browser-এর একটা security নিয়ম। এক origin (protocol + domain + port) থেকে অন্য origin-এ request গেলে, server স্পষ্টভাবে অনুমতি না দিলে browser সেই response JavaScript-কে পড়তে দেয় না। Development-এ আমরা Vite proxy দিয়ে সামলাই: frontend নিজের origin-এই `/api/...`-তে request করে, আর Vite server সেটা backend-এ পাঠিয়ে উত্তর ফেরত আনে। Browser-এর চোখে তাই সব একই origin।

**প্রশ্ন: HMR কী?**
উত্তর: Hot Module Replacement। কোনো file বদলালে browser-এ শুধু সেই file-এর অংশটুকু বদলানো হয়, পুরো page reload হয় না। ফলে form-এ যা লিখে রেখেছিলে বা page-এর বর্তমান state সাধারণত হারায় না, আর পরিবর্তন সাথে সাথে দেখা যায়।

**প্রশ্ন: Vite কি TypeScript-এর type error ধরে?**
উত্তর: না। Dev server চলার সময় Vite শুধু type-গুলো মুছে দিয়ে JavaScript বানায়, type ঠিক আছে কিনা check করে না। Type error দেখতে VS Code বা `tsc` (আমাদের project-এ `npm run typecheck`) লাগে। আমাদের `build` script আগে `tsc -b` চালায়, তাই type error থাকলে build হয় না।

**প্রশ্ন: TypeScript আর ESLint দুটোই কেন লাগে?**
উত্তর: TypeScript দেখে type মিলছে কিনা, যেমন string-এর জায়গায় number দেওয়া হলো কিনা। ESLint দেখে code-এর অভ্যাস আর সম্ভাব্য bug, যেমন Promise ফেলে রাখা, `any` ব্যবহার, বা return type না লেখা। দুটো আলাদা ধরনের ভুল ধরে।

**প্রশ্ন: Tailwind-এর সুবিধা আর অসুবিধা কী?**
উত্তর:
- সুবিধা: আলাদা CSS file আর class-এর নাম ভাবতে হয় না, design সবখানে একই রকম থাকে, আর build-এ শুধু ব্যবহার করা class-গুলো থাকে, তাই CSS file ছোট হয়।
- অসুবিধা: element-এ অনেক লম্বা class-এর তালিকা হয়ে যায়, প্রথমে পড়তে কষ্ট হয়।
