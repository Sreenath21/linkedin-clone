import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import axios from "axios";

import Input from "./Input";
import { handlePostState, useSSRPostState } from "../atoms/postAtom";
import Post from "./Post";

const Feed = ({ posts }) => {
  const [realTimePosts, setRealTimePosts] = useState([]);
  const [handlePost, setHandlePost] = useRecoilState(handlePostState);
  const [useSSRPosts, setUseSSRPosts] = useRecoilState(useSSRPostState);

  // const isMounted = useRef(false);

  useEffect(() => {
    const fetchPosts = async () => {
      // const { data } = await axios.get(`${process.env.NEXTAUTH_URL}/api/posts`);

      // Production Url
      const { data } = await axios.get(
        "https://linkedin-clone-chi-lime.vercel.app/api/posts"
      );
      setRealTimePosts(data);
      setHandlePost(false);
      setUseSSRPosts(false);
    };

    fetchPosts();
  }, [handlePost]);

  // console.log(realTimePosts);

  return (
    <div className="space-y-6 pb-24 max-w-lg">
      <Input />

      {/* Posts */}
      {useSSRPosts
        ? posts.map((post) => <Post key={post._id} post={post} />)
        : realTimePosts.map((post) => <Post key={post._id} post={post} />)}
    </div>
  );
};

export default Feed;
