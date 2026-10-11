# অধ্যায় ৭: State আর Event

Props বাইরে থেকে আসে। কিন্তু component-এর **নিজের** কিছু মনে রাখার দরকার হলে, যেমন input field-এ user কী লিখেছে, তখন লাগে **state** (অধ্যায় ৬.১-এ এক লাইনে দেখেছি)। এই অধ্যায়ে state, event, আর form নিয়ে পুরো আলোচনা।

---

## ৭.১ কেন সাধারণ variable দিয়ে হয় না?

ধরো login page-এ email মনে রাখতে একটা সাধারণ variable নিলাম:
```tsx
function LoginPage(): JSX.Element
{
    let email = '';
    return <input value={email} onChange={(event): void => { email = event.target.value; }} />;
}
```
- `onChange` চলে প্রতিবার user input field-এ কিছু টাইপ করলে। `event.target` হলো সেই input element, আর `event.target.value` হলো তাতে এখন যা লেখা আছে।

এই code কাজ করবে না, দুটো কারণে:
1. `email` বদলালে React **জানতেই পারে না** যে কিছু বদলেছে, তাই re-render হয় না, screen-ও বদলায় না।
2. কোনো কারণে re-render হলেও function আবার শুরু থেকে চলে, তাই `let email = ''` লাইনে `email` আবার খালি হয়ে যায়।

দরকার এমন একটা জিনিস, যেটা re-render-এর মাঝে value মনে রাখে, আর বদলালে React-কে re-render করতে বলে। এটাই state।

---

## ৭.২ `useState`

```tsx
import { useState } from 'react';

const [email, setEmail] = useState('');
```
- **`useState('')`**: React-কে বলে "এই component-এর জন্য একটা value মনে রাখো, শুরুতে `''`"।
- এটা দুটো জিনিসের একটা array return করে, যেগুলো array destructuring (অধ্যায় ২.৯) দিয়ে নেওয়া হয়:
  - **`email`**: বর্তমান value।
  - **`setEmail`**: value বদলানোর function। একে বলে **setter**।
- **`setEmail('a@b.com')`** call করলে:
  1. React নতুন value মনে রাখে।
  2. Component **re-render** হয় (function আবার চলে)।
  3. এবার `useState` return করে নতুন value, তাই `email` হয় `'a@b.com'`, আর screen সেই অনুযায়ী বদলায়।

শুরুর value (`''`) শুধু প্রথম render-এ, মানে mount-এর সময় কাজে লাগে। পরের সব render-এ React নিজের মনে রাখা value দেয়। এই কথাটা ৭.১০-এ খুব কাজে লাগবে।

### Hook কী?
`useState` হলো একটা **hook**। Hook মানে `use` দিয়ে শুরু হওয়া একটা React function, যেটা component-কে বাড়তি ক্ষমতা দেয় (যেমন `useState` দেয় মনে রাখার ক্ষমতা)। Hook শুধু component function-এর **top level**-এ call করা যায়: `if`, loop বা ভেতরের কোনো function-এর মধ্যে না। কেন এই নিয়ম, আর আরও hook, বিস্তারিত অধ্যায় ৮-এ।

### নামকরণের নিয়ম
`[কিছু, setকিছু]`, যেমন `[email, setEmail]`, `[values, setValues]`, `[errors, setErrors]`।

### Type
সাধারণত TypeScript শুরুর value দেখে type বুঝে নেয়: `useState('')` থেকে `email` হয় `string`। শুরুর value দেখে বোঝা না গেলে generic (অধ্যায় ৪.৬) দিয়ে নিজে বলে দাও। `ApplicationForm.tsx` থেকে:
```tsx
const [values, setValues] = useState<ApplicationFormValues>(initialValues);
const [errors, setErrors] = useState<ApplicationFormErrors>({});
```
দ্বিতীয় লাইনে শুরুর value `{}`, যেটা দেখে TypeScript বুঝতে পারত না পরে এতে কী কী field আসবে। তাই `<ApplicationFormErrors>` লেখা হয়েছে (এই type অধ্যায় ৪.৭-এ দেখেছ)।

---

## ৭.৩ Render: function আবার চলা মানে কী

React component হলো একটা function। প্রতিবার state বা props বদলালে **পুরো function আবার চলে**, আর নতুন JSX return করে।

