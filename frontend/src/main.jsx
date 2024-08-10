import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import App from './components/App.jsx';
import Home  from './components/Home';
import Workspace from './components/Workspace.jsx';
import SignUp from './components/SignUp.jsx';
import Login from './components/Login.jsx';
import Form from './components/Form.jsx';

import './Css/index.css';

const routes= createBrowserRouter([
  {
    path:'/',
    element:<App/>,
    children:[
      {
        path:'/',
        element:<Home/>, 
      },
      {
        path: '/workspace',
        element: <Workspace />,
        children: [
          {
            path: 'form',
            element: <Form/>,
          },
        ],
      },
      {
        path:'/signUp',
        element:<SignUp/>,
      },
      {
        path:'/login',
        element:<Login/>,
      },

    ]
  }

])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={routes}/>   
  </React.StrictMode>,
  
)
