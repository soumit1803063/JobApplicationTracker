# অধ্যায় ১২: Authentication — login থেকে logout

এই অধ্যায়ে দেখব একজন user কীভাবে account খোলে, login করে, page refresh করলেও login থেকে যায়, আর logout করে। সাথে দেখব security-র কিছু শব্দ, যেগুলো interview-তে প্রায়ই আসে।

---

## ১২.১ Authentication-এর মূল ধারণা

- **Authentication** মানে "তুমি কে?" প্রমাণ করা। যেমন email আর password দিয়ে login করা।
- **Authorization** মানে "তুমি কী করতে পারবে?" ঠিক করা। যেমন আমাদের app-এ login করা user শুধু নিজের application দেখতে পারে, অন্যের application দেখতে পারে না।

HTTP নিজে আগের request-এর কথা কিছু মনে রাখে না। প্রতিটা request server-এর কাছে একদম নতুন আর আলাদা। এই স্বভাবকে বলে **stateless**। তাহলে server কীভাবে জানবে কোন request কে পাঠাচ্ছে? উত্তর হলো **token**: একটা লম্বা string, যেটা browser প্রতিটা request-এর সাথে পাঠায়, আর server সেটা দেখে user চেনে।

### JWT (JSON Web Token)

আমাদের project-এ token হলো **JWT**। এর পুরো যাত্রা এরকম:

