# অধ্যায় ১: ওয়েব কীভাবে কাজ করে

React শেখার আগে বুঝতে হবে React কোন সমস্যার সমাধান করে। তার জন্য আগে বুঝতে হবে একটা website আসলে কীভাবে কাজ করে। এই অধ্যায়ে কোনো code লিখতে হবে না, শুধু ধারণাগুলো পরিষ্কার করব।

---

## ১.১ Browser আর Server

যখন তুমি browser-এ (Chrome, Firefox) একটা address লেখো, তখন দুটো program কথা বলে:

```
তোমার কম্পিউটার                              সাধারণত অন্য কোনো কম্পিউটার
┌──────────────┐     "আমাকে পেজটা দাও"      ┌──────────────┐
│   Browser    │ ─────────────────────────► │    Server    │
│  (Client)    │ ◄───────────────────────── │              │
└──────────────┘     "এই নাও পেজটা"         └──────────────┘
```

- **Client** হলো যে চায়। এখানে তোমার browser।
- **Server** হলো যে দেয়। Server কোনো আলাদা জাদুর যন্ত্র না, **server আসলে একটা program**। সে চুপচাপ বসে থাকে আর কেউ কিছু চাইলে উত্তর দেয়। সাধারণত server অন্য কোনো computer-এ চলে (যেমন Google-এর computer-এ)।

Client যখন কিছু চায়, সেই চাওয়াটাকে বলে **request**। Server যা ফেরত দেয়, সেটাকে বলে **response**। এখন থেকে এই দুটো শব্দ English-এই বলব।

আমাদের project-এ:

- **Frontend** (React) চলে browser-এ।
- **Backend** (NestJS) হলো server program। Development-এর সময় এটা **তোমার নিজের computer-এই** চলে, তাই address-এ `localhost` থাকে (ভূমিকা অধ্যায়ে দেখেছ)। আসল website-এ এটা অন্য কোনো computer-এ চলত।
- Backend data রাখে **database**-এ। Database হলো এমন program যেটা data স্থায়ীভাবে জমা রাখে, যাতে server বন্ধ হলেও data হারিয়ে না যায়।

---

## ১.২ একটা web page-এর তিনটা ভাষা

প্রতিটা web page তিনটা জিনিস দিয়ে তৈরি:

| ভাষা | কাজ | তুলনা |
|---|---|---|
| **HTML** | কাঠামো: কোথায় কী আছে | বাড়ির দেয়াল, দরজা, জানালা |
| **CSS** | styling: color, size, spacing | রং, পর্দা, ফার্নিচার |
| **JavaScript** | আচরণ: click করলে কী হবে | বিদ্যুৎ: সুইচ টিপলে বাতি জ্বলে |

### HTML

HTML লেখা হয় **tag** দিয়ে। প্রতিটা tag একটা জিনিস বোঝায়:

```html
<h1>Job Application Tracker</h1>
<p>তোমার সব আবেদন এক জায়গায়।</p>
<button>Log in</button>
<input type="email" />
```

এই চারটা লাইন browser-এ দেখাবে: একটা বড় শিরোনাম, তার নিচে একটা লাইন লেখা, একটা "Log in" button, আর একটা খালি ঘর যেখানে email লেখা যায়।

- `<h1>` হলো বড় শিরোনাম, `<p>` একটা paragraph, `<button>` একটা button, আর `<input>` হলো একটা **input field**, মানে user যেখানে কিছু type করতে পারে।
- বেশিরভাগ tag জোড়ায় আসে: `<p>` দিয়ে শুরু, `</p>` দিয়ে শেষ। মাঝের লেখাটা হলো ভেতরের content।
- কিছু tag একা আসে, যেমন `<input />`।
- Tag-এ **attribute** থাকে, মানে বাড়তি তথ্য। যেমন `type="email"` বলে দেয় এই input field-এ email লেখা হবে।

### CSS

CSS দিয়ে বলা হয় জিনিসটা দেখতে কেমন হবে:

```css
button {
    background-color: indigo;
    color: white;
    padding: 8px 16px;
}
```

এর মানে: page-এর সব button-এর পেছনের রং হবে নীলচে-বেগুনি (indigo), লেখা হবে সাদা, আর **padding** হবে উপর-নিচে 8px, ডানে-বামে 16px। **Padding** হলো জিনিসটার লেখা আর তার বর্ডারের মাঝের ফাঁকা জায়গা।

