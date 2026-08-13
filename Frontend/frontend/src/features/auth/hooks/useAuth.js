import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { login, register } from "../api/auth.api";

import {
  setLoading,
  setUserInfo,
  setIsAuthenticated,
  setToken,
  setError,
  clearError,
} from "../../../redux/slice/userSlice.redux";

const useAuth = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const loading = useSelector((state) => state.user.loading);

  const error = useSelector((state) => state.user.error);

  const token = useSelector((state) => state.user.token);

  const userInfo = useSelector((state) => state.user.userInfo);

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const handleLogin = async ({ usernameOrEmail, password }) => {
    try {
      dispatch(clearError());
      dispatch(setLoading(true));

      // Detect if user typed an email or a username
      const isEmail = usernameOrEmail.includes("@");
      const credentials = isEmail
        ? { email: usernameOrEmail, password }
        : { username: usernameOrEmail, password };

      const data = await login(credentials);
      dispatch(setToken(data.token));
      dispatch(setIsAuthenticated(true));

      navigate("/");

    } catch (err) {
      dispatch(
        setError(
          err?.message || err?.error || "Login failed. Please try again."
        )
      );
    } finally {
      dispatch(setLoading(false));
    }
  };
  const handleRegister = async ({ name, username, email, password }) => {
    try {
      dispatch(clearError());
      dispatch(setLoading(true));

      const data = await register({ name, username, email, password });
      navigate("/signin");
      console.log("Registration successful:", data);

    } catch (err) {
      dispatch(
        setError(
          err?.message || err?.error || "Registration failed. Please try again."
        )
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
  };
  return {
    handleLogin,
    handleRegister,
    handleClearError,

    loading,
    error,
    token,
    userInfo,
    isAuthenticated,
  };
};

export default useAuth;
