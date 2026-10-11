# অধ্যায় ১৩: পুরো feature একসাথে — Applications

আগের সব অধ্যায়ের জ্ঞান এখন একসাথে কাজে লাগবে। এই অধ্যায়ে "Applications" feature-এর প্রতিটা page শুরু থেকে শেষ পর্যন্ত দেখব।

---

## ১৩.১ Feature-এর file map

```
features/applications/
├── applications.types.ts      ← JobApplication, ApplicationFilters, ApplicationFormValues, ApplicationsState
├── applications.constants.ts  ← ApplyMedium, SortField, SortOrder, StatusFilter enum; DEFAULT_FILTERS; EMPTY_FORM_VALUES
├── applications.utils.ts      ← filtersToQuery, toFormValues, toPayload, validateForm, formatSalary, isDeadlinePassed
├── applications.api.ts        ← HTTP call
├── applications.thunks.ts     ← loadApplications, loadApplication, createApplication, updateApplication, deleteApplication
├── applications.slice.ts      ← state + reducers
├── ApplicationsPage.tsx       ← list page
├── ApplicationFilters.tsx     ← search, status, medium, sort, per page
├── ApplicationsTable.tsx      ← table
├── StatusBadge.tsx            ← Applied / Not applied badge
├── ApplicationFormPage.tsx    ← new/edit page
├── ApplicationForm.tsx        ← আসল form
└── ApplicationDetailsPage.tsx ← details page
```

### মূল data-র shape

`applications.types.ts`:
```ts
export interface JobApplication
{
    id: string;
    jobPost: string;
    jobPostLink: string;
    deadline: string | null;
    applyMedium: ApplyMedium;
    applyLink: string | null;
    applyMail: string | null;
    cvLink: string | null;
    salaryMin: number | null;
    salaryMax: number | null;
    salaryCurrency: string | null;
    isApplied: boolean;
    appliedAt: string | null;
    createdAt: string;
    updatedAt: string;
}
```
তারিখগুলো `string`, কারণ JSON-এ Date type নেই। server তারিখ পাঠায় এরকম string হিসেবে: `"2026-10-11T09:21:50.103Z"`।

এটাকে বলে **ISO format**: `YYYY-MM-DDTHH:mm:ss`, মানে বছর-মাস-দিন, তারপর `T`, তারপর ঘণ্টা:মিনিট:সেকেন্ড (এখানে `.103` হলো millisecond)। শেষের **`Z`** মানে সময়টা **UTC**-তে, অর্থাৎ পৃথিবীর একটা common reference time-এ। বাংলাদেশের সময় UTC+6, মানে UTC-র চেয়ে ৬ ঘণ্টা এগিয়ে। তাই `09:21Z` বাংলাদেশে বিকেল ৩:২১ (15:21)।

---

## ১৩.২ List page: `ApplicationsPage`

Page-টা কয়েকটা component জুড়ে বানানো (সংক্ষেপে):
```tsx
return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-800">Applications</h1>
            <LinkButton to={AppRoutes.ApplicationCreate}>+ New application</LinkButton>
        </div>

        <ApplicationFilters />
        <ErrorMessage message={listError} />

        {listStatus === RequestStatus.Loading && items.length === 0 && <Spinner />}
        {listStatus === RequestStatus.Succeeded && items.length === 0 && <p>No applications found.</p>}
        {items.length > 0 && <ApplicationsTable applications={items} onToggleApplied={...} onDelete={...} />}
        {meta && items.length > 0 && <Pagination meta={meta} onPageChange={...} />}
    </div>
);
```

| পরিস্থিতি | কী দেখায় |
|---|---|
| প্রথমবার load হচ্ছে | Spinner |
| ব্যর্থ | লাল error box |
| সফল, কিন্তু কিছু নেই | "No applications found." |
| data আছে | table + pagination |

Spinner-এর সাথে `items.length === 0` কেন? filter বদলালে list আবার load হয়। তখন spinner না দেখিয়ে পুরনো table দেখাতে থাকি, যাতে screen বারবার লাফিয়ে না ওঠে। শুধু প্রথমবার, যখন দেখানোর মতো কিছু নেই, তখন spinner।

