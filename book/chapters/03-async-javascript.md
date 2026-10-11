# অধ্যায় ৩: Asynchronous JavaScript

Server থেকে data আনতে সময় লাগে। এই অধ্যায়ে শিখব JavaScript কীভাবে "অপেক্ষা" করে, অথচ app জমে যায় না। শেষে আমাদের project-এর আসল API code (`frontend/src/shared/api.ts`) লাইন ধরে ধরে পড়ব।

---

## ৩.১ Synchronous বনাম asynchronous

**Synchronous** মানে একটার পর একটা কাজ। আগেরটা শেষ না হলে পরেরটা শুরু হয় না:

```js
console.log('১');
console.log('২');
console.log('৩');
```

Console-এ আসে ১, ২, ৩, এই ক্রমে।

ধরো server থেকে data আসতে ২ সেকেন্ড লাগে। যদি synchronous ভাবে অপেক্ষা করতাম, তাহলে ওই ২ সেকেন্ড **পুরো app জমে থাকত**: button চাপা যেত না, scroll হতো না।

**Asynchronous** মানে: "কাজটা শুরু করে দাও, শেষ হলে আমাকে জানিও। ততক্ষণ আমি অন্য কাজ করি।"

```js
console.log('১');
setTimeout(() => console.log('২'), 1000);
console.log('৩');
```

`setTimeout` (অধ্যায় ২.৫) প্রথম parameter-এর callback-টা দ্বিতীয় parameter-এর সময় পরে চালায়। সময় লেখা হয় **millisecond**-এ, তাই `1000` মানে ১ সেকেন্ড। Console-এ আসে ১, ৩, তারপর ১ সেকেন্ড পরে ২। JavaScript `setTimeout`-এর জন্য বসে থাকেনি, সোজা পরের লাইনে চলে গেছে।

---

## ৩.২ Promise: "ভবিষ্যতে একটা value দেব"

**Promise** হলো একটা object, যেটা বলে: "আমি এখন value-টা দিতে পারছি না, কিন্তু পরে দেব (অথবা জানাব যে ব্যর্থ হয়েছি)।" যে কাজ শেষ হতে সময় লাগে, যেমন server থেকে data আনা, সেটা সাথে সাথে result না দিয়ে একটা Promise দেয়।

একটা Promise-এর তিনটা **state** থাকে:

| State | মানে |
|---|---|
| **pending** | কাজ চলছে, অপেক্ষা করো |
| **fulfilled** | সফল, value পাওয়া গেছে |
| **rejected** | ব্যর্থ, error পাওয়া গেছে |

Promise শুরু হয় pending state-এ, তারপর হয় fulfilled নয়তো rejected হয়। একবার fulfilled বা rejected হয়ে গেলে আর বদলায় না।

**এই তিনটা নাম মনে রাখো।** Redux Toolkit-এর `createAsyncThunk` হুবহু এই নামগুলোই ব্যবহার করে (অধ্যায় ১১)।

### `.then()` আর `.catch()`

Promise-এর result নেওয়ার পুরনো উপায় হলো `.then()` আর `.catch()`। `.then(callback)` বলে "Promise fulfilled হলে এই callback-টা value দিয়ে চালাও"। `.catch(callback)` বলে "rejected হলে এই callback-টা error দিয়ে চালাও"।

নিচের উদাহরণে `fetch` হলো server-এ request পাঠানোর function (৩.৪-এ বিস্তারিত)। এখন শুধু জানো, `fetch` একটা Promise দেয়, যেটা server-এর response এলে fulfilled হয়। এটা চালাতে Chrome Console-টা `http://localhost:5173` tab-এ খুলতে হবে (backend চালু থাকতে হবে)।

```js
fetch('/api/health')
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.log('ব্যর্থ', error));
```

এখানে দুটো `.then` কেন লাগল?

