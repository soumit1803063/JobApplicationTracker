# অধ্যায় ১০: Global State — Redux Toolkit

`useState` একটা component-এর নিজের জিনিস। কিন্তু login করা user-কে দরকার navbar-এর, `ProtectedRoute`-এর, Login page-এর, সবার। যে data অনেক দূরের component-কে একসাথে লাগে, তাকে বলে **global state**। আমাদের project-এ global state রাখার জন্য ব্যবহার করা হয়েছে **Redux Toolkit**।

---

## ১০.১ সমস্যা: Prop drilling

ধরো আমাদের project-এ store নেই, আর `user` রাখা আছে সবচেয়ে উপরের component-এ। কিন্তু `user` লাগবে গভীরে থাকা navbar-এ। তাহলে মাঝের সব component-কে props দিয়ে হাতে হাতে `user` পৌঁছে দিতে হবে, অথচ মাঝের কেউ নিজে `user` ব্যবহারই করে না। এই কাল্পনিক chain-টা দেখতে এমন হতো:
```
App (user) → AppRouter (user) → ProtectedRoute (user) → AppLayout (user) → navbar
```
একে বলে **prop drilling**। লেখা বিরক্তিকর, আর মাঝের যেকোনো জায়গায় ভুল হওয়ার ঝুঁকি বেশি।

**সমাধান:** data রাখো সব component-এর বাইরে, একটা **central store**-এ। যে component-এর দরকার, সে সরাসরি store থেকে পড়বে; মাঝের কাউকে কিছু জানতে হবে না।

```
              ┌───────────── Redux Store ─────────────┐
              │ auth: { user, ... }                   │
              │ applications: { items, filters, ... } │
              └───────────────────────────────────────┘
                 ↑ পড়ে          ↑ পড়ে            ↑ পড়ে
             AppLayout    ProtectedRoute    ApplicationsPage
```

পুরো app-এর shared data যেহেতু এই এক জায়গাতেই থাকে, তাই store-কে বলা হয় **single source of truth**: কোনো data-র আসল value জানতে হলে একটাই জায়গায় দেখতে হয়।

---

## ১০.২ Redux-এর পাঁচটা মূল শব্দ

| শব্দ | মানে | তুলনা |
|---|---|---|
| **Store** | পুরো app-এর global state রাখার একমাত্র জায়গা | ব্যাংক |
| **State** | store-এর ভেতরের data | ব্যাংকে তোমার টাকা |
| **Action** | "কী ঘটেছে" জানানো একটা ছোট object | জমা বা তোলার স্লিপ |
| **Reducer** | action দেখে নতুন state বানানোর function | ক্যাশিয়ার |
| **Dispatch** | store-এ action পাঠানো | স্লিপটা কাউন্টারে দেওয়া |

### Action দেখতে কেমন
```js
{ type: 'applications/filtersChanged', payload: { search: 'dev' } }
```
- **`type`**: কী ঘটেছে, তার নাম (একটা string)।
- **`payload`**: সাথে পাঠানো data। এখানে মানে "search লেখা `'dev'` হয়েছে"।

### Reducer-এর নিয়ম
```
নতুন state = reducer(পুরনো state, action)
```
- পুরনো state **বদলাবে না**, নতুন state return করবে (immutability, অধ্যায় ৭)।
- কোনো side effect করবে না (server call, timer; অধ্যায় ৮)।
- একই input দিলে সবসময় একই output দেবে। এমন function-কে বলে **pure function**।

### One-way data flow

Redux-এ data সবসময় একই দিকে, একই পথে চলে। একে বলে **one-way data flow**:

```
UI → dispatch(action) → reducer → নতুন state (store) → useAppSelector → UI re-render
```

1. UI-তে কিছু ঘটল (যেমন user dropdown বদলাল), component একটা action dispatch করল।
2. Reducer পুরনো state আর action থেকে নতুন state বানাল।
3. Store নতুন state রাখল।
4. যে component-গুলো `useAppSelector` দিয়ে ওই state পড়ে (নিচে ১০.৭), তারা re-render হলো।

