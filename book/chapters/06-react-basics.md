# অধ্যায় ৬: React-এর মূল ধারণা

এখন আসল জিনিস। এই অধ্যায়ে শিখব React কী, JSX কী, component কী, আর props কীভাবে কাজ করে। শুরুতেই কয়েকটা শব্দ পরিষ্কার করে নেব, কারণ পুরো বইয়ে এগুলো বারবার আসবে।

---

## ৬.১ React কী?

React হলো user interface (UI) বানানোর একটা JavaScript library।

অধ্যায় ১-এ দেখেছি, হাতে হাতে DOM বদলানো কঠিন: কোন element খুঁজতে হবে, কোন লেখা বদলাতে হবে, কোনটা মুছতে হবে, সব নিজেকে মনে রাখতে হয়। React এই ঝামেলা নিজের কাঁধে নেয়।

React app ছোট ছোট টুকরো দিয়ে বানানো। প্রতিটা টুকরোর নাম **component**, যেমন একটা button, একটা table, বা একটা পুরো page। Component আসলে একটা JavaScript function (৬.৩-এ বিস্তারিত)।

### পাঁচটা জরুরি শব্দ

| শব্দ | মানে |
|---|---|
| **render** | React component function-টা call করে জেনে নেয় screen-এ কী দেখাতে হবে। এই কাজকে বলে render করা |
| **state** | Component-এর নিজের মনে রাখা data, যা সময়ের সাথে বদলাতে পারে। যেমন input field-এ কী লেখা আছে। পুরো আলোচনা অধ্যায় ৭-এ |
| **mount** | Component প্রথমবার screen-এ আসা (DOM-এ বসানো) |
| **unmount** | Component screen থেকে পুরোপুরি সরে যাওয়া (DOM থেকে মুছে ফেলা) |
| **re-render** | Data বদলালে React একই component আবার render করে, মানে function আবার call করে নতুন চেহারা বের করে |

একটা উদাহরণ দিয়ে দেখো। Applications page খুললে table-এর প্রতিটা row screen-এ আসে, মানে **mount** হয়। একটা application "Applied" করে দিলে ওই row-এর data বদলায়, তাই row **re-render** হয়ে নতুন লেখা দেখায়। আর application delete করলে row-টা screen থেকে সরে যায়, মানে **unmount** হয়।

### React-এর মূল ধারণা: UI = f(state)

> **UI = f(state)**
> Screen হলো data-র একটা function। Data (state) বদলাও, screen নিজেই বদলে যাবে।

তুমি শুধু বলো "data এমন হলে screen এমন দেখাবে"। DOM-এ ঠিক কী কী বদলাতে হবে, সেটা React নিজে বের করে। এই পদ্ধতির নাম **declarative** (কী চাই সেটা বলা)। এর উল্টো হলো **imperative** (প্রতিটা ধাপ নিজে বলা, যেমন `document.getElementById(...).textContent = ...`)।

### Virtual DOM
আসল DOM বদলানো slow কাজ। তাই React আগে memory-তে DOM-এর একটা হালকা JavaScript copy বানায়, যার নাম **Virtual DOM**। Data বদলালে:
1. React re-render করে নতুন Virtual DOM বানায়।
2. পুরনোটার সাথে তুলনা করে দেখে কী কী বদলেছে। একে বলে **diffing** বা **reconciliation**।
3. আসল DOM-এ **শুধু বদলানো অংশটুকু** update করে।

ফলাফল: পুরো page নতুন করে না বানিয়ে, শুধু একটা লেখা বা একটা class বদলায়।

---

## ৬.২ JSX: JavaScript-এর ভেতরে HTML-এর মতো লেখা

Component কী ফেরত দেয়? দেয় **JSX**। তাই component-এর আগে JSX দেখে নিই। JSX লেখা হয় component-এর ভেতরে (৬.৩), আপাতত শুধু এর চেহারা আর নিয়ম দেখো।

```tsx
return <h1 className="text-2xl">Applications</h1>;
```
দেখতে HTML, কিন্তু আসলে JavaScript। ফলাফল: screen-এ বড় font size-এ "Applications" লেখা একটা heading।

Browser JSX বোঝে না। Vite এটাকে মোটামুটি এরকম সাধারণ function call-এ convert করে (সংক্ষেপে):
```js
return jsx('h1', { className: 'text-2xl', children: 'Applications' });
```
মানে JSX আসলে একটা object বানানোর সহজ লেখা, যে object React-কে বলে "এখানে একটা `h1` বানাও, এই class দিয়ে, এই লেখা ভেতরে রেখে"।