1. login সফল হলে server একটা token দেয়, যার নাম **access token**। দেখতে এরকম: `eyJhbGciOiJIUzI1NiIs...`
2. token-টা তিন ভাগে ভাগ করা, মাঝে dot (`.`) দিয়ে: `header.payload.signature`। এখানে header মানে token-এর প্রথম অংশ (কোন algorithm দিয়ে sign করা, সেই তথ্য)। এটা HTTP header না; HTTP header হলো request-এর সাথে যাওয়া বাড়তি তথ্য (অধ্যায় ১.৪)।
3. browser token রেখে দেয়, আর প্রতিটা request-এর সাথে header-এ পাঠায়:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
   ```
4. server signature verify করে, তারপর payload থেকে বোঝে request-টা কোন user-এর।

### Payload-এ কী থাকে, আর কে পড়তে পারে?

**Payload** হলো token-এর মাঝের অংশ, যেখানে user-এর তথ্য থাকে। এটা **base64** দিয়ে লেখা। base64 হলো যেকোনো data-কে শুধু অক্ষর আর সংখ্যা দিয়ে লেখার একটা পদ্ধতি। এটা encryption না। যে কেউ token হাতে পেলে base64 decode করে payload পড়ে ফেলতে পারে।

আমাদের backend (`backend/jat/src/auth/services/auth.service.ts`) payload-এ রাখে এগুলো:

```json
{
    "sub": "3f6c2a1e-8b7d-4c2f-9a10-5e2b7c9d1f04",
    "email": "rahim@example.com",
    "iat": 1760170000,
    "exp": 1760256400
}
```

| Field | মানে |
|---|---|
| `sub` | "subject", মানে token-টা কার। এখানে user-এর id, যেটা একটা **UUID** string (practically unique একটা লম্বা random id) |
| `email` | user-এর email |
| `iat` | token কখন তৈরি হয়েছে (issued at), সেকেন্ডে |
| `exp` | token কখন **expired** হবে, সেকেন্ডে |

তাহলে কেউ payload বদলে অন্যের `sub` বসিয়ে দিলে কী হবে? এখানেই **signature** কাজে আসে। server একটা **secret key** দিয়ে header আর payload-কে **sign** করে, আর ফলাফলটা token-এর শেষ অংশে বসায়। secret key শুধু server জানে। payload-এর একটা অক্ষর বদলালেও signature আর মেলে না, তাই server token-টা **invalid** বলে ফিরিয়ে দেয়।

দুটো জিনিস মনে রাখো:
- JWT পড়া যায়, কিন্তু বদলানো যায় না। তাই password বা অন্য গোপন তথ্য কখনো JWT-তে রাখা যাবে না।
- আমাদের token ১ দিন চলে। backend-এর config-এ `JWT_EXPIRES_IN=86400` (৮৬,৪০০ সেকেন্ড = ২৪ ঘণ্টা)। এরপর token expired হয়ে যায়, আর আবার login করতে হয়।

---

## ১২.২ Auth feature-এর file-গুলো

```
features/auth/
├── auth.types.ts      ← User, LoginRequest, RegisterRequest, AuthResponse, AuthState
├── auth.api.ts        ← login, register, getCurrentUser
├── auth.thunks.ts     ← restoreSession, loginUser, registerUser, logoutUser
├── auth.slice.ts      ← user, isSessionChecked, status, error
├── LoginPage.tsx
├── RegisterPage.tsx
└── ProtectedRoute.tsx
```

### State

`auth.types.ts`:
```ts
export interface AuthState
{
    user: User | null;
    isSessionChecked: boolean;
    status: RequestStatus;
    error: string | null;
}
```

| Field | মানে |
|---|---|
| `user` | login করা user, অথবা `null` |
| `isSessionChecked` | app খোলার পরে "আগে থেকে login আছে কিনা" check শেষ হয়েছে কিনা |
| `status`, `error` | login বা register চলছে, সফল, নাকি ব্যর্থ (অধ্যায় ১১-এর RequestStatus pattern) |

---

## ১২.৩ Token কোথায় রাখা হয়: `localStorage`

**`localStorage`** হলো browser-এর একটা ছোট key-value storage। এখানে রাখা data page বন্ধ করে আবার খুললেও থেকে যায়। এ ধরনের storage-কে বলে **persistent storage**। আমাদের token-এর key হলো `'jat.accessToken'` (`shared/constants.ts`-এর `TOKEN_STORAGE_KEY`)।

`frontend/src/shared/api.ts`-এ তিনটা ছোট helper:
```ts
export function getToken(): string | null
{
    return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function saveToken(token: string): void
{
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearToken(): void
{
    localStorage.removeItem(TOKEN_STORAGE_KEY);
}
```
`getToken` token পড়ে (না থাকলে `null` দেয়), `saveToken` token লেখে, আর `clearToken` token মুছে দেয়।

প্রতিটা request-এ token যোগ করে একই file-এর `request` function (সংক্ষেপে):
```ts
const token = getToken();
if (token)
{
    headers.Authorization = `Bearer ${token}`;
}
```
token থাকলে header-এ `Authorization: Bearer ...` বসে যায়। না থাকলে header ছাড়াই request যায়।

---

## ১২.৪ Login-এর পুরো যাত্রা

### (১) Page: `LoginPage.tsx`
```tsx
function handleSubmit(event: SubmitEvent<HTMLFormElement>): void
{
    event.preventDefault();
    void dispatch(loginUser({ email, password }));
}
```
form submit হলে browser-এর reload থামানো হয়, তারপর `loginUser` thunk dispatch হয়।

### (২) Thunk: `auth.thunks.ts`
```ts
export const loginUser = createAppAsyncThunk<User, LoginRequest>(
    'auth/login',
    async (request, { rejectWithValue }) =>
    {
        try
        {
            const { accessToken } = await authApi.login(request);
            saveToken(accessToken);
            return await authApi.getCurrentUser();
        }
        catch (error: unknown)
        {
            clearToken();
            return rejectWithValue(getErrorMessage(error));
        }
    },
);
```
1. `POST /api/auth/login`-এ server ফেরত দেয় `{ accessToken }`।
2. token `localStorage`-এ রাখা হয়।
3. `GET /api/auth/me`-এ (এবার token সহ) server দেয় user-এর তথ্য।
4. user return করা হয়, যেটা `fulfilled` action-এর payload হয়।
5. কোনো ধাপ ব্যর্থ হলে token মুছে error message দিয়ে `rejected` হয়।

### (৩) Slice: `auth.slice.ts`
```ts
.addMatcher(isAnyOf(loginUser.pending, registerUser.pending), (state): void =>
{
    state.status = RequestStatus.Loading;
    state.error = null;
})
.addMatcher(isAnyOf(loginUser.fulfilled, registerUser.fulfilled), (state, action): void =>
{
    state.status = RequestStatus.Succeeded;
    state.user = action.payload;
    state.isSessionChecked = true;
})
.addMatcher(isAnyOf(loginUser.rejected, registerUser.rejected), (state, action): void =>
{
    state.status = RequestStatus.Failed;
    state.error = action.payload ?? 'Something went wrong';
})
```
login আর register-এর action একই ভাবে সামলানো হয়, তাই `isAnyOf` দিয়ে দুটোকে একসাথে ধরা হয়েছে (অধ্যায় ১১)। fulfilled হলে `user` বসে যায়।

### (৪) আবার page: সফল হলে নিজে থেকেই অন্য page-এ
```tsx
const { user, status, error } = useAppSelector((state) => state.auth);

if (user)
{
    return <Navigate to={redirectPathFrom(location.state)} replace />;
}
```
`user` set হলে LoginPage re-render হয়, আর সাথে সাথে applications page-এ (বা user আগে যে page-এ যেতে চাইছিল সেখানে) চলে যায়। কোথাও `navigate()` call করতে হয়নি। state বদলেছে, তাই UI নিজে বদলে গেছে। এটাই **UI = f(state)**।

- Loading-এর সময়: `<Button isLoading={status === RequestStatus.Loading}>`, তাই button **disabled** থাকে (click করা যায় না) আর লেখা দেখায় "Please wait..."।
- ব্যর্থ হলে: `<ErrorMessage message={error} />` দেখায় "Invalid email or password"।

### Register

একই পথ, শুধু request যায় `POST /api/auth/register`-এ। register সফল হলেই user login হয়ে যায়, কারণ server register-এর response-এই token দিয়ে দেয়।

---

## ১২.৫ Page refresh করলে login থাকে কীভাবে: `restoreSession`

Refresh করলে পুরো app আবার শুরু হয়, আর Redux store খালি হয়ে যায় (`user = null`)। কিন্তু token তো `localStorage`-এ রয়ে গেছে। সেটা দিয়েই user ফিরিয়ে আনা হয়।

`main.tsx`:
```tsx
void store.dispatch(restoreSession());

createRoot(rootElement).render(
    <StrictMode>
        <Provider store={store}>
            <AppRouter />
        </Provider>
    </StrictMode>,
);
```
এখানে একটা জিনিস খেয়াল করো। `dispatch` শুধু কাজটা **শুরু** করে। `/auth/me` request-এর উত্তর আসতে সময় লাগে, কিন্তু app সেটার জন্য অপেক্ষা করে না। `void` লেখা হয়েছে এটা বোঝাতে যে Promise-টার জন্য ইচ্ছা করেই অপেক্ষা করা হচ্ছে না (অধ্যায় ৩)। তাই পরের লাইনের `render` সাথে সাথেই চলে।

তাহলে render-এর মুহূর্তে আমরা জানি না user login আছে কিনা। এই ফাঁকটা ঢাকতেই `isSessionChecked` আছে। check শেষ না হওয়া পর্যন্ত এটা `false` থাকে, আর `ProtectedRoute` (অধ্যায় ৯) তখন spinner দেখায়। check শেষ হলে এটা `true` হয়, তখন ProtectedRoute হয় page দেখায়, নয়তো login-এ পাঠায়।

`auth.thunks.ts`:
```ts
export const restoreSession = createAppAsyncThunk<User | null, undefined>('auth/restoreSession', async () =>
{
    if (!getToken())
    {
        return null;
    }
    try
    {
        return await authApi.getCurrentUser();
    }
    catch
    {
        clearToken();
        return null;
    }
});
```

দ্বিতীয় type `undefined` মানে এই thunk কোনো argument নেয় না। তাই `main.tsx`-এ `restoreSession()` খালি call করা হয়, আর `async () =>`-এর parentheses-ও খালি (বিস্তারিত অধ্যায় ১৪.৬-এর ধাপ ৫)।

| পরিস্থিতি | কী হয় |
|---|---|
| token নেই | সাথে সাথে `null`, মানে login নেই |
| token আছে আর valid | `/auth/me` থেকে user আসে, login ফিরে এলো |
| token আছে কিন্তু expired বা invalid | server দেয় 401। token থাকা অবস্থায় 401 এসেছে, তাই `request`-এর 401 handler (১২.৬) token মুছে `/login`-এ reload করে। thunk-এর `catch`-ও token মুছে `null` দেয় |
| server বন্ধ বা network নেই | `catch` এখানেও token মুছে দেয়, তাই user-কে আবার login করতে হয় |

শেষ row-টা একটা trade-off। server সাময়িক বন্ধ থাকলেও token মুছে যায়, যদিও token-টা হয়তো ঠিকই ছিল। ভালো সমাধান হতো error-এর ধরন দেখে শুধু 401-এ token মোছা। কিন্তু code সহজ রাখতে এই project-এ যেকোনো error-এ token মোছা হয়।

Slice:
```ts
.addCase(restoreSession.fulfilled, (state, action): void =>
{
    state.user = action.payload;
    state.isSessionChecked = true;
})
```
thunk কখনো reject হয় না (error হলেও `null` return করে), তাই শুধু `fulfilled` সামলালেই চলে। যেকোনো ক্ষেত্রেই শেষে `isSessionChecked = true` হয়।

---

## ১২.৬ Token expired হলে: 401 সামলানো

ধরো app খোলা আছে, আর মাঝে token expired হয়ে গেল। পরের request-এ server দেয় **401 Unauthorized**। `shared/api.ts`-এর `request` function-এ (সংক্ষেপে):
```ts
if (response.status === 401 && token)
{
    clearToken();
    window.location.assign(AppRoutes.Login);
}
```
token মুছে login page-এ পাঠানো হয়।

- `window.location.assign` পুরো page নতুন করে load করে, তাই Redux-এর সব পুরনো state মুছে যায়। এটা সবচেয়ে সহজ আর নিশ্চিত উপায়।
- **`&& token`** কেন? ভুল password দিয়ে login করলেও server 401 দেয়। তখন সাধারণত token থাকে না, তাই redirect হয় না। শুধু error message দেখায়।

---

## ১২.৭ Logout

```ts
export const logoutUser = createAppAsyncThunk('auth/logout', (): void =>
{
    clearToken();
});
```
এখানে কোনো server call নেই, function-টা async-ও না। তবুও এটা thunk কেন, সাধারণ reducer না কেন?

1. `clearToken()` `localStorage` বদলায়। এটা একটা **side effect** (function-এর বাইরের কিছু বদলানো)। reducer pure হতে হয়, তাই reducer-এর ভেতরে এটা রাখা যায় না (অধ্যায় ১০)।
2. `createAsyncThunk` function sync হলেও `pending` আর `fulfilled` action পাঠায়। ফলে আমরা একটা `logoutUser.fulfilled` action পাই।
3. সেই একটা action দুটো slice শোনে:
   - **auth slice:** `user = null`, `status = Idle`।
   - **applications slice:** সবকিছু `initialState`-এ ফিরিয়ে দেয়, যাতে পরের user আগের জনের application না দেখে।

`user` null হলো, তাই `ProtectedRoute` নিজে থেকেই `/login`-এ পাঠিয়ে দেয়।

Navbar-এর button, `app/AppLayout.tsx`-এ (সংক্ষেপে):
```tsx
<button
    type="button"
    onClick={(): void =>
    {
        void dispatch(logoutUser());
    }}
>
    Log out
</button>
```
click করলে token মুছে যায়, দুই slice reset হয়, আর user login page-এ পৌঁছে যায়।

---

## ১২.৮ Security নিয়ে কিছু কথা (interview-তে প্রায়ই আসে)

| বিষয় | ব্যাখ্যা |
|---|---|
| **localStorage-এ token** | সহজ, কিন্তু page-এ কেউ নিজের JavaScript চালাতে পারলে (XSS) `localStorage` পড়ে token চুরি করতে পারে। বিকল্প হলো httpOnly cookie, যেটা JavaScript পড়তে পারে না। |
| **XSS ঠেকানো** | React `{text}`-কে সবসময় escape করে, মানে HTML হিসেবে চালায় না। ঝুঁকি শুধু `dangerouslySetInnerHTML`-এ। আমাদের server rich-text mail-টা save করার আগে `sanitize-html` দিয়ে sanitize করে (অধ্যায় ১৩.৫)। |
| **Frontend check যথেষ্ট না** | frontend-এর যেকোনো check এড়ানো যায় (কেউ সরাসরি API call করতে পারে)। আসল security server-এ: আমাদের backend প্রতিটা request-এ token verify করে, আর শুধু নিজের application দেখায়। |
| **ProtectedRoute** | শুধু UI লুকায়, এটা security না। data-র security server-এর দায়িত্ব। |

### Security-র শব্দগুলো

| শব্দ | মানে |
|---|---|
| **Cookie** | server-এর পাঠানো ছোট একটা data, যেটা browser রেখে দেয়, আর ওই server-এ প্রতিটা request-এর সাথে নিজে থেকেই পাঠায়। JavaScript-কে কিছু করতে হয় না। |
| **httpOnly cookie** | এমন cookie, যেটা JavaScript (`document.cookie`) পড়তে পারে না। browser শুধু request-এর সাথে পাঠায়। তাই XSS হলেও script token চুরি করতে পারে না। |
| **XSS (Cross-Site Scripting)** | অন্য কারো লেখা JavaScript তোমার page-এ চলে যাওয়া। যেমন কেউ নিজের নামের জায়গায় `<script>...</script>` লিখল, আর page সেটা HTML হিসেবে চালিয়ে দিল। |
| **Escape** | `<`, `>`-এর মতো বিশেষ অক্ষরকে সাধারণ লেখা হিসেবে দেখানো, যাতে browser সেগুলোকে tag ভাবে না। React এটা নিজে থেকেই করে। |
| **Sanitize** | HTML থেকে বিপজ্জনক অংশ (`<script>`, `onclick` ইত্যাদি) মুছে শুধু নিরাপদ tag রাখা। |
| **CSRF (Cross-Site Request Forgery)** | অন্য একটা website তোমার browser দিয়ে গোপনে তোমার site-এ request পাঠায়। cookie নিজে থেকেই যায়, তাই server ভাবে request-টা তুমিই পাঠিয়েছ। cookie ব্যবহার করলে এই ঝুঁকি আসে। আমাদের token header-এ হাতে পাঠানো হয়, তাই এই ঝুঁকি কম। |
| **SameSite** | cookie-র একটা setting। `SameSite=Lax` বা `Strict` দিলে অন্য site থেকে আসা request-এ browser cookie পাঠায় না। CSRF ঠেকানোর প্রধান উপায়। |
| **Refresh token** | একটা আলাদা, দীর্ঘ মেয়াদের token। access token অল্প সময় (যেমন ১৫ মিনিট) চলে। সেটা expired হলে refresh token দিয়ে চুপচাপ নতুন access token আনা হয়, user-কে আবার login করতে হয় না। সাধারণত refresh token httpOnly cookie-তে রাখা হয়। আমাদের project-এ refresh token নেই। |
| **Server-side session** | JWT-এর পুরনো বিকল্প। login হলে server নিজের database বা memory-তে "এই session id = এই user" লিখে রাখে, আর browser-কে শুধু session id দেয় (সাধারণত cookie-তে)। প্রতিটা request-এ server নিজের রেকর্ড খুঁজে user চেনে। |

**JWT-কে "stateless" বলে কেন?** JWT-তে server কোনো session রেকর্ড রাখে না। user-এর তথ্য token-এর ভেতরেই থাকে, আর signature verify করলেই server user চিনে ফেলে। এই "stateless" আর ১২.১-এর "HTTP stateless" আলাদা জিনিস। HTTP stateless মানে protocol নিজে request-গুলোর মাঝে কিছু মনে রাখে না। JWT stateless মানে server-কেও login-এর কোনো রেকর্ড মনে রাখতে হয় না।

---

## সারসংক্ষেপ
- Authentication মানে "তুমি কে", Authorization মানে "তুমি কী করতে পারবে"।
- login সফল হলে server **JWT access token** দেয়। payload-এ `sub` (user id), `email` আর মেয়াদ থাকে। payload পড়া যায়, কিন্তু secret key দিয়ে sign করা, তাই বদলানো যায় না। token ১ দিন চলে।
- token `localStorage`-এ থাকে, আর প্রতিটা request-এ `Authorization: Bearer ...` হিসেবে যায়।
- `loginUser` আর `registerUser` token রাখে, তারপর `/auth/me` থেকে user আনে।
- `restoreSession` app শুরুতে শুধু কাজ শুরু করে, render অপেক্ষা করে না। তাই check শেষ না হওয়া পর্যন্ত `isSessionChecked = false` থাকে আর ProtectedRoute spinner দেখায়।
- token থাকা অবস্থায় 401 এলে token মুছে login-এ reload হয়।
- `logoutUser` thunk কারণ token মোছা একটা side effect, আর এর `fulfilled` action auth আর applications দুই slice reset করে।
- frontend-এর security শুধু UI-এর জন্য, আসল security server-এ।

## ইন্টারভিউ প্রশ্ন

**প্রশ্ন: Authentication আর Authorization-এর পার্থক্য কী?**
উত্তর: Authentication প্রমাণ করে তুমি কে। যেমন email আর password দিয়ে login। Authorization ঠিক করে login করার পরে তুমি কী করতে পারবে। যেমন আমার project-এ login করা user শুধু নিজের application দেখতে পারে। কেউ অন্যের application-এর id দিয়ে request করলে server 404 দেয়।

**প্রশ্ন: JWT কী? কীভাবে কাজ করে?**
উত্তর: JWT হলো তিন ভাগের একটা token: header, payload, signature। payload-এ user-এর তথ্য থাকে, যেমন আমার project-এ `sub` (user-এর UUID), `email` আর `exp` (কখন expired হবে)। server একটা secret key দিয়ে token sign করে। client প্রতিটা request-এ `Authorization: Bearer <token>` header পাঠায়, server signature verify করে user চেনে। payload base64-এ লেখা, encrypt করা না, তাই যে কেউ পড়তে পারে। কিন্তু বদলালে signature মেলে না। তাই JWT-তে কখনো password বা গোপন তথ্য রাখি না। server-কে কোনো session রেকর্ড রাখতে হয় না, এজন্য একে stateless বলে।

**প্রশ্ন: Token কোথায় রাখবে: localStorage নাকি cookie?**
উত্তর:
- localStorage সহজ, আমার project-এ এটাই ব্যবহার করেছি। কিন্তু XSS হলে, মানে অন্য কারো JavaScript page-এ চললে, সেটা localStorage পড়ে token চুরি করতে পারে।
- httpOnly cookie JavaScript পড়তে পারে না, তাই XSS থেকে বেশি নিরাপদ। কিন্তু cookie browser নিজে থেকে পাঠায়, তাই CSRF-এর ঝুঁকি আসে, মানে অন্য site আমার browser দিয়ে request পাঠাতে পারে। এটা ঠেকাতে cookie-তে `SameSite=Lax/Strict` দিই, অথবা আলাদা CSRF token ব্যবহার করি।
- বেশি security চাইলে সাধারণ pattern হলো: অল্প মেয়াদের access token memory-তে, আর দীর্ঘ মেয়াদের refresh token httpOnly cookie-তে।

**প্রশ্ন: Refresh করলে login ধরে রাখো কীভাবে?**
উত্তর: token persistent storage-এ (localStorage বা cookie) রাখি। app শুরুতে `restoreSession` thunk dispatch করি। token থাকলে সেটা `/auth/me` call করে user আনে। dispatch শুধু কাজ শুরু করে, render অপেক্ষা করে না। তাই `isSessionChecked` নামে একটা flag রাখি, check শেষ না হওয়া পর্যন্ত এটা false, আর তখন protected page-এ spinner দেখাই। না রাখলে refresh-এর মুহূর্তে user null দেখে app ভুল করে login page-এ পাঠিয়ে দিত।

**প্রশ্ন: Token expired হলে কী করো?**
উত্তর: server 401 দিলে, আর request-এ token থাকলে, token মুছে `window.location.assign` দিয়ে login page-এ পাঠাই। পুরো reload হয় বলে পুরনো সব state মুছে যায়। token না থাকা অবস্থায় 401 মানে সাধারণত ভুল password, তখন redirect না করে শুধু error দেখাই। আরও ভালো উপায় হলো refresh token: access token expired হলে refresh token দিয়ে চুপচাপ নতুন access token এনে request আবার পাঠানো, যাতে user-কে আবার login করতে না হয়।

**প্রশ্ন: Logout-এ কোনো API call নেই, তবুও thunk কেন?**
উত্তর: logout-এ `localStorage` থেকে token মুছতে হয়, এটা side effect। reducer pure হতে হয়, তাই সেখানে রাখা যায় না। thunk-এ রাখলে `createAsyncThunk` sync function-এর জন্যও `logoutUser.fulfilled` action পাঠায়। সেই একটা action-এ auth slice user null করে, আর applications slice নিজের state reset করে, যাতে পরের user আগের জনের data না দেখে।

**প্রশ্ন: Frontend route guard কি security দেয়?**
উত্তর: না, শুধু user experience (UX) ভালো করে। যে কেউ browser-এর DevTools দিয়ে code বদলে বা সরাসরি API call করে UI এড়াতে পারে। data-র security server-এ নিশ্চিত করতে হয়: প্রতিটা request-এ token verify করা, আর শুধু ওই user-এর data ফেরত দেওয়া।
