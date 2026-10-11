# অধ্যায় ১৪: Project structure আর নতুন feature যোগ করার নিয়ম

Code কোথায় রাখা হয়েছে আর কেন, সেটা বুঝলে নিজে নতুন কিছু যোগ করতে পারবে। interview-তে "তোমার project-এর architecture বলো" প্রশ্নের উত্তরও দিতে পারবে। **Architecture** মানে project-এর বড় ছবি: কোন অংশ কোথায় থাকে, আর অংশগুলো একে অপরের সাথে কীভাবে কথা বলে।

---

## ১৪.১ পুরো folder structure

```
frontend/src/
├── main.tsx                 ← app শুরু: store, restoreSession, Provider, Router
├── index.css                ← Tailwind + rich-text style
│
├── app/                     ← পুরো app জোড়া লাগানোর জায়গা
│   ├── store.ts             ← Redux store, RootState, AppDispatch
│   ├── redux.ts             ← useAppDispatch, useAppSelector, createAppAsyncThunk
│   ├── AppRouter.tsx        ← সব route
│   ├── AppLayout.tsx        ← navbar + Outlet (login করা page-গুলোর জন্য)
│   ├── AuthLayout.tsx       ← মাঝখানে card + Outlet (login/register)
│   └── NotFoundPage.tsx     ← 404
│
├── features/                ← প্রতিটা feature-এর নিজের folder
│   ├── auth/                ← login, register, session
│   └── applications/        ← job application-এর সবকিছু
│
└── shared/                  ← যেকোনো feature ব্যবহার করতে পারে
    ├── api.ts               ← fetch client, ApiError, token helper
    ├── constants.ts         ← ApiEndpoints, AppRoutes enum
    ├── types.ts             ← RequestStatus, Page, ApiResponse
    ├── utils.ts             ← buildPath, formatDate, isValidUrl, parseEnum...
    └── components/          ← Button, Field, Feedback, Pagination, RichTextEditor
```

এখানে **feature** মানে app-এর এমন একটা অংশ, যেটা user-এর কাছে একটা আলাদা কাজ: যেমন "login করা" বা "application সামলানো"। একে **domain**-ও বলে।

---

## ১৪.২ তিনটা layer, তিনটা নিয়ম

**Layer** মানে code-এর একটা ভাগ, যার নির্দিষ্ট দায়িত্ব আছে, আর যে নির্দিষ্ট কিছু ভাগকেই import করতে পারে।

| Folder | কী থাকে | কাকে import করতে পারে |
|---|---|---|
| `shared/` | কোনো feature-এর কথা জানে না এমন জিনিস: button, তারিখ format, HTTP client | শুধু `shared/` |
| `features/` | একটা feature-এর সব: type, API, state, page | `shared/`, `app/redux.ts`, দরকারে অন্য feature-এর action |
| `app/` | সব জোড়া লাগানো: store, router, layout | সবাইকে |

"দরকারে অন্য feature-এর action"-এর উদাহরণ: applications slice auth-এর `logoutUser.fulfilled` শোনে, যাতে logout হলে নিজের data মুছে ফেলে (অধ্যায় ১২)।

**`shared/` কখনো `features/` import করবে না।** কেউ `Button`-এর ভেতরে application-এর কথা লিখলে সেটা আর "shared" থাকে না, অন্য feature সেটা আর ব্যবহার করতে পারে না।

---

## ১৪.৩ Feature folder কেন? (type-based না সাজিয়ে)

একটা উপায় হলো file-এর ধরন অনুযায়ী সাজানো। একে বলে **type-based** structure:
```
components/  pages/  slices/  thunks/  api/  types/
```
তাহলে "applications" feature-এ একটা ছোট কাজ করতেও ছয়টা folder-এ ঘুরতে হতো।