### JSX-এর নিয়ম
| নিয়ম | উদাহরণ |
|---|---|
| `class` নয়, `className` (কারণ `class` JavaScript-এর নিজের keyword, অধ্যায় ২.১৪) | `<div className="p-4">` |
| `for` নয়, `htmlFor` (একই কারণে: `for` হলো JavaScript-এর loop-এর keyword। **Loop** মানে একই code বারবার চালানো, যেমন array-র প্রতিটা item-এর জন্য একবার করে; অধ্যায় ২.৮-এর `forEach` আর `map`-ও এক ধরনের loop) | `<label htmlFor="email">` |
| সব tag বন্ধ করতে হবে | `<input />`, `<br />` |
| Attribute camelCase-এ | `onClick`, `onChange`, `minLength` |
| একটাই root element ফেরত দিতে হবে | কয়েকটা থাকলে একটা `<div>` বা `<>...</>` দিয়ে wrap করো |
| `{ }`-এর ভেতরে JavaScript | `<p>Hello, {name}!</p>` |

### `{ }`: JSX-এর ভেতরে JavaScript
```tsx
const name = 'Rahim';
return <p>Hello, {name}!</p>;
```
ফলাফল: screen-এ "Hello, Rahim!"।

```tsx
<p>{2 + 3}</p>
<td>{formatSalary(application)}</td>
<input placeholder={hint} />
```
- প্রথম লাইন দেখায় "5"।
- দ্বিতীয় লাইনে project-এর `formatSalary` function call হয়, আর যে string return করে (যেমন "50,000 – 80,000 BDT") সেটা table cell-এ দেখায়।
- তৃতীয় লাইনে `hint` variable-এর value attribute হিসেবে বসে।

`{ }`-এর ভেতরে যেকোনো **expression** (যা একটা value দেয়) চলে। কিন্তু `if` বা `for`-এর মতো **statement** চলে না। শর্ত দিয়ে কিছু দেখাতে কী করতে হয়, সেটা ৬.৮-এ দেখব।

### Fragment: `<>...</>`
একটা component একটাই root element return করতে পারে। ধরো পাশাপাশি একটা heading আর একটা paragraph দেখাতে চাও:
```tsx
return (
    <>
        <h1>Applications</h1>
        <p>All your job applications in one place.</p>
    </>
);
```
ফলাফল: screen-এ heading আর তার নিচে paragraph। `<>` আর `</>` হলো **Fragment**: এটা দুজনকে এক জায়গায় wrap করে, অথচ DOM-এ বাড়তি কোনো `<div>` যোগ করে না। একাধিক লাইনের JSX `( )`-এর ভেতরে রাখা হয়, যাতে পড়তে সুবিধা হয়।

---

## ৬.৩ Component: UI-এর ইট

একটা component হলো একটা **function**, যেটা JSX return করে। React এই function call করে (render করে) জানে screen-এ কী দেখাতে হবে।

Project-এর সবচেয়ে ছোট component, `frontend/src/features/applications/StatusBadge.tsx`:
```tsx
import type { JSX } from 'react';

export function StatusBadge({ isApplied }: { isApplied: boolean; }): JSX.Element
{
    return isApplied
        ? (
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                Applied
            </span>
        )
        : (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                Not applied
            </span>
        );
}
```
ব্যবহার:
```tsx
<StatusBadge isApplied={true} />
<StatusBadge isApplied={false} />
```
প্রথমটা সবুজ "Applied" badge দেখাবে, দ্বিতীয়টা হলুদ "Not applied" badge।

### Function-এর প্রথম লাইনটা ভেঙে দেখি
`function StatusBadge({ isApplied }: { isApplied: boolean; }): JSX.Element`

এখানে দুই জোড়া `{ }` আছে, আর দুটোর কাজ একদম আলাদা:

| অংশ | কী | কোথায় শিখেছি |
|---|---|---|
| প্রথম `{ isApplied }` | Parameter-এ **destructuring**: function-কে দেওয়া object থেকে `isApplied` field বের করে নেওয়া | অধ্যায় ২.৯ |
| `:` এর পরের `{ isApplied: boolean; }` | ওই object-এর **type**: এতে `isApplied` নামে একটা boolean আছে | অধ্যায় ৪ |
| `: JSX.Element` | Function-এর return type। **`JSX.Element`** হলো একটা JSX element-এর type | অধ্যায় ৪.২ |

`JSX` type-টা আসে React থেকে, তাই উপরে `import type { JSX } from 'react';` (অধ্যায় ৪.৯)।

`<StatusBadge isApplied={true} />` লিখলে React আসলে function-টা এভাবে call করে: `StatusBadge({ isApplied: true })`। মানে JSX-এ যত attribute লেখো, সব একটা object-এ ভরে component-কে দেওয়া হয়। এই object-এর নাম **props** (৬.৫-এ বিস্তারিত)।

Function-এর ভেতরে আছে ternary (অধ্যায় ২.১১): `isApplied` true হলে প্রথম `<span>`, না হলে দ্বিতীয়টা।

