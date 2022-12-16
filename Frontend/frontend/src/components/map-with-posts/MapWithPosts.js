import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { currentUser } from "../../redux/features/userSlice";
import { PostService } from "../../service/posts/postService";
import { GOOGLE_MAPS_API_KEY } from "../../utils/constants";
import { PostMarker } from "../post-marker/PostMarker";
import { Spinner } from "../spinner/Spinner";
import { SmallButton } from "../button/Button";
import { useNavigate } from "react-router-dom";
import { Modal } from "../modal/Modal";
import { AddPost } from "../add-post/AddPost";
import { calculateDistance } from "../../utils/core";
import { Input } from "../input/Input";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import "./MapWithPosts.scss";

export const MapWithPosts = () => {
  const navigate = useNavigate();
  const [isPublishNewPost, setIsPublishNewPost] = useState(false);
  const user = useSelector(currentUser);
  const [filters, setFilters] = useState({});
  const [userLocation, setUserLocation] = useState({});
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isSettingsClicked, setIsSettingsClicked] = useState(false);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((response) => {
      const lat = response.coords.latitude;
      const lng = response.coords.longitude;
      setUserLocation({ lat, lng });
    });
    (async () => {
      const postService = new PostService();
      const data = await postService.getPosts();
      setPosts(data);
      setFilteredPosts(data);
    })();
  }, []);

  const filterByBuns = () => {
    const filtered = filteredPosts.filter((post) =>
      user.friends.some((f) => f === post.userId)
    );
    setFilteredPosts(filtered);
  };

  const applyFilters = () => {
    const { dateFrom, dateTo, tags, tagged, radius, publisher } = filters;
    let fps = posts;
    if (dateFrom) fps = fps.filter((p) => p.date >= dateFrom);
    if (dateTo) fps = fps.filter((p) => p.date <= dateTo);
    if (radius && radius !== 0) {
      fps = fps.filter(
        (p) =>
          p.location && calculateDistance(p.location, userLocation) < radius
      );
    }
    if (tags && tags[0].length)
      fps = fps.filter(
        (p) => p.tags && tags.every((t) => p.tags.some((x) => x === t))
      );
    if (tagged && tagged[0].length)
      fps = fps.filter(
        (p) =>
          p.tagged &&
          tagged.every((t) =>
            p.tagged.some((x) => x.label.toLowerCase().includes(t))
          )
      );
    if (publisher)
      fps = fps.filter((p) =>
        p?.publishedBy?.toLowerCase().includes(publisher)
      );

    setFilteredPosts(fps);
  };

  return (
    <div>
      <div className="map">
        {!isLoaded ? (
          <Spinner />
        ) : (
          <GoogleMap
            mapContainerStyle={{
              width: "100vw",
              height: "90vh",
            }}
            center={userLocation}
            zoom={10}
          >
            <MarkerF
              position={userLocation}
              icon={{
                url: `${process.env.PUBLIC_URL}/images/you-are-here-icon.svg`,
                scaledSize: new window.google.maps.Size(60, 60),
              }}
            ></MarkerF>
            if({filteredPosts.length >= 30})
            {filteredPosts
              ?.filter((post) => post)
              .slice(0, 30)
              .map((post) => {
                return (
                  post.location && <PostMarker key={post._id} post={post} />
                );
              })}
            if({filteredPosts.length <= 100})
            {filteredPosts?.slice(0, 100).map((post) => {
              return post.location && <PostMarker key={post._id} post={post} />;
            })}
          </GoogleMap>
        )}
      </div>

      <div className={isSettingsClicked ? "wrapper" : "wrapper is-nav-open"}>
        <div className="wrapper">
          <div className="nav">
            <button
              className="nav__icon"
              type="menu-fold"
              onClick={() => setIsSettingsClicked(!isSettingsClicked)}
            >
              {isSettingsClicked ? (
                <MdArrowForwardIos />
              ) : (
                <MdArrowBackIosNew />
              )}
            </button>
            <div className="nav__body">
              <Modal
                show={isPublishNewPost ? 1 : 0}
                closemodal={() => setIsPublishNewPost(false)}
              >
                <AddPost close={() => setIsPublishNewPost(false)}></AddPost>
              </Modal>
              <div className="map-menu">
                <SmallButton onClick={() => setIsPublishNewPost(true)}>
                  Publish new post
                </SmallButton>
                <SmallButton onClick={() => navigate("/buns")}>
                  Friends
                </SmallButton>
                <SmallButton onClick={() => filterByBuns()}>
                  Show only your buns' posts
                </SmallButton>
                <h2>Filter:</h2>
                <p>by date:</p>
                <div className="form-group">
                  <label>From</label>
                  <Input
                    value={filters?.dateFrom || ""}
                    type="date"
                    onChange={(e) =>
                      setFilters({ ...filters, dateFrom: e.target.value })
                    }
                  ></Input>
                </div>

                <div className="form-group">
                  <label>To</label>
                  <Input
                    value={filters?.dateTo || ""}
                    type="date"
                    onChange={(e) =>
                      setFilters({ ...filters, dateTo: e.target.value })
                    }
                  ></Input>
                </div>

                <div className="form-group">
                  <p>By Publisher name:</p>
                  <Input
                    value={filters?.publisher || ""}
                    placeholder={"name"}
                    onChange={(e) =>
                      setFilters({ ...filters, publisher: e.target.value })
                    }
                  ></Input>
                </div>

                <div className="form-group">
                  <p>By Radius from your location: (in km)</p>
                  <Input
                    value={filters?.radius || ""}
                    type={"number"}
                    onChange={(e) =>
                      setFilters({ ...filters, radius: e.target.value })
                    }
                  ></Input>
                </div>

                <div className="form-group">
                  <p>By tagged users (split by ",")</p>
                  <Input
                    value={filters?.tagged?.join(",") || ""}
                    placeholder={"name"}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        tagged: e.target.value.split(","),
                      })
                    }
                  ></Input>
                </div>

                <div className="form-group">
                  <p>By post tags (split by ",")</p>
                  <Input
                    value={filters?.tags?.join(",") || ""}
                    placeholder={"name"}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        tags: e.target.value.split(","),
                      })
                    }
                  ></Input>
                </div>
                <SmallButton isactive={1} onClick={applyFilters}>
                  Apply Filters
                </SmallButton>
                <SmallButton
                  onClick={() => {
                    setFilteredPosts(posts);
                    setFilters({});
                  }}
                >
                  reset filters
                </SmallButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
