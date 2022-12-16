import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/button/Button";
import { currentUser } from "../../redux/features/userSlice";
import { RelationshipsService } from "../../service/relationships/relationshipsService";

export const BlockedBuns = () => {
  const user = useSelector(currentUser);
  const [blocked, setBlocked] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const service = new RelationshipsService();
      const block = service.getBlocked(user._id);
      setBlocked(block);
    })();
  }, []);

  const unblock = async (id) => {
    const service = new RelationshipsService();
    await service.unblock(user, id);
  };

  return (
    <div>
      {blocked?.map((block) => {
        return (
          <div>
            <h3>
              {block.firstName} {block.lastName}
            </h3>
            <Button onClick={() => unblock(block._id)}>Unblock</Button>
          </div>
        );
      })}
    </div>
  );
};
