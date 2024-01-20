import { Link } from "react-router-dom";
import { Button, Label, TextInput } from "flowbite-react";

export default function Signup() {
  return (
    <div className="min-h-screen mt-20 ">
      <div className="flex flex-col max-w-3xl gap-5 mx-auto md:flex-row md:items-center">
        <div className="flex-1">
          <Link
            to="/"
            className="text-4xl font-bold dark:text-white"
          >
            <span className="px-2 py-1 text-white rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Dimu's
            </span>
            Blog
          </Link>
          <p className="mt-5 text-sm">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eveniet quidem ratione optio !</p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-4">
            <div>
              <Label value="Your Username" />
              <TextInput
                type="text"
                id="username"
                placeholder="Username"
              />
            </div>
            <div>
              <Label value="Your Email" />
              <TextInput
                type="email"
                id="email"
                placeholder="Email Address"
              />
            </div>
            <div>
              <Label value="Your Password" />
              <TextInput
                type="password"
                id="password"
                placeholder="password"
              />
            </div>
            <Button gradientDuoTone="purpleToPink" type="submit">
              Sign Up
            </Button>
          </form>
          <div className="flex justify-center gap-2 mt-3 text-sm">
            <span>Have an account?</span>
            <Link to="/signin" className="text-blue-500">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