State বদলানোর অন্য কোনো পথ নেই। তাই কোনো bug হলে খুঁজতে হয় শুধু "কোন action এসেছিল, আর reducer কী করল"। এই কারণে Redux-এর state বদল **predictable**।

---

## ১০.৩ Redux Toolkit কেন?

পুরনো Redux-এ অনেক বাড়তি কোড লিখতে হতো: action type-এর আলাদা constant, action বানানোর আলাদা function, হাতে লেখা immutable update। **Redux Toolkit (RTK)** (`@reduxjs/toolkit` package) হলো Redux-এর official, আধুনিক রূপ, যেটা এই কাজগুলো automate করে:

- `configureStore`: store বানায়, আর ভালো default setting দেয়।
- `createSlice`: reducer আর action একসাথে বানায়।
- `createAsyncThunk`: server call সামলায় (অধ্যায় ১১)।
- ভেতরে থাকে **Immer** library, তাই "বদলানোর মতো" করে লিখলেও আসলে immutable update হয় (১০.৬)।

React component-কে store-এর সাথে যুক্ত করার কাজ করে আলাদা একটা package: **`react-redux`**। `Provider`, `useSelector` আর `useDispatch` আসে এখান থেকে।

---

## ১০.৪ Store বানানো: `app/store.ts`

`frontend/src/app/store.ts`:
```ts
import { applicationsReducer } from '@/features/applications/applications.slice';
import { authReducer } from '@/features/auth/auth.slice';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        applications: applicationsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
```

- Store-এর state দেখতে হবে `{ auth: {...}, applications: {...} }`। প্রতিটা অংশকে বলে একটা **slice**, আর প্রতিটা slice-এর নিজের reducer আছে (`authReducer`, `applicationsReducer`)।
- **`RootState`** হলো পুরো state-এর type। `store.getState()` পুরো state return করে, আর `ReturnType<typeof store.getState>` (utility type, অধ্যায় ৪) সেই return-এর type বের করে আনে। নতুন slice যোগ করলে type নিজে থেকেই update হয়।
- **`AppDispatch`** হলো এই store-এর `dispatch` function-এর type।

### Middleware

**Middleware** হলো dispatch আর reducer-এর মাঝের একটা ধাপ: action reducer-এ পৌঁছানোর আগে middleware সেটা দেখতে, বদলাতে, বা অন্য কিছু করতে পারে।

```
dispatch(...) → middleware → reducer
```

`configureStore` default হিসেবে কয়েকটা middleware যোগ করে দেয়, তার মধ্যে সবচেয়ে গুরুত্বপূর্ণ হলো **thunk middleware**, যেটা দিয়ে server call করা যায় (অধ্যায় ১১)। আমাদের আলাদা করে কিছু লিখতে হয়নি।

### App-কে store দেওয়া: `main.tsx`

`frontend/src/main.tsx` (সংক্ষেপে):
```tsx
<StrictMode>
    <Provider store={store}>
        <AppRouter />
    </Provider>
</StrictMode>
```

`Provider` (`react-redux` থেকে) পুরো app-কে wrap করে। এর ফলে ভেতরের যেকোনো component store ব্যবহার করতে পারে।

ভেতরে `Provider` React-এর **Context** ব্যবহার করে। Context হলো React-এর নিজস্ব ব্যবস্থা, যেটা দিয়ে props ছাড়াই উপরের একটা component থেকে নিচের যেকোনো component-এ value পৌঁছানো যায়।

---

## ১০.৫ Slice: এক বিষয়ের state + reducer + action

শুরুর filter value-গুলো রাখা আছে `frontend/src/features/applications/applications.constants.ts`-এ:
```ts
export const DEFAULT_FILTERS: ApplicationFilters = {
    search: '',
    status: StatusFilter.All,
    applyMedium: '',
    sortBy: SortField.CreatedAt,
    sortOrder: SortOrder.Desc,
    page: 1,
    limit: 10,
};
```
অর্থাৎ শুরুতে: কোনো search নেই, সব status, যেকোনো apply medium, নতুন যোগ করা আগে, প্রথম page, প্রতি page-এ ১০টা।

