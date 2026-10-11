# অধ্যায় ১১: Server-এর data আর Redux — `createAsyncThunk`

Reducer pure হতে হয় (অধ্যায় ১০), তাই সেখানে server call চলে না। তাহলে server থেকে data এনে store-এ বসানো হবে কীভাবে? উত্তর হলো **thunk**।

---

## ১১.১ Thunk কী?

সাধারণ action হলো একটা **object**: `{ type, payload }`। **Thunk** হলো একটা **function**, যেটা action-এর মতোই dispatch করা যায়। এর ভেতরে async কাজ (server call) করা যায়, আর কাজ শেষে সাধারণ action dispatch করা যায়।

কিন্তু reducer তো function বোঝে না। তাহলে function dispatch করলে কী হয়? এখানেই অধ্যায় ১০-এর **middleware** কাজে আসে। মনে করিয়ে দিই: middleware হলো dispatch আর reducer-এর মাঝের একটা ধাপ, আর `configureStore` default হিসেবে **thunk middleware** যোগ করে দেয়। এই middleware প্রতিটা dispatch দেখে:

| কী dispatch করা হলো | Thunk middleware কী করে |
|---|---|
| Object (সাধারণ action) | কিছু না, সোজা reducer-এ যেতে দেয় |
| Function (thunk) | Reducer-এ পাঠায় না; function-টা নিজে **চালায়**, আর তাকে `dispatch` দেয়, যাতে ভেতর থেকে সাধারণ action পাঠানো যায় |

### `loadApplications(filters)` আসলে কী?

অধ্যায় ৮ থেকে আমরা লিখে আসছি:
```tsx
void dispatch(loadApplications(filters));
```
এখানে দুটো ধাপ:

1. `loadApplications(filters)` call করলে server call **হয় না**। এটা একটা **thunk action creator**: ঠিক যেমন সাধারণ action creator (অধ্যায় ১০) action object return করে, এটা return করে একটা thunk function।
2. `dispatch(...)` সেই function পায়। Thunk middleware দেখে এটা function, তাই সেটা চালায়, আর তখনই server call শুরু হয়।

`dispatch(thunk)` একটা **Promise** return করে, যেটা কাজ শেষ হলে fulfilled হয়। একটা গুরুত্বপূর্ণ ব্যাপার: `createAsyncThunk` দিয়ে বানানো thunk dispatch করলে যে Promise আসে, সেটা **কখনো reject হয় না**, server call ব্যর্থ হলেও না; ব্যর্থ হলেও এটা fulfilled হয়, শুধু ভেতরে থাকে "ব্যর্থ" অবস্থার action (১১.৬)। আমরা সাধারণত অপেক্ষা করি না, তাই সামনে `void`।

### `createAsyncThunk`

Redux Toolkit-এর `createAsyncThunk` thunk action creator বানানোর কাজটা গুছিয়ে দেয়। একটা async function দাও, আর সে নিজে থেকেই তিনটা action বানায় ও ঠিক সময়ে dispatch করে:

| Action | কখন | অধ্যায় ৩-এর Promise-এর কোন অবস্থা |
|---|---|---|
| `.../pending` | কাজ শুরু হলো | pending |
| `.../fulfilled` | সফল; return করা ফলাফল থাকে `action.payload`-এ | fulfilled |
| `.../rejected` | ব্যর্থ; `rejectWithValue` দিয়ে পাঠানো error message থাকে `action.payload`-এ। `rejectWithValue` ছাড়া error হলে `payload` হয় `undefined`, আর error-এর তথ্য থাকে `action.error`-এ | rejected |

---

## ১১.২ আমাদের project-এর তিন layer

প্রতিটা feature-এ server-এর সাথে কাজ তিনটা আলাদা file-এ ভাগ করা। প্রতিটা file হলো একটা **layer**: নিজের কাজটুকু করে, আর শুধু তার আগের layer-কে চেনে: slice চেনে thunk-কে, thunk চেনে api-কে (slice → thunk → api)।

```
features/applications/
├── applications.api.ts      ← (১) শুধু HTTP call, আর কিছু জানে না
├── applications.thunks.ts   ← (২) api call করে, ফলাফল বা error Redux-কে দেয়
└── applications.slice.ts    ← (৩) pending/fulfilled/rejected দেখে state বদলায়
```

