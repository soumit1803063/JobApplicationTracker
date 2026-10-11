# অধ্যায় ৪: TypeScript

আমাদের প্রজেক্টের সব ফাইল `.ts` বা `.tsx`, মানে **TypeScript**। এই অধ্যায়ে শিখব TypeScript কী, আর project-এর code পড়তে এর কোন অংশগুলো জানা দরকার।

---

## ৪.১ TypeScript কেন?

JavaScript-এ নিচের ভুলটা code চালানোর আগে কেউ ধরে না:
```js
function formatSalary(info)
{
    return info.salaryMin.toLocaleString();
}

formatSalary({ salaryMn: 5000 });
```
`salaryMin`-এর বানান ভুল করে `salaryMn` লেখা হয়েছে। চালালে app crash করবে, আর সেটা হয়তো user-এর সামনেই।

**TypeScript = JavaScript + Type।** তুমি বলে দাও কোন variable বা parameter কোন type-এর। একই function TypeScript-এ:
```ts
interface SalaryInfo
{
    salaryMin: number;
}

function formatSalary(info: SalaryInfo): string
{
    return info.salaryMin.toLocaleString();
}

formatSalary({ salaryMn: 5000 });
```
এখানে `interface SalaryInfo` বলে দিচ্ছে object-টায় `salaryMin` নামে একটা `number` থাকবে (interface নিয়ে বিস্তারিত ৪.৩-এ)। এখন শেষ লাইনে VS Code সাথে সাথে লাল দাগ দেবে: `SalaryInfo`-তে `salaryMn` নামে কোনো field নেই। মানে ভুলটা **code লেখার সময়েই** ধরা পড়ল, runtime-এ (চালানোর সময়) না।

- Browser TypeScript বোঝে না। চালানোর আগে Vite এটাকে সাধারণ JavaScript-এ convert করে, আর সব type মুছে ফেলে।
- `.tsx` মানে TypeScript, যার ভেতরে JSX আছে (React-এর HTML-এর মতো লেখা, অধ্যায় ৬-এ শিখব)।
- পুরো project type-check করার command হলো `npm run typecheck` (ভেতরে এটা `tsc -b` চালায়)।

---

## ৪.২ Basic Type

```ts
const name: string = 'Rahim';
const page: number = 1;
const isApplied: boolean = false;
const tags: string[] = ['remote', 'senior'];
```
`: string` অংশটাকে বলে **type annotation**। `string[]` মানে string-এর array।

প্রায়ই annotation লিখতেই হয় না, কারণ TypeScript নিজেই value দেখে type বুঝে নেয়। একে বলে **type inference**:
```ts
const page = 1;
```
এখানে TypeScript নিজেই জানে `page`-এর type হলো `number`।

### Function-এর type
```ts
function formatDate(value: string | null): string
{
    return value ? new Date(value).toLocaleDateString() : '—';
}
```
- `new Date(value).toLocaleDateString()` string থেকে একটা তারিখ বানিয়ে সেটাকে local format-এ string হিসেবে দেয়।
- parameter-এর type লেখা হয় নামের পরে: `(value: string | null)`। এখানে `|` মানে "অথবা": value হয় string, নয়তো null (৪.৪-এ বিস্তারিত)।
- return type লেখা হয় `)` এর পরে: `: string`।
- (project-এর আসল `formatDate` একটু বড়, এখানে সংক্ষেপে দেখানো হলো।)

কিছু return না করলে return type হয় `void`। খেয়াল করো, এই `void` একটা **type**, আর অধ্যায় ৩.৭-এর `void` ছিল Promise ignore করার একটা **operator**: একই শব্দ, দুই জায়গায় দুই কাজ।
```ts
function saveToken(token: string): void
{
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
}
```
এখানে `TOKEN_STORAGE_KEY` হলো `shared/constants.ts`-এর একটা string constant।