### Component-এর নিয়ম
- নাম **বড় হাতের অক্ষর দিয়ে শুরু** হতে হবে (`StatusBadge`, `statusBadge` না)। ছোট হাতের নাম দেখলে React সেটাকে HTML tag ভাবে, যেমন `<span>`।
- JSX return করতে হবে। আমাদের project-এ return type লেখা হয় `JSX.Element`।
- একই component বারবার ব্যবহার করা যায়। Table-এর প্রতিটা row-এ একই `StatusBadge` ব্যবহার হয়, শুধু props আলাদা। এজন্যই component **reusable**।

### Fragment কেন লাগে: `ExternalLink`
`frontend/src/features/applications/ApplicationDetailsPage.tsx`-এ একটা ছোট component আছে:
```tsx
function ExternalLink({ href }: { href: string | null; }): JSX.Element
{
    if (!href)
    {
        return <>—</>;
    }
    return (
        <a href={href} target="_blank" rel="noreferrer" className="break-all text-indigo-600 hover:underline">
            {href}
        </a>
    );
}
```
Link থাকলে একটা clickable link দেখায়, না থাকলে শুধু একটা dash "—"। `target="_blank"` link-টা নতুন tab-এ খোলে, আর `rel="noreferrer"` দেওয়া হয় security-র জন্য (অধ্যায় ৯.৫)।

এখানে fragment-এ একটাই child, তাহলে fragment কেন? কারণ return type `JSX.Element`। শুধু `return '—';` লিখলে সেটা একটা string, `JSX.Element` না, তাই TypeScript error দেবে। `<>—</>` লিখলে string-টা JSX-এ wrap হয়ে যায়, আর DOM-এ বাড়তি কোনো tag-ও আসে না।

---

## ৬.৪ App শুরু হয় কোথা থেকে: `main.tsx`

`frontend/src/main.tsx` (import লাইনগুলো বাদে):
```tsx
const rootElement = document.getElementById('root');
if (!rootElement)
{
    throw new Error('Root element #root not found in index.html');
}

void store.dispatch(restoreSession());

createRoot(rootElement).render(
    <StrictMode>
        <Provider store={store}>
            <AppRouter />
        </Provider>
    </StrictMode>,
);
```
1. **`document.getElementById('root')`**: `index.html`-এর খালি `<div id="root">` খুঁজে বের করে। এর type `HTMLElement | null`, কারণ element না-ও থাকতে পারে।
2. **`if (!rootElement) throw ...`**: element না পেলে error। এটা আসলে **narrowing** (অধ্যায় ৪.৮): `if`-এর পরে TypeScript জানে `rootElement` আর null না, তাই নিচে নিশ্চিন্তে ব্যবহার করা যায়।
3. **`store.dispatch(restoreSession())`**: আগে login করা থাকলে সেটা ফিরিয়ে আনে। এটা Redux-এর জিনিস (অধ্যায় ১০–১২), এখন শুধু জেনে রাখো যে app শুরুতেই এই কাজটা হয়।
4. **`createRoot(...).render(...)`**: React-কে বলে "এই div-এর ভেতরে পুরো app render করো"।
5. **`<StrictMode>`**: শুধু development-এ বাড়তি check চালায়। ভুল ধরার জন্য এটা প্রতিটা component **ইচ্ছা করে দুইবার render করে** (আর effect-ও দুইবার চালায়, অধ্যায় ৮)। তাই development-এ component-এর ভেতরের `console.log` দুইবার দেখলে ভয় পেয়ো না। Production-এ এর কোনো প্রভাব নেই।
6. **`<Provider store={store}>`**: Redux store পুরো app-কে দেয় (অধ্যায় ১০)।
7. **`<AppRouter />`**: কোন URL-এ কোন page দেখাবে, তা ঠিক করে (অধ্যায় ৯)।

এভাবে component-এর ভেতরে component বসিয়ে তৈরি হয় **component tree**। নিচের ছবিটা সংক্ষেপে; আসলে `AppRouter`-এর ভেতরে `RouterProvider` আর আরও কিছু layer আছে, সেগুলো অধ্যায় ৯-এ দেখব:
```
StrictMode
└── Provider
    └── AppRouter
        ├── AuthLayout → LoginPage / RegisterPage
        └── ProtectedRoute
            └── AppLayout
                └── ApplicationsPage
                    ├── ApplicationFilters
                    ├── ApplicationsTable
                    │   └── StatusBadge (প্রতি row-এ একটা)
                    └── Pagination
```
যে component অন্যটাকে নিজের ভেতরে বসায়, সে **parent**; আর যাকে বসানো হয়, সে **child**। যেমন `ApplicationsTable` হলো `StatusBadge`-এর parent।

---

## ৬.৫ Props: Component-কে data দেওয়া

Function যেমন parameter নেয়, component নেয় **props** (properties)। Parent component JSX attribute হিসেবে child-কে props দেয়:

```tsx
<StatusBadge isApplied={application.isApplied} />
```
Child সেটা নেয় parameter-এ destructuring করে, যেটা ৬.৩-এ দেখেছি:
```tsx
export function StatusBadge({ isApplied }: { isApplied: boolean; }): JSX.Element
```