প্রতিটা file-এর একটাই কাজ। ফলে পড়া, বদলানো আর bug খোঁজা সহজ।

---

## ১১.৩ Layer ১: API function

`frontend/src/features/applications/applications.api.ts` (import বাদে):
```ts
function applicationUrl(id: string): string
{
    return buildPath(ApiEndpoints.ApplicationById, { id });
}

export function getApplications(filters: ApplicationFilters): Promise<Page<JobApplication>>
{
    return api.getPage<JobApplication>(ApiEndpoints.Applications + buildQueryString(filtersToQuery(filters)));
}

export function getApplication(id: string): Promise<JobApplication>
{
    return api.get<JobApplication>(applicationUrl(id));
}

export function createApplication(payload: ApplicationPayload): Promise<JobApplication>
{
    return api.post<JobApplication>(ApiEndpoints.Applications, payload);
}

export function updateApplication(id: string, payload: Partial<ApplicationPayload>): Promise<JobApplication>
{
    return api.patch<JobApplication>(applicationUrl(id), payload);
}

export function deleteApplication(id: string): Promise<void>
{
    return api.delete(applicationUrl(id));
}
```

React বা Redux, কারো কথা এখানে নেই। শুধু "এই URL-এ এই data পাঠাও, এই type-এর response আসবে"। যেমন `getApplication('42')` `/applications/42`-এ GET request পাঠায় (`buildPath`, অধ্যায় ৯), আর একটা `JobApplication` return করে। `api` object (`shared/api.ts`) আসল `fetch` call, token যোগ করা আর error বানানোর কাজ করে।

### Filter থেকে query string

`getApplications`-এ ব্যবহার হওয়া `filtersToQuery` থাকে আলাদা file-এ, `frontend/src/features/applications/applications.utils.ts`:
```ts
export function filtersToQuery(filters: ApplicationFilters): QueryParams
{
    return {
        page: filters.page,
        limit: filters.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        search: filters.search.trim(),
        applyMedium: filters.applyMedium,
        isApplied: filters.status === StatusFilter.Applied
            ? true
            : filters.status === StatusFilter.NotApplied
            ? false
            : undefined,
        upcoming: filters.status === StatusFilter.Upcoming ? true : undefined,
        expired: filters.status === StatusFilter.Expired ? true : undefined,
    };
}
```

UI-র একটা `status` filter, server-এর কাছে কয়েকটা আলাদা query parameter হয়ে যায়। `isApplied`-এর nested ternary সহজ ভাষায়: "status Applied হলে `true`, NotApplied হলে `false`, অন্য কিছু হলে `undefined` (মানে পাঠাবই না)"।

তারপর `buildQueryString` (`shared/utils.ts`) খালি value (`''`, `undefined`, `null`) বাদ দিয়ে query string বানায়। যেমন `DEFAULT_FILTERS`-এ শুধু status বদলে Applied করলে ফলাফল:
```
?page=1&limit=10&sortBy=createdAt&sortOrder=desc&isApplied=true
```
`search` খালি আর `applyMedium` খালি, তাই বাদ; `upcoming` আর `expired` `undefined`, তাই সেগুলোও বাদ।

---

## ১১.৪ Layer ২: Thunk

`frontend/src/features/applications/applications.thunks.ts` (সংক্ষেপে):
```ts
import { createAppAsyncThunk } from '@/app/redux';
import * as applicationsApi from '@/features/applications/applications.api';
...

export const loadApplications = createAppAsyncThunk<Page<JobApplication>, ApplicationFilters>(
    'applications/loadList',
    async (filters, { rejectWithValue }) =>
    {
        try
        {
            return await applicationsApi.getApplications(filters);
        }
        catch (error: unknown)
        {
            return rejectWithValue(getErrorMessage(error));
        }
    },
);
```

