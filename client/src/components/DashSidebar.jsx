import { Sidebar } from "flowbite-react";
import {
  HiArrowSmRight,
  HiDocumentAdd,
  HiDocumentText,
  HiUser,
} from "react-icons/hi";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { signOutFaluire, signOutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function DashSidebar() {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFormUrl = urlParams.get("tab");
    tabFormUrl && setTab(tabFormUrl);
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/user/signout");
      const data = await res.json();
      if (!res.ok) {
        dispatch(signOutFaluire(data.message));
      } else {
        dispatch(signOutSuccess(data));
      }
    } catch (error) {
      dispatch(signOutFaluire(data.message));
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              className="cursor-pointer"
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "user"}
              labelColor="dark"
              as={"div"}
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=posts">
              <Sidebar.Item
                className="cursor-pointer"
                active={tab === "posts"}
                icon={HiDocumentText}
                labelColor="dark"
                as={"div"}
              >
                Posts
              </Sidebar.Item>
            </Link>
          )}

          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignOut}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