### Arrow function-এর type
Arrow function-এও একই নিয়ম, শুধু লেখার জায়গা একটু আলাদা:
```ts
const add = (a: number, b: number): number => a + b;

const sayHello = (): void => console.log('hello');
```
- `(a: number, b: number)`: parameter আর তাদের type।
- `): number =>`: `)` এর পরে, `=>`-এর আগে return type।
- কোনো parameter না থাকলে `()`, আর কিছু return না করলে `: void`। তাই লেখা হয় `(): void => ...`।

এই `(): void =>` ধরনটা পুরো বইয়ে বারবার দেখবে, বিশেষ করে button-এর click handler-এ।

আমাদের project-এ **প্রতিটা function-এর return type লেখা বাধ্যতামূলক** (এটা একটা ESLint rule, অধ্যায় ৫)। এতে code পড়লেই বোঝা যায় function কী return করে।

একটা ব্যতিক্রম আছে: যে arrow function সরাসরি অন্য একটা function-এ argument হিসেবে দেওয়া হয় (যেমন `[1, 2].map((n) => n * 2)`-এর ভেতরের `(n) => n * 2`), তার type TypeScript আশেপাশ থেকেই জেনে যায়। তাই সেখানে return type না লিখলেও ESLint কিছু বলে না। বইয়ের অনেক callback-এ (map, filter, পরে `useAppSelector`) তাই return type নেই।

---

## ৪.৩ `interface`: Object-এর shape

`frontend/src/features/auth/auth.types.ts`:
```ts
export interface User
{
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
    updatedAt: string;
}
```
এখন কোথাও `User` লিখলে TypeScript জানে এই object-এ ঠিক এই ৫টা field আছে, আর কোনটার type কী। `user.emial` লিখলে লাল দাগ পড়বে।

### Optional field: `?`
```ts
export interface RegisterRequest extends LoginRequest
{
    name?: string;
}
```
- **`name?`**: এই field থাকতেও পারে, না-ও পারে।
- **`extends LoginRequest`**: `LoginRequest`-এর সব field (`email`, `password`) এখানেও আছে, সাথে নতুন `name`। একে বলে **inheritance**: এক interface অন্যটার field পেয়ে যায়।

---

## ৪.৪ Union Type: "এটা অথবা ওটা"

```ts
name: string | null;
```
`name` হয় string, অথবা `null`।

**Literal union** মানে নির্দিষ্ট কয়েকটা value-এর মধ্যে একটা:
```ts
type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';
type ButtonVariant = 'primary' | 'secondary' | 'danger';
```
`const variant: ButtonVariant = 'primry';` লিখলে বানান ভুলটা TypeScript সাথে সাথে ধরে ফেলবে, কারণ `'primry'` ওই তিনটার কোনোটা না।

### Function type (variable বা prop-এর জন্য)
একটা variable বা prop-এ function রাখলে তার type লেখা হয় এভাবে:
```ts
type PageChangeHandler = (page: number) => void;
```
মানে: এমন একটা function, যেটা একটা `number` নেয় আর কিছু return করে না। অধ্যায় ৬-এ props-এ এটা দেখবে।

### `type` বনাম `interface`
দুটো দিয়েই type-এর নাম দেওয়া যায়।
- **`interface`** শুধু object-এর shape বলার জন্য।
- **`type`** যেকোনো কিছুর জন্য: union, function, object।

আমাদের project-এ object-এর জন্য `interface`, আর বাকি সবের জন্য `type` ব্যবহার করা হয়েছে।

---

## ৪.৫ Enum: নাম দেওয়া নির্দিষ্ট value-এর set

`frontend/src/shared/constants.ts` (সংক্ষেপে):
```ts
export enum AppRoutes
{
    Home = '/',
    Login = '/login',
    Applications = '/applications',
    ApplicationDetails = '/applications/:id',
    ...
}
```
এখন code-এ `'/applications'` হাতে না লিখে লেখা হয় `AppRoutes.Applications`। সুবিধা:
- বানান ভুল হলে TypeScript ধরে।
- URL বদলাতে চাইলে শুধু এক জায়গায় বদলালেই চলে।
- VS Code-এ `AppRoutes.` লিখলেই সব option-এর তালিকা দেখায়।