ধরো `RegisterPage`-এ বোঝার জন্য একটা `console.log` যোগ করলাম (সংক্ষেপে; আসল file-এ এই log নেই, আর আরও অনেক কিছু আছে):
```tsx
export function RegisterPage(): JSX.Element
{
    const [name, setName] = useState('');
    console.log('render হলো, name =', name);
    return <Input value={name} onChange={(event): void => setName(event.target.value)} />;
}
```
Input field-এ "Rahim" টাইপ করলে console-এ দেখাবে:
```
render হলো, name =
render হলো, name = R
render হলো, name = Ra
render হলো, name = Rah
...
```
প্রতিটা অক্ষরে `setName` call হয়, আর প্রতিবার পুরো function আবার চলে।

Development-এ প্রতিটা লাইন দুইবার করে দেখতে পারো। এটা bug না, `StrictMode` ইচ্ছা করে প্রতিটা component দুইবার render করে (অধ্যায় ৬.৪)।

### State হলো একটা snapshot
একটা render-এর ভেতরে state-এর value **বদলায় না**। `setName` call করলে বদলটা দেখা যায় **পরের render-এ**:
```tsx
setName('Karim');
console.log(name);
```
এখানে এখনো পুরনো value print হবে, যেমন `'Rahim'`। কারণ এই render-এর `name` একটা সাধারণ `const`, এর value আর বদলাবে না। নতুন `'Karim'` পাওয়া যাবে পরের render-এ, যখন function আবার চলবে আর `useState` নতুন value দেবে।

### Snapshot-এর ফাঁদ: পুরনো value (stale value)
একটা counter ধরো:
```tsx
const [count, setCount] = useState(0);

function handleClick(): void
{
    setCount(count + 1);
    setCount(count + 1);
}
```
`count` 0 থাকা অবস্থায় click করলে নতুন value কত হবে? **2 না, 1।**

কারণ:
- `handleClick` function-টা তৈরি হয়েছে সেই render-এ, যখন `count` ছিল 0। একটা function যেখানে তৈরি হয় সেখানকার variable মনে রাখে, একে বলে **closure** (অধ্যায় ২.৬)। তাই এই function-এর ভেতরে `count` সবসময় 0।
- ফলে দুই লাইনই আসলে `setCount(0 + 1)`, মানে দুইবার `setCount(1)`।

এই সমস্যার নাম **stale value**: function একটা পুরনো snapshot-এর value দেখছে।

### সমাধান: functional update
Setter-কে নতুন value না দিয়ে একটা **function** দাও:
```tsx
function handleClick(): void
{
    setCount((c) => c + 1);
    setCount((c) => c + 1);
}
```
এবার click করলে value হবে **2**। React প্রতিটা function-কে সেই মুহূর্তের **সর্বশেষ** value দেয়: প্রথমটা পায় 0 আর দেয় 1, দ্বিতীয়টা পায় 1 আর দেয় 2। এখানে `count` variable-টা ব্যবহারই হয়নি, তাই পুরনো snapshot-এর প্রশ্ন নেই।

একে বলে **functional update**।

**নিয়ম:** নতুন state যদি পুরনো state-এর উপর নির্ভর করে, তাহলে functional update ব্যবহার করো।

---

## ৭.৪ Controlled Input: React-ই আসল মালিক

`frontend/src/features/auth/LoginPage.tsx` থেকে (সংক্ষেপে):
```tsx
const [email, setEmail] = useState('');

<Input
    id="email"
    type="email"
    required
    value={email}
    onChange={(event): void => setEmail(event.target.value)}
/>
```
চক্রটা এরকম:
```
User টাইপ করে "a"
   ↓
onChange চলে → event.target.value = "a"
   ↓
setEmail("a") → state বদলায়
   ↓
re-render → <Input value="a" />
   ↓
screen-এ "a"
```
Input-এর value সবসময় state থেকে আসে, তাই একে বলে **controlled input**। সুবিধা:
- যেকোনো সময় `email` variable থেকে value জানা যায়।
- Value বদলানো, খালি করা বা validate করা খুব সহজ: শুধু state বদলাও।

`value` দিয়ে কিন্তু `onChange` না দিলে input "জমে" যায়, টাইপ করা যায় না, কারণ value সবসময় state থেকে আসছে আর state কখনো বদলাচ্ছে না। React তখন console-এ warning দেয়।

