import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../../components/button";
import { useAuth } from "../../contexts/auth-context";
const DashboardHeaderStyles = styled.div`
  background-color: white;
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  .header-avatar {
    width: 52px;
    height: 52px;
    margin-left: 10px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 100rem;
    }
  }
  .header-left {
    display: flex;
    justify-content: flex-end;
  }
`;

const DashboardHeader = () => {
  const { userData } = useAuth();
  return (
    <DashboardHeaderStyles>
      <div>
        <Button to="/" className="header-button" height="52px">
          Back To Home
        </Button>
      </div>
      <div className="header-left">
        <Button
          to="/dashboard/post/add"
          className="header-button"
          height="52px"
        >
          Write new post
        </Button>
        <Link
          to={`/dashboard/user/profile?id=${userData.uid}`}
          className="header-avatar"
        >
          <img src={userData.avatar} alt="" />
        </Link>
      </div>
    </DashboardHeaderStyles>
  );
};

export default DashboardHeader;