### Props-এর type: আলাদা `interface`
Props বেশি হলে type-টা আলাদা `interface`-এ লেখা হয়। `frontend/src/shared/components/Pagination.tsx` (import লাইন বাদে):
```tsx
interface PaginationProps
{
    meta: PaginationMeta;
    onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps): JSX.Element
{
    return (
        <div className="flex items-center justify-between">
            <Button variant="secondary" disabled={!meta.hasPrev} onClick={(): void => onPageChange(meta.page - 1)}>
                Previous
            </Button>
            <span className="text-sm text-slate-600">Page {meta.page}</span>
            <Button variant="secondary" disabled={!meta.hasNext} onClick={(): void => onPageChange(meta.page + 1)}>
                Next
            </Button>
        </div>
    );
}
```
ফলাফল: বাম পাশে "Previous" button, মাঝে "Page 1", ডান পাশে "Next" button। আগের page না থাকলে "Previous" disabled থাকে।

লাইন ধরে দেখি:
- **`meta: PaginationMeta`**: একটা object, যাতে আছে `page` (বর্তমান page number), `limit`, `hasPrev` আর `hasNext` (আগের/পরের page আছে কিনা, boolean)।
- **`onPageChange: (page: number) => void`**: এটা একটা **function-type prop** (অধ্যায় ৪.৪)। মানে parent-কে এমন একটা function দিতে হবে, যেটা একটা number নেয় আর কিছু return করে না।
- **`Button`** হলো আমাদের নিজের button component (৬.৭)। আপাতত সাধারণ `<button>` ভাবো।
- **`disabled={!meta.hasPrev}`**: আগের page না থাকলে button disabled।
- **`onClick={(): void => onPageChange(meta.page - 1)}`**: click করলে এই arrow function চলে। `(): void =>` মানে কোনো parameter নেই আর কিছু return করে না (অধ্যায় ৪.২)। ভেতরে parent-এর দেওয়া `onPageChange` call হয়, আগের page number দিয়ে।

### ব্যবহার
```tsx
<Pagination meta={meta} onPageChange={(page): void => console.log(page)} />
```
এখন page 1-এ থাকা অবস্থায় "Next" click করলে console-এ `2` print হবে। এখানে `page`-এর type লিখতে হয়নি, কারণ TypeScript prop-এর type (`(page: number) => void`) দেখে নিজেই বুঝে নেয় `page` একটা number।

আসল `ApplicationsPage.tsx`-এ `console.log`-এর জায়গায় Redux-এ একটা action পাঠানো হয়, যাতে নতুন page-এর data load হয়। সেটা অধ্যায় ১০-এ দেখব। কিন্তু pattern একই: Pagination শুধু খবর দেয়, কী করতে হবে সেটা parent ঠিক করে।

### Function-কে prop হিসেবে দেওয়া: child থেকে parent-এ খবর পাঠানো
খেয়াল করো, Pagination নিজে জানে না page বদলালে কী করতে হবে। সে শুধু call করে `onPageChange(2)`। কী করতে হবে, সেটা ঠিক করে parent। Prop হিসেবে দেওয়া এমন function-কে বলে **callback**।

- **Data নিচে যায়** props হিসেবে (parent থেকে child)।
- **Event উপরে যায়** callback function হিসেবে (child থেকে parent)।

এটাকে বলে **one-way data flow**। React-এর সবচেয়ে গুরুত্বপূর্ণ নিয়মগুলোর একটা।

### Props পড়া যায়, বদলানো যায় না
Child কখনো নিজের props বদলাবে না। Props হলো **read-only**। কিছু বদলাতে হলে child callback দিয়ে parent-কে জানাবে, আর parent নতুন props পাঠাবে।

### Default value
Destructuring-এ default value (অধ্যায় ২.৯) দিয়ে optional prop-এর default ঠিক করা যায়। `frontend/src/shared/components/Feedback.tsx`-এর `Spinner` (সংক্ষেপে):
```tsx
export function Spinner({ fullPage = false }: { fullPage?: boolean; }): JSX.Element
```
- `fullPage?` মানে prop-টা দেওয়া optional (অধ্যায় ৪.৩)।
- `<Spinner />` লিখলে `fullPage` হবে `false`, তাই ছোট একটা loading চিহ্ন দেখায়।
- `<Spinner fullPage />` লিখলে `fullPage` হবে `true`, আর পুরো screen জুড়ে মাঝখানে loading চিহ্ন। JSX-এ value ছাড়া শুধু attribute-এর নাম লিখলে সেটা `true` ধরা হয়।

---

## ৬.৬ `children`: Component-এর ভেতরের জিনিস

