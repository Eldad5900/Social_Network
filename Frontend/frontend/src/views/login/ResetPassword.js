import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SmallButton } from "../../components/button/Button";
import { Input } from "../../components/input/Input";
import { AuthenticationService } from "../../service/auth/authService";
import "./Login.scss";

export const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { userId, token } = useParams();
  const navigate = useNavigate();

  const submit = async () => {
    if (password !== confirmPassword) {
      alert("Invalid password inputs");
      return;
    }
    const authService = new AuthenticationService();
    const res = await authService.resetPassword({
      userId,
      token,
      password1: password,
      password2: confirmPassword,
    });
    alert(res.message);
    navigate("/login");
  };

  return (
    <div>
      <div className="login-wrapper">
        <div className="login">
          <h2>Reset Password</h2>
          <label>password</label>
          <Input
            type={"password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>confirm password</label>
          <Input
            type={"password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div className="button-container">
            <SmallButton onClick={submit}>Submit</SmallButton>
          </div>
        </div>
      </div>
    </div>
  );
};