- **Response দুই ধাপে আসে।** প্রথমে server-এর status code আর headers আসে, তখনই `fetch`-এর Promise fulfilled হয়ে `response` object দেয়। কিন্তু response-এর **body** (আসল data) তখনো পুরোটা এসে না-ও পৌঁছাতে পারে। তাই `response.json()` সাথে সাথে data দেয় না, সেটাও **একটা Promise** দেয়। Body পুরো আসার পর সেটা parse করে (parse মানে string পড়ে বুঝে object বানানো) আর fulfilled হয়।
- **`.then` chain করা যায়।** একটা `.then`-এর callback যা return করে, সেটা পরের `.then`-এ যায়। Return করা জিনিস নিজেই Promise হলে পরের `.then` সেটা শেষ হওয়া পর্যন্ত অপেক্ষা করে। তাই প্রথম `.then` `response.json()`-এর Promise return করল, আর দ্বিতীয় `.then` সেটা শেষ হলে parse করা `data` পেল।
- **একটাই `.catch`** শেষে বসিয়ে দিলে chain-এর যেকোনো ধাপে error হলে সেটা ধরা পড়ে।

Result: backend চালু থাকলে Console-এ দেখায় `{ success: true, data: { status: 'ok', timestamp: '...' } }`, যেখানে `timestamp` হলো server-এর এখনকার সময়। `/api/health` এমন একটা endpoint যেটা login ছাড়াই চলে। আর backend বন্ধ থাকলে দেখায় `ব্যর্থ` আর একটা error। (তখন Vite proxy খালি body-সহ `502` দেয়, তাই error-টা আসে `response.json()` থেকে, কারণ খালি লেখাকে JSON হিসেবে parse করা যায় না।)

---

## ৩.৩ `async` / `await`: পড়তে সহজ উপায়

একই কাজ, কিন্তু দেখতে synchronous code-এর মতো:

```js
async function loadApplications()
{
    try
    {
        const response = await fetch('/api/health');
        const data = await response.json();
        console.log(data);
    }
    catch (error)
    {
        console.log('ব্যর্থ', error);
    }
}

loadApplications();
```

Result আগের উদাহরণের মতোই: backend চালু থাকলে Console-এ `{ success: true, data: { status: 'ok', timestamp: '...' } }` দেখায়, আর backend বন্ধ থাকলে `ব্যর্থ` আর error-টা, ঠিক আগের মতো।

- **`async`** লেখা function **সবসময় একটা Promise ফেরত দেয়**। Function-এর ভেতরে যা return করা হয়, সেটা ওই Promise-এর value হয়।
- **`await`** মানে: "এই Promise শেষ না হওয়া পর্যন্ত **এই function-টা** এখানে থামো, তারপর Promise-এর value দাও।" বাকি app কিন্তু চলতে থাকে, button-ও চাপা যায়।
- এখানেও দুটো `await` লেগেছে, একই কারণে: `fetch` একটা Promise দেয়, আর `response.json()`-ও আরেকটা Promise দেয়।
- `await` শুধু `async` function-এর ভেতরে লেখা যায়। একটা ব্যতিক্রম আছে: Chrome Console আর module file-এর একদম বাইরের level-এ (top level) `async` ছাড়াও `await` চলে। পরের উদাহরণগুলো সেভাবে লেখা।
- Promise rejected হলে `await` সেই error **throw** করে, তাই সাধারণ `try`/`catch` দিয়ে ধরা যায় (অধ্যায় ২.১৩)।

---

## ৩.৪ `fetch`: server-এ request পাঠানো

**`fetch`** হলো browser-এর নিজের একটা function, যেটা HTTP request পাঠায় (অধ্যায় ১.৪)। প্রথম parameter URL, দ্বিতীয় parameter একটা object, যেখানে method, headers আর body বলে দেওয়া হয়:

```js
const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'a@b.com', password: '12345678' }),
});
const json = await response.json();
```

এটা login-এর request পাঠায়। ঠিক email আর password হলে `json` হবে এমন কিছু: `{ success: true, data: { accessToken: '...' } }`।

- **`method`**: `'GET'`, `'POST'` ইত্যাদি। না দিলে `GET`।
- **`headers`**: request-এর বাড়তি তথ্য।
  - `Content-Type: application/json` মানে "আমি body-তে JSON পাঠাচ্ছি"।
  - `Accept: application/json` মানে "আমি response-এ JSON চাই"।
- **`body`**: পাঠানোর data। HTTP দিয়ে শুধু লেখা পাঠানো যায়, object না। তাই **`JSON.stringify`** object-কে JSON string-এ convert করে। উপরের উদাহরণে `JSON.stringify({ email: 'a@b.com', password: '12345678' })` দেয় এই string: `'{"email":"a@b.com","password":"12345678"}'`।
- **`response.json()`**: response body parse করে object বানায়। এটা `JSON.stringify`-এর উল্টো কাজ। Body-টা পুরো আসতে সময় লাগে বলে এটাও একটা Promise দেয়, তাই `await` লাগে।
- **`response.ok`**: status code 200 থেকে 299-এর মধ্যে হলে `true`।
- **`response.status`**: status code-টা, যেমন `200` বা `401`।