এবার slice। `frontend/src/features/applications/applications.slice.ts` (সংক্ষেপে):
```ts
const initialState: ApplicationsState = {
    filters: DEFAULT_FILTERS,
    items: [],
    meta: null,
    listStatus: RequestStatus.Idle,
    listError: null,
    ...
};

const applicationsSlice = createSlice({
    name: 'applications',
    initialState,
    reducers: {
        filtersChanged: (state, action: PayloadAction<Partial<ApplicationFilters>>): void =>
        {
            state.filters = { ...state.filters, page: 1, ...action.payload };
        },
        filtersReset: (state): void =>
        {
            state.filters = DEFAULT_FILTERS;
        },
        ...
    },
    ...
});

export const { filtersChanged, filtersReset, saveErrorCleared } = applicationsSlice.actions;

export const applicationsReducer: Reducer<ApplicationsState> = applicationsSlice.reducer;
```

`saveErrorCleared` `saveError`-কে `null` করে।

`initialState`-এ `listStatus` আর `listError` হলো server call-এর অবস্থা (loading চলছে কিনা, error হয়েছে কিনা); `RequestStatus` নিয়ে বিস্তারিত অধ্যায় ১১-এ।

**Action creator** হলো এমন একটা function, যেটা action object বানিয়ে return করে। যেমন:
```ts
filtersChanged({ search: 'dev' });
```
এটা return করে `{ type: 'applications/filtersChanged', payload: { search: 'dev' } }`। হাতে action object লেখার বদলে আমরা action creator call করি, তাই `type`-এর বানান ভুল হওয়ার সুযোগ থাকে না।

| অংশ | কাজ |
|---|---|
| `name` | action type-এর শুরু: `'applications/...'` |
| `initialState` | শুরুর state |
| `reducers` | প্রতিটা key থেকে একটা reducer **আর** একই নামের একটা action creator তৈরি হয় |
| `slice.actions` | সেই action creator-গুলো: `filtersChanged`, `filtersReset`... |
| `slice.reducer` | পুরো slice-এর একটা reducer, যেটা store-এ বসানো হয় |

`Reducer<ApplicationsState>` হলো RTK-র একটা type: "এটা এমন reducer, যার state-এর type `ApplicationsState`"।

### `filtersChanged` কী করে
```ts
state.filters = { ...state.filters, page: 1, ...action.payload };
```
1. পুরনো সব filter রাখো (`...state.filters`)।
2. `page`-কে 1 করো। নতুন filter দিলে প্রথম page থেকে দেখানো উচিত।
3. পাঠানো নতুন value-গুলো দিয়ে overwrite করো (`...action.payload`)। Payload-এ `page` থাকলে (মানে user page বদলাচ্ছে) সেটাই জিতবে, কারণ spread-এ পরে লেখা key আগেরটাকে overwrite করে।

উদাহরণ: `filters.page` এখন 3, আর dispatch হলো `filtersChanged({ search: 'dev' })`। নতুন `filters`-এ `search` হবে `'dev'`, `page` হবে 1, বাকি সব আগের মতো।

`PayloadAction<Partial<ApplicationFilters>>` মানে এই action-এর payload হলো `ApplicationFilters`-এর কিছু field (Partial, অধ্যায় ৪)। তাই কেউ ভুল field বা ভুল type পাঠালে TypeScript error দেবে।

---

## ১০.৬ Immer: "বদলানোর মতো লেখো, নিরাপদে নতুন বানাও"

অধ্যায় ৭-এ শিখেছি state কখনো সরাসরি বদলানো যায় না। তাহলে slice-এ এটা কীভাবে চলছে?
```ts
state.filters = DEFAULT_FILTERS;
```
Redux Toolkit-এর reducer-এর ভেতরে `state` আসল state না; এটা Immer-এর বানানো একটা **draft**, মানে একটা temporary copy। তুমি draft "বদলাও", আর Immer সেই বদলগুলো লিখে রাখে, তারপর সেগুলো দিয়ে **একটা সম্পূর্ণ নতুন immutable state** বানিয়ে দেয়। আসল পুরনো state অক্ষত থাকে।

