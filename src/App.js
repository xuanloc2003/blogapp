import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/auth-context";
import CategoryAddNew from "./module/category/CategoryAddNew";
import CategoryManage from "./module/category/CategoryManage";
import CategoryUpdate from "./module/category/CategoryUpdate";
import DashboardLayout from "./module/dashboard/DashBoardLayout";
import ProtectedRoute from "./module/dashboard/ProtectedRoute";
import PostAddNew from "./module/posts/PostAddNew";
import PostManage from "./module/posts/PostManege";
import UserAddNew from "./module/user/UserAddNew";
import UserManage from "./module/user/UserManage";
import UserProfile from "./module/user/UserProfile";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import PostDetailsPage from "./pages/PostDetailsPage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SingInPage";

function App() {
  return (
    <div>
      <AuthProvider>
        <Routes>
          <Route path="/">
            <Route index element={<HomePage />} />
            <Route path="/:slug" element={<PostDetailsPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/sign-in" element={<SignInPage />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard/*" element={<DashboardLayout />} />
          </Route>
          <Route path="*" element={<NotFoundPage></NotFoundPage>}></Route>
        </Routes>
        ;
      </AuthProvider>
    </div>
  );
}

export default App;