### `/api/...` কীভাবে backend-এ পৌঁছায়

URL-টা relative (`/api/auth/login`), তাই browser এটা পাঠায় `http://localhost:5173/api/auth/login`-এ, মানে frontend-এর নিজের port-এ। কিন্তু backend তো চলে port 3000-এ! Development-এ এই কাজটা করে **Vite**। `frontend/vite.config.ts`-এ বলে দেওয়া আছে, `/api` দিয়ে শুরু হওয়া সব request `http://localhost:3000`-এ পাঠিয়ে দাও। এভাবে মাঝখানে থেকে request অন্য জায়গায় পাঠিয়ে দেওয়াকে বলে **proxy** (অধ্যায় ৫-এ বিস্তারিত)।

### একটা গুরুত্বপূর্ণ বিষয়

`fetch` শুধু **network ব্যর্থ** হলে reject করে (মানে error throw করে), মানে server-এ একদমই পৌঁছানো না গেলে, যেমন internet নেই। Server 400 বা 500 status code ফেরত দিলেও `fetch` সফল ধরে নেয়! কারণ `fetch`-এর চোখে server একটা response তো দিয়েছে। তাই status code বা body নিজে চেক করতে হয়। যেমন login ছাড়া `fetch('/api/applications')` চালালে server 401 আর `{ success: false, error: {...} }` ফেরত দেয়, কিন্তু `.catch` চলে না।

---

## ৩.৫ আমাদের project-এর API client: `frontend/src/shared/api.ts`

প্রতিটা জায়গায় `fetch` লিখলে একই code বারবার লিখতে হতো: token যোগ করা, body-কে JSON string-এ convert করা, error চেক করা। তাই সব এক জায়গায় রাখা হয়েছে, এই file-এ।

### আগে কয়েকটা ছোট জিনিস

**`API_BASE_URL`**: `frontend/src/shared/constants.ts`-এ লেখা আছে `export const API_BASE_URL = '/api';`। তাই code-এ শুধু `'/auth/me'` লিখলে `API_BASE_URL + url` হয় `'/api/auth/me'`।

**`getToken()`**: একই `api.ts` file-এ আছে। এটা browser-এর **localStorage** থেকে login token পড়ে আনে। localStorage হলো browser-এর ভেতরে ছোট একটা জায়গা, যেখানে লেখা রাখলে page reload বা browser বন্ধ করলেও থেকে যায় (অধ্যায় ১২)। Token থাকলে সেটা string হিসেবে দেয়, না থাকলে `null`।

**`clearToken()`**: localStorage থেকে token মুছে দেয়।

**`parseJson`**: response-এর লেখাকে object-এ convert করার একটা ছোট helper function। Type বাদ দিয়ে দেখানো হলো:

```js
function parseJson(text)
{
    try
    {
        return text ? JSON.parse(text) : null;
    }
    catch
    {
        return null;
    }
}
```

**`JSON.parse`** হলো `JSON.stringify`-এর উল্টো: JSON string থেকে object বানায়। তাই:

- `parseJson('{"success":true}')` দেয় `{ success: true }`।
- `parseJson('')` দেয় `null`। Empty string falsy (অধ্যায় ২.৪), তাই ternary সোজা `null` দেয়।
- `parseJson('<html>...')` দেয় `null`। লেখাটা JSON না, তাই `JSON.parse` error throw করে, আর `catch` থেকে `null` আসে। (`catch`-এর পরে `(error)` নেই, কারণ error-টা ব্যবহার করা হচ্ছে না; অধ্যায় ২.১৩।)

### মূল function: `request`

