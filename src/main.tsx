import { createRoot } from 'react-dom/client';
import 'flowbite';
import './style.css';
import { App } from './app/App';

createRoot(document.getElementById('root')!).render(<App />);
