import { Link, NavLink } from "react-router-dom";
import slugify from "slugify";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostImage from "./PostImage";
import PostMeta from "./PostMeta";
import PostTitle from "./PostTitle";
const PostFeatureItemStyles = styled.div`
  width: 100%;
  border-radius: 16px;
  position: relative;
  height: 169px;
  .post {
    &-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 16px;
    }
    &-overlay {
      position: absolute;
      inset: 0;
      border-radius: 16px;
      background: linear-gradient(
        179.77deg,
        #6b6b6b 36.45%,
        rgba(163, 163, 163, 0.622265) 63.98%,
        rgba(255, 255, 255, 0) 99.8%
      );
      mix-blend-mode: multiply;
      opacity: 0.6;
    }
    &-content {
      position: absolute;
      inset: 0;
      z-index: 10;
      padding: 20px;
      color: white;
    }
    &-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    &-title {
      font-weight: bold;
      line-height: 1.5;
      display: block;
      font-size: 22px;
      color: white;
    }
    &-time {
      right: 10px;
      bottom: 10px;
      position: absolute;
      font-weight: bold;
    }
    &-author {
      left: 10px;
      bottom: 10px;
      position: absolute;
      font-weight: bold;
      margin-right: 10px;
      font-size: medium;
      background-color: #2ebac1;
      padding: 5px 10px;
      border-radius: 20px;
    }
  }
  @media screen and (min-width: 1024px) {
    height: 272px;
  }
`;
const PostFeatureItem = ({ data }) => {
console.log("🚀 ~ file: PostFeatureItem.js ~ line 76 ~ PostFeatureItem ~ data", data)
  // const [category, setCategory] = useState("");
  // const [user, setUser] = useState("");
  // // useEffect(() => {
  // //   async function fetch() {
  // //     const docRef = doc(db, "categories", data.categoryId);
  // //     const docSnap = await getDoc(docRef);
  // //     setCategory(docSnap.data());
  // //   }
  // //   fetch();
  // // }, [data.categoryId]);
  // useEffect(() => {
  //   async function fetchUser() {
  //     const docRef = doc(db, "user", data.userID);
  //     const docSnap = await getDoc(docRef);
  //     setUser(docSnap.data());
  //   }
  //   fetchUser();
  // }, [data.userID]);
  // console.log(user);
  if (!data || !data.id) return null;
  const date = data?.createdAt?.seconds
    ? new Date(data?.createdAt?.seconds * 1000)
    : new Date();
  const formatDate = new Date(date).toLocaleDateString("vi-VI");
  const { category, user } = data;
  return (
    <PostFeatureItemStyles>
      <PostImage url={data.image} alt="unsplash"></PostImage>
      <div className="post-overlay"></div>
      <div className="post-content">
       
        <div className="post-top">
          {category?.name && (
            <PostCategory to={category.slug}>{category?.name}</PostCategory>
          )}
          <PostMeta
            to={slugify(user?.username || "", { lower: true })}
            authorName={user?.fullname}
            date={formatDate}
          ></PostMeta>
        </div>
        <PostTitle to={data.slug} size="big">
          {data.title}
        </PostTitle>
      </div>
    </PostFeatureItemStyles>
  );
};

export default PostFeatureItem;