এবার আসল function। Code-এ TypeScript-এর অনেক কিছু আছে, যেমন `<T>`, `: string`, `: HttpMethod`, `body?`, `Promise<...>`, `Record<string, string>`, `: Response`, `parseJson<T>`। এগুলো অধ্যায় ৪-এ শিখব, এখন পার হয়ে যাও। (`HttpMethod` হলো এই file-এর একটা type, যেটা বলে method শুধু `'GET'`, `'POST'`, `'PATCH'` বা `'DELETE'` হতে পারে।) বাকি সব, যেমন `if`, `?.`, `??`, `||`, template literal, `try`/`catch`, অধ্যায় ২-এ শিখেছ। প্রথম লাইনটা সাধারণ ভাষায় পড়লে: "`request` একটা async function, যেটা তিনটা input নেয়: `method` (যেমন `'GET'`), `url` (যেমন `'/auth/me'`), আর ইচ্ছা হলে `body` (পাঠানোর data; `?` মানে এটা না দিলেও চলে)। এটা একটা Promise ফেরত দেয়, যেটা শেষে server-এর সফল response অথবা `null` দেয়।"

```ts
async function request<T>(method: HttpMethod, url: string, body?: unknown): Promise<ApiSuccessResponse<T> | null>
{
    const token = getToken();
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (token)
    {
        headers.Authorization = `Bearer ${token}`;
    }
    if (body !== undefined)
    {
        headers['Content-Type'] = 'application/json';
    }

    let response: Response;
    try
    {
        response = await fetch(API_BASE_URL + url, {
            method,
            headers,
            body: body === undefined ? null : JSON.stringify(body),
        });
    }
    catch
    {
        throw new ApiError(0, 'Cannot reach the server');
    }

    if (response.status === 401 && token)
    {
        clearToken();
        window.location.assign(AppRoutes.Login);
    }

    const json = parseJson<T>(await response.text());
    if (json?.success === true)
    {
        return json;
    }
    if (json?.success === false)
    {
        throw new ApiError(json.error.statusCode, json.error.details?.join(', ') ?? json.error.message);
    }
    if (response.ok)
    {
        return null;
    }
    throw new ApiError(response.status, response.statusText || 'Request failed');
}
```

ধাপে ধাপে কী হচ্ছে:

| ধাপ | কী হয় |
|---|---|
| 1 | Token থাকলে (login করা থাকলে) `Authorization: Bearer <token>` header যোগ হয় (অধ্যায় ১২)। `Accept` header সবসময় থাকে |
| 2 | Body থাকলে `Content-Type: application/json` header যোগ হয়, আর body `JSON.stringify` দিয়ে JSON string-এ convert হয়। Body না থাকলে (যেমন GET) `body: null` |
| 3 | `fetch` চলে। Network ব্যর্থ হলে `fetch` throw করে, `catch` সেটা ধরে আর তার বদলে `ApiError(0, 'Cannot reach the server')` throw করে। `0` মানে কোনো status code পাওয়াই যায়নি। (Development-এ কিন্তু request Vite proxy হয়ে যায়। Backend বন্ধ থাকলে proxy নিজেই `502 Bad Gateway` দেয়, তাই তখন `fetch` throw করে না; শেষ ধাপে `ApiError(502, 'Bad Gateway')` আসে।) |
| 4 | Token পাঠানো সত্ত্বেও 401 এলে বুঝতে হবে token expire করেছে বা ভুল। তখন token মুছে login page-এ পাঠানো হয়। তারপরও function থামে না, পরের ধাপগুলো চলে আর শেষে `ApiError` throw হয় |
| 5 | Response body-কে আগে **text** হিসেবে পড়া হয়, তারপর `parseJson` দিয়ে object বানানো হয় |
| 6 | Response `{ success: true, ... }` হলে সেটাই ফেরত দেয় |
| 7 | Response `{ success: false, error: ... }` হলে server-এর error message দিয়ে `ApiError` throw করে |
| 8 | Body খালি বা JSON না, কিন্তু status সফল (যেমন DELETE-এর 204) হলে `null` ফেরত দেয় |
| 9 | বাকি সব ক্ষেত্রে status code আর status-এর লেখা দিয়ে `ApiError` throw করে |

কয়েকটা লাইন একটু খুলে বলি:

- **`window.location.assign(AppRoutes.Login)`**: `AppRoutes.Login`-এর value হলো `'/login'` (`frontend/src/shared/constants.ts`)। `window.location.assign` browser-কে ওই address-এ পাঠায়, আর পুরো page নতুন করে load হয়। ফলে app-এর memory-তে থাকা সব পুরনো data মুছে যায়, আর user login page-এ চলে যায়।
- **কেন `response.json()` না লিখে `response.text()` তারপর `parseJson`?** কিছু সফল response-এর body একদম খালি থাকে, যেমন delete করার পর 204 No Content। খালি body-তে `response.json()` চালালে সেটা error throw করে। `response.text()` খালি body-তে শুধু `''` দেয়, আর `parseJson('')` দেয় `null`, কোনো error না। তারপর ধাপ 8-এ `response.ok` দেখে `null` ফেরত দেওয়া হয়। `response.text()`-ও একটা Promise দেয়, তাই তার আগে `await`।
- **ধাপ 7-এর message**: অধ্যায় ১.৫-এ দেখেছ, backend-এর error-এ `message` থাকে, আর মাঝে মাঝে `details` নামে একটা list থাকে। `json.error.details?.join(', ')` মানে: `details` থাকলে তার সব লেখা কমা দিয়ে জোড়া লাগাও (`join` array-এর একটা method, যেটা সব জিনিসকে একটা string-এ জোড়ে)। `details` না থাকলে `?.` থেমে গিয়ে `undefined` দেয়, তখন `??` fallback হিসেবে `json.error.message` নেয়। যেমন `details` যদি `['email must be an email', 'password is too short']` হয়, message হবে `'email must be an email, password is too short'`।
- **ধাপ 9-এর message**: `response.statusText` হলো status code-এর সাথে আসা ছোট লেখা, যেমন `'Not Found'`। সেটা খালি হলে `||` দিয়ে `'Request failed'` নেওয়া হয়।

### সহজ wrapper: `api` object

`request`-এর result থেকে প্রতিবার `data` বের করা ঝামেলা। তাই এর উপরে একটা **wrapper** বানানো হয়েছে, মানে আরেকটা layer যেটা ভেতরে `request` call করে আর ব্যবহার সহজ করে। নিচে `api` object-এর পাঁচটা method-এর দুটো দেখানো হলো, মাঝের `...` লাইনে বাকিগুলো (`getPage`, `patch`, `delete`) বাদ রাখা হয়েছে (অধ্যায় ২.১২-এর নিয়ম):

```ts
export const api = {
    async get<T>(url: string): Promise<T>
    {
        return dataOf(await request<T>('GET', url));
    },
    async post<T>(url: string, body: unknown): Promise<T>
    {
        return dataOf(await request<T>('POST', url, body));
    },
    ...
};
```

- **Object-এর ভেতরে method-এর ছোট লেখা।** `api` একটা object, আর `get`, `post` তার method (অধ্যায় ২.৭)। `async get(url) { ... }` অনেকটা `get: async (url) => { ... }`-এর মতো, তবে object-এর ভেতরে method হিসেবে ছোট করে লেখা। সামনে `async` থাকায় এগুলো async method।
- **`dataOf`**: একই file-এর আরেকটা ছোট function। Server-এর response `{ success: true, data: ... }` থেকে শুধু `data`-টা বের করে দেয়। আর response যদি `null` হয় (খালি body), তাহলে `ApiError(500, 'The server sent an empty response')` throw করে, কারণ `get` বা `post`-এর সময় data আসা উচিত ছিল।

ফলে বাকি code-এ শুধু এটুকু লিখলেই হয়। `frontend/src/features/auth/auth.api.ts` থেকে:

```ts
api.get<User>(ApiEndpoints.AuthMe)
```

- `ApiEndpoints.AuthMe` হলো `frontend/src/shared/constants.ts`-এ রাখা একটা নাম, যার value `'/auth/me'`। এভাবে নাম দিয়ে value-গুলো এক জায়গায় রাখার জিনিসটাকে বলে **enum** (অধ্যায় ৪)।
- `<User>` হলো একটা TypeScript type, যেটা বলে "ফেরত আসা data দেখতে `User`-এর মতো হবে", মানে তাতে `id`, `email`, `name` ইত্যাদি থাকবে (`frontend/src/features/auth/auth.types.ts`)।
- পুরো লাইনটা `GET /api/auth/me` request পাঠায়, আর একটা Promise দেয় যেটা শেষে সরাসরি user-এর object দেয়, যেমন `{ id: '1', email: 'a@b.com', name: 'Rahim', ... }`।

`<T>` বা `<User>` দেখে ভয় পেও না। এটাকে বলে **generic**। মানে "কোন ধরনের data আশা করছ, সেটা বলে দাও"। অধ্যায় ৪-এ বিস্তারিত আছে।

---

## ৩.৬ Error message এক জায়গায়: `getErrorMessage`

