# শূন্য থেকে React — Job Application Tracker প্রজেক্ট দিয়ে শেখা

## এই বই কার জন্য

এই বই তোমার জন্য, যদি:

- তুমি আগে কখনো programming করোনি, অথবা React আর JavaScript একদম নতুন।
- তুমি একটা **আসল project-এর code** পড়ে পড়ে শিখতে চাও।
- তুমি **job interview**-এর জন্য প্রস্তুতি নিচ্ছ।

বইটা ধরে নেয় না যে তুমি কিছু জানো। প্রতিটা নতুন শব্দ প্রথমবার আসার সময় ব্যাখ্যা করা হয়েছে।

উদাহরণগুলো **যেখানে সম্ভব project-এর আসল code** থেকে নেওয়া, `frontend/src` folder থেকে। তবে শুরুর দিকের অধ্যায়ে কিছু জায়গায় TypeScript-এর type সরিয়ে code সহজ করা হয়েছে (তখন লেখায় বলে দেওয়া থাকবে "type বাদ দিয়ে দেখানো হলো" বা "সংক্ষেপে")। আর কিছু ছোট খেলনা উদাহরণও আছে, শুধু একটা ধারণা বোঝানোর জন্য।

একটা কথা: বইয়ের code block-গুলোতে কোনো comment নেই। প্রতিটা code কী করে আর তার result কী, সেটা code-এর ঠিক আগে বা পরে সাধারণ লেখায় বলা আছে।

## কীভাবে পড়বে

1. **ক্রম অনুযায়ী পড়ো।** প্রতিটা অধ্যায় আগের অধ্যায়ের উপর দাঁড়িয়ে আছে।
2. **Code পাশে খুলে রাখো।** বইয়ে যে file-এর কথা বলা হচ্ছে, VS Code-এ সেটা খুলে মিলিয়ে দেখো।
3. **প্রতিটা অধ্যায়ের শেষে "ইন্টারভিউ প্রশ্ন"** অংশ আছে। উত্তর দেখার আগে নিজে মুখে উত্তর দেওয়ার চেষ্টা করো।
4. **শেষ অধ্যায়ে** পুরো বইয়ের সব গুরুত্বপূর্ণ প্রশ্ন একসাথে আছে, interview-এর আগের রাতে revision-এর জন্য।

## কোন অধ্যায়ে কী

পুরো সূচিপত্র বইয়ের শুরুতে আছে। এখানে শুধু এক নজরে দেখে নাও কোন অধ্যায়ে মূলত কী শিখবে:

| অধ্যায় | বিষয় |
|---|---|
| ১–৩ | Web কীভাবে কাজ করে, React-এর জন্য দরকারি JavaScript, asynchronous JavaScript |
| ৪–৫ | TypeScript আর tools (Node.js, npm, Vite, Tailwind CSS) |
| ৬–৯ | React-এর মূল জিনিস: component, state, effect, routing |
| ১০–১২ | Redux Toolkit দিয়ে global state, server থেকে data আনা, login/authentication |
| ১৩–১৪ | পুরো একটা feature শুরু থেকে শেষ, আর project-এর folder সাজানো |
| ১৫ | সব অধ্যায়ের interview প্রশ্ন একসাথে |

## Project-টা কী করে

**Job Application Tracker** দিয়ে তুমি চাকরির আবেদনগুলোর হিসাব রাখতে পারো:

- Account খোলা আর login করা যায়।
- নতুন চাকরির post যোগ করা যায়: post-এর নাম, link, deadline, আবেদনের মাধ্যম (link বা mail), বেতন, CV link।
- আবেদন করেছ কিনা চিহ্ন দেওয়া যায়।
- List-এ খোঁজা (search), filter করা, সাজানো (sort) আর page বদলানো যায়।
- Edit আর delete করা যায়।

## Project-এর দুটো অংশ

```
JobApplicationTracker/
├── backend/jat/
└── frontend/
```

