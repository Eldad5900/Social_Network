import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { currentUser, login } from "../../redux/features/userSlice";
import { RelationshipsService } from "../../service/relationships/relationshipsService";
import { UsersService } from "../../service/users/usersService";
import { UserCard } from "../../components/user-card/UserCard";
import { FaUserFriends } from "react-icons/fa";
import { MdOutlineTravelExplore } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { RiUserReceivedFill } from "react-icons/ri";
import { SmallButton } from "../../components/button/Button";
import "./Buns.scss";

const relationshipsService = new RelationshipsService();

export const Buns = () => {
  const user = useSelector(currentUser);
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [content, setContent] = useState("friends");
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const service = new RelationshipsService();
      const friends = await service.getRelationships({
        userId: user._id,
        relationship: "friends",
      });
      setFriends(friends);

      const sent = await service.getRelationships({
        userId: user._id,
        relationship: "requestsSent",
      });
      setSentRequests(sent);

      const received = await service.getRelationships({
        userId: user._id,
        relationship: "requestsReceived",
      });
      setReceivedRequests(received);

      const userService = new UsersService();
      const users = await userService.getUsers();
      const usersWithoutBlocked = users.filter(
        (x) =>
          !user.blocked.includes(
            x._id.toString() && !user.blockedBy.includes(x._id.toString())
          )
      );
      console.log("no blocked", usersWithoutBlocked);
      console.log("ALL USERS FROM BUNS", users);

      setUsers(usersWithoutBlocked);
    })();
  }, [user]);

  const removeFriend = async (removedFriend) => {
    const response = await relationshipsService.removeFriend({
      id1: removedFriend._id,
      id2: user._id,
    });
    dispatch(login(response.user));
    // setFriends(friends.filter((f) => f._id !== removedFriend._id));
    setUsers([...users, removedFriend]);
  };

  const sendFriendRequest = async (requestReceiver) => {
    const response = await relationshipsService.sendFriendRequest({
      receiverId: requestReceiver._id,
      sender: user,
    });
    dispatch(login(response.user));
    // setUsers(users.filter((user) => user._id !== requestReceiver._id));
    setSentRequests([...sentRequests, requestReceiver]);
  };

  const acceptFriendRequest = async (sender) => {
    const response = await relationshipsService.acceptFriendRequest({
      receiver: user,
      senderId: sender._id,
    });
    console.log("AFTER ACCEPTING", response);
    dispatch(login(response.user));
    // setFriends([...friends, sender]);
    // setReceivedRequests(receivedRequests.filter((r) => r._id !== sender._id));
  };

  const rejectFriendRequest = async (sender) => {
    const response = await relationshipsService.rejectFriendRequest({
      receiver: user,
      senderId: sender._id,
    });
    dispatch(login(response.user));
    // setReceivedRequests(receivedRequests.filter((r) => r._id !== sender._id));
  };

  const withdrawFriendRequest = async (receiver) => {
    const response = await relationshipsService.withdrawFriendRequest({
      receiverId: receiver._id,
      sender: user,
    });
    dispatch(login(response.user));
    // setUsers([...users, receiver]);
    // setSentRequests(sentRequests.filter((s) => s._id !== receiver._id));
  };

  const renderFriends = () => {
    return friends.map((item) => {
      return (
        <UserCard user={item}>
          <SmallButton isactive={1} onClick={() => removeFriend(item)}>
            Remove
          </SmallButton>
        </UserCard>
      );
    });
  };

  const renderDiscover = () => {
    return users?.map((item) => {
      return (
        !user?.friends?.some((f) => f === item?._id) &&
        !user?.requestsReceived.some((r) => r === item?._id) &&
        !user?.requestsSent.some((r) => r === item?._id) &&
        item?._id !== user?._id && (
          <UserCard user={item}>
            <SmallButton isactive={1} onClick={() => sendFriendRequest(item)}>
              Add Friend
            </SmallButton>
          </UserCard>
        )
      );
    });
  };

  const renderOutgoingFriendRequests = () => {
    return sentRequests.map((item) => {
      return (
        <UserCard user={item}>
          <SmallButton isactive={1} onClick={() => withdrawFriendRequest(item)}>
            Cancel
          </SmallButton>
        </UserCard>
      );
    });
  };

  const renderIncomingFriendRequests = () => {
    return receivedRequests.map((req) => {
      return (
        <UserCard user={req}>
          <SmallButton isactive={1} onClick={() => acceptFriendRequest(req)}>
            Accept
          </SmallButton>
          <SmallButton onClick={() => rejectFriendRequest(req)}>
            Reject
          </SmallButton>
        </UserCard>
      );
    });
  };

  return (
    <div className="buns">
      <div className="side-menu">
        <div
          className={`${content === "requests" && "active"} menu-option`}
          onClick={() => setContent("requests")}
        >
          <RiUserReceivedFill />
          <p>Friend Requests</p>
        </div>
        <div
          className={`${content === "outgoing" && "active"} menu-option`}
          onClick={() => setContent("outgoing")}
        >
          <IoMdSend />
          <p>Outgoing Requests</p>
        </div>
        <div
          className={`${content === "friends" && "active"} menu-option`}
          onClick={() => setContent("friends")}
        >
          <FaUserFriends />
          <p>Friends</p>
        </div>
        <div
          className={`${content === "discover" && "active"} menu-option`}
          onClick={() => setContent("discover")}
        >
          <MdOutlineTravelExplore />
          <p>Discover</p>
        </div>
      </div>
      <main className="content">
        {(() => {
          switch (content) {
            case "friends":
              return renderFriends();

            case "discover":
              return renderDiscover();

            case "outgoing":
              return renderOutgoingFriendRequests();

            case "requests":
              return renderIncomingFriendRequests();
          }
        })()}
      </main>
    </div>
  );
};
