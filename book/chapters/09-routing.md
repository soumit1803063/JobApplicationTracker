# অধ্যায় ৯: Routing — React Router

আমাদের app-এ কয়েকটা "page" আছে: login, register, application list, নতুন application, details, edit। কিন্তু SPA-তে আসলে HTML page একটাই। তাহলে আলাদা আলাদা page কীভাবে? উত্তর হলো **client-side routing**।

> **Heads-up:** এই অধ্যায়ের কিছু snippet-এ `useAppSelector` আর `dispatch` আছে। অধ্যায় ৮-এর মতোই: `useAppSelector` দিয়ে store (app-এর shared data) থেকে value পড়া হয়, আর `dispatch(...)` দিয়ে store-কে কাজ করতে বলা হয়। বিস্তারিত অধ্যায় ১০–১১-এ।

---

## ৯.১ Client-side routing কী?

Browser-এর একটা built-in API আছে, যার নাম **History API**। এটা দিয়ে JavaScript page reload না করেই address bar-এর URL বদলাতে পারে, আর browser-এর history-তে (Back/Forward-এর list-এ) নতুন entry যোগ করতে পারে।

Client-side routing মানে:

- URL বদলানো হয় JavaScript দিয়ে, History API ব্যবহার করে, **server থেকে নতুন page না এনে**।
- URL দেখে ঠিক করা হয় কোন component screen-এ দেখাবে।
- Browser-এর Back/Forward button ঠিকমতো কাজ করে।
- URL copy করে অন্য কাউকে দিলে সে একই page দেখে।

এই কাজের library হলো **React Router** (`react-router` package)।

---

## ৯.২ সব URL এক জায়গায়: `AppRoutes` enum

`frontend/src/shared/constants.ts`:
```ts
export enum AppRoutes
{
    Home = '/',
    Login = '/login',
    Register = '/register',
    Applications = '/applications',
    ApplicationCreate = '/applications/new',
    ApplicationDetails = '/applications/:id',
    ApplicationEdit = '/applications/:id/edit',
}
```

URL-কে `/` দিয়ে ভাগ করলে প্রতিটা টুকরাকে বলে **segment**। `/applications/new`-এ দুটো segment: `applications` আর `new`। দুটোই হুবহু লেখা, তাই এগুলো **static segment**।

`:id` আলাদা: এটা একটা **URL parameter**, একটা placeholder, যার জায়গায় যেকোনো লেখা বসতে পারে। `/applications/42` URL-এ `id` হবে `'42'`।

### `buildPath`: placeholder-এ value বসিয়ে URL বানানো

`frontend/src/shared/utils.ts`:
```ts
export function buildPath(template: string, params: Record<string, string> = {}): string
{
    return template.replace(/:(\w+)/g, (_match: string, name: string): string =>
    {
        const value = params[name];
        if (value === undefined)
        {
            throw new Error(`Missing path parameter "${name}" for ${template}`);
        }
        return encodeURIComponent(value);
    });
}
```

ব্যবহার:
```ts
buildPath(AppRoutes.ApplicationDetails, { id: '42' });
```
ফলাফল: `'/applications/42'`।

লাইন ধরে বুঝি:

**১. Regular expression `/:(\w+)/g`** — লেখার ভেতরে একটা pattern খোঁজার নিয়ম:

| অংশ | মানে |
|---|---|
| `:` | হুবহু `:` চিহ্ন |
| `\w+` | এক বা একাধিক অক্ষর, সংখ্যা বা `_` |
| `( )` | ভেতরের অংশটা আলাদা করে ধরে রাখো (**capture**) |
| `g` | প্রথমটায় থেমো না, **সব** match খোঁজো |

তাই `'/applications/:id/edit'`-এ এটা `:id` খুঁজে পায়, আর capture করে `id`।

**২. `template.replace(regex, callback)`** — প্রতিটা match-এর জায়গায় callback যা return করে, তা বসায়। Callback পায়:

- প্রথম parameter `_match`: পুরো match, যেমন `':id'`। এটা আমাদের লাগে না, তাই নামের শুরুতে `_` (convention: "ব্যবহার হবে না")।
- দ্বিতীয় parameter `name`: capture করা অংশ, যেমন `'id'`।

