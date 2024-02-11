import { Button } from "flowbite-react";

export default function CallToAction() {
  return (
    <div className="flex flex-col items-center justify-center p-3 text-center border border-teal-500 rounded-br-3xl rounded-tl-3xl sm:flex-row">
       <div className="flex flex-col justify-center flex-1">
        <h2 className="text-2xl">
           Want to learn more about JavaScript? 
        </h2>
        <p className="my-2 text-gray-500">
            Checkout these resources
        </p>
        <Button gradientDuoTone="purpleToPink" className="rounded-bl-none rounded-tl-xl">Learn More</Button>
       </div>
       <div className="flex-1 p-7">
        <img src="https://bairesdev.mo.cloudinary.net/blog/2023/08/What-Is-JavaScript-Used-For.jpg" alt="" />
       </div>
    </div>
  )
}