Project-এর আরও কিছু enum:
| Enum | কোথায় | Value |
|---|---|---|
| `ApiEndpoints` | `shared/constants.ts` | সব API path |
| `RequestStatus` | `shared/types.ts` | `Idle`, `Loading`, `Succeeded`, `Failed` |
| `ApplyMedium` | `features/applications/applications.constants.ts` | `Link = 'LINK'`, `Mail = 'MAIL'` |
| `SortField`, `SortOrder`, `StatusFilter` | একই ফাইলে | sort আর filter-এর option |

---

## ৪.৬ Generic: type-এর জায়গায় পরে বসবে

ধরো একটা function যেকোনো ধরনের data আনতে পারে। আগে থেকে জানি না সেটা `User` হবে নাকি `JobApplication`। তখন type-টাকেই একটা **parameter** বানানো হয়:

```ts
async get<T>(url: string): Promise<T>
```
`<T>` হলো একটা খালি ঘর, যেখানে পরে একটা type বসবে। call করার সময় ঘরটা ভরাট করা হয়:
```ts
const user = await api.get<User>(ApiEndpoints.AuthMe);
const application = await api.get<JobApplication>('/applications/42');
```
প্রথম লাইনে `user`-এর type হয় `User`, আর দ্বিতীয় লাইনে `application`-এর type হয় `JobApplication`। একই function, কিন্তু result-এর type আলাদা।

`Promise<T>` মানে: এমন একটা Promise, যেটা শেষে `T` type-এর value দেবে (Promise কী, তা অধ্যায় ৩-এ দেখেছি)।

Project-এর আরেকটা generic, `frontend/src/shared/types.ts`:
```ts
export interface Page<T>
{
    items: T[];
    meta: PaginationMeta;
}
```
`Page<JobApplication>` মানে application-এর একটা page: `items` হলো `JobApplication`-এর array।

---

## ৪.৭ Utility Type: পুরনো type থেকে নতুন type

TypeScript-এর কিছু built-in tool আছে, যেগুলো দিয়ে একটা type থেকে আরেকটা type বানানো যায়:

| Utility | মানে | উদাহরণ |
|---|---|---|
| `Partial<T>` | সব field optional | `Partial<ApplicationPayload>`: শুধু কিছু field পাঠিয়ে update |
| `Omit<T, 'a'>` | `a` field বাদ দিয়ে বাকি সব | `Omit<JobApplication, 'id' \| 'createdAt' \| 'updatedAt'>` |
| `Record<K, V>` | `K` type-এর key, `V` type-এর value | `Record<ButtonVariant, string>` |
| `ReturnType<F>` | function যা return করে তার type | `ReturnType<typeof formatDate>` হলো `string` |

`typeof formatDate` মানে "formatDate function-টার type"। Project-এ `ReturnType`-এর আসল ব্যবহার আছে `frontend/src/app/store.ts`-এ, `ReturnType<typeof store.getState>`; Redux chapter-এ (অধ্যায় ১০) সেটা দেখবে।

`frontend/src/features/applications/applications.types.ts` থেকে:
```ts
export type ApplicationPayload = Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>;
```
Server-এ নতুন application পাঠানোর সময় `id` আর তারিখগুলো পাঠাই না, ওগুলো server নিজেই বানায়। তাই সেগুলো বাদ দিয়ে নতুন type বানানো হলো। এতে সব field দ্বিতীয়বার লিখতে হলো না।

### একটু জটিল উদাহরণ
```ts
export type ApplicationFormErrors = Partial<Record<keyof ApplicationFormValues, string>>;
```
ভেতর থেকে বাইরের দিকে পড়ো:
1. **`keyof ApplicationFormValues`**: form-এর সব field-এর নাম, মানে `'jobPost' | 'jobPostLink' | 'deadline' | ...`।
2. **`Record<..., string>`**: প্রতিটা field-এর নামের জন্য একটা string, মানে error message।
3. **`Partial<...>`**: সব optional, কারণ সব field-এ error থাকে না।