### Filter (অধ্যায় ৮ আর ১০-এ বিস্তারিত)
- **Search:** local state + ৪০০ms debounce, তারপর `filtersChanged({ search })`।
- **Status, Apply via, Sort by, Per page:** সাথে সাথে `filtersChanged(...)`।
- **↑/↓ button:** sort order উল্টে দেয়।
- **Reset:** `filtersReset()`।

`<select>` থেকে আসা value সবসময় string। সেটাকে enum-এ convert করে `parseEnum`, `frontend/src/shared/utils.ts`-এ:
```ts
export function parseEnum<T extends string>(allowed: readonly T[], value: string, fallback: T): T
{
    return allowed.find((item) => item === value) ?? fallback;
}
```
`allowed` হলো allowed value-গুলোর list। `value` সেই list-এ থাকলে সেটাই ফেরত আসে, না থাকলে `fallback`। `Object.values(StatusFilter)` enum-এর সব value-র array দেয়: `['all', 'applied', 'notApplied', 'upcoming', 'expired']`। যেমন `parseEnum(Object.values(StatusFilter), 'applied', StatusFilter.All)` দেয় `StatusFilter.Applied`, আর `'hello'` দিলে দেয় `StatusFilter.All`। এভাবে `as` দিয়ে জোর করে type বদলাতে হয় না।

### Table: `ApplicationsTable`

Table নিজে কোনো data আনে না, কিছু বদলায়ও না। সে শুধু দেখায়, আর কোনো **event** (যেমন click) হলে callback দিয়ে parent-কে জানায়:
```ts
interface ApplicationsTableProps
{
    applications: JobApplication[];
    onToggleApplied: (application: JobApplication) => void;
    onDelete: (application: JobApplication) => void;
}
```
এমন component-কে বলে **presentational component**: শুধু props থেকে UI দেখায়। আর যে component data আনে ও সিদ্ধান্ত নেয় (এখানে ApplicationsPage), তাকে বলে **container component**।

Table-এর প্রতিটা row-তে থাকে:
- job post-এর নাম, যেটা click করলে details page-এ যায় (`<Link>`)
- deadline। deadline পেরিয়ে গেছে আর এখনো apply করা হয়নি, এমন হলে লাল (`isDeadlinePassed`)
- apply medium, আর salary (`formatSalary` দেয় যেমন "50,000 – 90,000 BDT")
- status badge, যেটা click করলে Applied ↔ Not applied বদলায়
- Edit link আর Delete button

### Status বদলানো আর delete
```tsx
function handleToggleApplied(application: JobApplication): void
{
    void dispatch(updateApplication({ id: application.id, payload: { isApplied: !application.isApplied } }));
}

async function handleDelete(application: JobApplication): Promise<void>
{
    if (!window.confirm(`Delete "${application.jobPost}"?`))
    {
        return;
    }
    await dispatch(deleteApplication(application.id));
    if (items.length === 1 && filters.page > 1)
    {
        dispatch(filtersChanged({ page: filters.page - 1 }));
    }
    else
    {
        void dispatch(loadApplications(filters));
    }
}
```
- **`window.confirm`**: browser-এর নিজস্ব "OK / Cancel" box। user Cancel চাপলে `false` আসে, আর function সেখানেই থেমে যায়।
- **`handleToggleApplied`**: slice `updateApplication.fulfilled`-এ row-টা server-এর নতুন data দিয়ে বদলে দেয়, তাই badge সাথে সাথে বদলায় (অধ্যায় ১১)।
- delete সফল হলে slice নিজেই `items` থেকে row-টা সরিয়ে দেয় (অধ্যায় ১১)। তবুও list আবার load করা হয়। কেন? ধরো page-এ ১০টা item ছিল, একটা মুছলে ৯টা থাকে। আবার load করলে server পরের page-এর প্রথম item এনে page-টা আবার ১০টা দিয়ে ভরে দেয়।
- `items.length === 1` কী বোঝায়? handler-এর ভেতরের `items` হলো সেই value, যেটা এই render-এর সময় ছিল। function-টা তৈরি হওয়ার সময়ের `items` মনে রেখেছে, এটাই closure (অধ্যায় ২)। `await`-এর পরে slice বদলালেও এই `items` বদলায় না। তাই `items.length === 1` মানে "যেটা মুছলাম, সেটা এই page-এর শেষ item ছিল"।
- তখন page খালি হয়ে যেত, তাই আগের page-এ যাওয়া হয়। page বদলালে `filters` বদলায়, আর ApplicationsPage-এর `useEffect` (যার dependency `filters`) নিজেই list আবার load করে। তাই এই ক্ষেত্রে আলাদা করে `loadApplications` call করতে হয় না।