- **`createAppAsyncThunk`**: `createAsyncThunk`-এর typed version (নিচে বিস্তারিত)।
- **`import * as applicationsApi`**: api file-এর সব export একটা object-এ নিয়ে আসে (module, অধ্যায় ২)। তাই api-র function call হয় `applicationsApi.createApplication(...)` হিসেবে। এর সুবিধা: thunk-এর নাম `createApplication` আর api function-এর নাম `createApplication` একই হলেও কোনো name conflict হয় না।
- **`<Page<JobApplication>, ApplicationFilters>`**: প্রথম type হলো সফল হলে কী return করবে, দ্বিতীয়টা হলো thunk action creator-কে কী argument দিয়ে call করা হবে।
- **`'applications/loadList'`**: action type-এর শুরু। এখান থেকে তৈরি হয় `applications/loadList/pending`, `.../fulfilled` আর `.../rejected`।
- **প্রথম parameter `filters`**: `loadApplications(filters)` call করার সময় যা দেওয়া হয়েছিল।
- **দ্বিতীয় parameter**: RTK একটা object দেয়, যাকে সাধারণত বলে **thunkAPI**। এতে থাকে `dispatch`, `getState` (পুরো state পড়ার function), `rejectWithValue` আর আরো কিছু। আমাদের শুধু `rejectWithValue` লাগে, তাই destructure করে সেটাই নেওয়া হয়েছে: `{ rejectWithValue }`।
- **`return await ...`**: যা `return` করা হয়, সেটাই `fulfilled` action-এর `payload` হয়।
- **`return rejectWithValue(message)`**: ব্যর্থ হলে `rejected` action পাঠায়, আর তার `payload`-এ থাকে আমাদের **readable error message**। `getErrorMessage` (`shared/utils.ts`) যেকোনো error থেকে একটা string বের করে।

### `createAppAsyncThunk` কেন?

`frontend/src/app/redux.ts`:
```ts
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: RootState;
    dispatch: AppDispatch;
    rejectValue: string;
}>();
```
অধ্যায় ১০-এর `useAppSelector`-এর মতোই এটা `createAsyncThunk`-এর typed version। সব thunk-এর জন্য একবারে বলে দেওয়া হলো: `getState` দেবে `RootState`, `dispatch`-এর type `AppDispatch`, আর `rejectWithValue`-এর payload সবসময় `string`। তাই প্রতিটা thunk-এ এগুলো আবার লিখতে হয় না।

### একাধিক argument লাগলে

Thunk একটাই argument নেয়, তাই একাধিক জিনিস লাগলে একটা object-এ ভরে দিতে হয়:

`applications.thunks.ts` (সংক্ষেপে):
```ts
export const updateApplication = createAppAsyncThunk<
    JobApplication,
    { id: string; payload: Partial<ApplicationPayload>; }
>(
    'applications/update',
    async ({ id, payload }, { rejectWithValue }) =>
    {
        ...
    },
);
```

`ApplicationsPage.tsx`-এ ব্যবহার:
```ts
void dispatch(updateApplication({ id: application.id, payload: { isApplied: !application.isApplied } }));
```
ফলাফল: ওই application-এর `isApplied` উল্টে দেওয়ার PATCH request server-এ যায়।

---

## ১১.৫ Layer ৩: Slice-এর `extraReducers`

`reducers` (অধ্যায় ১০) হলো slice-এর **নিজের** action, যেগুলোর action creator slice নিজে বানায়। Thunk-এর action তৈরি হয় slice-এর **বাইরে**, `createAsyncThunk`-এ। বাইরের action handle করা হয় **`extraReducers`**-এ।

`extraReducers` একটা function, যেটা একটা **`builder`** পায়। `builder` হলো RTK-র দেওয়া একটা object, যেটা দিয়ে "কোন action এলে কোন reducer চলবে" register করা হয়। এর দুটো method আমরা ব্যবহার করি:

| Method | মানে |
|---|---|
| `addCase(actionCreator, reducer)` | ঠিক এই একটা action এলে এই reducer চালাও |
| `addMatcher(condition, reducer)` | `condition` যে action-এর জন্য `true` দেয়, সেগুলোর সবকটায় এই reducer চালাও |

এই `condition` function-টাকে বলে **matcher**: action নিয়ে `true` বা `false` return করে। প্রতিটা method `builder`-কেই return করে, তাই একটার পর একটা chain করে লেখা যায়।

`applications.slice.ts` (সংক্ষেপে):
```ts
extraReducers: (builder): void =>
{
    builder
        .addCase(loadApplications.pending, (state): void =>
        {
            state.listStatus = RequestStatus.Loading;
            state.listError = null;
        })
        .addCase(loadApplications.fulfilled, (state, action): void =>
        {
            state.listStatus = RequestStatus.Succeeded;
            state.items = action.payload.items;
            state.meta = action.payload.meta;
        })
        .addCase(loadApplications.rejected, (state, action): void =>
        {
            state.listStatus = RequestStatus.Failed;
            state.listError = action.payload ?? 'Could not load applications';
        })
        ...
}
```