শেষে এই type দাঁড়ায় এমন:
```ts
{
    jobPost?: string;
    jobPostLink?: string;
    deadline?: string;
    ...
}
```

### Indexed access: `Type['field']`
কোনো object type থেকে একটা নির্দিষ্ট field-এর type বের করতে:
```ts
type AppliedType = ApplicationFormValues['isApplied'];
```
এখানে `AppliedType` হলো `boolean`, কারণ `ApplicationFormValues`-এ `isApplied: boolean`। অধ্যায় ৭-এ এটা কাজে লাগবে।

---

## ৪.৮ Type Narrowing: TypeScript-কে প্রমাণ দেখানো

যখন কোনো value-এর type একাধিক হতে পারে, তখন `if` দিয়ে check করলে TypeScript নিজেই type ছোট করে নেয়। একে বলে **narrowing**:

```ts
function formatDate(value: string | null): string
{
    if (!value)
    {
        return '—';
    }
    return new Date(value).toLocaleDateString();
}
```
`if`-এর পরের লাইনে পৌঁছানো মানে `value` null না। তাই TypeScript জানে এখানে `value` নিশ্চিতভাবে `string`।

### Discriminated union
আমাদের server-এর response দুই রকম হতে পারে। `frontend/src/shared/types.ts`-এ (সংক্ষেপে):
```ts
export interface ApiSuccessResponse<T>
{
    success: true;
    data: T;
}

export interface ApiErrorResponse
{
    success: false;
    error: { statusCode: number; message: string; };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
```
খেয়াল করো, `success`-এর type এখানে শুধু `boolean` না, একদম নির্দিষ্ট `true` অথবা `false`। নিচের উদাহরণে ধরো `getUserResponse()` একটা function, যেটা server থেকে `User`-এর response এনে দেয়:
```ts
const json: ApiResponse<User> = await getUserResponse();

if (json.success === false)
{
    console.log(json.error.message);
}
else
{
    console.log(json.data.email);
}
```
- `success === false` check করার পরে TypeScript জানে এটা `ApiErrorResponse`, তাই `json.error` লেখা নিরাপদ।
- `else`-এর ভেতরে জানে এটা `ApiSuccessResponse`, তাই `json.data` নিরাপদ।

একটা common field (`success`) দেখে কোন type সেটা বোঝার এই কৌশলের নাম **discriminated union**।

### `unknown` বনাম `any`
- **`any`** মানে "type-check বন্ধ"। এটা বিপজ্জনক, আর আমাদের project-এ নিষিদ্ধ।
- **`unknown`** মানে "জানি না কী, তাই ব্যবহারের আগে check করতে হবে"। এটা নিরাপদ।

`catch`-এ কী আসবে কেউ জানে না, তাই সেখানে `unknown`:
```ts
catch (error: unknown)
{
    console.log(getErrorMessage(error));
}
```
`getErrorMessage` (অধ্যায় ৩.৬) ভেতরে `typeof` আর `instanceof` দিয়ে narrowing করে।

---

## ৪.৯ `import type`

```ts
import type { User } from '@/features/auth/auth.types';
```
`@/` মানে `src/` folder (অধ্যায় ৫.২-এ বিস্তারিত)। শুধু type import করলে `import type` লেখা হয়। Runtime-এ type-এর কোনো অস্তিত্ব থাকে না, তাই এই import পুরোপুরি মুছে ফেলা হয়। ফলে final JavaScript file-এ (যাকে বলে **bundle**) বাড়তি কিছু ঢোকে না।

আমাদের project-এ এটা বাধ্যতামূলক: শুধু type import করলে `import type` না লিখলে error আসে।

---

## ৪.১০ `as const` (পরিচিতির জন্য)

