import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SmallButton } from "../../components/button/Button";
import { Input, TextArea } from "../../components/input/Input";
import { UserPic } from "../../components/user-pic/UserPic";
import { currentUser, login } from "../../redux/features/userSlice";
import { UsersService } from "../../service/users/usersService";
import "./EditProfile.scss";
export const EditProfile = () => {
  const [user, setUser] = useState(useSelector(currentUser));
  const userState = useSelector(currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setUser(userState);
  }, [userState]);

  const submit = async () => {
    const service = new UsersService();
    await service.editUser(user, user._id);
    dispatch(login(user));
    navigate(-1);
  };

  return (
    <>
      <main>
        <div className="edit-form">
          <UserPic
            imageurl={user?.imageUrl}
            style={{ height: "250px", width: "250px" }}
          />
          <div className="edit-text-fields">
            <div className="edit-group">
              <label>First Name</label>
              <Input
                value={user?.firstName}
                onChange={(e) =>
                  setUser({ ...user, firstName: e.target.value })
                }
              ></Input>
            </div>
            <div className="edit-group">
              <label>LastName</label>
              <Input
                value={user?.lastName}
                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
              ></Input>
            </div>
            <div className="edit-group">
              <label>Email</label>
              <Input
                value={user?.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              ></Input>
            </div>
            <div className="edit-group">
              <label>Work Place</label>
              <Input
                value={user?.workplace}
                onChange={(e) =>
                  setUser({ ...user, workplace: e.target.value })
                }
              ></Input>
            </div>
            <div className="edit-group">
              <label>Education</label>
              <Input
                value={user?.education}
                onChange={(e) =>
                  setUser({ ...user, education: e.target.value })
                }
              ></Input>
            </div>
            <div className="edit-group">
              <label>Bio</label>
              <TextArea
                value={user?.bio}
                onChange={(e) => setUser({ ...user, bio: e.target.value })}
              ></TextArea>
            </div>
            <div className="edit-group">
              <label>Birth Date</label>
              <Input
                type={"date"}
                value={user?.birthDate}
                onChange={(e) =>
                  setUser({ ...user, birthDate: e.target.value })
                }
              ></Input>
            </div>
            <SmallButton onClick={submit}>update!</SmallButton>
          </div>
        </div>
      </main>
    </>
  );
};
