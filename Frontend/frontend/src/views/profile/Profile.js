import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserPic } from "../../components/user-pic/UserPic";
import { Post } from "../../components/post/Post";
import { useSelector } from "react-redux";
import { currentUser } from "../../redux/features/userSlice";
import { RelationshipsService } from "../../service/relationships/relationshipsService";
import { ProfileService } from "../../service/profile/profileService";
import { SmallButton } from "../../components/button/Button";
import { formatDateTime } from "../../utils/core";
import { FaBaby, FaGraduationCap } from "react-icons/fa";
import { MdOutlineWork } from "react-icons/md";
import { UserCard } from "../../components/user-card/UserCard";
import "./Profile.scss";

export const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState({});
  const [content, setContent] = useState("posts");
  const activeUser = useSelector(currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const profileService = new ProfileService();
      const profile = await profileService.getProfile(id);
      console.log(profile);
      setProfile(profile);
    })();
  }, [id]);

  const renderPosts = () => {
    return profile.posts?.length === 0 ? (
      <h3>No Posts to display</h3>
    ) : (
      <div className="profile-posts">
        {profile?.posts?.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    );
  };

  const renderGroups = () => {
    return profile.groups?.length === 0 ? (
      <h3>No Groups to display</h3>
    ) : (
      <div className="profile-groups">
        {profile?.groups?.map((group) => (
          <div key={group._id}>
            <h2>{group.name}</h2>
          </div>
        ))}
      </div>
    );
  };

  const renderFriends = () => {
    return profile.friends?.length === 0 ? (
      <h3>User has no friends</h3>
    ) : (
      <div className="profile-friends">
        {profile?.friends?.map((friend) => (
          <UserCard key={friend._id} user={friend}>
            <SmallButton
              disabled={
                activeUser.friends.some((f) => f === friend._id) ||
                activeUser.requestsSent.some((r) => r === friend._id) ||
                friend._id === activeUser._id
              }
              isactive={1}
            >
              Add Friend
            </SmallButton>
          </UserCard>
        ))}
      </div>
    );
  };

  const sendFriendRequest = async () => {
    const service = new RelationshipsService();
    await service.sendFriendRequest({
      receiverId: profile.user._id,
      sender: activeUser,
    });
  };

  return (
    <>
      <main>
        <section className="profile-header">
          <UserPic
            style={{ height: "150px", width: "150px" }}
            imageurl={profile?.user?.imageUrl}
          />
          <div className="profile-header-details">
            <div className="profile-header-top">
              <h2>
                {profile?.user?.firstName} {profile?.user?.lastName}
              </h2>

              {activeUser?._id === profile?.user?._id ? (
                <SmallButton onClick={() => navigate("/edit-profile")}>
                  edit profile
                </SmallButton>
              ) : (
                <div className="button-container">
                  <SmallButton
                    disabled={
                      activeUser?.friends.some((f) => f === id) ||
                      activeUser?.requestsSent.some((r) => r === id)
                    }
                    onClick={() => sendFriendRequest()}
                  >
                    add friend
                  </SmallButton>
                  {/* <SmallButton>message</SmallButton> */}
                </div>
              )}
            </div>

            <div className="profile-header-bottom">
              <h4>{profile?.posts?.length} posts</h4>
              <h4>{profile?.friends?.length} friends</h4>
            </div>
            <p className="profile-bio">{profile?.user?.bio}</p>
          </div>

          <div className="profile-props">
            {profile?.user?.workplace && (
              <div className="property-group">
                <MdOutlineWork />
                <h4>{profile?.user?.workplace}</h4>
              </div>
            )}
            {profile?.user?.education && (
              <div className="property-group">
                <FaGraduationCap />
                <h4>{profile?.user?.education}</h4>
              </div>
            )}
            {profile?.user?.birthDate && (
              <div className="property-group">
                <FaBaby />
                <h4>{formatDateTime(profile?.user?.birthDate)}</h4>
              </div>
            )}
          </div>
        </section>

        <hr />
        <div className="profile-nav">
          <SmallButton
            isactive={content === "posts" ? 1 : 0}
            onClick={() => setContent("posts")}
          >
            posts
          </SmallButton>
          <SmallButton
            isactive={content === "friends" ? 1 : 0}
            onClick={() => setContent("friends")}
          >
            friends
          </SmallButton>
          <SmallButton
            isactive={content === "groups" ? 1 : 0}
            onClick={() => setContent("groups")}
          >
            groups
          </SmallButton>
        </div>

        <section className="profile-content">
          {(() => {
            switch (content) {
              case "posts":
                return renderPosts();

              case "friends":
                return renderFriends();

              case "groups":
                return renderGroups();

              default:
                break;
            }
          })()}
        </section>
      </main>
    </>
  );
};
