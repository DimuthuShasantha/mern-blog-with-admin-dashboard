import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Modal,
  Table,
  TableBody,
  Button,
  Spinner,
  Tooltip,
  TextInput,
} from "flowbite-react";
import { Link } from "react-router-dom";
import { FaCircleCheck, FaCircleExclamation, FaTrash } from "react-icons/fa6";
import { FaEdit, FaTimesCircle } from "react-icons/fa";

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchUser, setSearchUser] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setLoading(false);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        setLoading(false);
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(
        `/api/user/getusers?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteuser = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: "DELETE",
      });
      const data = res.json();
      if (!res.ok) {
        console.log(data.message);
        return;
      } else {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSearchUser = async (e) => {
    setSearchUser(e.target.value);
    const res = await fetch(
      `api/user/getusers?userId=${currentUser._id}&searchTerm=${searchUser}`
    );
    const data = await res.json();
    if (res.ok) {
      setUsers(data.users);
      if (data.users.length < 9) {
        setShowMore(false);
      } else {
        setShowMore(true);
      }
    }
    if (searchUser.length === "") {
      fetchPosts();
    }
  };

  return (
    <div className="p-3 overflow-x-scroll table-auto md:mx-auto scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {loading ? (
        <Spinner
          size="xl"
          className="flex justify-center items-center min-h-screen"
        />
      ) : (
        <>
          {currentUser.isAdmin && users.length > 0 ? (
            <>
              <div className="flex justify-end my-3">
                <TextInput
                  placeholder="Search..."
                  onChange={handleSearchUser}
                  type="search"
                />
              </div>
              <Table hoverable className="shadow-md">
                <Table.Head>
                  <Table.HeadCell>Date Created</Table.HeadCell>
                  <Table.HeadCell>Profile Picture</Table.HeadCell>
                  <Table.HeadCell>Name</Table.HeadCell>
                  <Table.HeadCell>Email</Table.HeadCell>
                  <Table.HeadCell>
                    <span>Status</span>
                  </Table.HeadCell>
                  <Table.HeadCell>Edit</Table.HeadCell>
                  <Table.HeadCell>Delete</Table.HeadCell>
                </Table.Head>
                <TableBody className="divide-y">
                  {users.map((user) => (
                    <Table.Row
                      key={user._id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>
                        <Link>
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="object-cover w-10 h-10 bg-gray-500 rounded-full"
                          />
                        </Link>
                      </Table.Cell>
                      <Table.Cell>{user.username}</Table.Cell>
                      <Table.Cell>{user.email}</Table.Cell>
                      <Table.Cell>
                        {user.isAdmin ? (
                          <FaCircleCheck className="text-green-500 w-4 h-4" />
                        ) : (
                          <FaTimesCircle className="text-orange-400 h-4 w-4" />
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <Tooltip content="Edit">
                          <Link to="/">
                            <FaEdit className="h-5 w-5 text-blue-500 cursor-pointer" />
                          </Link>
                        </Tooltip>
                      </Table.Cell>
                      <Table.Cell>
                        <Tooltip content="Delete">
                          <FaTrash
                            onClick={() => {
                              setShowModal(true);
                              setUserIdToDelete(user._id);
                            }}
                            className="text-red-500 cursor-pointer fonr-medium hover:underline h-4 w-4"
                          />
                        </Tooltip>
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
            <p>You have no users yet!</p>
          )}
        </>
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
            <FaCircleExclamation className="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteuser}>
                Yes, I am sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
