import React, { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import "./LikeButton.scss";

export const LikeButton = ({ isLiked = false, like, dislike }) => {
  const [liked, setLiked] = useState(isLiked);

  const click = () => {
    const likeState = !liked;
    setLiked(likeState);
    likeState ? like() : dislike();
  };

  return (
    <div onClick={click} className="lkbtn">
      {liked ? <AiFillHeart className="red" /> : <AiOutlineHeart />}
    </div>
  );
};
