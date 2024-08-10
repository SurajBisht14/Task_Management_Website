import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import AlertBox from './alertbox';
const BackendUrl = import.meta.env.VITE_BACKEND_URL;
import Loader from './Loader.jsx'

function SignUp() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        profileImage: null
    });

    const [messsages, setmessages] = useState({
        type: "",
        msgValue: ""
    })
    const [showLoader,setshowLoader]=useState(false);

    function handleInput(e) {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: files[0] // Handle file input
            }));
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: value
            }));
        }
    }
    async function submitFunction(e) {
        e.preventDefault();

        // Create a FormData object
        const formDataToSend = new FormData();

        formDataToSend.append('username', formData.username);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);
        if (formData.profileImage) {
            formDataToSend.append('profileImage', formData.profileImage);
        }

        try {
            setshowLoader(true);
            const response = await fetch(`${BackendUrl}/signup`, {
                method: 'POST',
                body: formDataToSend // Send the FormData object
            });
            if (response.ok) {
                const responseData = await response.json();
                setmessages((prev) => ({
                    ...prev,
                    type: "success",
                    msgValue: responseData.msg
                }));
                setFormData({
                    username: "",
                    email: "",
                    password: "",
                    profileImage: null
                })
                setTimeout(()=>{
                    setmessages((prev)=>({
                        ...prev,
                        type:"",
                        msgValue:""
                    }))
                },4000)
            } 
            else {
                const errorData = await response.json();
                setmessages((prev) => ({
                    ...prev,
                    type: "error",
                    msgValue: errorData.msg || response.statusText // Ensure 'msg' matches backend response
                }));

                setTimeout(()=>{
                    setmessages((prev)=>({
                        ...prev,
                        type:"",
                        msgValue:""
                    }))
                },4000)
            }
        } catch (error) {
            console.error("Error during fetch:", error);
        }
        finally{
            setTimeout(()=>setshowLoader(false),500)
        }
    }



    return (
        <>
            <div className="flex h-[90vh] w-full bg-[rgb(43,70,139)] relative overflow-hidden">
            
               {showLoader && <Loader/>}
                {
                    messsages.msgValue.length > 0 &&
                    <AlertBox text={messsages} />
                }
                <div className="w-[95%] sm:w-[400px] m-auto bg-indigo-100 rounded p-5 relative">
                    <form onSubmit={submitFunction} encType="multipart/form-data">
                        <div>
                            <label className="block mb-2 text-[rgb(43,70,139)]" htmlFor="username">Username</label>
                            <input
                                className="w-full p-2 mb-6 text-[rgb(43,70,139)] border-b-2 border-[rgb(43,70,139)] outline-none focus:bg-gray-300"
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInput}
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-[rgb(43,70,139)]" htmlFor="email">Email</label>
                            <input
                                className="w-full p-2 mb-6 text-[rgb(43,70,139)] border-b-2 border-[rgb(43,70,139)] outline-none focus:bg-gray-300"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInput}
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-[rgb(43,70,139)]" htmlFor="password">Password</label>
                            <input
                                className="w-full p-2 mb-6 text-[rgb(43,70,139)] border-b-2 border-[rgb(43,70,139)] outline-none focus:bg-gray-300"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInput}
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-[rgb(43,70,139)]" htmlFor="profileImage">Choose Profile Photo</label>
                            <input
                                className="w-full p-2 mb-6 text-[rgb(43,70,139)] border-b-2 border-[rgb(43,70,139)] outline-none focus:bg-gray-300"
                                type="file"
                                name="profileImage"
                                onChange={handleInput}
                            />
                        </div>
                        <div>
                            <input
                                className="w-full bg-[rgb(43,70,139)]  text-white font-bold py-2 px-4 mb-6 rounded hover:cursor-pointer hover:bg-blue-700"
                                type="submit"
                            />
                        </div>
                    </form>
                    <footer>
                        <Link className="text-[rgb(43,70,139)]  text-sm float-right" to="/login">Already have an account?</Link>
                    </footer>
                </div>
            </div>
        </>
    )
}

export default SignUp;
