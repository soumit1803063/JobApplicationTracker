import { AppRouter } from '@/app/AppRouter';
import { store } from '@/app/store';
import { restoreSession } from '@/features/auth/auth.thunks';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import '@/index.css';

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
