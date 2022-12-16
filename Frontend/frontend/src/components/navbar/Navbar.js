import React from "react";
import { GiRabbitHead } from "react-icons/gi";
import { RiChatSmileFill } from "react-icons/ri";
import { FaMap } from "react-icons/fa";
import { SmallButton } from "../button/Button";
import { useDispatch, useSelector } from "react-redux";
import { currentUser, logout } from "../../redux/features/userSlice";
import { useNavigate } from "react-router-dom";
import { UserPic } from "../user-pic/UserPic";
import { HiUserGroup } from "react-icons/hi";
import "./Navbar.scss";

export const Nav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(currentUser);

  const pageLogout = () => {
    try {
      localStorage.removeItem("access-token");
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="navbar" sticky="top">
      <div onClick={() => navigate("/")} className="logo">
        <img src={`${process.env.PUBLIC_URL}/images/logo.jpg`} />
      </div>
      <ul>
        <li>
          <button onClick={() => navigate("buns")} className="link">
            <GiRabbitHead />
          </button>
        </li>
        <li>
          <button onClick={() => navigate("/map")} className="link">
            <FaMap />
          </button>
        </li>
        <li>
          <button onClick={() => navigate("/groups")} className="link">
            <HiUserGroup></HiUserGroup>
          </button>
        </li>
      </ul>
      <div className="login-logout">
        {!user ? (
          <>
            <SmallButton onClick={() => navigate("/login")}>Login</SmallButton>
            <SmallButton onClick={() => navigate("sign-up")}>
              Sign Up
            </SmallButton>
          </>
        ) : (
          <>
            <SmallButton onClick={pageLogout}>Logout</SmallButton>
            <SmallButton onClick={() => navigate(`profile/${user._id}`)}>
              Check profile
            </SmallButton>
            <UserPic imageurl={user.imageUrl} />
          </>
        )}
      </div>
    </div>
  );
};