আমরা সাজিয়েছি feature অনুযায়ী, একে বলে **feature-based** structure:
```
features/applications/   ← application-এর সব কিছু এক জায়গায়
features/auth/           ← login-এর সব কিছু এক জায়গায়
```
- একটা feature-এর কাজ এক folder-এই।
- feature মুছতে চাইলে পুরো folder মুছলেই হয়।
- বড় team-এ আলাদা মানুষ আলাদা feature-এ কাজ করে, একই file নিয়ে কারো সাথে ধাক্কা লাগে না।

---

## ১৪.৪ File-এর নামকরণ

| ধরন | নাম | উদাহরণ |
|---|---|---|
| Component বা page | PascalCase + `.tsx` | `ApplicationsPage.tsx`, `StatusBadge.tsx` |
| Feature-এর logic | `<feature>.<কাজ>.ts` | `applications.api.ts`, `auth.slice.ts` |
| Shared logic | ছোট হাতের `.ts` | `utils.ts`, `api.ts` |

File-এর নাম দেখেই বোঝা যায় ভেতরে কী আছে।

---

## ১৪.৫ এই project-এর code-এর নিয়মগুলো (code conventions)

| নিয়ম | কেন |
|---|---|
| প্রতিটা function-এর return type লেখা | পড়লেই বোঝা যায় function কী দেয়, আর ভুল return করলে TypeScript ধরে |
| `any` নিষেধ, `unknown` + narrowing | type-safety থাকে (অধ্যায় ৪) |
| URL আর API path হাতে লেখা নিষেধ, enum (`AppRoutes`, `ApiEndpoints`) ব্যবহার | বানান ভুল হয় না, আর path বদলালে এক জায়গায় বদলালেই হয় |
| project-এর নিজের file import করতে সবসময় `@/` (package যেমন `react` এমনিই নাম দিয়ে import হয়) | যে file import করছে, সেটা অন্য folder-এ সরালেও path বদলাতে হয় না |
| data আনা: api → thunk → slice | প্রতিটা layer-এর একটাই কাজ |
| component সরাসরি `fetch` করবে না | সব network-এর কাজ api file-এ |
| code-এ comment নেই | নাম আর type দিয়েই code নিজেকে ব্যাখ্যা করবে |
| state কখনো সরাসরি বদলানো যাবে না | React আর Redux-এর immutability নিয়ম (অধ্যায় ৭, ১০) |
| `npm run format`, `npm run lint`, `npm run typecheck` | commit-এর আগে সব পরিষ্কার |

**`@/` কী?** `@/` মানে `src/`। যেমন `@/shared/utils` মানে `src/shared/utils`। এটা কাজ করে কারণ `tsconfig.app.json`-এর `paths`-এ TypeScript-কে, আর `vite.config.ts`-এর `alias`-এ Vite-কে এটা বলে দেওয়া আছে (অধ্যায় ৫)। `../../shared/utils`-এর মতো relative path লিখলে file সরালে path ভেঙে যায়। `@/` সবসময় `src/` থেকে শুরু হয়, তাই ভাঙে না।

---

## ১৪.৬ নতুন feature যোগ করার checklist

ধরো একটা "Companies" feature যোগ করতে চাও: কোম্পানির নাম আর website-এর একটা list।

> **আগে জেনে রাখো:** এই project-এর backend-এ `/companies` নামে কোনো API **নেই**। নিচের ধাপগুলো একটা template, যাতে দেখা যায় frontend-এ নতুন feature কীভাবে যোগ হয়। সত্যিই চালাতে হলে আগে backend-এ কাজ লাগবে: একটা NestJS module (controller, service, repository) আর database-এর জন্য একটা Prisma model। সেই কাজ এই বই শেখায় না। backend ছাড়া চালালে page-এ শুধু একটা error message দেখাবে।

সব import-এর style `features/applications/*`-এর মতোই: type-এর জন্য `import type`, আর path সবসময় `@/` দিয়ে।

### ১. Endpoint আর route যোগ করো: `shared/constants.ts`

