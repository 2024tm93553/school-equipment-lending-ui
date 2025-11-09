import './App.css'
import HeaderComponent from './components/HeaderComponent'
import FooterComponent from './components/FooterComponent'
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import RegisterComponent from './components/RegisterComponent'
import LoginComponent from './components/LoginComponent'
import { isUserLoggedIn } from './services/AuthService'
import EquipmentListComponent from "../srcNew/components/EquipmentListComponent";
import EquipmentFormComponent from "../srcNew/components/EquipmentFormComponent";

function App() {

  function AuthenticatedRoute({children}){

    const isAuth = isUserLoggedIn();

    if(isAuth) {
      return children;
    }
    return <Navigate to="/" />

  }

  return (
    <>
    <BrowserRouter>
        <HeaderComponent />
          <Routes>
              <Route path='/' element = { <LoginComponent /> }></Route>

              <Route path='/equipment' element = {
                  <AuthenticatedRoute>
                      <EquipmentListComponent />
                  </AuthenticatedRoute>
              }></Route>

              <Route path='/add-equipment' element = {
                  <AuthenticatedRoute>
                      <EquipmentFormComponent />
                  </AuthenticatedRoute>
              }></Route>

              <Route path='/edit-equipment/:id' element = {
                  <AuthenticatedRoute>
                      <EquipmentFormComponent />
                  </AuthenticatedRoute>
              }></Route>


              <Route path='/register' element = { <RegisterComponent />}></Route>
               <Route path='/login' element = { <LoginComponent /> }></Route>
          </Routes>
        <FooterComponent />
        </BrowserRouter>
    </>
  )
}

export default App
