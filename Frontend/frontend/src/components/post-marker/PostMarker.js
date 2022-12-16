import { InfoWindowF, MarkerF } from "@react-google-maps/api";
import React, { useState } from "react";
import { Post } from "../post/Post";
import "./PostMarker.scss";

export const PostMarker = ({ post }) => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <MarkerF
        position={post?.location}
        icon={{
          url: "/images/down-arrow.svg",
          scaledSize: new window.google.maps.Size(30, 30),
        }}
      ></MarkerF>
      <MarkerF
        onClick={() => setShowInfo(!showInfo)}
        position={post.location}
        icon={{
          anchor: new window.google.maps.Point(15, 50),
          url: post.imageUrl,
          scaledSize: new window.google.maps.Size(30, 30),
        }}
      >
        {showInfo && (
          <InfoWindowF
            position={post.location}
            onCloseClick={() => setShowInfo(false)}
          >
            <div style={{ width: "300px", height: "300px" }}>
              <Post post={post} />
            </div>
          </InfoWindowF>
        )}
      </MarkerF>
    </>
  );
};