Immer-এর আরেকটা সুবিধা: যে অংশ বদলায়নি, নতুন state-এ সেটা পুরনো object-ই থাকে। যেমন `items` বদলালে নতুন state-এ `filters` আগের reference-ই থাকে। অধ্যায় ৮-এর `useEffect`, যার dependency array `[dispatch, filters]`, এই কারণেই অপ্রয়োজনে চলে না।

শুধু দুটো নিয়ম:

1. Draft বদলাও, **অথবা** নতুন state `return` করো। **দুটো একসাথে না।**
2. এই সুবিধা **শুধু `createSlice`-এর reducer-এর ভেতরে**। Component-এর `useState`-এ এখনো spread দিয়ে নিজে নতুন object বানাতে হবে।

নতুন state return করার উদাহরণ। ধরো slice-এর `reducers`-এ এমন একটা reducer থাকত:
```ts
reset: (): ApplicationsState => initialState,
```
এটা draft-এ হাত দেয় না, সরাসরি `initialState` return করে, তাই dispatch হলে পুরো slice শুরুর অবস্থায় ফিরে যায়। আমাদের আসল কোডে ঠিক এই কাজটা হয় logout-এর সময় (অধ্যায় ১১)।

---

## ১০.৭ Store থেকে পড়া আর পাঠানো: typed hook

`frontend/src/app/redux.ts` (সংক্ষেপে):
```ts
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export const useAppSelector = useSelector.withTypes<RootState>();
```

`react-redux`-এর `useDispatch` আর `useSelector` আমাদের state-এর shape জানে না। `.withTypes<>()` দিয়ে এদের **typed version** বানানো হলো: এখন `useAppSelector` জানে state-এ `auth` আর `applications` আছে, আর ভুল field লিখলে TypeScript error দেয়। **সবসময় এই দুটোই ব্যবহার করবে।**

### `useAppSelector`: পড়া
```tsx
const filters = useAppSelector((state) => state.applications.filters);
const user = useAppSelector((state) => state.auth.user);
```
- ভেতরের function-টাকে বলে **selector**: পুরো state থেকে দরকারি অংশ বেছে return করে।
- **কখন re-render হয়:** প্রতিবার store বদলালে selector আবার চলে, আর নতুন ফলাফল আগের ফলাফলের সাথে `===` দিয়ে তুলনা হয়। আলাদা হলে তবেই component re-render হয়।
- তাই যে component শুধু `state.auth.user` পড়ে, application-এর list বদলালে সে re-render হয় না।

### পুরো slice select করলে কী হয়

Project-এর অনেক জায়গায় পুরো slice select করে তারপর destructure করা হয়েছে, যেমন `ApplicationsPage.tsx`:
```tsx
const { filters, items, meta, listStatus, listError } = useAppSelector((state) => state.applications);
```
এখানে selector return করছে **পুরো `state.applications` object**। Destructuring হয় তার **পরে**, শুধু field-গুলো বের করার জন্য; re-render-এর সিদ্ধান্তে এর কোনো ভূমিকা নেই।

ফলাফল: applications slice-এর **যেকোনো** field বদলালে (যেমন `saveStatus`, যেটা এই page ব্যবহারই করে না) slice-টা নতুন object হয়, আর `ApplicationsPage` re-render হয়। ছোট app-এ এটা সমস্যা না, কিন্তু খেয়াল রাখা ভালো। শুধু একটা field দরকার হলে সরাসরি সেটাই select করা ভালো, যেমন `ApplicationFilters.tsx` করে `state.applications.filters`।

### `useAppDispatch`: পাঠানো
```tsx
const dispatch = useAppDispatch();
dispatch(filtersChanged({ status: StatusFilter.Applied }));
```
ফলাফল: store-এ `filters.status` হয়ে যায় `'applied'`, আর `page` হয় 1।

---

## ১০.৮ পুরো flow একটা উদাহরণে: Status filter বদলানো

`ApplicationFilters.tsx`-এ user "Status" dropdown থেকে "Applied" বেছে নিল।

`ApplicationFilters.tsx` (সংক্ষেপে):
```tsx
<Select
    id="status"
    value={filters.status}
    onChange={(event): void =>
    {
        dispatch(
            filtersChanged({
                status: parseEnum(Object.values(StatusFilter), event.target.value, StatusFilter.All),
            }),
        );
    }}
>
```