### Checkbox
Checkbox-এ `value` নয়, `checked` ব্যবহার হয়, আর নতুন value পাওয়া যায় `event.target.checked` থেকে (true/false)। `ApplicationForm.tsx` থেকে (class বাদ):
```tsx
<input
    type="checkbox"
    checked={values.isApplied}
    onChange={(event): void => setField('isApplied', event.target.checked)}
/>
```
Tick দিলে `isApplied` হয় `true`, tick তুলে দিলে `false`। `setField` কী, সেটা ৭.৬-এ দেখব।

---

## ৭.৫ Form submit করা

`LoginPage.tsx` থেকে (সংক্ষেপে)। Snippet-এ `dispatch(loginUser(...))` আছে, যেটা Redux-এর জিনিস (অধ্যায় ১০–১১)। এখন শুধু ধরো এই লাইন server-এ login request পাঠায়:
```tsx
import type { JSX, SubmitEvent } from 'react';

function handleSubmit(event: SubmitEvent<HTMLFormElement>): void
{
    event.preventDefault();
    void dispatch(loginUser({ email, password }));
}

return (
    <form onSubmit={handleSubmit}>
        ...
        <Button type="submit">Log in</Button>
    </form>
);
```
- `<form>`-এর ভেতরে `type="submit"` button click করলে, অথবা কোনো input field-এ Enter চাপলে, form-এর `onSubmit` চলে।
- **`event.preventDefault()`** খুব জরুরি। Browser-এর পুরনো অভ্যাস হলো form submit হলে **পুরো page reload** করা। এই লাইন সেটা থামায়, কারণ আমাদের app-এ (single page app) request আমরা নিজেরাই JavaScript দিয়ে পাঠাই।
- **`SubmitEvent<HTMLFormElement>`** হলো এই event-এর type। **`HTMLFormElement`** হলো `<form>` element-এর type; মানে "একটা form থেকে আসা submit event"। `SubmitEvent` React থেকে import করা; `HTMLFormElement` browser-এর built-in type, import লাগে না।
- পুরনো tutorial-এ এর জায়গায় `FormEvent` দেখবে। আমাদের React version-এর type-এ `FormEvent` deprecated (আর ব্যবহার না করার পরামর্শ দেওয়া হয়েছে), তাই project-এ `SubmitEvent` ব্যবহার করা হয়েছে।
- `void` লেখা হয়েছে কারণ `dispatch(...)` একটা Promise return করে, আর আমরা ইচ্ছা করে তার জন্য অপেক্ষা করছি না (অধ্যায় ৩.৭)।
- `<Button type="button">` form submit করে না। আমাদের `Button`-এর default type `button` (অধ্যায় ৬.৭), যাতে form-এর ভেতরে অন্য কোনো button (যেমন "Apply by link") ভুল করে form submit না করে। Submit করতে হলে স্পষ্ট করে `type="submit"` লিখতে হয়।

### HTML-এর নিজস্ব validation
`RegisterPage.tsx`-এর password field (সংক্ষেপে):
```tsx
<Input
    id="password"
    type="password"
    required
    minLength={8}
    value={password}
    onChange={(event): void => setPassword(event.target.value)}
/>
```
আর email field-এ আছে `type="email"` আর `required`।

এই attribute-গুলো দিলে browser নিজেই submit-এর আগে check করে:
- `required`: খালি থাকলে submit হবে না।
- `type="email"`: email-এর format না মিললে submit হবে না।
- `minLength={8}`: ৮ অক্ষরের কম হলে submit হবে না।

Check fail করলে browser নিজের ছোট্ট message দেখায়, আর `onSubmit` চলেই না। Login আর Register page-এ এটুকুই যথেষ্ট, কারণ server-ও আবার validate করে।

---

## ৭.৬ অনেক field-এর form: একটা object state

আবেদনের form-এ ১২টা field। ১২টা আলাদা `useState` না লিখে একটা object রাখা হয়েছে। `frontend/src/features/applications/ApplicationForm.tsx`:

```tsx
const [values, setValues] = useState<ApplicationFormValues>(initialValues);

function setField<K extends keyof ApplicationFormValues>(field: K, value: ApplicationFormValues[K]): void
{
    setValues((previous) => ({ ...previous, [field]: value }));
}
```
ব্যবহার (class আর id বাদ):
```tsx
<Input value={values.jobPost} onChange={(event): void => setField('jobPost', event.target.value)} />
<input type="checkbox" checked={values.isApplied} onChange={(event): void => setField('isApplied', event.target.checked)} />
```
প্রথম লাইনে টাইপ করলে `values.jobPost` বদলায়, বাকি ১১টা field যেমন ছিল তেমন থাকে। দ্বিতীয় লাইনে tick দিলে শুধু `values.isApplied` বদলায়।

