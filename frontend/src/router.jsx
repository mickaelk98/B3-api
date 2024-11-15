import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Homepage from './pages/Homepage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <Homepage />,
            },
            {
                path: '/login',
                element: <Login />,
            },
            {
                path: "/signup",
                element: <Signup />,
            },
            {
                path: "/chat",
                element: <Chat />,
            },
        ],
    },
]);