**৩.** `params[name]` দিয়ে value নেওয়া হয়, যেমন `params['id']` হলো `'42'`। Value না থাকলে error throw করে, যাতে ভুল URL চুপচাপ তৈরি না হয়।

**৪. `encodeURIComponent(value)`** — value-তে `/`, space, `?`-এর মতো special character থাকলে সেগুলোকে URL-safe রূপে বদলায়। যেমন `'a b'` হয়ে যায় `'a%20b'`। এতে value-র ভেতরের `/` URL-এর structure ভেঙে দিতে পারে না।

একই function API-র path-এও ব্যবহার হয়, যেমন `ApiEndpoints.ApplicationById` (`'/applications/:id'`)।

---

## ৯.৩ Router তৈরি: `AppRouter.tsx`

`frontend/src/app/AppRouter.tsx` (import বাদে):
```tsx
const router = createBrowserRouter([
    { path: AppRoutes.Home, element: <Navigate to={AppRoutes.Applications} replace /> },
    {
        element: <AuthLayout />,
        children: [
            { path: AppRoutes.Login, element: <LoginPage /> },
            { path: AppRoutes.Register, element: <RegisterPage /> },
        ],
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <AppLayout />,
                children: [
                    { path: AppRoutes.Applications, element: <ApplicationsPage /> },
                    { path: AppRoutes.ApplicationCreate, element: <ApplicationFormPage /> },
                    { path: AppRoutes.ApplicationDetails, element: <ApplicationDetailsPage /> },
                    { path: AppRoutes.ApplicationEdit, element: <ApplicationFormPage /> },
                ],
            },
        ],
    },
    { path: '*', element: <NotFoundPage /> },
]);

export function AppRouter(): JSX.Element
{
    return <RouterProvider router={router} />;
}
```

- `createBrowserRouter([...])` route-এর list নিয়ে একটা router object বানায়, যেটা History API ব্যবহার করে।
- `<RouterProvider router={router} />` সেই router-কে React-এ চালু করে: বর্তমান URL দেখে ঠিক component render করে।

### Route object

প্রতিটা `{ path, element }` মানে: "URL এই `path`-এর সাথে মিললে এই `element` দেখাও।"

### Route tree (nested routes)

Route-এর ভেতরে `children` দিয়ে আরো route রাখা যায়। এই `children` ৬.৬-এর `children` prop না; এটা route object-এর একটা key, যেখানে child route-এর array থাকে। এভাবে পুরো structure একটা **route tree** হয়ে যায়। একে বলে **nested routes**।

নিচের diagram-এ প্রথম লাইনের `<Navigate>` হলো এমন একটা component, যেটা render হলেই অন্য URL-এ পাঠিয়ে দেয় (বিস্তারিত নিচে ৯.৫):

```
/                       → <Navigate>: /applications-এ পাঠিয়ে দাও
(AuthLayout)            ← মাঝখানে সাদা card
├── /login              → LoginPage
└── /register           → RegisterPage
(ProtectedRoute)        ← login না থাকলে /login-এ পাঠাও
└── (AppLayout)         ← উপরে navbar
    ├── /applications           → ApplicationsPage
    ├── /applications/new       → ApplicationFormPage (নতুন)
    ├── /applications/:id       → ApplicationDetailsPage
    └── /applications/:id/edit  → ApplicationFormPage (edit)
*                       → NotFoundPage (404)
```

যে route-এর `path` নেই, কিন্তু `element` আর `children` আছে, তাকে বলে **layout route**। এটা নিজে কোনো URL-এর সাথে মেলে না; এর কাজ হলো তার সব children-কে নিজের component দিয়ে wrap করা। যেমন `/login` খুললে screen-এ আসে `AuthLayout`, আর তার ভেতরে `LoginPage`।

### `new` বনাম `:id` — কে জেতে?

`/applications/new` URL-টা `/applications/:id`-এর সাথেও মেলে (তখন `id = 'new'`)! কিন্তু React Router static segment-কে parameter-এর চেয়ে বেশি priority দেয়। তাই array-তে যে order-এই লেখা থাকুক, `/applications/new` খুললে `ApplicationCreate` route-ই জেতে।

### `path: '*'`

`*` মানে "যেকোনো URL"। অন্য কোনো route-এর সাথে না মেলা সব URL এখানে আসে, আর 404 page দেখায়।

---

