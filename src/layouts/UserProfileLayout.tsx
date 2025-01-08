import React, { useEffect } from "react";
import ProfileNavigation from "../components/user/ProfileNavigation";
import ProfileCard from "../components/user/cards/ProfileCard";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";


const UserProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const isLogged = useSelector((state: RootState) => state.user.isLogged);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogged) {
      navigate("/login");
    }
  }, [isLogged, navigate]);
  
  return (
    <div className="bg-white min-h-screen p-4">
    <div className="max-w-6xl mx-auto">
      <ProfileNavigation />
      <div className="flex flex-col md:flex-row gap-4">
        <ProfileCard/>
        <>{children}</>
      </div>
    </div>
  </div>
  
  );
};

export default UserProfileLayout;