আমাদের project-এ আমরা CSS সরাসরি খুব কম লিখি। তার বদলে **Tailwind CSS** ব্যবহার করি (অধ্যায় ৫-এ বিস্তারিত)। HTML tag-এ **`class`** নামে একটা attribute দেওয়া যায়, যেটা দিয়ে tag-টাকে এক বা একাধিক নাম দেওয়া হয়। Tailwind আগে থেকেই অনেক ছোট ছোট class নাম বানিয়ে রেখেছে, আর প্রতিটা নাম একটা করে style বোঝায়:

```html
<button class="bg-indigo-600 text-white px-4 py-2">Log in</button>
```

| Class | মানে |
|---|---|
| `bg-indigo-600` | background রং indigo (600 হলো রঙের গাঢ়ত্ব) |
| `text-white` | লেখার রং সাদা |
| `px-4` | ডানে-বামে padding (x মানে আড়াআড়ি) |
| `py-2` | উপরে-নিচে padding (y মানে খাড়াখাড়ি) |

ফলে উপরের CSS-এর মতোই একটা রঙিন button দেখাবে, কিন্তু আলাদা CSS file লিখতে হলো না। একটা কথা মনে রাখো: React-এ `class` না লিখে **`className`** লেখা হয় (অধ্যায় ৬-এ কারণ দেখবে)।

### JavaScript

JavaScript হলো আসল programming ভাষা। এটা দিয়ে:

- Button-এ click করলে কিছু ঘটানো যায়
- Server থেকে data আনা যায়
- Page-এর লেখা বদলানো যায়, page reload না করেই

---

## ১.৩ DOM: browser-এর memory-তে page

Browser HTML পড়ে memory-তে page-এর একটা **tree-আকারের representation** বানায়। একটা গাছের যেমন গোড়া থেকে ডাল, ডাল থেকে আরো ডাল বের হয়, এটাও তেমন। এই ধরনের সাজানোকে বলে **tree structure**। Browser-এর বানানো এই tree-এর নাম **DOM** (Document Object Model)।

এই HTML থেকে:

```html
<main>
    <h1>Applications</h1>
    <button>New</button>
</main>
```

DOM হয় এমন:

```
main
├── h1  → "Applications"
└── button → "New"
```

অর্থাৎ `main`-এর ভেতরে দুটো জিনিস আছে: একটা `h1`, যার লেখা "Applications", আর একটা `button`, যার লেখা "New"।

DOM-এর প্রতিটা অংশ JavaScript-এর কাছে একটা **object**। Object হলো অনেকগুলো তথ্য একসাথে বাঁধা একটা জিনিস, যেমন একটা `h1`-এর object-এর ভেতরে তার লেখা, তার attribute ইত্যাদি থাকে (object নিয়ে বিস্তারিত অধ্যায় ২-এ)।

JavaScript এই DOM বদলাতে পারে, আর DOM বদলালে screen-ও সাথে সাথে বদলায়:

```js
document.querySelector('h1').textContent = 'আমার আবেদনগুলো';
```

এটাকে বাম থেকে ডানে পড়ো:

1. `document` হলো পুরো page।
2. `.querySelector('h1')` page-এ **প্রথম যে `h1`** পায়, সেটা খুঁজে বের করে।
3. `.textContent = 'আমার আবেদনগুলো'` সেই `h1`-এর লেখা বদলে দেয়।

Result: screen-এ "Applications" লেখাটা সাথে সাথে বদলে "আমার আবেদনগুলো" হয়ে যাবে, page reload ছাড়াই।

**সমস্যাটা হলো,** বড় app-এ এভাবে হাতে হাতে DOM বদলানো খুব কঠিন হয়ে যায়: কোন জিনিস কখন বদলাতে হবে, কোনটা বদলাতে ভুলে গেলাম, ইত্যাদি। **React ঠিক এই সমস্যার সমাধান করে।** তুমি শুধু বলো "data এরকম হলে screen দেখতে এরকম হবে", আর DOM বদলানোর কাজটা React নিজেই করে (অধ্যায় ৬)।

---

## ১.৪ HTTP: client আর server-এর ভাষা

Browser আর server যে নিয়মে কথা বলে, তার নাম **HTTP**। প্রতিটা কথোপকথনে থাকে একটা request আর একটা response।

### URL কী

**URL** হলো একটা address, যেমন `http://localhost:5173/api/applications/42`। এর অংশগুলো:

| অংশ | মানে |
|---|---|
| `http://` | কোন নিয়মে কথা হবে (HTTP) |
| `localhost:5173` | কোন computer (localhost মানে নিজের computer) আর কোন port |
| `/api/applications/42` | ওই server-এর ভেতরে কোন জিনিসটা চাই |

