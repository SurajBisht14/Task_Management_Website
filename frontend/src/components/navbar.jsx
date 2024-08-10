import img from '../images/Logo2.png';
import { NavLink } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import '../Css/nav.css';
const BackendUrl = import.meta.env.VITE_BACKEND_URL;

function Navbar() {

    const sliderNav = useRef(null);
    const showHiddenDiv = useRef(null);
    const [showNav, setshowNav] = useState(false);
    const profilePhoto = localStorage.getItem('profilePhoto');
    const [yesLogOutPage,setyesLogOutPage]=useState(false)


    useEffect(() => {
        if (sliderNav.current) {
            if (showNav) {
                sliderNav.current.style.left = "0";
            } else {
                sliderNav.current.style.left = "-65%";
            }
        }

    }, [showNav])

    function sliderNavFunction() {
        setshowNav(!showNav);
    }
    async function logoutFunction() {
        setyesLogOutPage(false);
        try{
            const response = await fetch(`${BackendUrl}/logout`, {
                method: 'GET',
                credentials: 'include'
            })
            if(response.ok){
                localStorage.removeItem('token');
                localStorage.removeItem('profilePhoto');
                localStorage.removeItem('projectId');
                localStorage.removeItem('tokenExpiration');
                window.location.href = '/';
            }
        }
        catch(error){
            console.log(error)
        }

    }

    return (
        <>
            <header className="w-full h-[10vh] flex relative p-5  shadow-sm">
                {
                    yesLogOutPage &&
                    <div className="h-screen w-screen bg-[rgba(0,0,0,.9)] z-[200] absolute flex items-center justify-center top-0 left-0">
                    <div className="bg-[rgba(255,255,255,.8)]  w-[400px] h-[100px] rounded-lg flex items-center justify-center flex-col  font-serif">
                        <h1 className="text-center text-[20px]">Do you want to log out ?</h1>
                        <div className="flex items-center  justify-center mt-4 gap-5 w-full">
                            <button className="bg-indigo-500 hover:bg-indigo-600 rounded-lg w-[20%] p-1 text-white" onClick={() => setyesLogOutPage(!yesLogOutPage)}>No</button>
                            <button className="bg-indigo-500 hover:bg-indigo-600 rounded-lg w-[20%] p-1 text-white" onClick={logoutFunction}>Yes</button>
                        </div>
                    </div>
                </div>
                }
                <img src={img} className='w-[120px]  absolute top-[-28px]  left-3 ' alt='Logo' />
                <span className='text-[rgb(43,70,139)] absolute  text-[25px] flex lg:hidden items-center left-2'><i className="fa-solid fa-bars" onClick={sliderNavFunction}></i></span>
                <nav className="hidden lg:flex mx-auto items-center gap-10" id="nav1">
                    <NavLink to='/' className="px-3 py-2 text-[rgb(43,70,139)] font-[500]  rounded-md  border-b-4 border-transparent transition-all   hover:cursor-pointer">Home</NavLink>
                    <NavLink to='/workspace' className="px-3 py-2 text-[rgb(43,70,139)] font-[500]  rounded-md  border-b-4 border-transparent transition-all   hover:cursor-pointer " >Workspace</NavLink>
                    <NavLink to='/signUp' className="px-3 py-2 text-[rgb(43,70,139)] font-[500]  rounded-md  border-b-4 border-transparent transition-all   hover:cursor-pointer " >SignUp</NavLink>
                    {profilePhoto ?
                        <button className="px-6  text-[rgb(43,70,139)] font-[500]   hover:cursor-pointer    hover:text-red-500" onClick={()=>setyesLogOutPage(!yesLogOutPage)}>Logout</button>
                        :
                        <NavLink to='/login' className="px-6 text-[rgb(43,70,139)] font-[500]   hover:cursor-pointer" onClick={() => { setshowNav(false) }}>Login</NavLink>
                    }
                </nav>
                <div className='h-full flex items-center'>
                    <span className="rounded-[50%] overflow-hidden  text-[rgb(43,70,139)] w-[30px] h-[30px]  border-[rgb(43,70,139)] border-2 flex items-center justify-center text-[15px] absolute right-4">
                        {profilePhoto ?
                            <img src={profilePhoto} className='h-full w-full object-cover' />
                            :
                            <i className="fa-solid fa-user"></i>
                        }
                    </span>
                </div>
                {/* mobile navbar */}
                {
                    showNav &&
                    <div className='h-[90vh]  w-screen absolute bottom-[-90vh] left-0 bg-[rgba(0,0,0,.5)] z-[100]' ref={showHiddenDiv}></div>
                }
                <div className='h-[90vh]  w-[50%]  absolute bottom-[-90vh] sm:w-[40%] flex flex-col  text-left  border-t-2 left-[-65%] transition-all duration-300 ease-linear bg-white z-[100]' ref={sliderNav} id="nav2">
                    <NavLink to='/' className="px-6 text-[rgb(43,70,139)] font-[500]  hover:cursor-pointer    mt-10" onClick={() => { setshowNav(false) }}>Home</NavLink>
                    <NavLink to='/workspace' className="px-6 text-[rgb(43,70,139)] font-[500] hover:cursor-pointer  mt-10" onClick={() => { setshowNav(false) }}>Workspace</NavLink>
                    <NavLink to='/signUp' className="px-6 text-[rgb(43,70,139)] font-[500]  hover:cursor-pointer    mt-10 " onClick={() => { setshowNav(false) }}>SignUp</NavLink>
                    {profilePhoto ?
                        <button className="px-6 text-[rgb(43,70,139)] font-[500]   hover:cursor-pointer    mt-10 text-left " onClick={()=>setyesLogOutPage(!yesLogOutPage)}>Logout</button>
                        :
                        <NavLink to='/login' className="px-6 text-[rgb(43,70,139)] font-[500]   hover:cursor-pointer    mt-10 " onClick={() => { setshowNav(false) }}>Login</NavLink>
                    }
                </div>
            </header>
        </>
    )
}

export default Navbar;