ফলাফল: list load শুরু হলে `listStatus` হয় Loading, সফল হলে `items` আর `meta` বসে, ব্যর্থ হলে `listError`-এ message বসে।

`action.payload`-এর type TypeScript নিজেই জানে: fulfilled-এ `Page<JobApplication>`, আর rejected-এ `string | undefined`।

### Rejected-এ `payload` কেন `undefined` হতে পারে?

Thunk দুইভাবে ব্যর্থ হতে পারে:

| কীভাবে ব্যর্থ | `action.payload` | `action.error` |
|---|---|---|
| আমরা `return rejectWithValue('...')` করলাম | আমাদের message | `{ message: 'Rejected' }` |
| `rejectWithValue` ছাড়াই কোনো error throw হলো (যেমন try-এর বাইরে bug) | `undefined` | আসল error-এর message ইত্যাদি |

আমাদের thunk-গুলো সব error ধরে `rejectWithValue` করে, তবুও TypeScript দ্বিতীয় সম্ভাবনাটা বাদ দিতে পারে না। তাই `action.payload ?? 'Could not load applications'`: payload `undefined` হলে default message বসে।

### `RequestStatus` pattern

`RequestStatus` হলো `frontend/src/shared/types.ts`-এর একটা enum:
```ts
export enum RequestStatus
{
    Idle = 'idle',
    Loading = 'loading',
    Succeeded = 'succeeded',
    Failed = 'failed',
}
```

প্রতিটা async কাজের জন্য slice-এ তিনটা জিনিস রাখা হয়: status, error আর data।
```ts
listStatus: RequestStatus;
listError: string | null;
items: JobApplication[];
```

Page এগুলো দেখে ঠিক করে কী দেখাবে। `ApplicationsPage.tsx` (সংক্ষেপে):
```tsx
<ErrorMessage message={listError} />

{listStatus === RequestStatus.Loading && items.length === 0 && <Spinner />}

{listStatus === RequestStatus.Succeeded && items.length === 0 && (
    <p>No applications found.</p>
)}

{items.length > 0 && <ApplicationsTable applications={items} ... />}
```

ফলাফল:

- `ErrorMessage` `listError` `null` হলে কিছুই render করে না (`null` return করে); error থাকলে লাল box-এ message দেখায়।
- Spinner দেখায় শুধু loading চলছে **আর** list খালি থাকলে, অর্থাৎ শুধু প্রথমবার। পরে filter বা page বদলালে নতুন load চলার সময় পুরনো table screen-এ থেকে যায়, spinner আসে না, তাই page লাফায় না।
- Load সফল কিন্তু list খালি হলে "No applications found."।
- List-এ কিছু থাকলে table।

### এক action, অনেক slice

`applications.slice.ts`:
```ts
.addCase(logoutUser.fulfilled, (): ApplicationsState => initialState)
```
`logoutUser` thunk থাকে auth feature-এ (`auth.thunks.ts`), কিন্তু applications slice-ও এটা handle করে। Logout-এর সময় এই reducer draft-এ হাত না দিয়ে সরাসরি `initialState` return করে (অধ্যায় ১০-এর Immer নিয়ম), তাই আগের user-এর সব application store থেকে মুছে যায়। যেকোনো slice যেকোনো action handle করতে পারে।

### Server-এর response দিয়ে list update রাখা

`applications.slice.ts`:
```ts
.addCase(updateApplication.fulfilled, (state, action): void =>
{
    state.items = state.items.map((item) => item.id === action.payload.id ? action.payload : item);
    if (state.selected?.id === action.payload.id)
    {
        state.selected = action.payload;
    }
})
.addCase(deleteApplication.fulfilled, (state, action): void =>
{
    state.items = state.items.filter((item) => item.id !== action.payload);
    if (state.selected?.id === action.payload)
    {
        state.selected = null;
    }
})
```

Table-এ "Not applied" badge-এ click করলে পুরো list আবার আনতে হয় না। Server update হওয়া application-টা response-এ ফেরত দেয়, আর `map` দিয়ে list-এর শুধু সেই row-টা বদলে দেওয়া হয়; বাকি row আগের মতো। Details page-এ খোলা application (`selected`) একই হলে সেটাও update হয়। Delete-এর ক্ষেত্রে `payload` হলো মুছে ফেলা `id`, আর `filter` সেই row বাদ দেয়।

