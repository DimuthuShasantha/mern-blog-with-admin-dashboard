import {
  Avatar,
  Button,
  Dropdown,
  Navbar,
  NavbarCollapse,
  TextInput,
} from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signOutFaluire, signOutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";

export default function Header() {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFormUrl = urlParams.get("searchTerm");
    if (searchTermFormUrl) {
      setSearchTerm(searchTermFormUrl);
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center text-sm font-semibold whitespace-nowrap sm:text-md dark:text-white"
      >
        <span className="px-2 py-1 text-white rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          Dimu's
        </span>
        Blog
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Button className="w-12 h-12 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button
          className="hidden w-12 h-10 sm:inline"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="user" img={currentUser.avatar} rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to="/dashboard?tab=profile">
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/signin">
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to="/projects">projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
