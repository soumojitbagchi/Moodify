import SignIn from "./features/auth/pages/signin";
import SignUp from "./features/auth/pages/signup";
import Home from "./features/Ui/pages/Home";
import { Routes, Route } from "react-router-dom";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;