Component tag-এর opening আর closing অংশের মাঝে যা লেখা হয়, সেটা component পায় `children` নামের একটা বিশেষ prop হিসেবে। `frontend/src/shared/components/Field.tsx` (সংক্ষেপে):
```tsx
import type { JSX, ReactNode } from 'react';

interface FieldProps
{
    label: string;
    htmlFor: string;
    error?: string | undefined;
    children: ReactNode;
}

export function Field({ label, htmlFor, error, children }: FieldProps): JSX.Element
{
    return (
        <div className="space-y-1">
            <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
                {label}
            </label>
            {children}
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}
```
- **`ReactNode`** হলো "React screen-এ দেখাতে পারে এমন যেকোনো কিছু"-র type: JSX, string, number, `null`, বা এদের array। `children`-এ কী আসবে আগে থেকে জানা নেই, তাই এই চওড়া type। এটাও React থেকে import করা হয়।
- **`error?: string | undefined`**: error message দেওয়া optional, আর দিলে সেটা string বা `undefined` হতে পারে। শুধু `?`-ই যথেষ্ট ছিল; `| undefined` এখানে বাড়তি, শুধু স্পষ্ট করার জন্য লেখা।
- **`{error && ...}`**: error থাকলে তবেই লাল লেখা দেখায় (৬.৮-এ বিস্তারিত)।

ব্যবহার:
```tsx
<Field label="Email" htmlFor="email">
    <input id="email" type="email" placeholder="you@example.com" />
</Field>
```
ফলাফল: উপরে "Email" label, তার নিচে একটা input field। কোনো `error` দেওয়া হয়নি, তাই লাল লেখা নেই।

এখানে `<input ... />` হলো `children`। Field জানে না ভেতরে কী আসবে: input, select নাকি rich text editor। সে শুধু label আর error-এর জায়গা দেয়, আর মাঝে `{children}` বসিয়ে দেয়। এভাবে ছোট component জুড়ে বড় জিনিস বানানোর নাম **composition**।

(Input field-এ `value` দিয়ে React থেকে লেখা নিয়ন্ত্রণ করার নিয়ম অধ্যায় ৭-এ। এখানে শুধু `placeholder` দিয়েছি, যেটা খালি থাকলে ধূসর একটা hint দেখায়।)

---

## ৬.৭ Reusable ছোট component: আমাদের `shared/components`

| Component | কাজ |
|---|---|
| `Button`, `LinkButton` | একই রকম দেখতে button, আর button-এর মতো দেখতে link |
| `Field`, `Input`, `Select` | Label + input + error, সব জায়গায় একই style-এ |
| `Spinner`, `ErrorMessage` | Loading হচ্ছে, অথবা সমস্যা হয়েছে |
| `Pagination` | আগের/পরের page |
| `RichTextEditor` | Bold, italic, list সহ লেখার editor (অধ্যায় ১৩) |

### উদাহরণ: `Input`, যেখানে HTML-এর সব attribute চলে
`frontend/src/shared/components/Field.tsx` থেকে:
```tsx
const CONTROL_CLASSES =
    'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200';

export function Input({ className = '', ...props }: ComponentProps<'input'>): JSX.Element
{
    return <input {...props} className={`${CONTROL_CLASSES} ${className}`} />;
}
```
- **`CONTROL_CLASSES`**: সব input আর select-এর common Tailwind class (পুরো width, border, rounded corner, focus করলে indigo রঙের ring)।
- **`ComponentProps<'input'>`**: সাধারণ `<input>`-এর যত attribute আছে (`type`, `value`, `onChange`, `required`, `placeholder`...), সবগুলোর type। এটাও React থেকে import করা একটা type।
- **`{ className = '', ...props }`**: `className` আলাদা করে নেওয়া হলো (না দিলে খালি string), আর বাকি সব attribute **rest** দিয়ে `props` object-এ জড়ো হলো (অধ্যায় ২.১২)।
- **`<input {...props} />`**: JSX-এ `{...props}` লিখলে object-এর সব field একেকটা attribute হিসেবে ছড়িয়ে বসে যায় (spread)।
- **className**: template literal (অধ্যায় ২.১০) দিয়ে আমাদের common class আর বাইরে থেকে আসা class জোড়া লাগানো হয়।

ফলে `<Input id="email" type="email" placeholder="you@example.com" />` লিখলে সাধারণ input-এর মতোই কাজ করে, শুধু দেখতে সব জায়গায় একই রকম সুন্দর।

