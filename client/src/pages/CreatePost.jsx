import { Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function CreatePost() {
  return (
    <div className="max-w-3xl min-h-screen p-3 mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Create a Post</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row">
            <TextInput
                type="text"
                placeholder="Title"
                id="title"
                className="flex-1"
                required
            />
            <Select>
              <option value="uncategorized">Select a Category</option>  
              <option value="javascript">JavaScript</option>    
              <option value="reactjs">React.js</option>    
              <option value="next14">Next 14</option>    
            </Select>
        </div>
        <div className="flex items-center justify-center gap-4 p-3 border-4 border-teal-500 border-dotted">
            <FileInput type="file" accept="image/*" />
            <Button type="button" size="sm" gradientDuoTone="purpleToBlue" outline>Upload Image</Button>
        </div>
        <ReactQuill theme="snow" placeholder="Write something..." className="mb-12 h-72" required />
        <Button type="submit" gradientDuoTone={"purpleToPink"} >Publish</Button>
      </form>
    </div>
  )
}