### Async function কেন সরাসরি prop হিসেবে দেওয়া হয়নি?
```tsx
onDelete={(application): void =>
{
    void handleDelete(application);
}}
```
`onDelete`-এর type `(application) => void`, কিন্তু `handleDelete` Promise return করে। সরাসরি দিলে ESLint সতর্ক করে (`no-misused-promises` rule; এটা ৫.৪-এ বলা `strictTypeChecked` rule-set-এর অংশ), কারণ কেউ সেই Promise-এর error ধরবে না। তাই একটা ছোট wrapper বানিয়ে `void` দিয়ে স্পষ্ট করা হলো যে Promise-টা ইচ্ছা করেই ছেড়ে দেওয়া হচ্ছে।

### Pagination

Server মোট কতগুলো application আছে সেটা বলে না। শুধু বলে `hasNext` (পরের page আছে কিনা) আর `hasPrev` (আগের page আছে কিনা)। তাই Pagination component শুধু Previous/Next button আর "Page 2" দেখায়।

মোট সংখ্যা জানতে database-এ **`COUNT(*)`** চালাতে হতো। এটা একটা SQL query, যেটা table-এর সব row গুনে দেয়। বড় table-এ এটা ধীর, কারণ database-কে প্রতিটা row ছুঁয়ে দেখতে হয়।

আমাদের backend (`backend/jat/src/common/utils/pagination.util.ts`) একটা চালাকি করে। ১০টা চাইলে database-কে বলে ১১টা দাও (`take: query.limit + 1`)। যদি ১১টা আসে, তাহলে পরের page আছে, তাই `hasNext = true`, আর বাড়তি একটা বাদ দিয়ে ১০টা পাঠায়। ১১টার কম এলে `hasNext = false`। `hasPrev` আরও সহজ: page ১-এর বেশি হলেই `true`।

---

## ১৩.৩ নতুন আর edit: `ApplicationFormPage` + `ApplicationForm`

### দুই component, দুই দায়িত্ব

| Component | দায়িত্ব |
|---|---|
| `ApplicationFormPage` | URL থেকে id নেওয়া, edit হলে data আনা, save করা, তারপর অন্য page-এ যাওয়া |
| `ApplicationForm` | শুধু form: input, validation, তারপর payload বানিয়ে `onSubmit`-এ দেওয়া |

`ApplicationForm` জানেই না যে server, Redux বা router আছে। তাই এটা বোঝা সহজ, আর **testable**: test-এ শুধু props দিয়ে চালিয়ে দেখা যায়।