## ৯.৪ Layout আর `<Outlet />`

`frontend/src/app/AppLayout.tsx` (সংক্ষেপে):
```tsx
export function AppLayout(): JSX.Element
{
    return (
        <div className="min-h-screen bg-slate-100">
            <header>... Job Tracker ... Log out ...</header>
            <main className="mx-auto max-w-6xl px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
}
```

**`<Outlet />`** হলো React Router-এর একটা placeholder component: route tree-তে যে child route URL-এর সাথে মিলেছে, তার page ঠিক এই জায়গায় render হয়। ফলাফল:

- Navbar প্রতিটা page-এ আলাদা করে লিখতে হয় না।
- Page বদলালে শুধু `<Outlet />`-এর ভেতরটা বদলায়; navbar একই থাকে, re-mount হয় না।

`AuthLayout`-ও একই কাজ করে: মাঝখানে একটা card, আর তার ভেতরে `<Outlet />`। সেখানে login বা register page বসে।

---

## ৯.৫ Page বদলানোর তিন উপায়

### (ক) `<Link>`: click করে যাওয়া

`LoginPage.tsx` আর `ApplicationsTable.tsx` থেকে (সংক্ষেপে, `className` বাদে):
```tsx
<Link to={AppRoutes.Register}>Create one</Link>
<Link to={buildPath(AppRoutes.ApplicationEdit, { id: application.id })}>Edit</Link>
```
প্রথমটা click করলে URL হয় `/register`, দ্বিতীয়টায় যেমন `/applications/42/edit`।

সাধারণ `<a href>` ব্যবহার করলে **পুরো page reload** হতো: browser server থেকে সব নতুন করে আনত, app একদম শুরু থেকে চালু হতো, আর memory-তে থাকা সব state (component-এর `useState`, আর store, অধ্যায় ১০) মুছে যেত। `<Link>` History API দিয়ে reload ছাড়াই URL বদলায়, তাই state থেকে যায়।

বাইরের website-এর জন্য কিন্তু সাধারণ `<a>`, `ApplicationDetailsPage.tsx`-এ (সংক্ষেপে):
```tsx
<a href={href} target="_blank" rel="noreferrer">{href}</a>
```
- `target="_blank"`: link-টা নতুন tab-এ খোলে।
- `rel="noreferrer"`: security আর privacy-র জন্য দুটো কাজ করে। এক, নতুন tab-এর page `window.opener` দিয়ে আমাদের page-কে access বা redirect করতে পারে না (যেটা `noopener`-এর কাজ, `noreferrer` সেটাও করে)। দুই, নতুন site-কে আমাদের page-এর URL (referrer) জানানো হয় না।

`LinkButton` হলো আমাদের বানানো component: ভেতরে `<Link>`, তবে দেখতে button-এর মতো। `ApplicationsPage.tsx`:
```tsx
<LinkButton to={AppRoutes.ApplicationCreate}>+ New application</LinkButton>
```

### (খ) `useNavigate`: কোড থেকে যাওয়া

কোনো কাজ শেষ হওয়ার **পরে** অন্য page-এ যেতে `useNavigate` hook লাগে। এটা একটা `navigate` function return করে; `navigate(path)` call করলে app সেই path-এ চলে যায়।

`ApplicationFormPage.tsx` (সংক্ষেপে):
```tsx
const navigate = useNavigate();

async function handleSubmit(payload: ApplicationPayload): Promise<void>
{
    try
    {
        const saved = id
            ? await dispatch(updateApplication({ id, payload })).unwrap()
            : await dispatch(createApplication(payload)).unwrap();
        void navigate(buildPath(AppRoutes.ApplicationDetails, { id: saved.id }));
    }
    catch
    {
        return;
    }
}
```

কী ঘটে:

- `id` থাকলে (edit page) server-এ update request যায়, না থাকলে (new page) create request।
- `.unwrap()` এখানে এটুকু করে: save সফল হলে server-এর ফেরত দেওয়া application (`saved`) দেয়, আর ব্যর্থ হলে error throw করে, তখন `catch`-এ চলে যায়। বিস্তারিত অধ্যায় ১১-এ।
- Save সফল হলে তবেই নতুন application-এর details page-এ যাওয়া হয়, যেমন `/applications/42`।
- `navigate(...)` একটা Promise return করে, আর আমরা সেটার জন্য অপেক্ষা করছি না, তাই সামনে `void` (অধ্যায় ৩)।

