import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { currentUser } from "../../redux/features/userSlice";
import { GroupsService } from "../../service/groups/groupsService";
import { PostService } from "../../service/posts/postService";
import { UsersService } from "../../service/users/usersService";
import { useParams } from "react-router-dom";
import { Post } from "../../components/post/Post";
import { Input } from "../../components/input/Input";
import { UserPic } from "../../components/user-pic/UserPic";
import { Modal } from "../../components/modal/Modal";
import { AddPost } from "../../components/add-post/AddPost";
import { SmallButton } from "../../components/button/Button";
import { UserCard } from "../../components/user-card/UserCard";
import "./Groups.scss";

const groupService = new GroupsService();
const postService = new PostService();
const userService = new UsersService();

export const Group = () => {
  const { groupId } = useParams();
  const user = useSelector(currentUser);
  const [groupMembers, setGroupMembers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [content, setContent] = useState("posts");
  const [isAdmin, setIsAdmin] = useState(false);
  const [posts, setPosts] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [showAddPostForm, setShowAddPostForm] = useState(false);
  const [group, setGroup] = useState({});

  useEffect(() => {
    (async () => {
      const group = await groupService.getAllInformation(groupId);
      if (group.group.admins.includes(user._id.toString())) setIsAdmin(true);
      setGroupMembers(group.dataMembers);
      setRequests(group.dataRequests);
      setAdmins(group.dataAdmins);
      setPosts(group.dataPosts);
      setGroup(group);
    })();
  }, []);

  const kickMember = async (member) => {
    await groupService.leaveGroup(groupId, member);
    const newData = group.dataMembers.filter(
      (x) => x.toString() !== member._id.toString()
    );
    setGroupMembers(newData);
  };
  const makeAdmin = async (member) => {
    await groupService.makeAdmin(groupId, member);
    const newData = group.dataMembers.push(member._id);
    setAdmins(newData);
  };
  const removeAdmin = async (admin) => {
    await groupService.removeAdmin(groupId, admin);
    const newData = group.dataAdmins.filter(
      (x) => x.toString() !== admin._id.toString()
    );
    setAdmins(newData);
  };
  const acceptRequest = async (request) => {
    await groupService.acceptRequest(groupId, request);
    const newData = group.dataRequests.filter(
      (x) => x.toString() !== request._id.toString()
    );
    const newData2 = group.dataMembers.push(request._id);
    setRequests(newData);
    setGroupMembers(newData2);
  };
  const rejectRequest = async (request) => {
    await groupService.cancelRequest(groupId, request);
    const newData = group.dataRequests.filter(
      (x) => x.toString() !== request._id.toString()
    );
    setRequests(newData);
  };

  const renderPosts = () => {
    return (
      <main className="home">
        <Modal
          show={showAddPostForm ? 1 : 0}
          closemodal={() => setShowAddPostForm(false)}
        >
          {showAddPostForm && (
            <AddPost close={() => setShowAddPostForm(false)} />
          )}
        </Modal>
        <div className="feed">
          {user && (
            <div className="add-post">
              <div>
                <h4>Would you like to share something?</h4>
                <Input
                  placeholder={"make a post"}
                  onClick={() => setShowAddPostForm(true)}
                />
              </div>
              <UserPic imageurl={user.imageUrl} />
            </div>
          )}
          {posts?.map((post) => {
            return <Post key={post._id} post={post} />;
          })}
        </div>
      </main>
    );
  };

  const renderMembers = () => {
    //add option to invite friends?
    return (
      <div>
        <div>Memebers</div>
        <div>
          {groupMembers.map((member) => {
            return (
              <UserCard user={member} key={member}>
                {isAdmin && (
                  <>
                    <SmallButton onClick={() => kickMember(member)}>
                      Kick
                    </SmallButton>
                    <SmallButton onClick={() => makeAdmin(member)}>
                      Make Admin
                    </SmallButton>
                  </>
                )}
              </UserCard>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAdmin = () => {
    return (
      <div>
        {group.group?.creator.includes(user._id.toString()) && (
          <div>
            {admins?.map((admin) => {
              return (
                <div key={admin}>
                  <div>
                    {admin.firstName} {admin.lastName}
                  </div>
                  <SmallButton onClick={() => removeAdmin(admin)}>
                    you aint no admin now
                  </SmallButton>
                </div>
              );
            })}
            <div>Requests</div>
            {requests?.map((request) => {
              return (
                <div key={request}>
                  <div>
                    {request.firstName} {request.lastName}
                  </div>
                  <SmallButton onClick={() => acceptRequest(request)}>
                    Accept
                  </SmallButton>
                  <SmallButton onClick={() => rejectRequest(request)}>
                    Reject
                  </SmallButton>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="groups">
      <div className="side-menu">
        <div
          className={`${content === "posts" && "active"} menu-option`}
          onClick={() => setContent("posts")}
        >
          posts
        </div>
        <div
          className={`${content === "members" && "active"} menu-option`}
          onClick={() => setContent("memebers")}
        >
          memebers
        </div>
        {isAdmin && (
          <div
            className={`${content === "members" && "active"} menu-option`}
            onClick={() => setContent("admin")}
          >
            admin controls
          </div>
        )}
      </div>
      <main className="group-content">
        {(() => {
          switch (content) {
            case "posts":
              return renderPosts();

            case "memebers":
              return renderMembers();

            case "admin":
              return renderAdmin();
          }
        })()}
      </main>
    </div>
  );
};