(সংক্ষেপে, `...` মানে আগের value-গুলো যেমন আছে তেমন থাকবে)
```ts
export enum ApiEndpoints
{
    ...
    Companies = '/companies',
}

export enum AppRoutes
{
    ...
    Companies = '/companies',
}
```
দুটোর string একই (`'/companies'`), কিন্তু জিনিস আলাদা:
- `ApiEndpoints.Companies` হলো backend-এর path। এর আগে `API_BASE_URL` (`/api`) বসে, তাই request যায় `/api/companies`-এ।
- `AppRoutes.Companies` হলো browser-এর URL। user address bar-এ দেখে `/companies`, আর React Router এটা দেখে CompaniesPage দেখায়।

একটা বদলালে অন্যটা বদলায় না। এখানে শুধু list লাগবে, তাই একটা company আনার `/companies/:id` endpoint যোগ করা হয়নি।

### ২. Folder বানাও: `features/companies/`

এই feature-এর সব file এই নতুন folder-এ থাকবে। এর পরের ধাপগুলোতে যে order-এ file লেখা হচ্ছে (types → api → thunks → slice → store), সেটা ইচ্ছা করেই: slice import করে thunk, আর store import করে slice। এই order-এ লিখলে কোনো ধাপে এমন কিছু import করতে হয় না যেটা এখনো লেখা হয়নি।

### ৩. Type: `features/companies/companies.types.ts`
```ts
import type { RequestStatus } from '@/shared/types';

export interface Company
{
    id: string;
    name: string;
    website: string | null;
}

export interface CompaniesState
{
    items: Company[];
    status: RequestStatus;
    error: string | null;
}
```
`Company` হলো server থেকে আসা একটা company-র shape। `CompaniesState` হলো slice-এর state: list, request-এর status, আর error (অধ্যায় ১১-এর RequestStatus pattern)।

### ৪. API: `features/companies/companies.api.ts`
```ts
import type { Company } from '@/features/companies/companies.types';
import { api } from '@/shared/api';
import { ApiEndpoints } from '@/shared/constants';

export function getCompanies(): Promise<Company[]>
{
    return api.get<Company[]>(ApiEndpoints.Companies);
}
```
`getCompanies()` call করলে `GET /api/companies` request যায়, আর একটা Promise আসে, যেটা `Company[]` দিয়ে resolve হয়।

### ৫. Thunk: `features/companies/companies.thunks.ts`
```ts
import { createAppAsyncThunk } from '@/app/redux';
import * as companiesApi from '@/features/companies/companies.api';
import type { Company } from '@/features/companies/companies.types';
import { getErrorMessage } from '@/shared/utils';

export const loadCompanies = createAppAsyncThunk<Company[], undefined>(
    'companies/load',
    async (_arg, { rejectWithValue }) =>
    {
        try
        {
            return await companiesApi.getCompanies();
        }
        catch (error: unknown)
        {
            return rejectWithValue(getErrorMessage(error));
        }
    },
);
```
- **`import * as companiesApi`**: file-এর সব export একটা object-এ নিয়ে আসে, তাই `companiesApi.getCompanies()` লেখা যায়। নাম দেখেই বোঝা যায় function-টা api file থেকে এসেছে।
- **`<Company[], undefined>`**: প্রথমটা fulfilled-এর payload-এর type, দ্বিতীয়টা thunk-এর argument-এর type। `undefined` মানে এই thunk কোনো argument নেয় না, তাই dispatch করার সময় শুধু `loadCompanies()` লিখলেই হয়।
- **`_arg`**: thunk-এর function-এ প্রথম parameter সবসময় argument, দ্বিতীয়টা thunkAPI। আমাদের `rejectWithValue` লাগবে, যেটা দ্বিতীয় parameter-এ থাকে। তাই প্রথমটা ব্যবহার না করলেও লিখতে হয়। নামের শুরুতে `_` একটা প্রচলিত convention, মানে "এটা ইচ্ছা করেই ব্যবহার করা হয়নি"। project-এ আরেক জায়গায়ও আছে: `shared/utils.ts`-এর `buildPath`-এ `_match`।