`try`/`catch`-এর `catch`-এ যে error আসে, সেটা **যেকোনো কিছু** হতে পারে। কারণ JavaScript-এ শুধু `Error` object না, যেকোনো value throw করা যায়: `throw 'oops'` (একটা string), এমনকি `throw 42` (একটা number)। তাই error থেকে সবসময় একটা readable error message বের করতে একটা function আছে, `frontend/src/shared/utils.ts`-এ:

```ts
export function getErrorMessage(error: unknown): string
{
    if (typeof error === 'string')
    {
        return error;
    }
    if (error instanceof Error)
    {
        return error.message;
    }
    return 'Something went wrong';
}
```

- **`error: unknown`**: `unknown` একটা TypeScript type, যার মানে "এর type জানা নেই, যেকোনো কিছু হতে পারে" (অধ্যায় ৪)। `catch`-এ আসা error-এর জন্য এটাই ঠিক।
- **`: string`** (প্রথম লাইনের শেষে): function সবসময় একটা string ফেরত দেবে।
- **`typeof error === 'string'`**: error কি একটা string? (অধ্যায় ২.৩)
- **`error instanceof Error`**: error কি `Error` class থেকে বানানো? `ApiError`-ও এর মধ্যে পড়ে, কারণ সে `Error`-কে extend করে (অধ্যায় ২.১৪)।

Result:

| Input | Output |
|---|---|
| `'oops'` | `'oops'` |
| `new ApiError(0, 'Cannot reach the server')` | `'Cannot reach the server'` |
| `42` | `'Something went wrong'` |

যে message আসে, সেটাই screen-এ user-কে দেখানো হয়।

---

## ৩.৭ `void`: "জেনেশুনে অপেক্ষা করছি না"

কখনো কখনো আমরা একটা async function call করি, কিন্তু তার Promise-এর জন্য অপেক্ষা করতে চাই না। যেমন:

```js
void loadApplications();
```

`loadApplications()` (৩.৩-এর function) একটা Promise ফেরত দেয়। সামনে **`void`** লিখে বলা হচ্ছে: "এই Promise-টা আমি ইচ্ছা করেই ignore করছি।" কাজটা ঠিকই চলবে, শুধু আমরা এখানে তার শেষ হওয়ার অপেক্ষা করছি না।

কেন লিখতে হয়? Project-এ **ESLint** নামে একটা tool আছে, যেটা code-এর সম্ভাব্য ভুল ধরে (অধ্যায় ৫)। কোনো Promise-কে `await` ছাড়া এমনি ফেলে রাখলে ESLint সাবধান করে দেয়, কারণ ভুলে `await` বাদ পড়ে যাওয়া খুব সাধারণ bug। `void` লিখলে ESLint বোঝে এটা ভুল না, ইচ্ছাকৃত।

Project-এ এমন লাইন অনেক পাবে, যেমন `frontend/src/features/applications/ApplicationsPage.tsx`-এ:

```ts
void dispatch(loadApplications(filters));
```

এখানকার `loadApplications` ৩.৩-এর function না, একই নামের আলাদা একটা function: একটা Redux thunk (অধ্যায় ১১)। `dispatch` আর thunk দুটোই Redux-এর জিনিস, অধ্যায় ১০ আর ১১-এ শিখব। এখন শুধু এটুকু জানো: `dispatch(...)` একটা Promise ফেরত দেয়, আর আমরা তার অপেক্ষা করছি না, কারণ result নিজে থেকেই অন্য জায়গায় (Redux store-এ) পৌঁছে যাবে।

---

## সারসংক্ষেপ

- Asynchronous code অপেক্ষার সময় app-কে জমিয়ে রাখে না। `setTimeout`-এর সময় millisecond-এ।
- **Promise**-এর তিন state: **pending**, **fulfilled**, **rejected**।
- `.then` chain করা যায়: একটার return value পরেরটায় যায়। `response.json()` নিজেও Promise দেয়, তাই আলাদা `.then` বা `await` লাগে।
- `async`/`await` দিয়ে async code সহজে পড়া যায়, আর `try`/`catch` দিয়ে error ধরা যায়।
- `fetch` শুধু network ব্যর্থতায় reject করে। 4xx আর 5xx নিজে চেক করতে হয়। Development-এ Vite `/api/...` request backend-এর port 3000-এ proxy করে।
- আমাদের `shared/api.ts` token, JSON আর error সামলানোর কাজ এক জায়গায় করে। `api.get`/`api.post` wrapper সরাসরি `data` দেয়।
- `getErrorMessage` যেকোনো error থেকে readable message বের করে। `void` দিয়ে Promise ইচ্ছা করে ignore করা হয়।