```ts
const SIZES = [10, 20, 50];
const FIXED_SIZES = [10, 20, 50] as const;
```
- `SIZES`-এর type হলো `number[]`: যেকোনো number, আর পরে বদলানো যায়।
- `FIXED_SIZES`-এর type হলো `readonly [10, 20, 50]`: ঠিক এই তিনটা value, আর **readonly**, মানে বদলানো যাবে না।

---

## ৪.১১ Strict mode

আমাদের TypeScript config-এ (অধ্যায় ৫.৩) `"strict": true` আর আরও কিছু কড়া নিয়ম চালু আছে:
- **`strictNullChecks`** (strict-এর অংশ): `null` বা `undefined` হতে পারে এমন জিনিস check না করে ব্যবহার করা যায় না।
- **`noUncheckedIndexedAccess`**: array বা object থেকে index দিয়ে কিছু নিলে TypeScript ধরে নেয় সেটা না-ও থাকতে পারে:
  ```ts
  const tags: string[] = [];
  const first = tags[0];
  ```
  এখানে `first`-এর type `string | undefined`, কারণ array খালিও হতে পারে। তাই ব্যবহারের আগে check করতে হয়।

---

## সারসংক্ষেপ
- TypeScript ভুলগুলো **runtime-এর আগেই** ধরে ফেলে।
- Parameter আর return type লেখা হয় `(a: number): string`, আর arrow function-এ `(a: number): string => ...`।
- `interface` object-এর shape বলে, আর `type` যেকোনো type-এর নাম দেয়।
- Union (`A | B`) মানে এটা অথবা ওটা। Enum হলো নাম দেওয়া নির্দিষ্ট value।
- Generic (`<T>`) মানে type-টা পরে বসবে।
- `Partial`, `Omit`, `Record` দিয়ে পুরনো type থেকে নতুন type বানানো যায়।
- `if` দিয়ে check করলে TypeScript type narrow করে নেয়।
- `any` নয়, `unknown` ব্যবহার করো।

## ইন্টারভিউ প্রশ্ন

**প্রশ্ন: interface আর type-এর পার্থক্য কী?**
উত্তর: দুটোই object-এর shape বলতে পারে। union (`'a' | 'b'`) শুধু `type` দিয়েই বানানো যায়, আর function type লেখা `type` দিয়ে সহজ। interface `extends` দিয়ে আরেকটা interface-এর field নিতে পারে। সাধারণ নিয়ম হলো object-এর জন্য interface, বাকি সবের জন্য type।

**প্রশ্ন: any আর unknown-এর পার্থক্য কী?**
উত্তর: `any`-তে TypeScript কোনো check করে না, যা খুশি করা যায়। `unknown`-এ কিছু করার আগে type check (narrowing) করতে হয়। তাই unknown নিরাপদ।

**প্রশ্ন: Generic কেন দরকার?**
উত্তর: একই function বা type যাতে আলাদা আলাদা type-এর data-র সাথে কাজ করতে পারে, অথচ type-safety না হারায়। যেমন `api.get<User>()` আর `api.get<JobApplication>()` একই function, কিন্তু result-এর type আলাদা।

**প্রশ্ন: Type narrowing কী?**
উত্তর: `typeof`, `instanceof`, `=== null`, বা কোনো common field (যেমন `success`) দিয়ে check করার পরে TypeScript নিজেই variable-এর type ছোট করে নেয়। যেমন `if (!value) return;` এর পরে `value` আর null থাকে না।

**প্রশ্ন: Partial আর Omit কী?**
উত্তর: `Partial<T>` সব field optional করে দেয়। `Omit<T, K>` `K` নামের field-গুলো বাদ দিয়ে নতুন type বানায়।

**প্রশ্ন: enum কী? এর বিকল্প কী?**
উত্তর: নাম দেওয়া নির্দিষ্ট value-এর set হলো enum, যেমন `AppRoutes.Login`। বিকল্প হলো string literal union (`'a' | 'b'`), অথবা `as const` দেওয়া object।
