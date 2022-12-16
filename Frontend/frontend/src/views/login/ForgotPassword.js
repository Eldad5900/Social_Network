import React, { useState } from "react";
import { SmallButton } from "../../components/button/Button";
import { Input } from "../../components/input/Input";
import { AuthenticationService } from "../../service/auth/authService";
import "./Login.scss";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  const sendEmail = async () => {
    const authService = new AuthenticationService();
    const res = await authService.sendResetPasswordLink(email);
    if (res.ok) {
      setIsEmailSent(true);
    }
  };

  return (
    <div>
      <div className="login-wrapper">
        <div className="login">
          <h2>Forgot Password</h2>
          {!isEmailSent ? (
            <label>
              You will receive an email with a one time link to reset your
              password
            </label>
          ) : (
            <label style={{ color: "green" }}>
              A link was sent to your email!
            </label>
          )}
          <label>Email</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="button-container">
            <SmallButton onClick={sendEmail}>Submit</SmallButton>
          </div>
        </div>
      </div>
    </div>
  );
};
