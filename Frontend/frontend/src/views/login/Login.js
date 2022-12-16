import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthenticationService } from "../../service/auth/authService";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/userSlice";
import { SmallButton } from "../../components/button/Button";
import "./Login.scss";

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const submitLogin = async () => {
    const authService = new AuthenticationService();
    try {
      const response = await authService.login({ email, password });

      if (response.ok) {
        localStorage.setItem(
          "access-token",
          JSON.stringify(response.accessToken)
        );
        dispatch(login({ ...response.user }));
        navigate("/");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <div className="login-wrapper">
        <div className="login">
          <h2>Login to your account</h2>

          <div className="form-group">
            <label htmlFor="username">Email</label>
            <input
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              className="form-input"
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>

          <div className="button-container">
            <button className="btn-login" onClick={submitLogin}>
              Login
            </button>
            <button className="btn-login" onClick={() => navigate("/sign-up")}>
              don't have an account?? Sign Up
            </button>
            <SmallButton onClick={() => navigate("/forgot-password")}>
              forgot password?
            </SmallButton>
          </div>
        </div>
      </div>
    </>
  );
};
