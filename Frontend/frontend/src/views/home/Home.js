import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AddPost } from "../../components/add-post/AddPost";
import { Input } from "../../components/input/Input";
import { Modal } from "../../components/modal/Modal";
import { Post } from "../../components/post/Post";
import { UserPic } from "../../components/user-pic/UserPic";
import { currentUser } from "../../redux/features/userSlice";
import { PostService } from "../../service/posts/postService";
import "./Home.scss";

export const Home = () => {
  const user = useSelector(currentUser);
  const [showAddPostForm, setShowAddPostForm] = useState(false);
  const [posts, setPosts] = useState([]);
  // const dispatch = useDispatch();

  useEffect(() => {
    try {
      const postService = new PostService();
      (async () => {
        const allPosts = await postService.getPosts();
        const postsWithoutBlocked = allPosts.filter(
          (x) =>
            !user?.blocked?.includes(x.userId) &&
            !user?.blockedBy?.includes(x.userId)
        );
        setPosts(postsWithoutBlocked);
      })();
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <main className="home">
      <Modal
        show={showAddPostForm ? 1 : 0}
        closemodal={() => setShowAddPostForm(false)}
      >
        {showAddPostForm && user && (
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
            <UserPic imageurl={user?.imageUrl} />
          </div>
        )}
        {posts?.map((post) => {
          return <Post key={post?._id} post={post} />;
        })}
      </div>
    </main>
  );
};