`setField`-এর তিনটা জিনিস বুঝতে হবে।

### (ক) Generic দিয়ে নিখুঁত type
`<K extends keyof ApplicationFormValues>`-কে ভাগ করে পড়ো:
- **`keyof ApplicationFormValues`**: form-এর সব field-এর নাম, মানে `'jobPost' | 'jobPostLink' | ... | 'isApplied' | ...` (অধ্যায় ৪.৭)।
- **`K`**: একটা generic type parameter (অধ্যায় ৪.৬)। Call করার সময় TypeScript নিজেই বের করে নেয় `K` কী।
- **`extends`**: এখানে `extends` মানে **constraint**, অর্থাৎ "`K`-কে অবশ্যই এর মধ্যে একটা হতে হবে"। এটা interface-এর inheritance (অধ্যায় ৪.৩) না, একই শব্দ কিন্তু আলাদা কাজ। তাই `field` হতে পারবে শুধু form-এর কোনো একটা field-এর নাম।

তারপর **`value: ApplicationFormValues[K]`** হলো indexed access (অধ্যায় ৪.৭): "`K` field-টার type"। যেমন `setField('isApplied', ...)` call করলে `K` হয় `'isApplied'`, আর `ApplicationFormValues['isApplied']` হলো `boolean`, তাই `value`-কে boolean হতে হবে।

ফলাফল:
- `setField('isApplied', true)` চলবে, কারণ `isApplied` একটা boolean।
- `setField('isApplied', 'yes')` লাল দাগ পাবে, কারণ `'yes'` boolean না।
- `setField('jobPst', 'Engineer')` লাল দাগ পাবে, কারণ `jobPst` নামে কোনো field নেই।

### (খ) `[field]: value`: computed key
`{ [field]: value }` মানে object-এর key-এর নাম আসবে `field` variable-এর value থেকে। `field` যদি `'jobPost'` হয়, তাহলে এটা দাঁড়ায় `{ jobPost: value }`। আর `...previous` আগের সব field copy করে (অধ্যায় ২.১২), তারপর শুধু এই একটা field নতুন value দিয়ে বসে।

### (গ) Functional update: `setValues((previous) => ...)`
এটা ৭.৩-এর functional update। নতুন object বানানো হচ্ছে পুরনো object থেকে, তাই `values` variable সরাসরি না ধরে React-এর দেওয়া সর্বশেষ `previous` ব্যবহার করা হয়েছে। এতে কখনো পুরনো snapshot-এর ফাঁদে পড়তে হয় না।

---

## ৭.৭ Immutability: State কখনো সরাসরি বদলাবে না

```tsx
values.jobPost = 'Engineer';
setValues(values);

setValues({ ...values, jobPost: 'Engineer' });
```
প্রথম দুই লাইন ভুল: আসল object-টাই বদলে ফেলে সেই একই object আবার দেওয়া হয়েছে। শেষ লাইন ঠিক: পুরনোটা copy করে একটা নতুন object বানানো হয়েছে।

**কেন?** React পুরনো আর নতুন state তুলনা করে **reference** দিয়ে (`Object.is`), মানে "এটা কি memory-তে একই object?"। একই object বদলে দিলে React দেখে object একই আছে, ভাবে কিছুই বদলায়নি, তাই re-render করে না, screen-ও update হয় না।

State বদলানো যায় না, শুধু নতুন বানিয়ে বদলে দেওয়া যায়: এই নিয়মের নাম **immutability**।

Array-র বেলাতেও একই নিয়ম:

| ভুল (আসলটা বদলায়) | ঠিক (নতুন বানায়) |
|---|---|
| `items.push(x)` | `[...items, x]` |
| `items.splice(i, 1)` | `items.filter((item) => item.id !== id)` |
| `items[i].done = true` | `items.map((item) => item.id === id ? { ...item, done: true } : item)` |

এখানে `id` হলো যে item বদলাতে চাও তার id, আর `i` তার index।

ডান দিকের সব method (`filter`, `map`) আর spread নতুন array return করে, পুরনোটা ছোঁয় না (অধ্যায় ২.৮, ২.১২)।

(Redux Toolkit-এ এই নিয়ম লেখার ধরন একটু আলাদা, দেখব অধ্যায় ১০-এ।)

---

## ৭.৮ Derived value: State থেকে হিসাব করা যায় এমন জিনিস state-এ রাখবে না