### Page-এর মূল অংশ (সংক্ষেপে)
```tsx
const { id } = useParams<{ id: string; }>();

useEffect((): void =>
{
    dispatch(saveErrorCleared());
    if (id)
    {
        void dispatch(loadApplication(id));
    }
}, [dispatch, id]);

if (id && selected?.id !== id)
{
    return selectedStatus === RequestStatus.Failed ? <ErrorMessage message={selectedError} /> : <Spinner />;
}

return (
    <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold text-slate-800">{id ? 'Edit application' : 'New application'}</h1>
        <ErrorMessage message={saveError} />
        <ApplicationForm
            key={id ?? 'new'}
            initialValues={id && selected ? toFormValues(selected) : EMPTY_FORM_VALUES}
            submitLabel={id ? 'Save changes' : 'Create application'}
            isSaving={saveStatus === RequestStatus.Loading}
            onSubmit={(payload): void =>
            {
                void handleSubmit(payload);
            }}
        />
    </div>
);
```
- URL-এ id থাকলে (`/applications/:id/edit`) এটা edit, না থাকলে (`/applications/new`) নতুন। heading-ও সেই অনুযায়ী "Edit application" বা "New application" দেখায়।
- Edit হলে application-টা না আসা পর্যন্ত spinner দেখায়, কারণ form-এর **initial value** তখনো জানা নেই।
- **`<ErrorMessage message={saveError} />`**: save ব্যর্থ হলে form-এর উপরে লাল box-এ server-এর message দেখায়।
- **`initialValues`**: নতুন হলে খালি value (`EMPTY_FORM_VALUES`), edit হলে server-এর data থেকে বানানো (`toFormValues`)।
- **`key`**: অন্য application-এ বা নতুন form-এ গেলে form একদম নতুন করে শুরু হয় (অধ্যায় ৭-এর key reset)। `useState(initialValues)` initial value শুধু প্রথম render-এ নেয়, পরে prop বদলালেও নেয় না। তাই key বদলে নতুন component বানানোই সবচেয়ে সহজ সমাধান।

### Form-এর ভেতরে conditional field (সংক্ষেপে)
```tsx
{values.applyMedium === ApplyMedium.Link
    ? <Field label="Apply link" ...><Input ... /></Field>
    : <Field label="Application mail" ...><RichTextEditor ... /></Field>}

{values.isApplied && (
    <Field label="Applied at (leave empty for now)" htmlFor="appliedAt">
        <Input type="datetime-local" ... />
    </Field>
)}
```
- **Conditional field** মানে এমন input field, যেটা কোনো শর্ত মিললে তবেই দেখায়।
- "Apply by link" বেছে নিলে link-এর input field আসে, আর "Apply by mail" বেছে নিলে mail লেখার editor।
- "I have applied" tick দিলে তবেই apply-এর তারিখের field দেখায়।
- Label-এর "(leave empty for now)" মানে: এই field খালি রাখলে server এখনকার সময় বসিয়ে দেবে। তাই আজই apply করলে তারিখ লেখার দরকার নেই।

### তারিখ: `datetime-local` input

`<input type="datetime-local">` value দেয় আর চায় এই format-এ: `"2026-10-11T15:30"`। এখানে কোনো `Z` নেই, মানে এটা user-এর computer-এর **local time**। server চায় ISO format, UTC-তে: `"2026-10-11T09:30:00.000Z"`। বাংলাদেশে (UTC+6) local 15:30 মানে UTC 09:30।

দুই দিকের **conversion function** আছে `shared/utils.ts`-এ:
```ts
export function fromDateTimeInputValue(value: string): string | null
{
    return value ? new Date(value).toISOString() : null;
}
```
`new Date("2026-10-11T15:30")` string-টাকে local time হিসেবে পড়ে, আর `toISOString()` সেটাকে UTC-তে লেখে। বাংলাদেশের computer-এ ফল হয় `"2026-10-11T09:30:00.000Z"`। খালি string দিলে `null` আসে।

`toDateTimeInputValue` ঠিক উল্টো কাজ করে। ISO string থেকে local বছর, মাস, দিন, ঘণ্টা, মিনিট বের করে `"2026-10-11T15:30"` বানায়, যাতে edit form-এ সঠিক সময় দেখায়।

