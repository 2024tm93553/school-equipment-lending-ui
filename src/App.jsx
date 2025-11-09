import './App.css'
import './components/animations.css'
import HeaderComponent from './components/HeaderComponent'
import FooterComponent from './components/FooterComponent'
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import RegisterComponent from './components/RegisterComponent'
import LoginComponent from './components/LoginComponent'
import { isUserLoggedIn } from './services/AuthService'
import EquipmentListComponent from "../src/components/EquipmentListComponent";
import EquipmentFormComponent from "../src/components/EquipmentFormComponent";
import BorrowRequestFormComponent from "../src/components/BorrowRequestFormComponent";
import MyRequestsComponent from "../src/components/MyRequestsComponent";
import AdminRequestsComponent from "../src/components/AdminRequestsComponent";

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

              <Route path='/borrow-request' element = {
                  <AuthenticatedRoute>
                      <BorrowRequestFormComponent />
                  </AuthenticatedRoute>
              }></Route>

              <Route path='/my-requests' element = {
                  <AuthenticatedRoute>
                      <MyRequestsComponent />
                  </AuthenticatedRoute>
              }></Route>

              <Route path='/admin-requests' element = {
                  <AuthenticatedRoute>
                      <AdminRequestsComponent />
                  </AuthenticatedRoute>
              }></Route>

          </Routes>
        <FooterComponent />
        </BrowserRouter>
    </>
  )
}

export default App