### উদাহরণ: `Button`, যেখানে variant দিয়ে রং বদলায়
`frontend/src/shared/components/Button.tsx` (শুধু `Button` অংশ):
```tsx
type ButtonVariant = 'primary' | 'secondary' | 'danger';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
};

function buttonClasses(variant: ButtonVariant, className: string): string
{
    return `inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
        VARIANT_CLASSES[variant]
    } ${className}`;
}

interface ButtonProps extends ComponentProps<'button'>
{
    variant?: ButtonVariant;
    isLoading?: boolean;
}

export function Button({
    variant = 'primary',
    isLoading = false,
    className = '',
    type = 'button',
    disabled,
    children,
    ...props
}: ButtonProps): JSX.Element
{
    return (
        <button
            {...props}
            type={type}
            disabled={disabled === true || isLoading}
            className={buttonClasses(variant, className)}
        >
            {isLoading ? 'Please wait...' : children}
        </button>
    );
}
```
ধাপে ধাপে:
- **`VARIANT_CLASSES`**: প্রতিটা variant-এর জন্য রঙের class। `Record<ButtonVariant, string>` (অধ্যায় ৪.৭) নিশ্চিত করে তিনটা variant-এর একটাও বাদ পড়েনি।
- **`buttonClasses`**: সব button-এর common class-এর সাথে `VARIANT_CLASSES[variant]` জোড়া দেয়। `variant` যদি `'danger'` হয়, তাহলে `VARIANT_CLASSES['danger']` মানে লাল রঙের class-গুলো। এর পরে বাইরে থেকে আসা `className`। Template literal-এর `${`-এর পরে লাইন ভেঙে যাওয়াটা dprint-এর কাজ: লাইন খুব লম্বা হলে সে এভাবে ভেঙে format করে, মানে একই থাকে। আর `disabled:cursor-not-allowed`-এর মতো Tailwind-এর `disabled:` prefix মানে button disabled থাকলে তবেই class-টা কাজ করে, ঠিক `hover:`-এর মতো।
- **`interface ButtonProps extends ComponentProps<'button'>`**: সাধারণ `<button>`-এর সব attribute, সাথে আমাদের নিজের দুটো: `variant` আর `isLoading` (inheritance, অধ্যায় ৪.৩)।
- **Destructuring**: `variant`, `isLoading`, `className`, `type`-এর default value আছে; `disabled` আর `children` আলাদা করে নেওয়া হলো, কারণ এদের নিয়ে আলাদা কাজ আছে; বাকি সব (`onClick` ইত্যাদি) গেল `props`-এ।
- **`type = 'button'`**: default type `button`। কেন এটা জরুরি, অধ্যায় ৭-এ form-এর সময় দেখবে।
- **`disabled={disabled === true || isLoading}`**: বাইরে থেকে disabled করা হলে, অথবা loading চলাকালীন, button disabled।
- **`{isLoading ? 'Please wait...' : children}`**: loading হলে লেখা বদলে "Please wait..." হয়, না হলে ভেতরের আসল লেখা।

ফলাফল: `<Button variant="danger">Delete</Button>` লিখলে লাল "Delete" button আসবে। `<Button isLoading={true}>Save</Button>` লিখলে button disabled হয়ে "Please wait..." দেখাবে।

---

## ৬.৮ Conditional rendering: condition অনুযায়ী দেখানো

`{ }`-এর ভেতরে `if` চলে না, তাই শর্ত দিয়ে কিছু দেখাতে তিনটা উপায় আছে।

### `&&`: শর্ত true হলে দেখাও
```tsx
{error && <p className="text-sm text-red-600">{error}</p>}
```
`error`-এ কোনো string থাকলে লাল লেখা দেখায়। `error` undefined বা খালি string হলে কিছুই দেখায় না (অধ্যায় ২.১১-এর `&&`)।

**সাবধান:** বাম দিকে number থাকলে `0` screen-এ print হয়ে যায়, কারণ React `false`, `null`, `undefined` দেখায় না কিন্তু `0` দেখায়। `{items.length && <Table />}` লিখলে list খালি থাকলে screen-এ "0" দেখাবে। তাই লেখো `{items.length > 0 && <Table />}`, যেমনটা `ApplicationsPage.tsx`-এ লেখা আছে।

### Ternary: এটা অথবা ওটা
Button থেকে আগেই দেখেছ:
```tsx
{isLoading ? 'Please wait...' : children}
```
আবেদনের form-এ apply medium "Link" হলে link-এর input field, আর "Mail" হলে mail লেখার editor দেখায়। নিচেরটা **pseudo-code** (`...` মানে অংশ বাদ, এভাবে হুবহু লিখলে চলবে না):
```tsx
{values.applyMedium === ApplyMedium.Link
    ? <Field label="Apply link" ...> ... </Field>
    : <Field label="Application mail" ...> ... </Field>}
```
পুরো code অধ্যায় ১৩.৩-এ দেখবে।

### আগেভাগে return (early return)
`frontend/src/shared/components/Feedback.tsx`:
```tsx
export function ErrorMessage({ message }: { message: string | null; }): JSX.Element | null
{
    if (!message)
    {
        return null;
    }
    return <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{message}</p>;
}
```
- `message` null বা খালি হলে `null` return করে। `null` return করলে React কিছুই দেখায় না।
- তাই return type `JSX.Element | null`: হয় JSX, নয়তো null।
- `<ErrorMessage message="Network error" />` লাল box-এ "Network error" দেখায়; `<ErrorMessage message={null} />` কিছুই দেখায় না।

