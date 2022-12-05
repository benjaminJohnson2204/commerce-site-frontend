import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import "./App.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import EnsureAuthenticated from "./components/EnsureAuthenticated";
import RugPage from "./pages/RugPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderPage from "./pages/OrderPage";
import EnsureAdmin from "./components/EnsureAdmin";
import AddRugPage from "./pages/AddRugPage";

function App() {
  return (
    <CookiesProvider>
      <BrowserRouter>
        <Routes>
          <Route path='*' element={<NotFoundPage />} />
          <Route path='/' element={<HomePage />} />
          <Route
            path='profile'
            element={<EnsureAuthenticated page={<ProfilePage />} />}
          />
          <Route
            path='cart'
            element={<EnsureAuthenticated page={<CartPage />} />}
          />
          <Route
            path='checkout'
            element={<EnsureAuthenticated page={<CheckoutPage />} />}
          />
          <Route path='login' element={<LoginPage />} />
          <Route path='register' element={<RegisterPage />} />
          <Route
            path='order/:id'
            element={<EnsureAuthenticated page={<OrderPage />} />}
          />
          <Route path='rug/:id' element={<RugPage />} />

          <Route
            path='add-rug'
            element={<EnsureAdmin page={<AddRugPage />} />}
          />
        </Routes>
      </BrowserRouter>
    </CookiesProvider>
  );
}

export default App;