### `isAnyOf`: কয়েকটা action-এ একই কাজ

Create আর update দুটোরই "saving" অবস্থা একই রকম। RTK-র `isAnyOf(...)` একটা matcher বানায়, যেটা দেওয়া action-গুলোর যেকোনোটা এলে `true` দেয়।

`applications.slice.ts`:
```ts
.addMatcher(isAnyOf(createApplication.pending, updateApplication.pending), (state): void =>
{
    state.saveStatus = RequestStatus.Loading;
    state.saveError = null;
})
.addMatcher(isAnyOf(createApplication.fulfilled, updateApplication.fulfilled), (state): void =>
{
    state.saveStatus = RequestStatus.Succeeded;
})
.addMatcher(isAnyOf(createApplication.rejected, updateApplication.rejected), (state, action): void =>
{
    state.saveStatus = RequestStatus.Failed;
    state.saveError = action.payload ?? 'Could not save the application';
});
```
ফলাফল: create বা update যেটাই হোক, শুরুতে `saveStatus` Loading, সফল হলে Succeeded, ব্যর্থ হলে Failed আর `saveError`-এ message।

দুটো নিয়ম মনে রাখো:

1. **`builder`-এ সব `addCase` আগে, তারপর `addMatcher`।** `addMatcher`-এর পরে `addCase` লিখলে RTK error throw করে।
2. **একটা action একটা case আর একটা matcher, দুটোর সাথেই মিললে দুটো reducer-ই চলে** (আগে case, তারপর matcher)। যেমন `updateApplication.fulfilled` এলে উপরের `addCase` (আগের অংশে দেখানো) list-এর row update করে, **আর** ঠিক উপরের fulfilled matcher `saveStatus` Succeeded করে।

---

## ১১.৬ Component-এ thunk-এর ফলাফল জানা: `unwrap` আর `match`

সাধারণত component শুধু dispatch করে, আর ফলাফল আসে store থেকে (`useAppSelector`)। কিন্তু মাঝে মাঝে **সফল হলেই** পরের কাজ করতে হয়, যেমন save সফল হলে details page-এ যাওয়া। এর জন্য `dispatch(thunk)`-এর return করা Promise ব্যবহার করা হয়।

মনে করো (১১.১): এই Promise কখনো reject হয় না। সফল হলে এর ফলাফল fulfilled action, আর ব্যর্থ হলে **rejected action**। দুইভাবে বোঝা যায় কোনটা হলো।

### `unwrap()`

`ApplicationFormPage.tsx`:
```tsx
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

**`.unwrap()`** Promise-টাকে বদলে দেয়: সফল হলে সরাসরি `payload` দেয় (এখানে save হওয়া `JobApplication`), আর ব্যর্থ হলে `rejectWithValue`-এ দেওয়া value (এখানে একটা message string) **throw** করে — Error object না, তাই `error.message` লেখা যাবে না। তাই সাধারণ try/catch লেখা যায়।

ফলাফল: সফল হলে `saved.id` দিয়ে details page-এ যাওয়া হয়। ব্যর্থ হলে `catch`-এ কিছু করার নেই, কারণ rejected matcher ইতিমধ্যে `saveError`-এ message বসিয়েছে, আর page সেটা `<ErrorMessage>`-এ দেখাচ্ছে।

### `.fulfilled.match()`

`ApplicationDetailsPage.tsx`:
```tsx
const result = await dispatch(deleteApplication(selected.id));
if (deleteApplication.fulfilled.match(result))
{
    void navigate(AppRoutes.Applications);
}
```

এখানে `result` হলো শেষ action: সফল হলে fulfilled action, ব্যর্থ হলে rejected action। `deleteApplication.fulfilled.match(result)` check করে `result` fulfilled action কিনা।

`match` একটা **type guard**: যে function `true` return করলে TypeScript ওই `if`-এর ভেতরে value-র type narrow করে (অধ্যায় ৪)। তাই `if`-এর ভেতরে TypeScript জানে `result` fulfilled action, আর `result.payload` নিরাপদে ব্যবহার করা যায়।

ফলাফল: delete সফল হলে list page-এ যাওয়া হয়; ব্যর্থ হলে কিছুই হয় না, user একই page-এ থাকে।

### কোনটা কখন?

| | `unwrap()` | `.fulfilled.match()` |
|---|---|---|
| ব্যর্থ হলে | `rejectWithValue`-এ দেওয়া value (message string) throw করে; Error object না, তাই `error.message` চলে না | `false` return করে |
| লিখতে হয় | try/catch | সাধারণ `if` |
| ভালো যখন | সফল হলে payload লাগবে, যেমন `saved.id` | শুধু "সফল হলো কিনা" জানলেই চলে |

---

## ১১.৭ পুরো যাত্রা: page খোলা থেকে table দেখা পর্যন্ত

```
① ApplicationsPage mount হলো
   useEffect → dispatch(loadApplications(filters))
   thunk middleware দেখে এটা function, তাই চালায়