### (গ) `<Navigate>`: render-এর সময়েই সরিয়ে দেওয়া

```tsx
if (user)
{
    return <Navigate to={AppRoutes.Applications} replace />;
}
```
কোনো component JSX হিসেবে `<Navigate>` return করলে, React Router render-এর সাথে সাথে অন্য URL-এ পাঠিয়ে দেয়। এখানে `user` থাকলে (মানে login করা আছে) `/applications`-এ চলে যায় (সরল উদাহরণ; আসল `LoginPage` কোথায় পাঠায়, তা ৯.৭-এ)।

**`replace`** মানে browser history-তে নতুন entry যোগ না করে বর্তমান entry-টাকেই বদলে দেওয়া। কেন দরকার? ধরো `/`-এ এসে `/applications`-এ redirect হলে। `replace` না থাকলে history-তে থাকত `/` আর `/applications`। Back চাপলে `/`-এ ফিরত, সেখান থেকে আবার `/applications`-এ redirect হতো, আর user কখনো পেছনে যেতে পারত না। `replace` থাকলে `/` history থেকেই বাদ পড়ে।

| উপায় | কখন ব্যবহার করবে |
|---|---|
| `<Link>` | User click করে অন্য page-এ যাবে |
| `useNavigate` | কোনো কাজ (যেমন save) শেষ হওয়ার পরে কোড থেকে যাবে |
| `<Navigate>` | Render-এর সময়েই বোঝা গেল এই page দেখানো যাবে না |

---

## ৯.৬ URL থেকে তথ্য পড়া

### `useParams`: `:id`-এর value

`ApplicationDetailsPage.tsx`:
```tsx
const { id = '' } = useParams<{ id: string; }>();
```

- `useParams` URL-এর সব parameter একটা object হিসেবে দেয়। `/applications/42`-এ সেটা `{ id: '42' }`।
- `<{ id: string; }>` হলো generic (অধ্যায় ৪): TypeScript-কে বলা হলো কোন parameter আশা করছি।
- তবুও `id`-এর type হয় `string | undefined`, কারণ TypeScript জানে না এই component আসলেই `:id` আছে এমন route-এ বসানো কিনা।
- `= ''` হলো destructuring-এর default value: `id` `undefined` হলে `''` বসবে। ফলে নিচের কোডে `id` সবসময় `string`, আর `loadApplication(id)`-এ সরাসরি দেওয়া যায়।

`ApplicationFormPage.tsx`-এ কিন্তু default নেই:
```tsx
const { id } = useParams<{ id: string; }>();
```
এখানে `undefined` হওয়াটাই দরকারি তথ্য। এই component দুটো route-এ বসানো:

| URL | `id` | Page |
|---|---|---|
| `/applications/new` | `undefined` (route-এ `:id` নেই) | নতুন application |
| `/applications/42/edit` | `'42'` | edit |

তাই একই component দেখে নেয় কোন কাজ করবে:
```tsx
<h1>{id ? 'Edit application' : 'New application'}</h1>
```
**একই component, দুই কাজ।** কম কোড, কম bug।

### `useLocation`: বর্তমান location আর লুকানো state

`useLocation()` বর্তমান URL-এর তথ্য একটা **location** object হিসেবে দেয়। এতে আরো কিছু field আছে, আমাদের কাজে লাগে এই তিনটা:

| Field | `/applications/42?tab=info` URL-এ |
|---|---|
| `pathname` | `'/applications/42'` |
| `search` | `'?tab=info'` |
| `state` | navigate করার সময় সাথে পাঠানো লুকানো data; কিছু না পাঠালে `null` |

`state` URL-এ দেখা যায় না। এটা পাঠানো হয় navigate করার সময়, যেমন `<Navigate>`-এর `state` prop দিয়ে:
```tsx
<Navigate to={AppRoutes.Login} replace state={{ from: location.pathname }} />
```
এতে `/login` page-এর `useLocation().state` হবে `{ from: '/applications/42' }`-এর মতো কিছু। "Login শেষে আগের page-এ ফেরা" এভাবেই কাজ করে (নিচে ৯.৭)।

---

## ৯.৭ সুরক্ষিত page: `ProtectedRoute`