### Save করা
```ts
const saved = id
    ? await dispatch(updateApplication({ id, payload })).unwrap()
    : await dispatch(createApplication(payload)).unwrap();
void navigate(buildPath(AppRoutes.ApplicationDetails, { id: saved.id }));
```
সফল হলে নতুন বা update হওয়া application-এর details page-এ যাওয়া হয়। ব্যর্থ হলে `unwrap()` throw করে, তাই `navigate` আর চলে না (পুরো function একটা try/catch-এ wrap করা)। `catch`-এ শুধু `return`; error message দেখানোর কাজ slice-এর `saveError`-এর। তখন slice `saveError` set করে, আর form-এর উপরে message দেখায়। যেমন development-এ backend বন্ধ থাকলে Vite proxy `502` দেয়, তাই দেখাবে "Bad Gateway" (অধ্যায় ৩.৫-এর `request` function-এর শেষ ধাপ)। (form-এর নিজের validation, মানে `validateForm`, আগেই ভুল ধরে ফেলে, তাই server-এর validation error এখান থেকে সাধারণত আসে না।)

### Business rule-গুলো কোথায়?

**Business rule** মানে app-এর নিজস্ব নিয়ম, যেমন "link দিয়ে apply হলে link লাগবেই"। এগুলো তিন জায়গায় আছে, আর প্রত্যেকটার কাজ আলাদা।

**(ক) `validateForm`: সাথে সাথে feedback।** submit-এর সময় form-এর ভেতরেই check হয়, server-এ যাওয়ার আগে। ভুল থাকলে field-এর নিচে লাল লেখা আসে, request যায় না। যেমন:
- job post খালি থাকলে "Job post is required"
- link `http://` বা `https://` দিয়ে না শুরু হলে "Enter a valid link..."
- mail medium বেছে mail খালি রাখলে "Write the application mail"
- `salaryMin` > `salaryMax` হলে "Maximum must be greater than minimum"

**(খ) `toPayload`: পাঠানোর আগে data পরিষ্কার করা।** এটা কিছু আটকায় না, শুধু form-এর value-কে server-এর পছন্দমতো আকারে সাজায়। যেমন:
- medium LINK হলে `applyMail: null` যায়, আর MAIL হলে `applyLink: null`। ফলে অন্য medium বেছে আগে কিছু লিখে থাকলেও সেটা save হয় না।
- "I have applied" tick না থাকলে `appliedAt: null` যায়।
- লেখার আগে-পরের ফাঁকা জায়গা `trim()` দিয়ে কাটা হয়, আর salary string থেকে number হয়।

**(গ) Server: আসল validation।** frontend-এর check যে কেউ এড়াতে পারে, তাই server (`backend/jat/src/application/services/application.service.ts`) সব নিয়ম আবার check করে। যেমন কেউ সরাসরি API-তে `applyMedium: "LINK"` পাঠাল কিন্তু `applyLink` দিল না, তখন server **400 Bad Request** দেয়: "applyLink is required when applyMedium is LINK"।

একটা জিনিস validation না, বরং **default**: `isApplied` true কিন্তু `appliedAt` নেই, এমন হলে server ভুল ধরে না। সে নিজেই "এখন"-এর সময় বসিয়ে দেয়। form-এর "(leave empty for now)" label এই default-এর উপরেই ভরসা করে।

---

## ১৩.৪ Rich text: Tiptap editor

চাকরির application mail-এ bold, italic, list থাকতে পারে। সাধারণ `<textarea>` এসব পারে না। তাই **Tiptap** library ব্যবহার করা হয়েছে।