② createAsyncThunk → dispatch({ type: 'applications/loadList/pending' })
   slice: listStatus = Loading
   page re-render → <Spinner /> (items এখনো খালি)

③ thunk-এর ভেতর: applicationsApi.getApplications(filters)
   → filtersToQuery + buildQueryString → "/applications?page=1&limit=10&..."
   → api.getPage → request('GET', ...) → fetch("/api/applications?...")
   → Vite dev server → backend (NestJS, localhost:3000) → database (PostgreSQL)

④ Server-এর response: { success: true, data: [...], meta: { page: 1, hasNext: true, ... } }
   → api.getPage return করে { items, meta }
   → thunk সেটা return করে

⑤ createAsyncThunk → dispatch({ type: '.../fulfilled', payload: { items, meta } })
   slice: listStatus = Succeeded, items = ..., meta = ...

⑥ useAppSelector দেখে state.applications বদলেছে → ApplicationsPage re-render
   → <ApplicationsTable applications={items} /> + <Pagination meta={meta} />
```

③-এ: development-এ Vite dev server `/api` দিয়ে শুরু হওয়া request backend-এ (`localhost:3000`) পাঠিয়ে দেয় (`vite.config.ts`-এর proxy setting)।

ব্যর্থ হলে ④-এ `api` একটা `ApiError` throw করে। তখন thunk-এর `catch` থেকে `rejectWithValue('...')` হয়, slice-এ `listStatus` Failed আর `listError`-এ message বসে, আর page-এ `<ErrorMessage>` দেখায়।

---

## সারসংক্ষেপ

- **Thunk** হলো async কাজ করার জন্য dispatch করা যায় এমন function। `configureStore`-এর thunk middleware function দেখলে সেটা চালায়, object দেখলে reducer-এ পাঠায়।
- `loadApplications(filters)` একটা **thunk action creator**: thunk function return করে। `createAsyncThunk` দিয়ে বানানো thunk dispatch করলে যে Promise আসে, সেটা কখনো reject হয় না।
- `createAsyncThunk` নিজেই **pending → fulfilled/rejected** action পাঠায়। `return` হয়ে যায় fulfilled-এর payload, আর `rejectWithValue` হয়ে যায় rejected-এর payload।
- Slice-এর **`extraReducers`**-এ `builder.addCase` একটা action ধরে, `builder.addMatcher` matcher দিয়ে কয়েকটা একসাথে ধরে (যেমন **`isAnyOf`**)। সব `addCase` আগে, `addMatcher` পরে।
- `RequestStatus` + error + data, এই তিনটা দিয়ে loading, error, empty আর data অবস্থা দেখানো হয়।
- Component-এ সফল হলেই কিছু করতে **`unwrap()`** (try/catch) বা **`.fulfilled.match()`** (type guard)।
- Layer তিনটা: **api → thunk → slice**।

## ইন্টারভিউ প্রশ্ন

**প্রশ্ন: Redux-এ async কাজ কোথায় করো? reducer-এ কেন নয়?**
উত্তর: Thunk-এ। Thunk হলো একটা function, যেটা dispatch করা যায়; thunk middleware সেটা চালায়, আর ভেতরে server call করে শেষে সাধারণ action dispatch করা যায়। Reducer-এ করা যায় না, কারণ reducer pure আর synchronous হতে হয়: একই input-এ একই output, কোনো side effect না। Server call একটা side effect, আর তার ফলাফল পরে আসে, তাই reducer-এর নিয়ম ভাঙে।

**প্রশ্ন: createAsyncThunk কোন কোন action পাঠায়?**
উত্তর: তিনটা। কাজ শুরু হলে `pending`। সফল হলে `fulfilled`, যার payload হলো async function-এর return value। ব্যর্থ হলে `rejected`; `rejectWithValue` ব্যবহার করলে তার value payload-এ থাকে, আর না করলে payload `undefined` হয় এবং error-এর তথ্য থাকে `action.error`-এ।

**প্রশ্ন: reducers আর extraReducers-এর পার্থক্য কী?**
উত্তর: `reducers`-এর প্রতিটা key থেকে slice একটা reducer আর একই নামের action creator বানায়; এগুলো slice-এর নিজের action। `extraReducers` নতুন action creator বানায় না; এটা slice-এর বাইরে তৈরি হওয়া action handle করে, যেমন thunk-এর pending/fulfilled/rejected বা অন্য slice-এর action। এখানে `builder.addCase` দিয়ে একটা নির্দিষ্ট action, আর `builder.addMatcher` দিয়ে শর্ত মেলা কয়েকটা action ধরা হয়।

**প্রশ্ন: unwrap() কী করে?**
উত্তর: `createAsyncThunk` দিয়ে বানানো thunk dispatch করলে যে Promise আসে, সেটা কখনো reject হয় না; ব্যর্থ হলেও rejected action দিয়ে fulfilled হয়। `unwrap()` সেটাকে সাধারণ Promise-এর মতো বানায়: সফল হলে সরাসরি payload দেয়, ব্যর্থ হলে `rejectWithValue`-এ দেওয়া value (এখানে একটা message string) throw করে — Error object না, তাই `error.message` লেখা যাবে না। ফলে try/catch দিয়ে সফল হলে পরের কাজ, যেমন অন্য page-এ যাওয়া, আর ব্যর্থ হলে আলাদা কাজ করা যায়।

**প্রশ্ন: Loading আর error state কীভাবে সামলাও?**
উত্তর: প্রতিটা async কাজের জন্য slice-এ একটা `status` রাখি, যার value idle, loading, succeeded বা failed, সাথে একটা `error` আর আসল data। Thunk-এর pending-এ status loading আর error null করি, fulfilled-এ succeeded আর data বসাই, rejected-এ failed আর error message বসাই। UI status আর data দেখে ঠিক করে spinner, error message, empty message না data দেখাবে।

**প্রশ্ন: Race condition কী? কীভাবে এড়াবে?**
উত্তর: Race condition হলো যখন একাধিক async কাজ চলে, আর কোনটা আগে শেষ হবে তার উপর ফলাফল নির্ভর করে। যেমন user দ্রুত দুইবার filter বদলাল, দুটো request গেল, কিন্তু প্রথমটার response পরে এসে দ্বিতীয়টার ফলাফল overwrite করে দিল; screen-এ পুরনো filter-এর data দেখা গেল। এড়ানোর উপায়:
- Debounce দিয়ে request-এর সংখ্যা কমানো (আমাদের search-এ করা হয়েছে)।
- `requestId` মিলিয়ে দেখা: createAsyncThunk প্রতিটা thunk call-কে একটা unique id দেয়, যেটা `action.meta.requestId`-এ থাকে। Slice-এ সর্বশেষ request-এর id রেখে, শুধু সেই id-র fulfilled action গ্রহণ করা যায়।
- AbortController দিয়ে পুরনো request বাতিল করা: এটা browser-এর একটা API, যেটা দিয়ে চলমান fetch বাতিল করা যায়। নতুন request পাঠানোর আগে পুরনোটা বাতিল করলে তার response আর আসে না।

**প্রশ্ন: RTK Query বা TanStack Query কী? কখন ব্যবহার করবে?**
উত্তর: এগুলো server-এর data আনার কাজ automate করার library। এরা loading আর error state নিজে রাখে, আর data **cache** করে, মানে একবার আনা data memory-তে রেখে দেয়, যাতে একই data আবার লাগলে server-এ না গিয়েই সাথে সাথে দেখানো যায়। দরকার হলে পেছনে আবার এনে update-ও করে (refetch)। বড় app-এ এগুলো slice আর thunk-এর বাড়তি কোড অনেক কমায়। শেখার জন্য createAsyncThunk ভালো, কারণ pending, fulfilled আর rejected-এ ভেতরে কী হচ্ছে স্পষ্ট দেখা যায়।
