import './App.css'
import { SessionProvider } from './context/SessionContext'
import router from './routes'
import { RouterProvider } from 'react-router-dom'
function App() {

  return (
    <div className='bg-slate-900 h-screen'>
      <div className='flex justify-center items-center h-screen'>
        <SessionProvider>
          <RouterProvider router={router} />
        </SessionProvider>

      </div>
    </div>
  )
}

export default App