1. **Event:** `onChange` চলে। `event.target.value` হলো string `'applied'`।
2. **`parseEnum`:** string-টা আসলেই `StatusFilter`-এর কোনো value কিনা check করে, আর মিললে সেটা return করে। না মিললে `StatusFilter.All`।
3. **Action তৈরি:** action creator `filtersChanged({ status: 'applied' })` return করে `{ type: 'applications/filtersChanged', payload: { status: 'applied' } }`।
4. **Dispatch:** action store-এ যায়।
5. **Reducer:** `state.filters = { ...পুরনো, page: 1, status: 'applied' }`। Immer নতুন `filters` object বানায়, তাই applications slice-ও নতুন object হয়।
6. **Selector:** `ApplicationFilters` select করে `state.applications.filters`, যেটা নতুন object, তাই re-render হয়, আর dropdown-এ "Applied" দেখায়। `ApplicationsPage` select করে পুরো `state.applications`, যেটাও নতুন object, তাই সেও re-render হয়।
7. **Effect:** `ApplicationsPage`-এর `useEffect(..., [dispatch, filters])` দেখে `filters` বদলেছে, তাই `loadApplications(filters)` dispatch করে server থেকে নতুন list আনে (অধ্যায় ১১)।

### Filter কেন Redux-এ, `useState`-এ না?
- Filter bar (`ApplicationFilters`) আর page (`ApplicationsPage`), দুটো আলাদা component-এর এটা দরকার।
- Details page দেখে list-এ ফিরে এলেও filter মনে থাকা উচিত। `useState`-এ রাখলে page ছাড়ার সাথে সাথে component unmount হয়, আর filter হারিয়ে যেত।

---

## ১০.৯ কোনটা store-এ রাখবে, কোনটা রাখবে না

| Store-এ রাখো | Local `useState`-এ রাখো |
|---|---|
| Login করা user | Form-এ type করা লেখা |
| Server থেকে আনা list | Dropdown খোলা আছে কিনা |
| অনেক page-এ লাগা filter | Search box-এর তাৎক্ষণিক লেখা (debounce-এর আগে) |
| Server call-এর loading বা error অবস্থা | শুধু একটা component-এর UI অবস্থা |

নিয়মটা সহজ: একাধিক দূরের component-এর দরকার, বা page বদলালেও মনে থাকা দরকার, এমন data store-এ। বাকি সব local।

---

## সারসংক্ষেপ

- **Store** হলো পুরো app-এর global state রাখার একমাত্র জায়গা (single source of truth)। এতে prop drilling দূর হয়।
- **Action** `{ type, payload }` জানায় কী ঘটেছে। **Action creator** action বানায়। **Reducer** পুরনো state আর action থেকে নতুন state বানায়।
- Data চলে one-way data flow-তে: UI → dispatch → reducer → store → `useAppSelector` → UI।
- **`configureStore`** store বানায়, আর default হিসেবে thunk middleware যোগ করে। **Middleware** হলো dispatch আর reducer-এর মাঝের ধাপ।
- **`createSlice`** reducer আর action creator একসাথে বানায়।
- **Immer**-এর কারণে slice-এর ভেতরে "বদলানোর মতো" লেখা যায়, যদিও আসলে নতুন state তৈরি হয়।
- **`useAppSelector`** দিয়ে পড়া হয় (selector-এর ফলাফল `===` অনুযায়ী বদলালে তবেই re-render), আর **`useAppDispatch`** দিয়ে পাঠানো হয়। দুটোই `react-redux`-এর hook-এর typed version।

## ইন্টারভিউ প্রশ্ন

**প্রশ্ন: Redux কেন ব্যবহার করবে? সবসময় কি দরকার?**
উত্তর: অনেক দূরের component-এর মধ্যে data share করতে, prop drilling এড়াতে, আর state কোথায় কীভাবে বদলায় তা predictable রাখতে। Redux-এ state বদলানোর একটাই পথ: action dispatch করা, আর reducer নতুন state বানানো। তাই যেকোনো বদলের কারণ খুঁজে পাওয়া সহজ। এছাড়া Redux DevTools নামের browser extension দিয়ে প্রতিটা action আর তার পরের state দেখা যায়। তবে সবসময় দরকার নেই; ছোট app-এ `useState` আর lifting state, বা React-এর Context-ই যথেষ্ট।

