import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { store } from './app/store'
import { Provider } from 'react-redux'
import { initializeInterceptors } from './services/api.ts'

initializeInterceptors(store);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
     <App />
    </Provider>
    
  </StrictMode>,
)
