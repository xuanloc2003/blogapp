import { async } from "@firebase/util";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import React, { useState } from "react";
import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import Heading from "../components/layout/Heading";
import Layout from "../components/layout/Layout";
import { db } from "../firebase-app/firebase-config";
import PostCategory from "../module/posts/PostCategory";
import PostImage from "../module/posts/PostImage";
import PostItem from "../module/posts/PostItem";
import PostMeta from "../module/posts/PostMeta";
import NotFoundPage from "./NotFoundPage";
import parse from "html-react-parser";
import AuthorBox from "../components/author/AuthorBox";
import PostRelated from "../module/posts/PostRelated";
import slugify from "slugify";
const PostDetailsPageStyles = styled.div`
  padding-bottom: 100px;
  .post {
    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 40px;
      margin: 40px 0;
    }
    &-feature {
      width: 100%;
      max-width: 640px;
      height: 466px;
      border-radius: 20px;
    }
    &-heading {
      font-weight: bold;
      font-size: 36px;
      margin-bottom: 16px;
    }
    &-info {
      flex: 1;
    }
    &-content {
      max-width: 700px;
      margin: 80px auto;
    }
  }
  .author {
    margin-top: 40px;
    display: flex;
    border-radius: 20px;
    background-color: ${(props) => props.theme.grayF3};
    &-image {
      width: 200px;
      height: 200px;
      flex-shrink: 0;
      border-radius: inherit;
    }
    &-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
    }
    &-content {
      flex: 1;
      padding: 20px;
    }
    &-name {
      font-weight: bold;
      margin-bottom: 20px;
      font-size: 20px;
    }
    &-desc {
      font-size: 14px;
      line-height: 2;
    }
  }
`;

const PostDetailsPage = () => {
  const { slug } = useParams();
  const [postInfo, setPostInfo] = useState({});
  console.log("🚀 ~ file: PostDetailsPage.js ~ line 84 ~ PostDetailsPage ~ postInfo", postInfo)
  useEffect(() => {
    async function fetchData() {
      if (!slug) return;
      const colRef = query(collection(db, "posts"), where("slug", "==", slug));
      onSnapshot(colRef, (snapshot) => {
        snapshot.forEach((doc) => {
          doc.data() && setPostInfo(doc.data());
        });
      });
    }
    fetchData();
  }, [slug]);
  if (!slug) return <NotFoundPage></NotFoundPage>;
  if (!postInfo.title) return null;
  const date = postInfo?.createdAt?.seconds
  ? new Date(postInfo?.createdAt?.seconds * 1000)
  : new Date();
const formatDate = new Date(date).toLocaleDateString("vi-VI");
  const { user } = postInfo;
  return (
    <PostDetailsPageStyles>
      <Layout>
        <div className="container">
          <div className="post-header">
            <PostImage
              url={postInfo.image}
              className="post-feature"
            ></PostImage>
            <div className="post-info">
              <PostCategory classname="mb-6">
                {postInfo.category?.name}
              </PostCategory>
              <h1 className="post-heading">{postInfo.title}</h1>
              <PostMeta
                to={slugify(postInfo.user?.username || "", { lower: true })}
                authorName={postInfo.user?.fullname}
                date={formatDate}
              ></PostMeta>
            </div>
          </div>
          <div className="post-content">
            <div className="entry-content">{parse(postInfo.content || "")}</div>
            <AuthorBox userId={user.id}></AuthorBox>
          </div>
          <PostRelated categoryId={postInfo?.categoryId}></PostRelated>
        </div>
      </Layout>
    </PostDetailsPageStyles>
  );
};

export default PostDetailsPage;
