import { Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";
import SignInPage from "../../pages/SingInPage";
import styles from "./Loading.module.scss";

const ProtectedRoute = () => {
  const { userData, loading } = useAuth();
  if (loading)
    return (
      <div className={styles.loading}>
        <div className={styles.loading_circle}></div>
      </div>
    );
  return !userData ? <SignInPage /> : <Outlet />;
};

export default ProtectedRoute;