আমাদের frontend code-এ প্রায় সবসময় শুধু শেষ অংশটা লেখা হয়, যেমন `/api/applications/42`। একে বলে **relative URL**। Browser নিজে থেকেই সামনে বর্তমান page-এর address (`http://localhost:5173`) বসিয়ে নেয়। পুরোটা লেখা থাকলে সেটাকে বলে full URL।

আমাদের project-এ একটা নিয়ম আছে: যে URL **`/api`** দিয়ে শুরু, সেটা **backend-এর** জন্য। বাকি URL, যেমন `/login` বা `/applications`, হলো frontend-এর page। `/api` দিয়ে শুরু হওয়া request কীভাবে port 3000-এর backend-এ পৌঁছায়, সেটা অধ্যায় ৩ আর ৫-এ দেখবে।

### Request-এর অংশ

একটা request-এ চারটা অংশ থাকতে পারে:

| অংশ | মানে | উদাহরণ |
|---|---|---|
| **Method** | কী করতে চাই | `GET`, `POST`, `PATCH`, `DELETE` |
| **URL** | কোথায় | `/api/applications/42` |
| **Headers** | বাড়তি তথ্য | `Authorization: Bearer abc123` |
| **Body** | পাঠানো data (সবসময় থাকে না) | `{ "email": "a@b.com" }` |

Header-এর উদাহরণে `abc123` হলো একটা **token**। Login করার পর server তোমাকে একটা লম্বা গোপন লেখা দেয়, সেটাই token। পরের প্রতিটা request-এ সেটা দেখিয়ে তুমি প্রমাণ করো যে তুমি login করা user। `Bearer` শব্দটা শুধু বলে দেয় "এর পরে যেটা আছে সেটা একটা token" (বিস্তারিত অধ্যায় ১২-এ)।

Body-র উদাহরণটা **JSON** format-এ লেখা, যেটা ১.৫-এ দেখবে।

### চারটা প্রধান method

| Method | কাজ | আমাদের project-এ |
|---|---|---|
| `GET` | Data পড়া | আবেদনের list আনা |
| `POST` | নতুন কিছু তৈরি | নতুন আবেদন যোগ করা, login |
| `PATCH` | কিছু অংশ বদলানো | আবেদন edit করা |
| `DELETE` | মুছে ফেলা | আবেদন delete করা |

### Response-এর status code

Server প্রতিটা response-এর সাথে একটা **status code** পাঠায়। এটা তিন অঙ্কের একটা number, যেটা দেখে বোঝা যায় কাজটা সফল হলো কিনা। মোটা দাগে: **2xx** মানে সফল, **4xx** মানে client (মানে আমরা) কিছু ভুল করেছি, **5xx** মানে server-এ সমস্যা।

| Code | মানে |
|---|---|
| `200` OK | সফল |
| `201` Created | নতুন কিছু তৈরি হয়েছে |
| `204` No Content | সফল, তবে ফেরত দেওয়ার কিছু নেই (যেমন delete) |
| `400` Bad Request | তুমি ভুল data পাঠিয়েছ (যেমন email-এর জায়গায় উল্টাপাল্টা লেখা) |
| `401` Unauthorized | Server জানে না তুমি কে: login করোনি, অথবা token ভুল বা পুরনো |
| `403` Forbidden | Server জানে তুমি কে, কিন্তু এই কাজের অনুমতি তোমার নেই |
| `404` Not Found | জিনিসটা নেই |
| `409` Conflict | আগে থেকেই আছে (যেমন একই email দিয়ে আবার register) |
| `500` Server Error | Server-এ সমস্যা |

---

## ১.৫ API আর JSON

### API

**API** (Application Programming Interface) হলো server-এর কিছু নির্দিষ্ট URL, যেখানে request পাঠিয়ে data পাওয়া বা বদলানো যায়। এমন প্রতিটা URL-কে বলে একটা **endpoint**। আমাদের backend-এর API:

| Method + URL | কাজ |
|---|---|
| `POST /api/auth/register` | Account খোলা |
| `POST /api/auth/login` | Login |
| `GET /api/auth/me` | আমি কে? (login করা user-এর তথ্য) |
| `GET /api/applications` | আবেদনের list |
| `POST /api/applications` | নতুন আবেদন |
| `GET /api/applications/:id` | একটা আবেদন |
| `PATCH /api/applications/:id` | আবেদন বদলানো |
| `DELETE /api/applications/:id` | আবেদন মোছা |

