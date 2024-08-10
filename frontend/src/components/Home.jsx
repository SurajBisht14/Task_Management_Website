import React from 'react';
import '../Css/home.css';
import img from '../images/meeting4.jpg'
import { Link } from 'react-router-dom'

function Home(){
    return (
        <>
            <div className="w-screen h-[90vh] relative">
                <div className='w-full h-full overflow-y-scroll overflow-x-hidden flex flex-col-reverse lg:flex-row justify-around' id="homePage">
                    <div className='w-full lg:w-[35%] flex flex-col justify-center lg:py-10 lg:px-2 px-4 leading-7'>
                        <h1 className=' lg:py-2 text-[rgb(43,70,139)] font-extrabold lg:text-[30px] text-[25px]'>Welcome to Task Pro</h1>
                        <h1 className=' text-[rgb(43,70,139)] font-bold  text-[15px]'>Efficiently manage your tasks and projects.</h1>
                        <p className=' text-gray-500 pt-1'>
                            Our task management tool, designed to help you stay on top of your to-do list. Whether you're managing personal tasks or team projects, our platform offers the features you need to stay organized and productive. Create, track, and complete tasks with ease, and enjoy a seamless workflow that boosts your efficiency.
                            With our intuitive interface, you can effortlessly create, track, and complete tasks. Assign tasks to team members, set deadlines, and monitor progress in real time. Our customizable workflows adapt to your unique needs, ensuring a seamless experience that enhances your efficiency.
                            <br />
                            <Link to='/workspace'>
                            <button className='w-full text-center sm:w-auto sm:text-left px-12 py-2 mt-2 lg:mt-4 text-white rounded-md mx-auto bg-[rgb(43,70,139)]'>
                               Get Started
                            </button>
                            </Link>

                        </p>
                    </div>
                    <div className='lg:w-[50%] w-full h-full '>
                        <img src={img} alt="meeting" className='w-full h-full ' id="imageTransition" />
                    </div>

                </div>
            </div>
        </>
    )
}

export default Home;
