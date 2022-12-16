import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { currentUser } from "../../redux/features/userSlice";
import { PostService } from "../../service/posts/postService";
import { Input, TextArea } from "../../components/input/Input";
import { SmallButton } from "../../components/button/Button";
import { UserPic } from "../../components/user-pic/UserPic";
import Select from "react-select";
import { RelationshipsService } from "../../service/relationships/relationshipsService";
import { GOOGLE_MAPS_API_KEY } from "../../utils/constants";
import { GrCheckboxSelected } from "react-icons/gr";
import "./AddPost.scss";

export const AddPost = ({ postToEdit = {}, close }) => {
  const [post, setPost] = useState(postToEdit);
  const [marker, setMarker] = useState({});
  const [userLocation, setUserLocation] = useState({});
  const [openMap, setOpenMap] = useState(false);
  const [friends, setFriends] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const inputFileRef = useRef(null);
  const user = useSelector(currentUser);
  useJsApiLoader({ googleMapsApiKey: GOOGLE_MAPS_API_KEY });

  useEffect(() => {
    initLocation();
    if (Object.keys(postToEdit).length !== 0) {
      setIsEditMode(true);
      setPost(postToEdit);
      setMarker(postToEdit?.location ?? {});
    }

    const service = new RelationshipsService();
    (async () => {
      const userFriends = await service.getRelationships({
        userId: user._id,
        relationship: "friends",
      });
      setFriends(userFriends);
    })();
  }, [user]);

  const initLocation = () => {
    navigator.geolocation.getCurrentPosition((response) => {
      const lat = response.coords.latitude;
      const lng = response.coords.longitude;
      setUserLocation({ lat, lng });
    });
  };

  const selectLocation = (e) => {
    const lng = e.latLng.lng();
    const lat = e.latLng.lat();
    setPost({ ...post, location: { lat, lng } });
    setMarker({ lat, lng });
  };

  const selectCurrentLocation = () => {
    setPost({ ...post, location: userLocation });
    setMarker(userLocation);
  };

  const validatePost = () => {
    if ((!post.files && !isEditMode) || !post.location) {
      alert("Can't upload post without a location and image...");
      return false;
    }
    return true;
  };

  const uploadPost = async () => {
    try {
      if (!validatePost()) {
        return;
      }
      const postService = new PostService();
      await postService.uploadPost({
        ...post,
        userId: user._id,
        publishedBy: `${user.firstName} ${user.lastName}`,
      });
      close();
      alert("Post Updated!");
    } catch (error) {
      console.error(error);
    }
  };

  const updatePost = async () => {
    try {
      if (!validatePost()) return;
      const postService = new PostService();
      console.log("NEW POST", postToEdit);
      await postService.updatePost(
        {
          ...post,
          userId: user._id,
          publishedBy: `${user.firstName} ${user.lastName}`,
        },
        post._id
      );
      close();
      alert("Post Uploaded!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {user ? (
        <section className="new-post">
          <h3>{isEditMode ? "Edit Post" : "Create Post"}</h3>
          <div className="new-post-content">
            <div className="new-post-form-group">
              <label>Post content</label>
              <TextArea
                value={post.content}
                onChange={(e) => setPost({ ...post, content: e.target.value })}
              ></TextArea>
            </div>
            <UserPic imageurl={user?.imageUrl} />
          </div>
          <div className="button-container">
            <SmallButton onClick={() => inputFileRef.current.click()}>
              {(post.imageUrl || post.files) && <GrCheckboxSelected />}
              attach an image
            </SmallButton>
            <SmallButton onClick={() => setOpenMap(!openMap)}>
              {Object.keys(marker).length !== 0 && <GrCheckboxSelected />}
              select location
            </SmallButton>
            <SmallButton onClick={() => selectCurrentLocation()}>
              {Object.keys(marker).length !== 0 && <GrCheckboxSelected />}
              use your current location
            </SmallButton>
          </div>
          <input
            ref={inputFileRef}
            type={"file"}
            onChange={(e) => setPost({ ...post, files: e.target.files })}
          ></input>
          <img src=""></img>
          {openMap && (
            <div className="map-container">
              <GoogleMap
                mapContainerStyle={{
                  width: "100%",
                  height: "20rem",
                }}
                center={userLocation}
                zoom={15}
                onClick={selectLocation}
              >
                {Object.keys(marker).length !== 0 && (
                  <MarkerF
                    position={marker}
                    onClick={() => setMarker({})}
                  ></MarkerF>
                )}
              </GoogleMap>
            </div>
          )}
          <div className="form-group">
            <h4 className="add-post-tag-others">Tag Other Buns!</h4>
            <Select
              isMulti
              defaultValue={postToEdit?.tagged}
              onChange={(options) => setPost({ ...post, tagged: options })}
              closeMenuOnSelect={false}
              options={friends?.map((f) => {
                return {
                  label: `${f?.firstName} ${f?.lastName}`,
                  value: f?._id,
                };
              })}
            ></Select>
          </div>
          <div className="form-group">
            <p>Add Tags: (separated by space)</p>

            <Input
              value={post.tags?.join(" ")}
              onChange={(e) =>
                setPost({ ...post, tags: e.target.value.split(" ") })
              }
            ></Input>
          </div>
          <SmallButton
            isactive={1}
            onClick={() => (isEditMode ? updatePost() : uploadPost())}
          >
            {isEditMode ? "update" : "upload"}
          </SmallButton>
          <SmallButton isactive={1} onClick={() => console.log(post)}>
            log post
          </SmallButton>
        </section>
      ) : (
        <h2>Log in to make a post</h2>
      )}
    </>
  );
};
