import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './components/App'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AdminDashboard from './components/Admin/AdminDashboard';
import ArticleEdit from './components/Article/ArticleEdit';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/article/:id",
    element: <App />
  },
  {
    path: "/admin",
    element: <AdminDashboard />
  },
  {
    path: "/article/edit/:id",
    element: <ArticleEdit />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
