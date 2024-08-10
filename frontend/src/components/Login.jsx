import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Loader from './Loader.jsx'; 
import AlertBox from './alertbox';
const BackendUrl = import.meta.env.VITE_BACKEND_URL;

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [messsages, setmessages] = useState({
        type: "",
        msgValue: ""
    })
    const [showLoader,setshowLoader]=useState(false);

    async function submitFunction(e) {
        e.preventDefault(); 
        try{
            setshowLoader(true);
            const response = await fetch(`${BackendUrl}/login`, {
                method: 'POST',
                headers : {
                    "Content-Type" :'application/json',
                },
                body : JSON.stringify(formData),
                credentials : 'include' //cookies included
            });
            
            if(response.ok){
                const data = await response.json();
                localStorage.setItem('profilePhoto', `${data.image}`);
                localStorage.setItem('token',data.tokenValue);
                localStorage.setItem('tokenExpiration',data.expirationTime)
                 window.location.href = '/'
               setFormData({
                ...formData,   
                    email: "",
                    password: "",
               })        
            }
            else{
                const data = await response.json();
                setmessages({
                    ...messsages,
                    type: "error",
                    msgValue : data.msg
                   })
                   setTimeout(()=>{
                    setmessages({
                        ...messsages,
                        type: "",
                        msgValue : ""
                       })
                   },4000) 
            }
        }
        catch(error){
            console.log(error);
        }
        finally{
            setTimeout(()=>setshowLoader(false),500);
        }
    }

    function handleInput(e) {
        const { name, value} = e.target;
        setFormData(prevFormData => ({
          ...prevFormData,
          [name]: value
      }));
    }

    return (
        <>
            <div className="flex h-[90vh] w-full bg-[rgb(43,70,139)] relative overflow-hidden">
                {showLoader && <Loader/>}         
                {
                    messsages.msgValue.length > 0 &&
                    <AlertBox text={messsages} />
                }
                <div className="w-[95%] sm:w-[400px]  h-[450px] m-auto bg-indigo-100 rounded p-5 relative">
                    <form onSubmit={submitFunction}>
                        
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
                            <input
                                className="w-full bg-[rgb(43,70,139)]  text-white font-bold py-2 px-4 mb-6 rounded hover:cursor-pointer hover:bg-blue-700"
                                type="submit"
                            />
                        </div>
                    </form>
                    <footer className='absolute bottom-3  w-[90%]'>
                        <Link className="text-[rgb(43,70,139)] text-sm inline-block w-full text-right" to="/signUp">Don't have an account ?</Link>
                    </footer>
                </div>
            </div>
        </>
    )
}

export default Login;
