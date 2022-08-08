import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useState } from "react";
import { useEffect } from "react";
import Heading from "../../components/layout/Heading";
import { db } from "../../firebase-app/firebase-config";
import PostItem from "./PostItem";

const PostRelated = ({ categoryId = "" }) => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const docRef = query(
      collection(db, "posts"),
      where("categoryId", "==", categoryId)
    );
    onSnapshot(docRef, (snapshot) => {
      const results = [];
      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setPosts(results);
      console.log(
        "🚀 ~ file: PostRelated.js ~ line 21 ~ useEffect ~ results",
        results
      );
    });
  }, [categoryId]);
  if (!categoryId || posts.length <= 0) return null;
  return (
    <div className="post-related">
      <Heading>Bài viết liên quan</Heading>
      <div className="grid-layout grid-layout--primary">
        {posts.map((item) => (
          <PostItem key={item.id} data={item}></PostItem>
        ))}
      </div>
    </div>
  );
};

export default PostRelated;