আবেদনের form-এ "Apply by link" আর "Apply by mail" নামে দুটো button আছে। যেটা বেছে নেওয়া, সেটা indigo (`primary`), অন্যটা সাদা (`secondary`)। `ApplicationForm.tsx` থেকে (সংক্ষেপে):
```tsx
{[ApplyMedium.Link, ApplyMedium.Mail].map((medium) => (
    <Button
        key={medium}
        variant={values.applyMedium === medium ? 'primary' : 'secondary'}
        onClick={(): void => setField('applyMedium', medium)}
    >
        {medium === ApplyMedium.Link ? 'Apply by link' : 'Apply by mail'}
    </Button>
))}
```
ফলাফল: শুরুতে "Apply by link" indigo। "Apply by mail" click করলে `values.applyMedium` বদলায়, re-render হয়, আর এবার "Apply by mail" indigo হয়ে যায়।

খেয়াল করো, "কোন button highlighted" এর জন্য আলাদা কোনো state নেই। এটা প্রতিটা render-এ `values.applyMedium` থেকে হিসাব করা হয়। একই কৌশল `applications.utils.ts`-এর `toPayload`-এও আছে:
```ts
const isLink = values.applyMedium === ApplyMedium.Link;
```
এখানে `isLink` একটা সাধারণ variable, প্রতিবার নতুন করে হিসাব হয়।

উল্টোটা করলে কী হতো? ধরো `const [isLinkSelected, setIsLinkSelected] = useState(true);` নামে আলাদা state রাখলাম। তখন `applyMedium` বদলালে প্রতিবার `isLinkSelected`-ও মনে করে বদলাতে হবে। একবার ভুলে গেলেই form বলবে medium "Mail", অথচ button দেখাবে "Link" selected।

State থেকে হিসাব করে বের করা এমন value-কে বলে **derived value**।

**নিয়ম:** যা props বা অন্য state থেকে হিসাব করা যায়, সেটা render-এর সময় সরাসরি variable-এ হিসাব করো। আলাদা state রাখলে দুটো value একে অপরের সাথে না মেলার bug তৈরি হয়।

---

## ৭.৯ Form validation: আমাদের নিজের `validateForm`

`frontend/src/features/applications/applications.utils.ts`:
```ts
export function validateForm(values: ApplicationFormValues): ApplicationFormErrors
{
    const errors: ApplicationFormErrors = {};

    if (!values.jobPost.trim())
    {
        errors.jobPost = 'Job post is required';
    }
    if (!isValidUrl(values.jobPostLink))
    {
        errors.jobPostLink = 'Enter a valid link starting with http:// or https://';
    }
    if (values.applyMedium === ApplyMedium.Link && !isValidUrl(values.applyLink))
    {
        errors.applyLink = 'Enter the link where you apply';
    }
    if (values.applyMedium === ApplyMedium.Mail && !htmlToText(values.applyMail))
    {
        errors.applyMail = 'Write the application mail';
    }
    if (values.cvLink && !isValidUrl(values.cvLink))
    {
        errors.cvLink = 'Enter a valid link starting with http:// or https://';
    }
    if (values.salaryMin && values.salaryMax && Number(values.salaryMin) > Number(values.salaryMax))
    {
        errors.salaryMax = 'Maximum must be greater than minimum';
    }

    return errors;
}
```
এখানে দুটো helper function ব্যবহার হয়েছে, দুটোই `frontend/src/shared/utils.ts`-এ:
- **`isValidUrl(value)`**: string-টা `http://` বা `https://` দিয়ে শুরু হওয়া valid link হলে `true`, না হলে `false`। ভেতরে `new URL(value)` চেষ্টা করে; ভুল link হলে সেটা error throw করে, আর `catch`-এ `false` return হয় (অধ্যায় ২.১৩)।
- **`htmlToText(html)`**: Rich text editor HTML দেয়, যেমন `<p></p>`। এই function HTML tag বাদ দিয়ে শুধু লেখাটুকু বের করে। খালি string আসা মানে mail-এ আসলে কিছুই লেখা হয়নি।

ফলাফল: সব ঠিক থাকলে খালি object `{}` return হয়। ধরো বাকি সব field ঠিকঠাক পূরণ করা, শুধু job post খালি আর salary min 90000, max 50000; তাহলে return হবে `{ jobPost: 'Job post is required', salaryMax: 'Maximum must be greater than minimum' }`।