`:id` মানে এখানে আসল id বসবে, যেমন `/api/applications/42` মানে "42 নম্বর id-র আবেদনটা"।

খেয়াল করো, একই URL-এ method আলাদা হলে কাজ আলাদা। `GET /api/applications` list আনে, আর `POST /api/applications` নতুন আবেদন বানায়।

### JSON

**JSON** (JavaScript Object Notation) হলো data লিখে পাঠানোর একটা format। Server আর browser দুজনেই এটা বোঝে। দেখতে এমন:

```json
{
    "success": true,
    "data": {
        "id": "42",
        "jobPost": "Backend Engineer",
        "isApplied": false,
        "salaryMin": 50000
    }
}
```

পড়ার নিয়ম:

- `{ }`-এর ভেতরে থাকে কিছু **key-value pair**। বাম পাশে নাম (key), কোলন `:`, তারপর তার value। যেমন `"jobPost": "Backend Engineer"` মানে jobPost-এর value হলো "Backend Engineer"।
- Key সবসময় double quote `" "`-এর ভেতরে থাকে।
- Value হতে পারে লেখা (`"42"`), number (`50000`), `true`/`false`, `null` (কিছু নেই), অথবা আরেকটা `{ }`। উপরে `data`-র value নিজেই আরেকটা `{ }`।
- `[ ]` দিয়ে একটা **list** বোঝায়, যেমন `["a", "b", "c"]`। Programming-এ list-কে বলে **array** (অধ্যায় ২)।

আমাদের backend **সবসময় একই আকারে** response দেয়। এটা মনে রাখো, অধ্যায় ৩-এ কাজে লাগবে:

- **সফল হলে:** `{ "success": true, "data": ... }`
- **ব্যর্থ হলে:** `{ "success": false, "error": { "statusCode": 400, "message": "...", "details": [...] } }`

এখানে `...` কোনো code না। এর মানে শুধু "এখানে কিছু একটা থাকবে"। যেমন `data`-তে থাকবে আসল data (একটা আবেদন, বা আবেদনের list), `message`-এ থাকবে error-এর লেখা, আর `details`-এ থাকবে error-এর খুঁটিনাটি লেখার একটা list (`details` সবসময় থাকে না, শুধু validation error-এ)।

---

## ১.৬ Single Page Application (SPA)

পুরনো website-এ প্রতিটা click-এ server থেকে **পুরো নতুন page** আসত, আর screen সাদা হয়ে আবার load হতো।

আমাদের React app একটা **SPA (Single Page Application)**:

1. প্রথমবার browser একটাই HTML page (`index.html`) আর JavaScript file load করে।
2. এরপর page বদলানো, data দেখানো সব কাজ browser-এই JavaScript দিয়ে হয়।
3. Server থেকে শুধু **JSON data** আসে, পুরো page আর আসে না।

ফলে app-টা খুব দ্রুত আর মসৃণ লাগে, mobile app-এর মতো।

আমাদের `frontend/index.html`-এর `<body>`-তে শুধু এটুকু আছে (পুরো file-এর বাকি অংশ বাদ দিয়ে দেখানো হলো):

```html
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
```

- `<div id="root"></div>` একটা খালি বাক্স। `id="root"` দিয়ে বাক্সটার নাম দেওয়া হয়েছে "root"।
- **`<script>`** tag দিয়ে browser-কে বলা হয় "এই JavaScript file-টা load করে চালাও"। `src` attribute-এ file-এর path থাকে।
- File-টার নাম `main.tsx`। **`.tsx`** মানে file-টা **TypeScript + JSX**-এ লেখা। TypeScript হলো type-যুক্ত JavaScript (অধ্যায় ৪), আর JSX হলো JavaScript-এর ভেতরে HTML-এর মতো লেখা (অধ্যায় ৬)। Browser এগুলো সরাসরি বোঝে না। Development-এ **Vite** নামের একটা tool এগুলোকে browser-এর বোঝার মতো সাধারণ JavaScript-এ convert করে দেয় (অধ্যায় ৫)।

Result: page খুললে প্রথমে কিছুই দেখা যায় না, তারপর `main.tsx` চলে আর React পুরো app-টা ওই খালি `<div id="root">`-এর ভেতরে বানিয়ে দেয় (অধ্যায় ৬)।

### SPA আর SEO