`frontend/src/features/auth/ProtectedRoute.tsx` (import বাদে):
```tsx
export function ProtectedRoute(): JSX.Element
{
    const { user, isSessionChecked } = useAppSelector((state) => state.auth);
    const location = useLocation();

    if (!isSessionChecked)
    {
        return <Spinner fullPage />;
    }
    if (!user)
    {
        return <Navigate to={AppRoutes.Login} replace state={{ from: location.pathname }} />;
    }
    return <Outlet />;
}
```

এটা একটা **guard** layout route (পাহারা দেয়, কে ঢুকতে পারবে)। Store থেকে `user` (login করা user, না থাকলে `null`) আর `isSessionChecked` পড়ে ঠিক করে কী দেখাবে:

| অবস্থা | কী দেখায় |
|---|---|
| এখনো জানা নেই login আছে কিনা (app সবে খুলল) | পুরো screen জুড়ে Spinner |
| Login নেই | `/login`-এ পাঠায়, সাথে `state`-এ বর্তমান path মনে রাখে |
| Login আছে | `<Outlet />`, মানে ভেতরের page |

এটা নিজে থেকে বদলায় কীভাবে? `useAppSelector` store-এর value পড়ে, আর store-এ `user` বা `isSessionChecked` বদলালে এই component আপনাআপনি re-render হয় (অধ্যায় ১০)। তাই login হওয়ার সাথে সাথে Spinner বা redirect-এর জায়গায় `<Outlet />` চলে আসে।

`isSessionChecked` কেন দরকার? App খোলার সাথে সাথে server-কে জিজ্ঞেস করা হয় "এই token-টা কার?" (অধ্যায় ১২)। Server-এর response আসার আগে `user` থাকে `null`। তখনই যদি `user === null` দেখে login-এ পাঠিয়ে দিতাম, তাহলে login করা user-ও প্রতিবার page refresh করলে login page দেখত।

### Login-এর পরে আগের page-এ ফেরা

`LoginPage.tsx` (সংক্ষেপে):
```tsx
function redirectPathFrom(state: unknown): string
{
    if (typeof state === 'object' && state !== null && 'from' in state && typeof state.from === 'string')
    {
        return state.from;
    }
    return AppRoutes.Applications;
}

const location = useLocation();
const { user, status, error } = useAppSelector((state) => state.auth);

if (user)
{
    return <Navigate to={redirectPathFrom(location.state)} replace />;
}
```

`'from' in state` হলো JavaScript-এর `in` operator: object-এ `from` নামের key আছে কিনা check করে। TypeScript এটা দেখে narrowing করে, তাই এরপর `state.from` লেখা যায়।

পুরো ঘটনা:

1. কেউ `/applications/42` খুলল, কিন্তু login নেই।
2. `ProtectedRoute` তাকে `/login`-এ পাঠাল, `state`-এ `{ from: '/applications/42' }` রেখে।
3. User login করল। Store-এ `user` set হলো, তাই `useAppSelector`-এর কারণে `LoginPage` re-render হলো।
4. এবার `user` আছে, তাই `<Navigate>` return হলো। `redirectPathFrom` `state.from` থেকে `'/applications/42'` বের করল।
5. User পৌঁছে গেল `/applications/42`-এ।

কেউ সরাসরি `/login` খুললে `state` থাকে `null`, তাই `redirectPathFrom` default `/applications` return করে।

React Router-এ `location.state`-এর type আসলে `any`, কারণ যেকোনো জায়গা থেকে যেকোনো কিছু পাঠানো যায়। `any`-তে TypeScript কোনো check করে না, তাই `redirectPathFrom` ইচ্ছা করে parameter-টা `unknown` হিসেবে নেয় (অধ্যায় ৪.৮), যাতে ব্যবহারের আগে ধাপে ধাপে পরীক্ষা করতেই হয়: object কিনা, `null` না, `from` key আছে কিনা, আর সেটা `string` কিনা (type narrowing, অধ্যায় ৪)।

---

## সারসংক্ষেপ