- **`frontend/`**: এটা **React** দিয়ে বানানো, browser-এ চলে, user যা দেখে আর click করে সেটা। **এই বই মূলত এটা নিয়ে।**
- **`backend/jat/`**: এটা server-এর code। এটা বানানো **NestJS** দিয়ে। NestJS হলো একটা **backend framework**, মানে server বানানোর জন্য তৈরি করা একগাদা ready-made code আর নিয়মকানুন। Backend data রাখে **PostgreSQL**-এ।
- **Database** হলো এমন একটা program যেটা data **স্থায়ীভাবে** রাখে, যাতে computer বন্ধ করে আবার চালালেও তোমার আবেদনগুলো হারিয়ে না যায়। **PostgreSQL** হলো একটা জনপ্রিয় database।

দুটো অংশই **TypeScript**-এ লেখা। TypeScript হলো JavaScript-এর সাথে কিছু বাড়তি নিয়ম যোগ করা একটা ভাষা (অধ্যায় ৪)। আগে JavaScript শিখব (অধ্যায় ২–৩), তারপর TypeScript।

## Project চালানোর আগে যা লাগবে

### যে program-গুলো install করতে হবে

| Program | কী জিনিস | কেন লাগবে |
|---|---|---|
| **Node.js** | Browser-এর বাইরে, তোমার computer-এ JavaScript চালানোর program। এর সাথে **npm** আসে, যেটা দিয়ে project-এর দরকারি package নামানো আর command চালানো হয় (অধ্যায় ৫) | Frontend আর backend দুটোই চালাতে |
| **Docker Desktop** | অন্য program-কে একটা আলাদা ছোট বাক্সে (container) চালানোর program | আমাদের PostgreSQL database এটার ভেতরে চলে, তাই PostgreSQL আলাদা করে install করতে হয় না |
| **VS Code** | Code লেখা আর পড়ার জন্য একটা free editor | File খুলে বইয়ের সাথে মিলিয়ে পড়তে |

Node.js নামাও nodejs.org থেকে (LTS version), Docker Desktop নামাও docker.com থেকে, আর VS Code নামাও code.visualstudio.com থেকে। Install করার পর Docker Desktop একবার খুলে রাখো, ওটা চালু না থাকলে database চলবে না।

### Terminal কী

**Terminal** হলো একটা window, যেখানে mouse দিয়ে click না করে লিখে লিখে computer-কে command দেওয়া হয়। VS Code-এর ভেতরেই terminal আছে: উপরের menu থেকে **Terminal → New Terminal** দিলে নিচে একটা terminal খুলবে।

Terminal সবসময় কোনো একটা folder-এর "ভেতরে" থাকে। **`cd`** (change directory) command দিয়ে folder বদলানো হয়। যেমন `cd frontend` লিখে Enter চাপলে terminal `frontend` folder-এ ঢোকে। এরপর যে command দেবে, সেটা ওই folder-এর ভেতরে চলবে।

### একটা জিনিস জেনে রাখো: localhost আর port

- **localhost** মানে "**নিজের computer**"। Development-এর সময় frontend আর backend দুটোই তোমার নিজের computer-এ চলে, তাই address-এ `localhost` থাকে।
- একই computer-এ অনেক program একসাথে network-এ কথা বলতে পারে। কে কোনটা, সেটা আলাদা করা হয় **port** number দিয়ে। এটাকে একটা building-এর flat number-এর মতো ভাবতে পারো। আমাদের project-এ frontend চলে port **5173**-এ, backend চলে port **3000**-এ, আর database চলে port **5432**-এ।

## Project চালানো, ধাপে ধাপে

প্রথমে VS Code দিয়ে `JobApplicationTracker` folder-টা খোলো (**File → Open Folder**)। তাহলে terminal শুরুতে এই folder-এই থাকবে। দুটো আলাদা terminal লাগবে, কারণ backend আর frontend দুটোই একসাথে চালু থাকতে হবে।

### Terminal ১: backend

**ধাপ ১.** Backend folder-এ ঢোকো, আর setting-এর file বানাও। Folder-এ `.env.example` নামে একটা file আছে। এটা copy করে `.env` নামে নতুন file বানাও:

```bash
cd backend/jat
cp .env.example .env
```

(Windows-এর Command Prompt ব্যবহার করলে `cp`-এর বদলে লেখো `copy .env.example .env`। VS Code-এর ভেতরের terminal-এ `cp` চলে।)

