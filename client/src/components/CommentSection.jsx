import { Alert, Button, TextInput, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Comment from "./Comment";

export default function CommentSection({ postId }) {
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);

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
        setComments([data, ...comments]);
      } else {
        setCommentError(data.message);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
        } else {
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [postId]);

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
            {commentError && (
              <Alert color="failure" className="mt-5">
                {commentError}
              </Alert>
            )}
          </form>
        </>
      )}
      {comments.length === 0 ? (
        <p className="text-sm my-5">No comments yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => {
            return <Comment key={comment._id} comment={comment} />;
          })}
        </>
      )}
    </div>
  );
}