এটা একটা সাধারণ function: values নেয়, errors object return করে। React-এর কিছুই জানে না, তাই আলাদা করে test করা সহজ।

### Form-এ ব্যবহার
প্রথমে দেখো `ApplicationForm` কী কী props নেয়:
```tsx
interface ApplicationFormProps
{
    initialValues: ApplicationFormValues;
    submitLabel: string;
    isSaving: boolean;
    onSubmit: (payload: ApplicationPayload) => void;
}
```
এখানে **`onSubmit` হলো `ApplicationForm`-এর একটা callback prop** (অধ্যায় ৬.৫), `<form>`-এর `onSubmit` attribute না। নাম এক, কিন্তু কাজ আলাদা: form নিজে জানে না data কোথায় পাঠাতে হবে, তাই validation পার হলে parent-কে data দিয়ে খবর দেয়। Parent ঠিক করে নতুন বানাবে নাকি পুরনোটা update করবে।

`ApplicationForm`-এর ভেতরে:
```tsx
function handleSubmit(event: SubmitEvent<HTMLFormElement>): void
{
    event.preventDefault();
    const validationErrors = validateForm(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0)
    {
        onSubmit(toPayload(values));
    }
}
```
1. Page reload থামাও।
2. `validateForm` দিয়ে সব error বের করো, আর `errors` state-এ রাখো (এতে re-render হবে আর error দেখাবে)।
3. **`Object.keys(obj)`** একটা object-এর সব key-এর নাম array হিসেবে দেয়। যেমন `Object.keys({ jobPost: '...' })` হলো `['jobPost']`। Length 0 মানে কোনো error নেই।
4. Error না থাকলে form-এর values server-এর format-এ convert করে (`toPayload`, নিচে দেখো) parent-এর `onSubmit` callback call করো।

Error থাকলে `Field`-এর নিচে লাল লেখা দেখায়, কারণ `Field` `error` prop পায় (অধ্যায় ৬.৬):
```tsx
<Field label="Job post" htmlFor="jobPost" error={errors.jobPost}>
```
`errors.jobPost` undefined হলে কিছু দেখায় না, string হলে লাল রঙে দেখায়।

এই form-এ `<form onSubmit={handleSubmit} noValidate>` লেখা আছে। **`noValidate`** browser-এর নিজস্ব validation (৭.৫) বন্ধ রাখে, যাতে browser-এর ছোট্ট message-এর বদলে শুধু আমাদের নিজের, field-এর নিচের error message দেখায়।

### Form-এর value আর server-এর data আলাদা
- Input field সবসময় **string** দেয়, যেমন salary `"50000"`, আর খালি থাকলে `""`।
- Server চায় `50000` (number) বা `null`।

তাই দুটো conversion function আছে, দুটোই `applications.utils.ts`-এ:
- **`toFormValues(application)`**: server-এর data থেকে form-এর values বানায় (edit-এর সময়)। যেমন salary `50000` হয়ে যায় `"50000"`, আর `null` হয়ে যায় `""`।
- **`toPayload(values)`**: form-এর values থেকে server-এ পাঠানোর data বানায়।

`toPayload`-এর দুটো লাইন (সংক্ষেপে):
```ts
salaryMin: values.salaryMin ? Number(values.salaryMin) : null,
cvLink: values.cvLink.trim() || null,
```
- `"50000"` হয় `50000`, আর `""` হয় `null` (খালি string falsy, অধ্যায় ২.৪)।
- CV link-এর আগে-পিছের space কেটে খালি হলে `null`, না হলে link-টাই।

---

## ৭.১০ `key` দিয়ে component-কে নতুন করে শুরু করানো

অধ্যায় ৬.৯-এ `key` দেখেছি list-এর জন্য। কিন্তু `key` যেকোনো component-এ দেওয়া যায়, আর এর একটা জরুরি ব্যবহার আছে।

**নিয়ম:** কোনো component-এর `key` বদলালে React পুরনো component-টা unmount করে, আর একদম নতুন একটা mount করে। নতুন component-এর সব state শুরু হয় শূন্য থেকে।