`frontend/src/shared/components/RichTextEditor.tsx` (সংক্ষেপে):
```tsx
interface ToolbarAction
{
    label: string;
    run: (editor: Editor) => boolean;
}

const TOOLBAR: ToolbarAction[] = [
    { label: 'B', run: (editor) => editor.chain().focus().toggleBold().run() },
    { label: 'I', run: (editor) => editor.chain().focus().toggleItalic().run() },
    { label: 'U', run: (editor) => editor.chain().focus().toggleUnderline().run() },
    { label: '• List', run: (editor) => editor.chain().focus().toggleBulletList().run() },
    { label: '1. List', run: (editor) => editor.chain().focus().toggleOrderedList().run() },
];

export function RichTextEditor({ id, value, onChange }: RichTextEditorProps): JSX.Element
{
    const editor = useEditor({
        extensions: [StarterKit],
        content: value,
        onUpdate: ({ editor: current }): void => onChange(current.getHTML()),
        editorProps: { attributes: { id, class: 'rich-text min-h-40 px-3 py-2 text-sm' } },
    });

    return (
        <div className="overflow-hidden rounded-md border border-slate-300 bg-white">
            <div className="flex gap-1 border-b border-slate-200 bg-slate-50 p-1">
                {TOOLBAR.map((action) => (
                    <button
                        key={action.label}
                        type="button"
                        onClick={(): void =>
                        {
                            action.run(editor);
                        }}
                    >
                        {action.label}
                    </button>
                ))}
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}
```
- **`useEditor`**: Tiptap-এর নিজের hook (একটা **custom hook**, মানে `use` দিয়ে শুরু হওয়া এমন function যেটা ভেতরে React-এর hook ব্যবহার করে)। এটা একটা editor বানিয়ে দেয়।
- **`StarterKit`**: bold, italic, underline, list-এর মতো সাধারণ feature-এর একটা package।
- **`onUpdate`**: editor-এ প্রতিটা বদলে লেখাটা HTML string হিসেবে parent-কে দেয়। যেমন "Hello" লিখে "HR" bold করলে parent পায় `<p>Hello <strong>HR</strong></p>`। (Tiptap bold-এর জন্য `<b>` না, `<strong>` ব্যবহার করে।)
- **`({ editor: current })`** মানে object-এর `editor` field বের করে `current` নামে রাখো (destructuring-এর সময় rename)। বাইরের `editor` variable-এর সাথে নাম যেন না মেলে, তাই। এখানে `: current` কোনো type না।
- **`EditorContent`**: editor-এর লেখার জায়গাটা screen-এ বসায়।
- **`TOOLBAR` array থেকে `map`**: পাঁচটা button আলাদা করে না লিখে data থেকে বানানো। নতুন button লাগলে array-তে একটা object যোগ করলেই হয়।

### Method chaining: `editor.chain().focus().toggleBold().run()`

এখানে একটার পর একটা method dot দিয়ে জোড়া, একে বলে **method chaining**। এটা কাজ করে কারণ প্রতিটা method একটা "chain" object return করে, আর পরের method সেই object-এর উপর call হয়।

| ধাপ | কী করে |
|---|---|
| `editor.chain()` | একটা খালি command-এর list শুরু করে |
| `.focus()` | list-এ যোগ করে: "editor-এ cursor ফেরত দাও" (button click করলে focus editor থেকে সরে যায়) |
| `.toggleBold()` | list-এ যোগ করে: "selected লেখা bold থাকলে বন্ধ, না থাকলে চালু" |
| `.run()` | এতক্ষণ জমানো সব command একসাথে চালায় |

`run()` না লিখলে কিছুই ঘটে না, শুধু list তৈরি হয়ে পড়ে থাকে। ফলাফল: B button চাপলে selected লেখা bold হয়, আর cursor editor-এই থেকে যায়।

Tailwind browser-এর default list style (bullet, number) মুছে দেয়। তাই `index.css`-এ `.rich-text ul`-এ bullet আর `.rich-text ol`-এ number ফেরত আনা হয়েছে।

**খালি mail চেনা:** editor খালি হলেও `<p></p>` দেয়, যেটা খালি string না। তাই validation-এ HTML থেকে শুধু লেখা বের করে দেখা হয়: `htmlToText(values.applyMail)`। `<p></p>` থেকে আসে `''`, তাই error দেখায়।

---

## ১৩.৫ Details page: `ApplicationDetailsPage`

(সংক্ষেপে)
```tsx
<dl className="divide-y divide-slate-100 rounded-xl bg-white px-6 shadow">
    <DetailRow label="Job post link">
        <ExternalLink href={selected.jobPostLink} />
    </DetailRow>
    <DetailRow label="Deadline">{formatDateTime(selected.deadline)}</DetailRow>
    <DetailRow label="Salary">{formatSalary(selected)}</DetailRow>
    ...
</dl>
```
- **`DetailRow`, `ExternalLink`**: একই file-এর ভেতরের ছোট component, export করা হয়নি। শুধু এই page-এ লাগে, তাই আলাদা file বানানো হয়নি।
- **`<dl>`, `<dt>`, `<dd>`**: "label আর তার value"-র list দেখানোর সঠিক HTML tag (description list)। `<dt>`-তে label, `<dd>`-তে value।

