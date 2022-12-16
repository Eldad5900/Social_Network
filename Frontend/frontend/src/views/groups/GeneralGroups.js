import React from "react";
import { GroupsService } from "../../service/groups/groupsService";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { currentUser } from "../../redux/features/userSlice";
import { SmallButton } from "../../components/button/Button";
import { useNavigate } from "react-router-dom";
import { TextArea } from "../../components/input/Input";
import "./Groups.scss";

const service = new GroupsService();

export const GeneralGroups = () => {
  const user = useSelector(currentUser);
  const [groups, setGroups] = useState([]);
  const [joined, setJoined] = useState([]);
  const [requested, setRequested] = useState([]);
  const [content, setContent] = useState("groups");
  const [newGroup, setNewGroup] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const allGroups = await service.getPublicGroups();
      const requestedGroups = allGroups.filter((x) =>
        x.requests.includes(user?._id)
      );
      const joinedGroups = allGroups.filter((x) =>
        x.memebers.includes(user?._id)
      );
      const publicGroups = allGroups.filter(
        (x) =>
          !x.memebers.includes(user?._id) && !x.requests.includes(user?._id)
      );
      setGroups(publicGroups);
      setJoined(joinedGroups);
      setRequested(requestedGroups);
    })();
  }, [user]);

  const requestToJoin = async (group) => {
    const response = await service.requestToJoin({
      groupId: group._id,
      sender: user,
    });
    const g = groups.filter((x) => x._id.toString() !== group._id.toString());
    const r = [...requested, group];
    setGroups(g);
    setRequested(r);
  };

  const leaveGroup = async (group) => {
    const response = await service.leaveGroup({
      groupId: group._id,
      sender: user,
    });
    setJoined(joined.filter((x) => x._id.toString() !== group._id.toString()));
    setGroups(groups.push(group));
  };

  const cancelRequest = async (group) => {
    const response = await service.cancelRequest({
      groupId: group._id,
      sender: user,
    });
    setRequested(
      joined.filter((x) => x._id.toString() !== group._id.toString())
    );
    setGroups(groups.push(group));
  };

  const createGroup = async () => {
    const group = await service.postAsync({
      name: newGroup.name,
      creator: user._id,
      memebers: [user._id],
      admins: [user._id],
    });
    setJoined(joined.push(group));
    setContent("groups");
  };

  const renderUnjoinedGroups = () => {
    return (
      <div>
        {groups?.map((group) => {
          return (
            <div key={group._id}>
              <div>{group.name}</div>
              <SmallButton onClick={() => requestToJoin(group)}>
                Join
              </SmallButton>
            </div>
          );
        })}
      </div>
    );
  };

  const renderJoinedGroups = () => {
    return (
      <div>
        {joined?.map((group) => {
          return (
            <div key={group._id}>
              <div>{group.name}</div>
              <SmallButton onClick={() => leaveGroup(group)}>Leave</SmallButton>
              <SmallButton onClick={() => navigate(`/groups/${group._id}`)}>
                View
              </SmallButton>
            </div>
          );
        })}
      </div>
    );
  };

  const renderRequestedGroups = () => {
    return (
      <div>
        {requested?.map((group) => {
          return (
            <div key={group._id}>
              <div>{group.name}</div>
              <SmallButton onClick={() => cancelRequest(group)}>
                Cancel request
              </SmallButton>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMakeGroup = () => {
    return (
      <div>
        <label>Group name</label>
        <TextArea
          onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
        ></TextArea>
        <SmallButton onClick={() => createGroup()}>Create!</SmallButton>
      </div>
    );
  };

  return (
    <div className="groups">
      <div className="side-menu">
        <div
          className={`${content === "newGroup" && "active"} menu-option`}
          onClick={() => setContent("newGroup")}
        >
          <p>Make a group</p>
        </div>
        <div
          className={`${content === "outgoing" && "active"} menu-option`}
          onClick={() => setContent("outgoing")}
        >
          <p>Outgoing Requests</p>
        </div>
        <div
          className={`${content === "groups" && "active"} menu-option`}
          onClick={() => setContent("groups")}
        >
          <p>Groups</p>
        </div>
        <div
          className={`${content === "discover" && "active"} menu-option`}
          onClick={() => setContent("discover")}
        >
          <p>Discover</p>
        </div>
      </div>
      <main className="content">
        {(() => {
          switch (content) {
            case "groups":
              return renderJoinedGroups();

            case "discover":
              return renderUnjoinedGroups();

            case "outgoing":
              return renderRequestedGroups();

            case "newGroup":
              return renderMakeGroup();
          }
        })()}
      </main>
    </div>
  );
};