**SEO** (Search Engine Optimization) মানে এমনভাবে website বানানো যাতে Google-এর মতো search engine page-এর লেখা পড়তে পারে আর search result-এ দেখায়। Search engine একটা program পাঠিয়ে page-এর HTML পড়ে। সাধারণ website-এ server থেকে আসা HTML-এই সব লেখা থাকে। কিন্তু SPA-তে server থেকে আসা HTML-এ শুধু খালি `<div id="root">` থাকে, আসল লেখা পরে JavaScript দিয়ে তৈরি হয়। ফলে search engine অনেক সময় page-টাকে প্রায় খালি দেখে।

আমাদের app-এর জন্য এটা সমস্যা না, কারণ এটা login করে ব্যবহার করার app, Google-এ দেখানোর দরকার নেই। কিন্তু blog বা online shop-এর মতো site-এ SEO খুব জরুরি। তখন **server-side rendering** নামের কৌশল ব্যবহার করা হয়, যেখানে server নিজেই লেখাসহ পুরো HTML বানিয়ে পাঠায়।

---

## সারসংক্ষেপ

- Browser (client) server-এর কাছে **HTTP request** পাঠায়, আর server **response** দেয়। Server আসলে একটা program, development-এ আমাদের backend নিজের computer-এ (localhost) চলে।
- **HTML** কাঠামো দেয়, **CSS** সাজায়, **JavaScript** আচরণ ঠিক করে।
- **DOM** হলো memory-তে page-এর tree-আকারের representation। React DOM বদলানোর কাজটা আমাদের হয়ে করে।
- Request-এ থাকে method, URL, headers আর body। Response-এ থাকে **status code** (2xx সফল, 4xx client-এর ভুল, 5xx server-এর সমস্যা)।
- **API** হলো server-এর endpoint-গুলো, আর **JSON** হলো data-র format। আমাদের backend সবসময় `{ success, data }` বা `{ success, error }` আকারে response দেয়।
- আমাদের app একটা **SPA**: একবার load হয়, তারপর শুধু JSON data আসা-যাওয়া করে।

## ইন্টারভিউ প্রশ্ন

**প্রশ্ন: GET আর POST-এর পার্থক্য কী?**
উত্তর: GET data পড়ার জন্য। এর body থাকে না, আর একই GET request বারবার পাঠালে server-এর data বদলায় না। POST নতুন কিছু তৈরির জন্য। এর data body-তে যায়, আর প্রতিবার পাঠালে নতুন একটা জিনিস তৈরি হতে পারে। যেমন আমাদের project-এ `GET /api/applications` list আনে, আর `POST /api/applications` নতুন আবেদন বানায়।

**প্রশ্ন: 401 আর 403-এর পার্থক্য কী?**
উত্তর: 401 Unauthorized মানে server জানে না তুমি কে: login করা নেই, অথবা token ভুল বা পুরনো হয়ে গেছে। আবার login করলে ঠিক হয়ে যাবে। 403 Forbidden মানে server জানে তুমি কে, কিন্তু এই কাজের অনুমতি তোমার নেই। এখানে আবার login করে লাভ নেই।

**প্রশ্ন: SPA কী? এর সুবিধা আর অসুবিধা কী?**
উত্তর: যে app একবার একটা HTML page load করে, তারপর browser-এই JavaScript দিয়ে page বদলায় আর server থেকে শুধু data আনে, সেটাই SPA।
- সুবিধা: page বদলাতে পুরো reload হয় না, তাই দ্রুত আর মসৃণ লাগে। Server-কে শুধু data পাঠাতে হয়, পুরো page না।
- অসুবিধা: প্রথমবার load-এ অনেক JavaScript নামাতে হয়, তাই প্রথম load ভারী। আর server থেকে আসা HTML প্রায় খালি থাকে বলে search engine লেখা ঠিকমতো পড়তে পারে না, মানে SEO খারাপ হয়। এর সমাধান server-side rendering।

**প্রশ্ন: DOM কী?**
উত্তর: Browser HTML পড়ে memory-তে page-এর যে tree-আকারের representation বানায়, সেটাই DOM। এর প্রতিটা অংশ JavaScript-এর কাছে একটা object। JavaScript DOM বদলালে screen-ও বদলায়। React এই DOM বদলানোর কাজটা আমাদের হয়ে করে।

**প্রশ্ন: Status code-এর 2xx, 4xx, 5xx মানে কী?**
উত্তর: 2xx মানে request সফল, যেমন 200 OK বা 201 Created। 4xx মানে client-এর দিক থেকে ভুল, যেমন 400 ভুল data, 401 login নেই, 404 জিনিসটা নেই। 5xx মানে server-এর ভেতরে সমস্যা, যেমন 500।
