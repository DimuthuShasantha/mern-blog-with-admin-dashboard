import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, TableBody } from "flowbite-react";
import { Link } from "react-router-dom";

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
      const data = await res.json();
      if (!res.ok) {
        return;
      } else {
        setUserPosts(data.posts);
      }
    };
    currentUser.isAdmin && fetchPosts();
  }, [currentUser._id]);
  return (
    <div className="p-3 overflow-x-scroll table-auto md:mx-auto scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <Table hoverable clasName="shadow-md">
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
          {userPosts.map((post) => (
            <TableBody className="divide-y">
              <Table.Row key={post._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>
                  {new Date(post.updatedAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <Link>
                    <img src={post.image} alt={post.title} className="object-cover w-20 h-20 bg-gray-500" />
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Link className="font-medium text-gray-900 dark:text-white" to={`/post/${post.slug}`}>{post.title}</Link>
                </Table.Cell>
                <Table.Cell>{post.category}</Table.Cell>
                <Table.Cell><Link to={`/update-post/${post._id}`}><span className="text-teal-500 cursor-pointer fonr-medium hover:underline">Edit</span></Link></Table.Cell>
                <Table.Cell><span className="text-red-500 cursor-pointer fonr-medium hover:underline">Delete</span></Table.Cell>
              </Table.Row>
            </TableBody>
          ))}
        </Table>
      ) : (
        <p>You have no posts yet!</p>
      )}
    </div>
  );
}
