import { useCallback, useState } from "react";
import { Route, Routes } from "react-router-dom";
import LoginModal from "./components/LoginModal.jsx";
import Toast from "./components/Toast.jsx";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import AccountPage from "./pages/AccountPage.jsx";

export default function App() {
  const [user, setUser] = useState(() => localStorage.getItem("user"));
  const [toast, setToast] = useState(null);

  const handleAuthSuccess = (email, name) => {
    setUser(email);
    if (name) localStorage.setItem("userName", name);
    else if (!localStorage.getItem("userName")) {
      localStorage.setItem("userName", email.split("@")[0] || "User");
    }
    setToast("Logged in successfully");
    setTimeout(() => setToast(null), 3500);
  };

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("userName");
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    setUser(null);
    window.location.reload();
  }, []);

  if (!user) {
    return (
      <>
        <LoginModal onSuccess={handleAuthSuccess} />
        <Toast message={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  return (
    <>
      <Routes>
        <Route element={<Layout onLogout={logout} />}>
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<AccountPage />} />
        </Route>
      </Routes>
      <Toast message={toast} onClose={() => setToast(null)} />
    </>
  );
}
