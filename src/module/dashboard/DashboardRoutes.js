import React from "react";
import { Route, Routes } from "react-router-dom";
import DashboardPage from "../../pages/DashboardPage";
import CategoryAddNew from "../category/CategoryAddNew";
import CategoryManage from "../category/CategoryManage";
import CategoryUpdate from "../category/CategoryUpdate";
import PostAddNew from "../posts/PostAddNew";
import PostManage from "../posts/PostManege";
import PostUpdate from "../posts/PostUpdate";
import UserAddNew from "../user/UserAddNew";
import UserManage from "../user/UserManage";
import UserProfile from "../user/UserProfile";
import UserUpdate from "../user/UserUpdate";

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route index element={<DashboardPage />} />

      <Route path="post">
        <Route index element={<PostManage />} />
        <Route path="add" element={<PostAddNew />} />
        <Route path="update" element={<PostUpdate />} />
      </Route>

      <Route path="category">
        <Route index element={<CategoryManage />} />
        <Route path="add" element={<CategoryAddNew />} />
        <Route path="update" element={<CategoryUpdate />} />
      </Route>

      <Route path="user">
        <Route index element={<UserManage />} />
        <Route path="update" element={<UserUpdate />} />
        <Route path="add" element={<UserAddNew />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>

      <Route path="/profile" element={<UserProfile />} />
    </Routes>
  );
};

export default DashboardRoutes;