### ৬. Slice: `features/companies/companies.slice.ts`
```ts
import { loadCompanies } from '@/features/companies/companies.thunks';
import type { CompaniesState } from '@/features/companies/companies.types';
import { RequestStatus } from '@/shared/types';
import { createSlice } from '@reduxjs/toolkit';
import type { Reducer } from '@reduxjs/toolkit';

const initialState: CompaniesState = {
    items: [],
    status: RequestStatus.Idle,
    error: null,
};

const companiesSlice = createSlice({
    name: 'companies',
    initialState,
    reducers: {},
    extraReducers: (builder): void =>
    {
        builder
            .addCase(loadCompanies.pending, (state): void =>
            {
                state.status = RequestStatus.Loading;
                state.error = null;
            })
            .addCase(loadCompanies.fulfilled, (state, action): void =>
            {
                state.status = RequestStatus.Succeeded;
                state.items = action.payload;
            })
            .addCase(loadCompanies.rejected, (state, action): void =>
            {
                state.status = RequestStatus.Failed;
                state.error = action.payload ?? 'Could not load companies';
            });
    },
});

export const companiesReducer: Reducer<CompaniesState> = companiesSlice.reducer;
```
- শুরুতে list খালি, status `Idle`।
- pending-এ status `Loading` আর পুরনো error মোছা হয়, fulfilled-এ list বসে, rejected-এ error message বসে।
- **নিজের কোনো action না থাকলেও `reducers: {}` লিখতে হবে।** Redux Toolkit 2-এ `createSlice`-এর `reducers` field বাধ্যতামূলক, খালি object হলেও।
- শেষ লাইনে শুধু reducer export হয়েছে, কারণ store-এ এটাই লাগবে।

### ৭. Store-এ বসাও: `app/store.ts`
```ts
import { applicationsReducer } from '@/features/applications/applications.slice';
import { authReducer } from '@/features/auth/auth.slice';
import { companiesReducer } from '@/features/companies/companies.slice';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        applications: applicationsReducer,
        companies: companiesReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
```
এখানে নতুন শুধু দুটো লাইন: `companiesReducer`-এর import, আর `companies: companiesReducer`। নিচের `RootState` আর `AppDispatch` লাইন দুটো আগের মতোই রাখতে হবে। মুছে ফেললে পুরো app ভেঙে যাবে, কারণ `app/redux.ts` এ দুটো ব্যবহার করে। `RootState` store থেকে নিজে থেকেই তৈরি হয়, তাই নতুন slice যোগ করলে এর ভেতরে `companies` নিজে থেকেই চলে আসে। এখন `state.companies` দিয়ে companies-এর state পড়া যায়।

### ৮. Page: `features/companies/CompaniesPage.tsx`

`ApplicationsPage`-এর মতো করে:
```tsx
import { useAppDispatch, useAppSelector } from '@/app/redux';
import { loadCompanies } from '@/features/companies/companies.thunks';
import { ErrorMessage, Spinner } from '@/shared/components/Feedback';
import { RequestStatus } from '@/shared/types';
import { useEffect } from 'react';
import type { JSX } from 'react';

export function CompaniesPage(): JSX.Element
{
    const dispatch = useAppDispatch();
    const { items, status, error } = useAppSelector((state) => state.companies);

    useEffect((): void =>
    {
        void dispatch(loadCompanies());
    }, [dispatch]);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Companies</h1>
            <ErrorMessage message={error} />

            {status === RequestStatus.Loading && <Spinner />}

            {status === RequestStatus.Succeeded && items.length === 0 && (
                <p className="rounded-xl bg-white p-12 text-center text-slate-500 shadow">No companies yet.</p>
            )}

            {items.length > 0 && (
                <ul className="divide-y divide-slate-100 rounded-xl bg-white shadow">
                    {items.map((company) => (
                        <li key={company.id} className="px-4 py-3">
                            <p className="font-medium text-slate-800">{company.name}</p>
                            <p className="text-sm text-slate-500">{company.website ?? '—'}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
```
- page mount হলে `useEffect` একবার `loadCompanies()` dispatch করে (`dispatch` কখনো বদলায় না, তাই effect আবার চলে না)।
- load চলার সময় spinner, ব্যর্থ হলে লাল error box, সফল কিন্তু খালি হলে "No companies yet.", আর data থাকলে প্রতিটা company একটা `<li>`-তে। `key={company.id}` দিয়ে React প্রতিটা item চেনে (অধ্যায় ৬)।
- website না থাকলে (`null`) `??` দিয়ে "—" দেখায়।

