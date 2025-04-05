


import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import store from './store/store' 
import App from "./App"
import {Login,SignUp,Chat} from "./components/index"
import "./index.css";



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
        {
            path: "/",
            element: <Chat />,
        },
        {
            path: "/login",
            element: (
                
                    <Login />
               
            ),
        },
        {
            path: "/signup",
            element: (
              
                    <SignUp />
              
            ),
        },
        {
            path: "/history",
            element: (
                
                    
                    <History />
            ),
        },
      
      
        {
            path: "/:id",
            element: <Chat/>,
        },
    ],
},
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>
  </React.StrictMode>,
)