Page-এও early return ব্যবহার হয়। নিচের snippet `ApplicationDetailsPage.tsx` থেকে (সংক্ষেপে)। এখানে `selectedStatus`, `selectedError` আর `selected` আসে Redux থেকে, আর `id` আসে URL থেকে (অধ্যায় ৯–১১)। এখন এগুলোর উৎস নিয়ে ভেবো না, শুধু early return-এর pattern দেখো:
```tsx
if (selectedStatus === RequestStatus.Failed)
{
    return <ErrorMessage message={selectedError} />;
}
if (!selected || selected.id !== id)
{
    return <Spinner />;
}
return ( ... );
```
- Load করতে গিয়ে fail হলে: error message দেখাও, বাকি page না।
- `selected` হলো load করা application। এটা এখনো না থাকলে, অথবা থাকলেও সেটা অন্য কোনো application (যেটা আগে দেখা হয়েছিল, তাই তার `id` URL-এর `id`-র সাথে মেলে না), তাহলে ঠিক data এখনো আসেনি: spinner দেখাও।
- দুটো পরীক্ষাই পার হলে তবেই আসল page return হয় (`( ... )` অংশটা বাদ রাখা হয়েছে)।

---

## ৬.৯ List দেখানো আর `key`

Array-এর প্রতিটা item থেকে JSX বানাতে `map` (অধ্যায় ২.৮)। `ApplicationsTable.tsx` থেকে (সংক্ষেপে, class আর কিছু column বাদ):
```tsx
<tbody>
    {applications.map((application) => (
        <tr key={application.id}>
            <td>{application.jobPost}</td>
            <td>{formatDate(application.deadline)}</td>
            ...
        </tr>
    ))}
</tbody>
```
ফলাফল: `applications` array-তে যতগুলো application, table-এ ততগুলো row। `map` প্রতিটা application-কে একটা `<tr>`-এ convert করে, আর JSX সেই array-র সব element পরপর দেখায়।

### `key` কেন দরকার?
List বদলালে (নতুন item এলো, একটা মুছে গেল, ক্রম বদলাল) React-কে বুঝতে হয় কোন row কোন data-র। `key` হলো প্রতিটা row-এর **স্থায়ী পরিচয়পত্র**। এটা list-এর ভেতরে **unique** হতে হবে, আর re-render-এর মাঝে বদলানো যাবে না।

| key হিসেবে | ভালো? |
|---|---|
| Database-এর `id` | সবচেয়ে ভালো: সবসময় একই, আর unique |
| Array index (`0, 1, 2`) | সাবধান: list-এর ক্রম বদলালে বা মাঝখান থেকে মুছলে index সরে যায়, তখন React ভুল row-এ ভুল data দেখাতে পারে |
| `Math.random()` | খারাপ: প্রতি render-এ নতুন key আসে, তাই React প্রতিবার সব row unmount করে নতুন করে mount করে |

যে list কখনো বদলায় না, যেমন `PAGE_SIZES = [10, 20, 50]`, সেখানে value নিজেই key হতে পারে। `ApplicationFilters.tsx`-এ:
```tsx
{PAGE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
```
ফলাফল: dropdown-এ 10, 20, 50 তিনটা option।

`key` দিয়ে একটা component-কে "একদম নতুন করে শুরু" করানোর একটা কৌশলও আছে। সেটা বুঝতে state জানা লাগে, তাই অধ্যায় ৭-এ দেখব।

---

## ৬.১০ Event: user-এর কাজে সাড়া দেওয়া

`ApplicationsTable.tsx`-এর delete button (সংক্ষেপে, class বাদ):
```tsx
<button type="button" onClick={(): void => onDelete(application)}>Delete</button>
```
Click করলে parent-এর দেওয়া `onDelete` callback চলে, ওই row-এর application দিয়ে।

- Event-এর নাম camelCase: `onClick`, `onChange`, `onSubmit`।
- Value হিসেবে একটা **function** দিতে হয়, function call-এর **ফলাফল** না।

তিনটা লেখা তুলনা করো:
```tsx
onClick={handleReset}
onClick={(): void => onDelete(application)}
onClick={onDelete(application)}
```
- **প্রথমটা ঠিক**: function-টা নিজেই দেওয়া হয়েছে (call করা হয়নি, শুধু নাম)। Click হলে React এটা call করবে। `ApplicationFilters.tsx`-এর Reset button ঠিক এভাবে লেখা।
- **দ্বিতীয়টা ঠিক**: একটা নতুন arrow function দেওয়া হয়েছে (অধ্যায় ৪.২), যেটা click হলে চলবে আর ভেতরে `onDelete(application)` call করবে।
- **তৃতীয়টা ভুল**: এখানে `onDelete` **এখনই** call হয়ে যাবে, render-এর সময়েই, click-এর অপেক্ষা না করে। মানে page খুললেই সব application delete হওয়ার চেষ্টা হবে।