এরপর VS Code-এ `.env` খুলে খালি জায়গাগুলো পূরণ করো:

- `POSTGRES_USER` আর `POSTGRES_PASSWORD`: database-এর জন্য যেকোনো একটা নাম আর password দাও, যেমন `jat` আর `jat123`।
- `DATABASE_URL`: এখানে `USER` আর `PASSWORD`-এর জায়গায় ঠিক ওই একই নাম আর password বসাও। যেমন `postgresql://jat:jat123@localhost:5432/jat`।
- `JWT_SECRET`: যেকোনো লম্বা secret string, যেমন `my-very-long-secret-text-123`। এটা login token বানাতে লাগে (অধ্যায় ১২)।

এই ধাপটা **আগে** করতে হবে। পরের ধাপের `npm install` ভেতরে ভেতরে `.env`-এর `DATABASE_URL` পড়ে, তাই `.env` না থাকলে সেটা error দেয়।

**ধাপ ২.** দরকারি package নামাও। **Package** মানে অন্যদের লেখা ready-made code, যেটা আমাদের project ব্যবহার করে (অধ্যায় ৫-এ বিস্তারিত):

```bash
npm install
```

`npm install` প্রথমবার একটু সময় নেবে। শেষ হলে `node_modules` নামে একটা folder তৈরি হবে, আর সব package থাকে ওখানেই।

**ধাপ ৩.** Docker-এর ভেতরে PostgreSQL database চালু করো (Docker Desktop খোলা থাকতে হবে):

```bash
npm run db:up
```

**ধাপ ৪.** Database-এ দরকারি table-গুলো তৈরি করো। **Table** হলো database-এর ভেতরে data সাজিয়ে রাখার জায়গা, অনেকটা Excel sheet-এর মতো: প্রতিটা row একটা জিনিস (যেমন একটা application), আর প্রতিটা column একটা তথ্য (যেমন deadline)। Table বানানো বা বদলানোর নির্দেশগুলো যে file-এ লেখা থাকে, তাকে বলে **migration**:

```bash
npm run db:migrate
```

প্রথমবার `npm run db:up`-এর পরে database পুরোপুরি চালু হতে কয়েক সেকেন্ড লাগে। তাই একটু অপেক্ষা করে migrate চালাও। যদি "Can't reach database server" ধরনের error আসে, কয়েক সেকেন্ড পর একই command আবার চালাও।

**ধাপ ৫.** Backend server চালু করো:

```bash
npm run start:dev
```

কিছুক্ষণ পর terminal-এ দেখবে server চালু হয়েছে। এই terminal খোলা রাখো, বন্ধ করলে backend থেমে যাবে।

### Terminal ২: frontend

Terminal-এর পাশের **+** চিহ্নে click করে নতুন terminal খোলো। নতুন terminal আবার `JobApplicationTracker` folder থেকে শুরু হবে।

```bash
cd frontend
npm install
npm run dev
```

`npm run dev` চালালে terminal-এ `http://localhost:5173` লেখা একটা address দেখাবে।

### Browser-এ খোলো

Browser-এ **http://localhost:5173** খোলো। Login page আসবে। "Register" দিয়ে নতুন account খুলে ব্যবহার শুরু করো।

| কী চালাচ্ছ | কোন folder-এ | Command |
|---|---|---|
| `.env` বানানো (প্রথমবার, backend-এ সবার আগে) | `backend/jat` | `cp .env.example .env` |
| Package নামানো (প্রথমবার) | `backend/jat` আর `frontend` দুটোতেই | `npm install` |
| Database চালু | `backend/jat` | `npm run db:up` |
| Table তৈরি (প্রথমবার) | `backend/jat` | `npm run db:migrate` |
| Backend চালু | `backend/jat` | `npm run start:dev` |
| Frontend চালু | `frontend` | `npm run dev` |

পরের দিন আবার চালাতে চাইলে শুধু Docker Desktop খুলে `npm run db:up`, `npm run start:dev` (backend) আর `npm run dev` (frontend) দিলেই হবে। `npm install` আর `db:migrate` প্রথমবারের কাজ।
