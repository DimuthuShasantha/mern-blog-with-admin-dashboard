import {
  Alert,
  Button,
  FileInput,
  Select,
  Spinner,
  TextInput,
} from "flowbite-react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { HiInformationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";

export default function UpdatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [publish, setPublish] = useState(false);
  const navigate = useNavigate();
  const { postId } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if(!res.ok) {
            console.log(data.message);
            setPublishError(data.message);
            return;
        } else {
            setPublishError(null);
            setFormData(data.posts[0]);
        }
      } catch (error) {
        setPublishError(error);
        console.log(error);
      }
    };
    fetchPost();
  }, [postId]);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image!");
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.mame;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image must be less than 2MB!");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadError(null);
            setImageUploadProgress(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload faild!");
      setImageUploadProgress(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setPublish(true);
      setPublishError(null);
      const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        setPublish(false);
        return;
      } else {
        setPublish(false);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError(error.message);
      setPublish(false);
    }
  };
  return (
    <div className="max-w-3xl min-h-screen p-3 mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Update Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row">
          <TextInput
            type="text"
            placeholder="Title"
            id="title"
            className="flex-1"
            required
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData.category}
          >
            <option value="uncategorized">Select a Category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="next14">Next 14</option>
          </Select>
        </div>
        <div className="flex items-center justify-between gap-4 p-3 border-4 border-teal-500 border-dotted">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            size="sm"
            gradientDuoTone="purpleToBlue"
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <>
                <Spinner size="sm" />
                {`${imageUploadProgress || 0}%`}
                <span className="px-2">Uploading...</span>
              </>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {formData.image && (
          <img
            src={formData.image}
            className="object-cover w-full h-72"
            alt="upload image"
          />
        )}
        {imageUploadError && (
          <Alert
            className="py-3 mt-5"
            color="failure"
            icon={HiInformationCircle}
          >
            {imageUploadError}
          </Alert>
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="mb-12 h-72"
          required
          value={formData.content}
          onChange={(value) => setFormData({ ...formData, content: value })}
        />
        <Button
          type="submit"
          gradientDuoTone={"purpleToPink"}
          disabled={publish || imageUploadProgress}
        >
          {publish ? (
            <>
              <Spinner size="sm" />
              <span className="pl-3">Updating...</span>
            </>
          ) : (
            "Update Post"
          )}
        </Button>
        {publishError && (
          <Alert
            className="py-3 mt-5"
            color="failure"
            icon={HiInformationCircle}
          >
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