### ৯. Route আর navbar link

`app/AppRouter.tsx`-এ উপরে import যোগ করো, তারপর AppLayout-এর `children`-এ নতুন route (সংক্ষেপে):
```tsx
import { CompaniesPage } from '@/features/companies/CompaniesPage';

{
    element: <AppLayout />,
    children: [
        ...
        { path: AppRoutes.Companies, element: <CompaniesPage /> },
    ],
},
```
AppLayout-এর children-এ রাখা হয়েছে, তাই page-টা ProtectedRoute-এর ভেতরে পড়ে (login ছাড়া দেখা যায় না) আর উপরে navbar থাকে।

user যেন page-টা খুঁজে পায়, তাই `app/AppLayout.tsx`-এর navbar-এ "Job Tracker" link-এর পরে একটা link (সংক্ষেপে):
```tsx
<Link to={AppRoutes.Companies} className="text-sm font-medium text-slate-600 hover:text-indigo-600">
    Companies
</Link>
```
`Link` আর `AppRoutes` AppLayout-এ আগে থেকেই import করা আছে। এখন navbar-এ "Companies" click করলে page reload ছাড়াই `/companies`-এ যাওয়া যায়।

### ১০. Check করো
```
npm run format
npm run lint
npm run typecheck
```
তিনটাই কোনো error ছাড়া শেষ হলে browser-এ `/companies` খুলে দেখো। backend-এ endpoint না থাকলে লাল error box দেখাবে, সেটাই প্রত্যাশিত।

এই দশ ধাপ প্রতিটা নতুন feature-এর জন্য একই। project-এর সবচেয়ে বড় শক্তি এটাই: **সবকিছু একই pattern-এ**। একটা feature বুঝলে বাকিগুলোও বোঝা যায়।

---

## ১৪.৭ "Over-engineering" এড়ানো: কী কী ইচ্ছা করেই রাখা হয়নি

**Over-engineering** মানে এখনো যে সমস্যা নেই, তার জন্য আগেভাগে জটিল সমাধান বানানো।

| যা নেই | কেন নেই | কখন লাগবে |
|---|---|---|
| Form library (react-hook-form) | মাত্র ৩টা form (Login, Register, ApplicationForm), `useState` + `validateForm` যথেষ্ট | অনেক বড় আর জটিল form হলে |
| Toast notification system | inline error message যথেষ্ট | অনেক জায়গায় popup message দরকার হলে |
| Custom modal | `window.confirm` যথেষ্ট | design করা dialog লাগলে |
| URL-এ filter রাখা | Redux-এ রাখা সহজ | filter-সহ link share করতে হলে |
| Data-fetching library (RTK Query) | thunk দিয়ে শেখা সহজ | অনেক endpoint আর cache লাগলে |
| Unit test | শেখার project | আসল product-এ অবশ্যই |

**মূলনীতি:** যতটুকু দরকার, ততটুকুই। জটিলতা যোগ করো তখনই, যখন সমস্যাটা সত্যিই আসে।

---

## সারসংক্ষেপ
- `app/` সব জোড়া লাগায়, `features/` প্রতিটা feature-এর code রাখে, আর `shared/` সবার common জিনিস রাখে। `shared/` কখনো `features/` import করে না।
- feature-based structure-এ একটা feature-এর সব কিছু এক folder-এ থাকে।
- `@/` মানে `src/`, তাই file সরালেও import path বদলাতে হয় না।
- নতুন feature মানে একই ১০ ধাপ:
  1. constants-এ endpoint আর route
  2. `features/<name>/` folder
  3. types
  4. api
  5. thunks
  6. slice (`reducers: {}` সহ)
  7. store-এ reducer বসানো
  8. page
  9. route আর navbar link
  10. format, lint, typecheck দিয়ে check
