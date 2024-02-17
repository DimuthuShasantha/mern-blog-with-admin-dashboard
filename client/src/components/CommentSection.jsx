import { Alert, Button, TextInput, Textarea } from "flowbite-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function CommentSection({ postId }) {
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    setCommentError(null);
    e.preventDefault();
    if (comment.length > 200) return;
    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment("");
        setCommentError(null);
      } 
    } catch (error) {
      setCommentError(error.message);
    }
  };

  return (
    <div className="w-full max-w-2xl p-3 mx-auto">
      {currentUser ? (
        <div className="flex items-center gap-2 my-5 text-sm text-gray-500">
          <p>Signed as: </p>
          <img
            className="object-cover w-5 h-5 rounded-full"
            src={currentUser.avatar}
            alt=""
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="">
          You must be signed in to comment.
          <Link className="text-xs text-cyan-500 hover:underline" to="/signin">
            Sign in
          </Link>
        </div>
      )}
      {currentUser && (
        <>
          <form
            onSubmit={handleSubmit}
            className="p-3 border border-teal-500 rounded-md"
          >
            <Textarea
              placeholder="Add a comment..."
              rows="3"
              maxLength="200"
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
            <div className="flex items-center justify-between mt-5">
              <p className="text-xs text-gray-500">
                {200 - comment.length} characters remaining
              </p>
              <Button gradientDuoTone={"purpleToBlue"} type="submit" outline>
                Submit
              </Button>
            </div>
          </form>
          {commentError && (
            <Alert color="failure" className="mt-5">{commentError}</Alert>
          )}
        </>
      )}
    </div>
  );
}
