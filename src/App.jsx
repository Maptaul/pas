import { Route, Routes } from "react-router-dom";
import PassportApplicationForm from "./Components/PassportApplicationForm";
import Root from "./Layouts/Root";
import Contact from "./Pages/Contact";
import ErrorPage from "./Pages/ErrorPage";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Root />}>
        <Route index element={<Home />} />
        <Route path="contact" element={<Contact></Contact>} />
        <Route path="*" element={<ErrorPage />} />
        <Route path="apply-passport" element={<PassportApplicationForm />} />
        <Route path="login" element={<Login />} />
        <Route path="signUp" element={<SignUp />} />
      </Route>
    </Routes>
  );
}

export default App;
