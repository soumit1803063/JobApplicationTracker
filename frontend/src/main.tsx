import App from '@/App';
import { store } from '@/app/store';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import '@/index.css';

const rootElement = document.getElementById('root');
if (!rootElement)
{
    throw new Error('Root element #root not found in index.html');
}

createRoot(rootElement).render(
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>,
);