### HTML দেখানো: `dangerouslySetInnerHTML`

React সাধারণত `{ }`-এর ভেতরের string-কে **escape** করে, মানে HTML tag-গুলোকে সাধারণ লেখা হিসেবে দেখায়। যেমন:
```tsx
<div>{'<b>Hi</b>'}</div>
```
screen-এ দেখা যায় হুবহু `<b>Hi</b>` লেখাটা, bold "Hi" না। এটাই XSS থেকে বাঁচায় (অধ্যায় ১২): কেউ `<script>` লিখলেও সেটা লেখা হিসেবে দেখায়, চলে না।

কিন্তু mail-এর bold, list তো দেখাতে হবে। আসল HTML render করতে এই বিশেষ prop লাগে:
```tsx
<div className="rich-text" dangerouslySetInnerHTML={{ __html: selected.applyMail }} />
```
এখানে `applyMail` যদি `<p>Hello <strong>HR</strong></p>` হয়, তাহলে screen-এ দেখায় "Hello **HR**"। নামটা ইচ্ছা করেই ভয় দেখানো, কারণ কেউ এখানে বিপজ্জনক HTML ঢোকাতে পারলে সেটা সত্যিই চলবে।

**আমরা নিরাপদ কেন?** backend save করার আগেই mail-কে sanitize করে (`backend/jat/src/common/utils/html.util.ts`, `sanitize-html` library)। শুধু নিরাপদ tag রাখে, যেমন `p`, `b`, `strong`, `i`, `em`, `u`, `ul`, `ol`, `li`, `a`। `<script>`, `<iframe>`, `style` সহ বাকি সব মুছে দেয়। ফলে database-এ যা আছে, সেটা দেখানো নিরাপদ।

### Action button
- **Mark as applied / not applied**: `updateApplication` dispatch হয়। slice `selected` update করে, তাই page সাথে সাথে বদলায়।
- **Edit**: `LinkButton`, যেটা edit page-এ নিয়ে যায়।
- **Delete**: confirm, তারপর `deleteApplication`। সফল হলে list page-এ ফেরত যায়।

---

## সারসংক্ষেপ
- List page: filter (Redux-এ) বদলালে effect চলে, effect thunk dispatch করে, তারপর table + pagination দেখায়। loading, error, empty প্রতিটা state আলাদা দেখানো হয়।
- Delete-এর পরে list আবার load হয়, যাতে page পরের item দিয়ে ভরে যায়। page-এর শেষ item মুছলে আগের page-এ যাওয়া হয়।
- Server `COUNT(*)` চালায় না, `limit + 1` row এনে `hasNext` বোঝে।
- Table presentational: শুধু দেখায় আর callback দিয়ে event জানায়।
- একই form page নতুন আর edit দুই কাজ করে। `key` দিয়ে form নতুন করে শুরু হয়।
- `validateForm` সাথে সাথে feedback দেয়, `toPayload` data পরিষ্কার করে, আর server আসল validation করে।
- form-এর local time আর server-এর ISO/UTC string-এর মাঝে conversion function আছে।
- Tiptap দিয়ে rich text লেখা হয়, `dangerouslySetInnerHTML` দিয়ে দেখানো হয়, আর server আগেই sanitize করে রাখে।

## ইন্টারভিউ প্রশ্ন

**প্রশ্ন: Presentational আর Container component কী?**
উত্তর: Presentational component শুধু props থেকে UI দেখায়, আর কোনো event হলে callback দিয়ে parent-কে জানায়। যেমন আমার ApplicationsTable: সে `applications`, `onToggleApplied`, `onDelete` props নেয়, নিজে কোনো data আনে না। Container component data আনে, state সামলায়, আর সিদ্ধান্ত নেয়। যেমন ApplicationsPage, যে Redux থেকে data পড়ে আর thunk dispatch করে। এতে UI অংশ **reusable** হয় (অন্য data দিয়ে অন্য জায়গায় ব্যবহার করা যায়) আর testable হয়।