নিয়ম: function-কে argument দিতে হলে (এখানে `application`) arrow function-এ wrap করো।

Input field-এ লেখা, form submit করা ইত্যাদি event-এর বিস্তারিত অধ্যায় ৭-এ।

---

## সারসংক্ষেপ
- **render** মানে React component function call করে চেহারা বের করা; **mount** মানে প্রথম screen-এ আসা, **unmount** মানে সরে যাওয়া, **re-render** মানে data বদলালে আবার render।
- React-এ **UI = f(state)**: data বদলালে screen নিজে বদলায়। React Virtual DOM দিয়ে শুধু বদলানো অংশ update করে।
- **JSX**-এ `className`, `htmlFor`, সব tag বন্ধ, একটাই root (দরকারে Fragment `<>...</>`), আর `{ }`-এ JavaScript expression।
- **Component** হলো JSX return করা function, নাম বড় হাতের অক্ষরে শুরু, return type `JSX.Element`।
- **Props** parent থেকে child-এ আসে, আর read-only। Child callback দিয়ে parent-কে খবর দেয় (**one-way data flow**)।
- **children** দিয়ে component-এর ভেতরে যেকোনো কিছু বসানো যায় (**composition**)।
- Conditional rendering-এ `&&`, ternary আর early return; `null` return করলে কিছু দেখায় না।
- List-এ `map` আর স্থায়ী, unique `key`।
- Event handler-এ function দাও, function call-এর ফলাফল না।

## ইন্টারভিউ প্রশ্ন

**প্রশ্ন: Virtual DOM কী? কেন দরকার?**
উত্তর: Virtual DOM হলো আসল DOM-এর একটা হালকা JavaScript copy, যেটা memory-তে থাকে। Data বদলালে React নতুন Virtual DOM বানিয়ে আগেরটার সাথে তুলনা করে (diffing), তারপর আসল DOM-এ শুধু পার্থক্যটুকু বসায়। আসল DOM বদলানো slow আর expensive, তাই এতে কাজ অনেক কম হয়।

**প্রশ্ন: Render, mount আর re-render-এর পার্থক্য কী?**
উত্তর: Render মানে React component function call করে জানা screen-এ কী দেখাতে হবে। Mount মানে component প্রথমবার DOM-এ বসানো। পরে state বা props বদলালে React আবার function call করে নতুন চেহারা বের করে, এটা re-render। আর component DOM থেকে সরে গেলে সেটা unmount।

**প্রশ্ন: Props আর State-এর পার্থক্য কী?**
উত্তর: Props বাইরে থেকে, মানে parent থেকে আসে, আর child সেগুলো বদলাতে পারে না, শুধু পড়ে। State হলো component-এর নিজের মনে রাখা data, যা সে নিজে বদলাতে পারে। দুটোর যেকোনোটা বদলালে component re-render হয়।

**প্রশ্ন: key কেন দরকার? index কেন ভালো key নয়?**
উত্তর: List বদলালে কোন element কোন data-র, সেটা React key দিয়ে চেনে। Index ব্যবহার করলে মাঝখানে কিছু যোগ বা মুছলে পরের সব item-এর index সরে যায়, তখন React ভুল element-এর সাথে ভুল data জুড়ে দিতে পারে। Database-এর id-র মতো স্থায়ী আর unique value সবচেয়ে ভালো key।

**প্রশ্ন: JSX কী? Browser কি JSX বোঝে?**
উত্তর: JSX হলো JavaScript-এর ভেতরে HTML-এর মতো করে UI লেখার syntax। Browser এটা বোঝে না। Build tool, আমাদের ক্ষেত্রে Vite, এটাকে সাধারণ JavaScript function call-এ convert করে, যেটা React-এর জন্য একটা object বানায়।

**প্রশ্ন: One-way data flow কী?**
উত্তর: Data শুধু উপর থেকে নিচে, parent থেকে child-এ props হিসেবে যায়। Child কিছু বদলাতে চাইলে নিজে বদলায় না, parent-এর দেওয়া callback function call করে। Parent তখন নিজের data বদলায় আর নতুন props পাঠায়। এতে data কোথা থেকে আসছে আর কে বদলাচ্ছে, তা সহজে বোঝা যায়।

**প্রশ্ন: Fragment কী?**
উত্তর: `<>...</>`। কয়েকটা element একসাথে return করতে দেয়, অথচ DOM-এ বাড়তি কোনো tag যোগ করে না। Component একটাই root element return করতে পারে বলে এটা দরকার হয়।

**প্রশ্ন: StrictMode কী করে?**
উত্তর: StrictMode শুধু development-এ চলে। লুকানো bug ধরার জন্য component ইচ্ছা করে দুইবার render করে, effect-ও দুইবার চালায়, আর পুরনো API ব্যবহার করলে সতর্ক করে। Production-এ এর কোনো প্রভাব নেই।