- এই project-এর backend-এ companies নেই। checklist-টা template, চালাতে হলে backend-এর কাজ লাগবে।
- দরকার না হলে জটিলতা যোগ করা হয় না।

## ইন্টারভিউ প্রশ্ন

**প্রশ্ন: তোমার React project-এর architecture বলো।**
উত্তর (নমুনা): "Vite + React + TypeScript দিয়ে বানানো একটা SPA (single-page application, মানে browser একবার page load করে, তারপর JavaScript দিয়ে page বদলায়)।
- Routing: React Router-এর layout route। login লাগে এমন অংশ ProtectedRoute দিয়ে ঢাকা।
- Global state: Redux Toolkit। server-এর data আসে createAsyncThunk দিয়ে। প্রতিটা feature-এ api → thunk → slice layer: api file শুধু HTTP call করে, thunk async কাজ আর error সামলায়, slice state বদলায়।
- Code সাজানো feature অনুযায়ী: auth আর applications। common UI component আর HTTP client থাকে shared-এ।
- URL আর API path সব enum-এ, হাতে লেখা নেই।
- Styling: Tailwind।
- Type-safety: strict TypeScript আর ESLint।"

**প্রশ্ন: Feature-based আর type-based folder structure-এর পার্থক্য কী?**
উত্তর: Type-based-এ file-এর ধরন অনুযায়ী folder: সব component এক folder-এ, সব reducer আরেক folder-এ। ছোট project-এ চলে, কিন্তু বড় হলে একটা feature-এর একটা কাজে অনেক folder-এ ঘুরতে হয়। Feature-based-এ একটা feature-এর সব file এক folder-এ থাকে, যেমন আমার `features/applications/`-এ সেই feature-এর type, api, thunk, slice, page সব। খোঁজা, বদলানো, মোছা সহজ, আর বড় team-এ আলাদা মানুষ আলাদা folder-এ কাজ করতে পারে।

**প্রশ্ন: Component কখন আলাদা file-এ ভাঙবে?**
উত্তর: যখন এটা একাধিক জায়গায় ব্যবহার হয়, যখন file এত বড় হয়ে যায় যে পড়া কঠিন, বা যখন এর দায়িত্ব স্পষ্টভাবে আলাদা। শুধু এক জায়গায় লাগা ছোট অংশ একই file-এ রাখা যায়। যেমন আমার `DetailRow` শুধু details page-এ লাগে, তাই সেটা ওই file-এর ভেতরেই আছে, export করা হয়নি। আর `Button` সব জায়গায় লাগে, তাই সেটা `shared/components`-এ।

**প্রশ্ন: Separation of concerns বলতে কী বোঝো?**
উত্তর: প্রতিটা অংশের একটাই দায়িত্ব থাকবে। আমার project-এ api file শুধু HTTP call করে, thunk শুধু async flow আর error সামলায়, slice শুধু state বদলায়, component শুধু দেখায়, আর utils শুধু হিসাব করে (যেমন `formatSalary`)। ফলে এক জায়গার বদল অন্য জায়গা ভাঙে না। যেমন backend-এর URL বদলালে শুধু constants আর api file বদলাতে হয়, page-এ হাত দিতে হয় না।

**প্রশ্ন: নতুন feature কীভাবে যোগ করো?**
উত্তর: প্রতিবার একই order মানি: constants-এ endpoint আর route, তারপর type, api function, thunk, slice, store-এ reducer, page, route আর navbar link, শেষে format, lint আর typecheck। সব feature একই pattern-এ, তাই নতুন কেউ একটা feature দেখেই বাকিগুলো বুঝে ফেলে।
