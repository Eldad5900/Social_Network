import React from "react";
import { useNavigate } from "react-router-dom";
import { UserPic } from "../user-pic/UserPic";
import "./UserCard.scss";

export const UserCard = ({ user, children }) => {
  const navigate = useNavigate();
  return (
    <div className="user-card">
      <img
        onClick={() => navigate(`/profile/${user._id}`)}
        src={
          user.imageUrl || `${process.env.PUBLIC_URL}/images/default-pic.jpg`
        }
      />
      <div>
        <p>
          {user.firstName} {user.lastName}
        </p>
        {children}
      </div>
    </div>
  );
};

export const UserCardSmall = ({ user, children }) => {
  const navigate = useNavigate();
  return (
    <div className="user-card-small">
      <UserPic
        imageurl={user.imageUrl}
        onClick={() => navigate(`/profile/${user._id}`)}
      />
      <h3>
        {user.firstName} {user.lastName}
      </h3>
      <div>{children}</div>
    </div>
  );
};
