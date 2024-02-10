import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Modal,
  Table,
  TableBody,
  Button,
  TextInput,
  Spinner,
} from "flowbite-react";
import { Link } from "react-router-dom";
import { set } from "mongoose";
import { FaCircleExclamation } from "react-icons/fa6";
// import Pagination from "./Pagination";

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");
  const [searchPost, setSearchPost] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
          setLoading(false);
        }
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        { method: "DELETE" }
      );
      const data = res.json();
      if (!res.ok) {
        console.log(data.message);
        return;
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSearchPost = async (e) => {
    setSearchPost(e.target.value);
    const res = await fetch(
      `api/post/getposts?userId=${currentUser._id}&searchTerm=${searchPost}`
    );
    const data = await res.json();
    if (res.ok) {
      setUserPosts(data.posts);
      if (data.posts.length < 9) {
        setShowMore(false);
      } else {
        setShowMore(true);
      }
    }
  };

  return (
    <div className="p-3 overflow-x-scroll table-auto md:mx-auto scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {loading ? (
        <div>
          <Spinner
            size="xl"
            className="flex items-center justify-center min-h-screen"
          />
        </div>
      ) : (
        <>
          {currentUser.isAdmin && userPosts.length > 0 ? (
            <>
              <div className="flex justify-end my-3">
                <TextInput
                  placeholder="Search..."
                  onChange={handleSearchPost}
                  type="search"
                />
              </div>
              <Table hoverable className="shadow-md">
                <Table.Head>
                  <Table.HeadCell>Date Updated</Table.HeadCell>
                  <Table.HeadCell>Post Image</Table.HeadCell>
                  <Table.HeadCell>Post Title</Table.HeadCell>
                  <Table.HeadCell>Category</Table.HeadCell>
                  <Table.HeadCell>
                    <span>Edit</span>
                  </Table.HeadCell>
                  <Table.HeadCell>Delete</Table.HeadCell>
                </Table.Head>
                <TableBody className="divide-y">
                  {userPosts.map((post) => (
                    <Table.Row
                      key={post._id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell>
                        {new Date(post.updatedAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>
                        <Link>
                          <img
                            src={post.image}
                            alt={post.title}
                            className="object-cover w-20 h-20 bg-gray-500"
                          />
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        <Link
                          className="font-medium text-gray-900 dark:text-white"
                          to={`/post/${post.slug}`}
                        >
                          {post.title}
                        </Link>
                      </Table.Cell>
                      <Table.Cell>{post.category}</Table.Cell>
                      <Table.Cell>
                        <Link to={`/update-post/${post._id}`}>
                          <span className="text-teal-500 cursor-pointer fonr-medium hover:underline">
                            Edit
                          </span>
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        <span
                          onClick={() => {
                            setShowModal(true);
                            setPostIdToDelete(post._id);
                          }}
                          className="text-red-500 cursor-pointer fonr-medium hover:underline"
                        >
                          Delete
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </TableBody>
              </Table>
              {showMore && (
                <button
                  className="self-center w-full text-sm text-teal-500 py-7"
                  onClick={handleShowMore}
                >
                  Show more
                </button>
              )}
            </>
          ) : (
            <p>You have no posts yet!</p>
          )}
          <Modal
            show={showModal}
            onClose={() => setShowModal(false)}
            popup
            size="md"
          >
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <FaCircleExclamation className="mx-auto mb-4 text-red-400 w-14 h-14 dark:text-gray-200" />
                <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                  Are you sure want to delete this post?
                </h3>
                <div className="flex justify-center gap-4">
                  <Button color="failure" onClick={handleDeletePost}>
                    Yes, I am sure
                  </Button>
                  <Button color="gray" onClick={() => setShowModal(false)}>
                    No, Cancel
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </>
      )}
    </div>
  );
}
