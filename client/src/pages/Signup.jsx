import { Link, useNavigate } from "react-router-dom";
import { Button, Label, TextInput, Alert, Spinner } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { useState } from "react";
import OAuth from "../components/OAuth";

export default function Signup() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.email)
      return setErrorMessage("Please fill out all feilds!");
    try {
      setErrorMessage(null);
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        navigate("/signin");
      }
      if (data.success === false) return setErrorMessage(data.message);
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen mt-20 ">
      <div className="flex flex-col max-w-3xl gap-5 mx-auto md:flex-row md:items-center">
        <div className="flex-1 px-4">
          <Link to="/" className="text-4xl font-bold dark:text-white">
            <span className="px-2 py-1 text-white rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Dimu's
            </span>
            Blog
          </Link>
          <p className="mt-5 text-sm">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eveniet
            quidem ratione optio !
          </p>
        </div>
        <div className="flex-1 px-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label value="Your Username" />
              <TextInput
                type="text"
                id="username"
                placeholder="Username"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your Email" />
              <TextInput
                type="email"
                id="email"
                placeholder="Email Address"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your Password" />
              <TextInput
                type="password"
                id="password"
                placeholder="password"
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign up"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex justify-center gap-2 mt-3 text-sm">
            <span>Have an account?</span>
            <Link to="/signin" className="text-blue-500">
              Sign in
            </Link>
          </div>
          {errorMessage && (
            <Alert
              className="py-3 mt-5"
              color="failure"
              icon={HiInformationCircle}
            >
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