**প্রশ্ন: dangerouslySetInnerHTML কী? কখন নিরাপদ?**
উত্তর: React সাধারণত string escape করে, তাই `{'<b>Hi</b>'}` screen-এ লেখা হিসেবে `<b>Hi</b>` দেখায়। আসল HTML render করতে চাইলে `dangerouslySetInnerHTML={{ __html: html }}` দিতে হয়। এতে XSS-এর ঝুঁকি আছে, কারণ HTML-এ বিপজ্জনক কিছু থাকলে সেটা চলবে। তাই শুধু বিশ্বস্ত বা sanitize করা HTML দিতে হয়। আমার project-এ server save করার আগে `sanitize-html` দিয়ে শুধু নিরাপদ tag রাখে। client-এ করতে চাইলে DOMPurify library আছে।

**প্রশ্ন: Form-এ initial value বদলালে নতুন value দেখায় না কেন? সমাধান কী?**
উত্তর: `useState(initialValue)` initial value শুধু প্রথম render-এ নেয়। পরে prop বদলালেও state বদলায় না। সমাধান হলো component-কে নতুন `key` দেওয়া। key বদলালে React পুরনো component unmount করে নতুনটা mount করে, তাই state নতুন initial value দিয়ে শুরু হয়। আমার project-এ `key={id ?? 'new'}` দিয়েছি। আরেকটা উপায় হলো data আসার পরে তবেই form render করা, সেটাও করেছি (data না আসা পর্যন্ত spinner)।

**প্রশ্ন: Pagination কত রকম হয়?**
উত্তর:
- **Offset/page-based** (`?page=3&limit=10`): সহজ, আর যেকোনো page-এ লাফ দেওয়া যায়। কিন্তু বড় data-য় ধীর, কারণ page ৩ চাইলে database-কে প্রথম ২০টা row পেরিয়ে যেতে হয়, ফেলে দেওয়ার জন্য হলেও। page যত পিছনে, তত বেশি row পেরোতে হয়।
- **Cursor-based** (`?after=<id>`): মানে "এই id-এর পরেরগুলো দাও"। database index দিয়ে সরাসরি ওই জায়গায় চলে যায়, তাই বড় data-তেও দ্রুত। মাঝে নতুন row যোগ হলেও item বাদ পড়ে না বা দুবার আসে না, তাই **stable**। কিন্তু সরাসরি page ৫-এ যাওয়া যায় না।
- মোট সংখ্যা জানতে `COUNT(*)` লাগে, যেটা বড় table-এ **expensive**। আমার project-এ server `limit + 1` row আনে: ১১টা এলে `hasNext = true`, আর ১০টা পাঠায়। তাই শুধু Previous/Next দেখাই।

**প্রশ্ন: একই component দিয়ে create আর edit কেন?**
উত্তর: দুটোর field আর validation একই, শুধু initial value আর save-এর API আলাদা। তাই ApplicationForm শুধু `initialValues`, `submitLabel`, `onSubmit` props নেয়, আর ApplicationFormPage ঠিক করে কোনটা দেবে। একটা component রাখলে code দ্বিগুণ হয় না, আর এক জায়গায় বদলালে দুটোই ঠিক হয়।

**প্রশ্ন: Frontend validation থাকলে server validation কেন লাগে?**
উত্তর: frontend validation শুধু user experience (UX)-এর জন্য, যাতে ভুল সাথে সাথে দেখা যায়। কিন্তু যে কেউ browser বাদ দিয়ে সরাসরি API-তে request পাঠাতে পারে। তাই server সব নিয়ম আবার check করে। যেমন আমার project-এ `applyMedium: "LINK"` দিয়ে `applyLink` না পাঠালে server 400 দেয়।