## ইন্টারভিউ প্রশ্ন

**প্রশ্ন: Promise কী? এর state-গুলো কী কী?**
উত্তর: Promise হলো এমন একটা object, যেটা ভবিষ্যতে আসবে এমন একটা value-কে represent করে, যেমন server-এর response। এর তিনটা state: pending মানে কাজ চলছে, fulfilled মানে সফলভাবে value পাওয়া গেছে, rejected মানে error হয়েছে। Promise pending থেকে শুরু হয়, আর একবার fulfilled বা rejected হয়ে গেলে আর বদলায় না।

**প্রশ্ন: async/await আর .then()-এর পার্থক্য কী?**
উত্তর: দুটো একই কাজ করে। async/await আসলে Promise-এর উপরেই বানানো, শুধু লেখার সহজ উপায়। `.then()`-এ callback chain করে লিখতে হয়, আর error ধরতে `.catch()` লাগে। async/await-এ code পড়তে synchronous code-এর মতো লাগে, ওপর থেকে নিচে, আর error ধরা যায় সাধারণ `try`/`catch` দিয়ে। `await` শুধু `async` function-এর ভেতরে লেখা যায়।

**প্রশ্ন: fetch কি 404 বা 500-এ error throw করে?**
উত্তর: না। fetch শুধু network ব্যর্থ হলে reject করে, মানে server-এ একদমই পৌঁছানো না গেলে, যেমন internet নেই। Server 404 বা 500 দিলেও fetch-এর চোখে একটা response এসেছে, তাই Promise fulfilled হয়, শুধু `response.ok` হয় `false`। তাই status code বা body নিজে চেক করতে হয়। আমাদের project-এ `shared/api.ts`-এর `request` function এই চেক করে `ApiError` throw করে।

**প্রশ্ন: `response.json()`-এর আগে আবার `await` কেন লাগে?**
উত্তর: `fetch`-এর Promise fulfilled হয় যখন status code আর headers চলে আসে, তখনো body পুরোটা এসে না-ও পৌঁছাতে পারে। `response.json()` body পুরো আসার অপেক্ষা করে তারপর parse করে, তাই সেটাও একটা Promise দেয়, আর তার জন্য আলাদা `await` লাগে।

**প্রশ্ন: একাধিক request একসাথে চালাতে চাইলে কী করবে?**
উত্তর: `Promise.all` ব্যবহার করব। যেমন:

```ts
const [me, apps] = await Promise.all([api.get('/auth/me'), api.get('/applications')]);
```

`api.get(...)` call করার সাথে সাথেই দুটো request শুরু হয়ে যায়, একটা আরেকটার জন্য অপেক্ষা করে না। `Promise.all` সেই Promise-গুলোর array নেয়, আর সবগুলো শেষ হওয়া পর্যন্ত wait করে। তারপর একই ক্রমে result-এর একটা array দেয়, যেটা array destructuring দিয়ে `me` আর `apps`-এ রাখা হলো (অধ্যায় ২.৯)। দুটো আলাদা `await` পরপর লিখলে দ্বিতীয় request শুরু হতো প্রথমটা শেষ হওয়ার পরে, তাই বেশি সময় লাগত। কোনো একটা request ব্যর্থ হলে `Promise.all` পুরোটাই reject হয়।

**প্রশ্ন: Event loop কী? (সংক্ষেপে)**
উত্তর: **Thread** মানে code চালানোর একটা লাইন। JavaScript-এর একটাই thread, মানে সে একসাথে একটাই কাজ করতে পারে (single threaded)। অপেক্ষার কাজগুলো, যেমন timer বা network request, browser নিজে আলাদাভাবে সামলায়। সেগুলো শেষ হলে তাদের callback একটা **queue**-তে গিয়ে বসে। Queue মানে লাইন, যেখানে আগে যে আসে সে আগে সুযোগ পায়। **Event loop** বারবার দেখে JavaScript-এর বর্তমান কাজ শেষ হলো কিনা। শেষ হলে queue থেকে পরের callback নিয়ে চালায়। এই কারণেই `setTimeout(..., 0)` দিলেও callback সাথে সাথে চলে না, বর্তমান code শেষ হওয়ার পরে চলে।
