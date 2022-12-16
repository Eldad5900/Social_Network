import React, { useEffect, useState } from "react";
import { GenericService } from "../../../service/genericService";
import { formatDateTime } from "../../../utils/core";
import { UserPic } from "../../user-pic/UserPic";
import "./Comment.scss";

export const Comment = ({ comment }) => {
  const [commentOwner, setCommentOwner] = useState({});
  useEffect(() => {
    (async () => {
      const userService = new GenericService("users");
      const data = await userService.getByIdAsync(comment.userId);
      setCommentOwner(data);
    })();
  }, []);
  return (
    <div className="comment">
      <UserPic
        style={{ width: "30px", height: "30px" }}
        imageurl={commentOwner?.imageUrl}
      />
      <div className="text">
        <div className="text-header">
          <h4>
            {commentOwner?.firstName} {commentOwner?.lastName}
          </h4>
          <p>{formatDateTime(comment?.date)}</p>
        </div>
        <p>{comment?.content}</p>
      </div>
    </div>
  );
};