**প্রশ্ন: Reducer কেন pure হতে হবে?**
উত্তর: Pure মানে একই input-এ সবসময় একই output, আর কোনো side effect নেই। তাহলে state বদল predictable হয়, reducer test করা সহজ হয় (শুধু input দিয়ে output মেলাও), আর Redux DevTools-এ আগের action-গুলো আবার চালিয়ে আগের অবস্থায় ফেরা যায়, যাকে বলে time-travel debugging। Reducer-এ server call বা random value থাকলে এগুলো ভেঙে যায়।

**প্রশ্ন: Redux Toolkit-এ state "mutate" করা যায় কীভাবে?**
উত্তর: Immer library-র কারণে। `createSlice`-এর reducer-এ আসল state-এর বদলে একটা draft, মানে একটা temporary copy দেওয়া হয়। আমরা draft-এ সরাসরি assign করি, আর Immer সেই বদলগুলো থেকে একটা নতুন immutable state বানায়; আসল state অক্ষত থাকে। এটা শুধু RTK-র reducer-এর ভেতরে কাজ করে, component-এর `useState`-এ না। আর একটা reducer-এ হয় draft বদলাতে হবে, নয়তো নতুন state return করতে হবে, দুটো একসাথে না।

**প্রশ্ন: useSelector কখন component re-render করে?**
উত্তর: প্রতিবার store-এ action dispatch হলে selector আবার চলে, আর নতুন return value আগের value-র সাথে strict reference তুলনা, মানে `===` দিয়ে মেলানো হয়। আলাদা হলে তবেই re-render হয়। তাই selector-এ প্রতিবার নতুন object বানালে, যেমন `(state) => ({ a: state.a })`, প্রতিবার নতুন reference হয়, আর প্রতিটা action-এ re-render হয়। একইভাবে পুরো slice select করলে slice-এর যেকোনো field বদলালেই re-render হয়।

**প্রশ্ন: Context API আর Redux-এর পার্থক্য কী?**
উত্তর:
- Context হলো React-এর নিজস্ব ব্যবস্থা, যেটা দিয়ে props ছাড়াই উপরের component থেকে নিচের যেকোনো component-এ value পৌঁছানো যায়। Value বদলালে যারা ওই Context ব্যবহার করে তারা সবাই re-render হয়, আর state কীভাবে বদলাবে তার কোনো নিয়ম Context নিজে দেয় না।
- Redux একটা পূর্ণ state management library: selector দিয়ে শুধু দরকারি অংশ বদলালে re-render, middleware (যেমন thunk, যেটা server call সামলায়), DevTools, আর action-reducer-এর নির্দিষ্ট structure।
- কম বদলায় এমন জিনিসে (theme, ভাষা) Context ভালো। জটিল, ঘনঘন বদলানো, অনেক জায়গায় লাগা data-তে Redux ভালো।

**প্রশ্ন: Prop drilling কী? সমাধান কী?**
উত্তর: যে component-এর নিজের কোনো data দরকার নেই, তাকে দিয়েও props পাঠাতে হয় শুধু নিচের component-এ পৌঁছানোর জন্য। এটাই prop drilling। সমাধান: Context, Redux বা অন্য কোনো state management library, অথবা composition, মানে data যার কাছে আছে সেখানেই child component বানিয়ে `children` হিসেবে নিচে পাঠানো।

**প্রশ্ন: Action creator কী?**
উত্তর: Action object বানিয়ে return করা একটা function। যেমন `filtersChanged({ search: 'dev' })` return করে `{ type: 'applications/filtersChanged', payload: { search: 'dev' } }`। এতে প্রতিবার হাতে `type` লিখতে হয় না, বানান ভুলের সুযোগ থাকে না, আর payload-এর type TypeScript check করতে পারে। `createSlice` প্রতিটা reducer-এর জন্য একই নামের action creator নিজেই বানিয়ে দেয়।
