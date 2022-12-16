import React, { useEffect } from "react";
import { Login } from "./views/login/Login";
import "./App.scss";
import { Route, Routes } from "react-router-dom";
import { Nav } from "./components/navbar/Navbar";
import { Home } from "./views/home/Home";
import { Buns } from "./views/buns/Buns";
import { SignUp } from "./views/login/SignUp";
import { MapWithPosts } from "./components/map-with-posts/MapWithPosts";
import { Profile } from "./views/profile/Profile";
import { BlockedBuns } from "./views/buns/BlockedBuns";
import { EditProfile } from "./views/profile/EditProfile";
import { LoadScript } from "@react-google-maps/api";
import { Chats } from "./views/chats/chats";
import { Requests } from "./views/requests/Requests";
import { useDispatch } from "react-redux";
import { AuthenticationService } from "./service/auth/authService";
import { login } from "./redux/features/userSlice";
import { ForgotPassword } from "./views/login/ForgotPassword";
import { ResetPassword } from "./views/login/ResetPassword";
import { GeneralGroups } from "./views/groups/GeneralGroups";
import { Group } from "./views/groups/Group";

export const App = () => {
  ///
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("access-token");
    if (!token) {
      return;
    }
    (async () => {
      const service = new AuthenticationService();
      const response = await service.getUser();
      dispatch(login({ ...response }));
    })();
  }, []);

  return (
    <>
      <Nav />

      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        <Route
          path="/reset-password/:userId/:token"
          element={<ResetPassword />}
        ></Route>
        <Route path="/buns" element={<Buns />}></Route>
        <Route path="/blockedBuns" element={<BlockedBuns />}></Route>
        <Route path="/map" element={<MapWithPosts />}></Route>
        <Route path="/map-start-view" element={<mapAllPosts />}></Route>
        <Route path="/profile/:id" element={<Profile />}></Route>
        <Route path="/edit-profile" element={<EditProfile />}></Route>
        <Route path="/chats" element={<Chats />}></Route>
        <Route path="/requests" element={<Requests />}></Route>
        <Route path="/groups" element={<GeneralGroups />}></Route>
        <Route path="/groups/:groupId" element={<Group />}></Route>
      </Routes>
    </>
  );
};
