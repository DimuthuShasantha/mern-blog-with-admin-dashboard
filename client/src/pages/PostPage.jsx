import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Spinner } from "flowbite-react";
import CallToAction from "../components/CallToAction";

export default function PostPage() {
  const { postSlug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.message);
          setLoading(false);
        } else {
          setPost(data.posts[0]);
          setLoading(false);
          setError(null);
        }
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Spinner size="xl" />
        </div>
      ) : (
        <div>
          <main className="flex flex-col max-w-6xl min-h-screen p-3 mx-auto">
            <h1 className="max-w-2xl p-3 mx-auto mt-10 font-serif text-3xl text-center lg:text-4xl">
              {post && post.title}
            </h1>
            <Link
              className="self-center mt-5"
              to={`/search?category=${post && post.category}`}
            >
              <Button color="gray" size="xs">
                {post && post.category}
              </Button>
            </Link>
            <img src={post && post.image} alt={post && post.image} className="p-3 mt-10 max-h-[600px] object-cover w-full" />
            <div className="flex justify-between w-full max-w-2xl p-3 mx-auto text-xs border-b border-slate-500">
                <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
                <span className="italic">{post && (post.content.length / 1000).toFixed(0)} mins read</span>
            </div>
            <div className="w-full max-w-2xl p-3 mx-auto post-content" dangerouslySetInnerHTML={{ __html: post && post.content }}>
                
            </div>
            <div className="w-full max-w-4xl mx-auto">
              <CallToAction />
            </div>
          </main>
        </div>
      )}
    </>
  );
}