`ApplicationFormPage.tsx` থেকে (সংক্ষেপে)। এখানে `id` আসে URL থেকে `useParams` দিয়ে (অধ্যায় ৯), আর `selected` আসে Redux থেকে (অধ্যায় ১১)। "New application" page-এ `id` থাকে না (undefined), আর "Edit" page-এ থাকে:
```tsx
<ApplicationForm
    key={id ?? 'new'}
    initialValues={id && selected ? toFormValues(selected) : EMPTY_FORM_VALUES}
    ...
/>
```
- `id ?? 'new'` (অধ্যায় ২.১১): `id` থাকলে key হয় সেই id, না থাকলে `'new'`।
- নতুন form হলে `initialValues` খালি values, edit হলে সেই application-এর values।

### Key না দিলে কী সমস্যা হতো?
৭.২-এ বলেছি: `useState(initialValues)`-এর শুরুর value **শুধু mount-এর সময়** কাজে লাগে। ধরো user প্রথমে application A edit করছিল, তারপর browser-এর Back button দিয়ে (page reload ছাড়া) "New application" page-এ ফিরে গেল। (Address bar-এ URL লিখে Enter চাপলে কিন্তু পুরো page reload হয়, সব state মুছে নতুন করে শুরু হয়, তাই সেখানে এই সমস্যা হয় না।) `frontend/src/app/AppRouter.tsx`-এ দুটো route-ই একই `<ApplicationFormPage />` element দেখায়, আর "New" page-এ `id` না থাকায় Spinner-ও আসে না। তাই একই `ApplicationForm` mount থাকে, শুধু নতুন `initialValues` prop (খালি values) পায়। কিন্তু `values` state সেটা পাত্তা দেয় না, আগের মতোই A-এর লেখা ধরে রাখে। ফলে key না থাকলে নতুন form-এ A-এর data দেখাত।

`key={id ?? 'new'}` থাকায় A-এর id থেকে `'new'`-এ গেলে key বদলায়। React তখন পুরনো form unmount করে নতুন form mount করে, আর নতুন form-এর `useState` খালি `initialValues` দিয়ে শুরু হয়।

(এক application-এর edit থেকে আরেকটার edit-এ গেলে সমস্যাটা এমনিতেই হয় না: `ApplicationFormPage` নতুন application load না হওয়া পর্যন্ত, মানে `selected?.id !== id` থাকা পর্যন্ত, form-এর জায়গায় Spinner দেখায়, তাই form তখন unmount হয়ে যায়।)

---

## ৭.১১ State কোথায় রাখবে?

| State | কোথায় | উদাহরণ |
|---|---|---|
| শুধু এক component-এর দরকার | ওই component-এ `useState` | Form-এর values, search box-এর লেখা |
| পাশাপাশি কয়েকটা component-এর দরকার | তাদের সবচেয়ে কাছের common parent-এ | (**lifting state up**) |
| অনেক দূরের অনেক component-এর দরকার | Redux store (অধ্যায় ১০) | Login করা user, আবেদনের list আর filter |

**Lifting state up:** দুটো sibling component (একই parent-এর দুই child) একই data চাইলে, state তাদের parent-এ নিয়ে যাও। Parent props দিয়ে দুজনকে data দেয়, আর callback দিয়ে বদলানোর সুযোগ দেয় (অধ্যায় ৬.৫-এর one-way data flow)।

আমাদের project-এ:
- Form-এর values শুধু `ApplicationForm`-এর দরকার, তাই local state।
- Login করা user লাগে navbar, `ProtectedRoute`, login page সবার, তাই Redux।
- Filter লাগে filter bar আর page দুজনের, আর details page থেকে ফিরে এলেও মনে রাখতে হয়, তাই Redux।

---

## সারসংক্ষেপ
- **`useState`** component-কে re-render-এর মাঝে value মনে রাখার ক্ষমতা দেয়। Setter call করলে re-render হয়।
- **Hook** হলো `use` দিয়ে শুরু হওয়া React function, শুধু component-এর top level-এ call করা যায়।
- প্রতিটা render হলো সেই মুহূর্তের state-এর একটা **snapshot**। Setter-এর পরের লাইনে পুরনো value-ই থাকে।
- নতুন state পুরনোটার উপর নির্ভর করলে **functional update** (`setCount((c) => c + 1)`), নইলে stale value-এর ফাঁদে পড়বে।
- **Controlled input:** `value` আসে state থেকে, আর `onChange` দিয়ে state update হয়।
- `onSubmit`-এ **`event.preventDefault()`** দিয়ে page reload থামাতে হয়; event-এর type `SubmitEvent<HTMLFormElement>`।
- State **কখনো সরাসরি বদলাবে না**, সবসময় নতুন object বা array বানাবে (**immutability**)।
- হিসাব করা যায় এমন জিনিস state-এ রাখবে না (**derived value**)।
- `key` বদলালে component unmount হয়ে নতুন করে mount হয়, state শুরু থেকে।