- Client-side routing-এ History API দিয়ে page reload ছাড়াই URL আর component বদলায়।
- `createBrowserRouter` + `RouterProvider` দিয়ে route tree বানানো হয়। Static segment, `:param`-এর চেয়ে বেশি priority পায়।
- `buildPath` placeholder-এর জায়গায় value বসিয়ে URL বানায়।
- **Layout route** + `<Outlet />` দিয়ে navbar বা card একবার লিখে সব page-এ ব্যবহার করা যায়।
- `<Link>` click করে যাওয়ার জন্য, `useNavigate` কোড থেকে যাওয়ার জন্য, আর `<Navigate>` render-এর সময় সরিয়ে দেওয়ার জন্য। `replace` history-তে নতুন entry যোগ করে না।
- `useParams` `:id` পড়ে (না থাকলে `undefined`), আর `useLocation` `pathname`, `search` আর লুকানো `state` দেয়।
- `ProtectedRoute` login ছাড়া ভেতরে ঢুকতে দেয় না, আর login শেষে আগের page-এ ফেরত পাঠাতে `state` ব্যবহার করে।

## ইন্টারভিউ প্রশ্ন

**প্রশ্ন: `<Link>` আর `<a href>`-এর পার্থক্য কী?**
উত্তর: `<a href>` পুরো page reload করে: browser server থেকে সব নতুন করে আনে, ফলে app আর memory-তে থাকা সব state শুরু থেকে চালু হয়। `<Link>` browser-এর History API দিয়ে JavaScript থেকে URL বদলায়, reload করে না, তাই state থেকে যায় আর page বদল দ্রুত হয়। App-এর ভেতরের page-এ `<Link>`, আর বাইরের website-এ `<a>` ব্যবহার করি।

**প্রশ্ন: Protected route কীভাবে বানাবে?**
উত্তর: একটা layout route component বানাব, যেটা store থেকে auth state পড়ে। Login না থাকলে `<Navigate to="/login" replace />` return করে, আর থাকলে `<Outlet />`, যেখানে ভেতরের page render হয়। সুরক্ষিত সব route হবে এর children। App শুরুর সময় server থেকে session check শেষ না হওয়া পর্যন্ত spinner দেখাব, নাহলে login করা user-ও refresh-এ login page দেখবে। চাইলে redirect-এর সময় `state`-এ বর্তমান path রেখে, login শেষে সেখানে ফেরত পাঠানো যায়।

**প্রশ্ন: Nested route আর Outlet কী?**
উত্তর: Route-এর `children`-এ রাখা route হলো nested route। Parent route-এর component-এ `<Outlet />` রাখা হয়, আর URL-এর সাথে মিলে যাওয়া child route-এর component ঠিক সেখানে render হয়। এতে navbar বা card-এর মতো common layout একবার লিখে অনেক page-এ reuse করা যায়, আর page বদলালে layout re-mount হয় না।

**প্রশ্ন: navigate-এর `replace` option কী করে?**
উত্তর: Browser history-তে নতুন entry যোগ না করে বর্তমান entry-টাকে বদলে দেয়। Component-এ লেখা হয় `<Navigate to={path} replace />`, আর কোড থেকে `navigate(path, { replace: true })`। Redirect-এর ক্ষেত্রে এটা দরকার: নাহলে Back চাপলে user redirect করা page-এ ফেরে, সেখান থেকে আবার redirect হয়, আর পেছনে যেতে পারে না।

**প্রশ্ন: SPA server-এ deploy করলে refresh-এ 404 আসে কেন?**
উত্তর: `/applications/42`-এ refresh করলে browser server-এর কাছে ঠিক ওই path চায়, অথচ server-এ ওই নামে কোনো file নেই, কারণ SPA-তে HTML file একটাই, `index.html`। সমাধান হলো server-কে বলা, অচেনা সব path-এ `index.html` দিতে (একে fallback বলে)। তারপর app চালু হয়ে React Router নিজে URL দেখে ঠিক page দেখায়।

**প্রশ্ন: URL parameter আর query string-এর পার্থক্য কী?**
উত্তর: URL parameter path-এরই একটা segment, আর সাধারণত একটা নির্দিষ্ট resource বোঝায়, যেমন `/applications/42`-এর `42`; React Router-এ এটা `useParams` দিয়ে পড়া হয়। Query string হলো URL-এর `?`-এর পরের key-value অংশ, যেমন `?page=2&search=dev`; সাধারণত optional filter, sort বা pagination-এর জন্য, আর `useLocation().search`-এ পাওয়া যায়।