## ইন্টারভিউ প্রশ্ন

**প্রশ্ন: setState কি সাথে সাথে state বদলায়?**
উত্তর: না। Setter call করলে React update-টা পরে করার জন্য তালিকায় রাখে (schedule করে), আর একই event-এর ভেতরের কয়েকটা update একসাথে করে একবারই re-render করে, একে বলে batching। নতুন value দেখা যায় পরের render-এ। তাই setter-এর ঠিক পরের লাইনে পুরনো value-ই পাওয়া যায়, কারণ প্রতিটা render হলো state-এর একটা snapshot।

**প্রশ্ন: Functional update কখন ব্যবহার করবে?**
উত্তর: নতুন state পুরনো state-এর উপর নির্ভর করলে। যেমন `setCount(count + 1)` দুইবার লিখলে দুটোই একই পুরনো snapshot-এর `count` দেখে, তাই value মাত্র 1 বাড়ে। `setCount((c) => c + 1)` দুইবার লিখলে React প্রতিবার সর্বশেষ value দেয়, তাই 2 বাড়ে। Object-এর বেলায় `setValues((previous) => ({ ...previous, jobPost: 'X' }))`।

**প্রশ্ন: State কেন immutable রাখতে হয়?**
উত্তর: React পুরনো আর নতুন state-এর reference তুলনা করে বোঝে state বদলেছে কিনা। আসল object বদলে দিলে reference একই থাকে, তাই React ভাবে কিছু বদলায়নি আর re-render করে না। তাছাড়া immutable data-য় কোথায় কী বদলেছে বোঝা আর bug ধরা সহজ হয়।

**প্রশ্ন: Controlled আর uncontrolled component-এর পার্থক্য কী?**
উত্তর: Controlled component-এ input-এর value React state-এ থাকে: `value` আসে state থেকে আর `onChange` দিয়ে state বদলায়। Uncontrolled component-এ value DOM নিজে রাখে, React শুধু দরকারের সময় পড়ে নেয়, সাধারণত `ref` দিয়ে। `ref` হলো একটা DOM element-কে সরাসরি ধরে রাখার React-এর উপায়। Controlled-এ validation, value বদলানো আর খালি করা সহজ, তাই আমাদের project-এর সব form controlled।

**প্রশ্ন: Hook কী? এর নিয়ম কী?**
উত্তর: Hook হলো `use` দিয়ে শুরু হওয়া React function, যেমন `useState`, যেটা component-কে state-এর মতো বাড়তি ক্ষমতা দেয়। Hook শুধু component function-এর top level-এ call করা যায়, `if`, loop বা ভেতরের function-এর মধ্যে না, যাতে প্রতিটা render-এ hook-গুলো একই ক্রমে call হয়।

**প্রশ্ন: Component-এর key বদলালে কী হয়?**
উত্তর: React পুরনো component unmount করে নতুন একটা mount করে, তাই সব state শুরুর value থেকে আবার শুরু হয়। Edit form থেকে New form-এ গেলে পুরনো লেখা মুছে নতুন করে শুরু করাতে এই কৌশল ব্যবহার হয়, কারণ `useState`-এর শুরুর value শুধু mount-এর সময় নেওয়া হয়।

**প্রশ্ন: Lifting state up কী?**
উত্তর: দুই বা তার বেশি component-এর একই data লাগলে state-কে তাদের সবচেয়ে কাছের common parent-এ নিয়ে যাওয়া। Parent props দিয়ে data দেয়, আর callback দিয়ে child-দের বদলানোর সুযোগ দেয়।

**প্রশ্ন: কখন useState আর কখন global state (Redux)?**
উত্তর: যে data শুধু একটা component বা ছোট একটা অংশের দরকার, সেটা useState-এ। যে data app-এর অনেক দূরের অংশের দরকার, page বদলালেও মনে রাখতে হয়, বা অনেক জায়গা থেকে বদলায়, যেমন login করা user বা server থেকে আনা list, সেটা Redux-এ।

**প্রশ্ন: Re-render কখন হয়?**
উত্তর: তিনভাবে: component-এর নিজের state বদলালে, parent re-render হলে (তখন child-রাও সাধারণত re-render হয়), অথবা component Redux store থেকে যে data পড়ছে সেটা বদলালে।
