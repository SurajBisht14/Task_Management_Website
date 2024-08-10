import React, { useEffect, useState } from 'react';
import '../Css/projectDiv.css';
import loginImage from '../images/loginImage.png';
import Table from './table.jsx';
import { Outlet, Link } from 'react-router-dom';
import AlertBox from './alertbox';
import Loader from './Loader.jsx'
const BackendUrl = import.meta.env.VITE_BACKEND_URL;


function Workspace() {
  const profilePhoto = localStorage.getItem('profilePhoto');
  const [showProjects, setShowProjects] = useState(false);
  const [showTeam, setTeam] = useState(false);
  const [showTask, setTask] = useState(false);
  const [allProjects, setAllProjects] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoader, setshowLoader] = useState(false);
  const [taskCompletedOrNot, settaskcompletedOrNot] = useState(false);
  const [taskChangesValue, settaskchangesValue] = useState(false);
  const [messsages, setmessages] = useState({
    type: "",
    msgValue: ""
  })
  const [dataLoaded, setDataLoaded] = useState(false);
  const [projectId, setProjectId] = useState(localStorage.getItem("projectId") || '');

  function formatDateOnly(datetimeString) {
    const date = new Date(datetimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  useEffect(() => {
    fetchData().then(() => 
     {
       setDataLoaded(true)
       if (projectId) {
        ShowProjectRelatedData(projectId);
      }
      }
    
    );
  }, [taskChangesValue]);

  useEffect(() => {
    if (dataLoaded && projectId) {
      document.querySelectorAll('[data-project-id]').forEach((element) => {
        element.style.backgroundColor = '';
      });

      const element = document.querySelector(`[data-project-id="${projectId}"]`);
      if (element) {
        element.style.backgroundColor = 'green';
      }
    }
  }, [dataLoaded, projectId, showProjects]);



  async function fetchData() {
    setshowLoader(true);
    try {
      const response = await fetch(`${BackendUrl}/getAllData`, {
        method: 'GET',
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setAllProjects(data.allProjects);
      }
    }
    catch (error) {
      console.log("Error", error)
    }
    finally {
      setshowLoader(false);
    }
  }
  async function ShowProjectRelatedData(projectId) {
    localStorage.setItem('projectId', projectId);
    setProjectId(projectId);
    setshowLoader(true);
    setShowProjects(false)
    try {
      const response = await fetch(`${BackendUrl}/gettingProject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ projectId: projectId })
      })
      if (response.ok) {
        const data = await response.json();
        setAllTasks(data.tasks);
        setAllMembers(data.allMembers);
        setIsAdmin(data.isAdmin);
      }
      else {
        console.log(response.status);
      }
    }
    catch (error) {
      console.log(error);
    }
    finally {
      setshowLoader(false);
    }
  }

  async function taskcompletedfunction(taskId) {
    document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach((e) => {
      e.checked = false;
    });
    setshowLoader(true);
    setTask(false); //for phone 
    try {
      const response = await fetch(`${BackendUrl}/updateTask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          taskId: taskId,
          taskCompletedOrNot: taskCompletedOrNot
        })
      })
      if (response.ok) {
        const data = await response.json();
        settaskchangesValue(!taskChangesValue);
        setmessages((prev) => ({
          ...prev,
          type: "success",
          msgValue: data.msg
        }));
        setTimeout(() => {
          setmessages((prev) => ({
            ...prev,
            type: "",
            msgValue: ""
          }))
        }, 4000)
      }
      else {
        const errorData = await response.json();
        setmessages((prev) => ({
          ...prev,
          type: "error",
          msgValue: errorData.msg || response.statusText // Ensure 'msg' matches backend response
        }));

        setTimeout(() => {
          setmessages((prev) => ({
            ...prev,
            type: "",
            msgValue: ""
          }))
        }, 4000)
      }
    }
    catch (error) {
      console.log(error);
    }
    finally {
      setshowLoader(false);
    }
  }

  return (
    <>
      <div className='h-[90vh] w-full relative overflow-hidden'>
        {showLoader && <Loader />}
        {
          messsages.msgValue.length > 0 &&
          <AlertBox text={messsages} />
        }
        {!profilePhoto ?
          <div className='h-screen w-screen bg-[rgba(0,0,0,.9)] z-[99] absolute top-0 left-0 flex items-center justify-center'>
            <div className='flex flex-col items-center justify-center w-[400px] sm:w-[400px]'>
              <img src={loginImage} className='rounded-md' />
              <Link to='/login' className='w-full font-bold p-2 rounded-md bg-indigo-400 hover:bg-indigo-500 text-center text-white mt-1'>Login</Link>
            </div>
          </div> :

          <div className='h-full w-full flex flex-col lg:flex-row'>

            {/* mobile design  */}

            <div className='w-full lg:hidden flex justify-between h-[10%] bg-white z-[90] relative border-t border-[rgb(106,125,174)]'>


              {/* All projects  mobile */}

              <div className='h-full flex items-center w-[33%] justify-center'>

                <button

                  className='font-bold'

                  onClick={() => {
                    setTask(false)
                    setTeam(false)
                    setShowProjects(!showProjects)
                  }
                  }>Projects
                  {showProjects ?
                    <i className="fa-solid fa-angle-down px-2"></i> :
                    <i className="fa-solid fa-angle-up px-2"></i>}

                </button>

                {
                  showProjects &&
                  (<div className='border-t-2 border-white h-[81vh] w-full overflow-y-auto p-2 absolute top-[100%] left-0 bg-indigo-500 z-[80]'>

                    {
                      allProjects.length <= 0 ?
                        <div className='w-full h-full flex items-center justify-center'>
                          <h1 className='text-black font-bold text-center'><Link to='/workspace/form'>Create Project</Link></h1>
                        </div>
                        :
                        <div className='w-full h-[full] flex flex-col items-center overflow-auto' id="projectDiv" >
                          {
                            allProjects.map((e) =>
                              <div onClick={() => { ShowProjectRelatedData(e._id) }} data-project-id={e._id} key={e._id} className='w-[90%] p-1 bg-[rgb(43,70,139)] mt-3  rounded-md flex items-center  font-[500] text-white cursor-pointer  relative'>{e.projectName}<i className="fa-solid fa-share absolute right-2"></i></div>
                            )
                          }
                        </div>
                    }

                  </div>)
                }
              </div>


              {/* team members  mobile*/}
              <div className='h-full flex items-center w-[33%] justify-center'>
                <button className='font-bold'
                  onClick={() => {
                    setTask(false)
                    setShowProjects(false)
                    setTeam(!showTeam)
                  }}
                >Team
                  {showTeam ?
                    <i className="fa-solid fa-angle-down px-2"></i> :
                    <i className="fa-solid fa-angle-up px-2"></i>}
                </button>
                {
                  showTeam &&
                  (
                    <div className='border-t-2 border-white h-[81vh] w-full overflow-y-auto p-2 absolute top-[100%] left-0 bg-indigo-500 z-[80]' id="teamMember">


                      {
                        allMembers.length <= 0 ?
                          <div className='w-full h-full flex items-center justify-center'>
                            <h1 className='text-black font-bold text-center'>Please select any project</h1>
                          </div>
                          :
                          allMembers.map((member) => (
                            <div key={member._id} className='mx-auto w-[95%] p-1 bg-[rgb(43,70,139)] mt-3 rounded-md flex items-center gap-3 font-bold text-white cursor-pointer transition-all relative'>
                              <div className='h-full flex items-center'>
                                <span className="rounded-[50%] overflow-hidden text-white w-[30px] h-[30px] border-white border-2 flex items-center justify-center text-[15px]">
                                   <img 
                                    src={member.profileImage || 'https://res.cloudinary.com/dnahmeyxh/image/upload/v1723298414/user_3161848_zvrvtx.png'} 
                                    alt={member.username} 
                                    className='h-full w-full object-cover' 
                                  />
                                </span>
                              </div>
                              <span className='text-[20px] font-[500]'>{member.username}</span>
                            </div>
                          ))

                      }


                    </div>
                  )
                }
              </div>

              {/* my task  mobile*/}
              <div className='h-full flex items-center w-[33%] justify-center'>
                <button className='font-bold'
                  onClick={() => {
                    setShowProjects(false)
                    setTeam(false)
                    setTask(!showTask);
                  }}
                >Task
                  {showTask ?
                    <i className="fa-solid fa-angle-down px-2"></i> :
                    <i className="fa-solid fa-angle-up px-2"></i>
                  }
                </button>
                {
                  showTask &&
                  (
                    <div className='border-t-2 border-white h-[81vh] w-full overflow-y-auto p-2 absolute top-[100%] left-0 bg-indigo-500 z-[80]'>

                      {
                        allTasks.length <= 0 ?
                          <div className='w-full h-full flex items-center justify-center'>
                            <h1 className='text-black font-bold text-center'>Please select any project</h1>
                          </div>
                          :

                          isAdmin ?
                            <Table tasks={allTasks} />
                            :

                            (
                              <div className='w-full overflow-y-auto mt-3' id="TaskMember">

                                {
                                  allTasks.map((e) => {
                                    return (
                                      <div key={e._id} className='mx-auto w-[95%] p-1 bg-[rgb(43,70,139)]  rounded-md flex flex-col gap-3  text-white cursor-pointer  transition-all relative'>
                                        <p>
                                          <span className='font-bold text-red-400'>Task - </span>
                                          <span>{e.description}</span>
                                        </p>

                                        <p>
                                          <span className='font-bold text-red-400'>Assigned On - </span>
                                          <span>{formatDateOnly(e.createdAt)}</span>
                                        </p>

                                        <p>
                                          <span className='font-bold text-red-400'>Deadline - </span>
                                          <span>{formatDateOnly(e.dueDate)}</span>
                                        </p>

                                        <p>
                                          <span className='font-bold text-red-400'>Status - </span>
                                          <span>{e.status === "Completed" ? <span>Completed <i className="fa-regular fa-circle-check text-green-400 text-[20px] pl-2"></i></span> : <span>Pending <i className="fa-solid fa-hourglass-start text-yellow-200 px-2" id="pendingTime"></i></span>}</span>
                                        </p>

                                        <div className='flex flex-col items-center border-t-2 border-white'>
                                          <span className='font-bold text-red-400'>Task completed ?</span>
                                          <div>
                                            <label className=''>
                                              <input type="radio" name="example" onChange={() => settaskcompletedOrNot(true)} />
                                              <span className="custom-radio"></span>
                                              <span className='inline-block pl-1'>Yes</span>
                                            </label >
                                            <label className='ml-3'>
                                              <input type="radio" name="example" onChange={() => settaskcompletedOrNot(false)} />
                                              <span className="custom-radio"></span>
                                              <span className='inline-block pl-1'>No</span>
                                            </label>

                                            <button className='px-2  py-1 rounded-sm bg-red-400 ml-4 uppercase text-[12px]' onClick={() => taskcompletedfunction(e._id)}>Confirm</button>
                                          </div>
                                        </div>


                                      </div>
                                    )
                                  })
                                }

                              </div>
                            )

                      }

                    </div>
                  )
                }
              </div>
            </div>


            {/* large screen desing  */}


            {/* 1st Box  projects div */}
            <div className=' hidden lg:block  lg:w-[40%]  h-full bg-[rgb(42,70,136,.5)]'>
              <h1 className='w-full p-3 flex items-center justify-center text-white  font-bold bg-red-400'>All Projects</h1>
              {
                allProjects.length <= 0 ? (
                  <div className='w-full h-[40%] flex items-center justify-center'>
                    <h1 className='text-[rgb(43,70,139)] font-bold text-center'>
                      <Link to='/workspace/form'>Create Project</Link>
                    </h1>
                  </div>
                ) : (
                  <div className='w-full h-[40%] overflow-auto' id="projectDiv">
                    <div className='w-full relative'>
                      {allProjects.map((e) => (
                        <div onClick={() => { ShowProjectRelatedData(e._id) }} data-project-id={e._id} key={e._id} className='mx-auto w-[95%] p-2 bg-[rgb(43,70,139)] mt-3 rounded-md flex items-center font-[500] text-white cursor-pointer hover:scale-[1.05] transition-all relative'>
                          {e.projectName}
                          <i className="fa-solid fa-share absolute right-2"></i>
                        </div>
                      ))}
                      <div className='h-[25px] w-full'></div>
                    </div>
                  </div>
                )
              }

              {/* team member  */}

              <div className='w-full h-[50%]  overflow-hidden' >

                <h1 className='w-full py-3 flex items-center justify-center text-white  font-bold bg-red-400'>Team Members</h1>

                {
                  allMembers.length <= 0 ?
                    <div className='w-full h-full flex items-center justify-center'>
                      <h1 className='text-[rgb(43,70,139)] font-bold text-center'>Please select any project</h1>
                    </div>
                    :
                    (
                      <div className='w-full overflow-y-auto h-full' id="teamMember">
                        {allMembers.map((e) => {
                          return (
                            <div key={e._id}>
                              <div className='mx-auto w-[95%] p-1 bg-[rgb(43,70,139)] mt-3 rounded-md flex items-center  gap-3 font-bold text-white cursor-pointer  transition-all relative'>
                                <div className='h-full flex items-center'>
                                  <span className="rounded-[50%] overflow-hidden  text-white w-[30px] h-[30px]  border-white border-2 flex items-center justify-center text-[15px]">
                                  <img 
                                    src={e.profileImage || 'https://res.cloudinary.com/dnahmeyxh/image/upload/v1723298414/user_3161848_zvrvtx.png'} 
                                    alt={e.username} 
                                    className='h-full w-full object-cover' 
                                  />
                                  </span>
                                </div>
                                <span className='text-[20px] font-[500]'>{e.username}</span>
                              </div>
                            </div>
                          )
                        })
                        }

                        <div className='w-full h-[100px]'></div>
                      </div>)
                }

              </div>


            </div>

            {/* 2nd box project div */}

            <div className='h-[90%] w-full bg-[rgb(42,70,136,.5)] flex lg:hidden items-center justify-center font-bold '>
              <Link to="/workspace/form">
                <span>
                  Create Project
                  <i className="fa-solid fa-folder-plus px-2"></i>
                </span>
              </Link>

            </div>


            {/* 3rd div team and task*/}

            <div className='relative border-l-2 border-l-[rgb(42,70,136,.5)] hidden lg:block lg:w-[60%]  h-full bg-[rgb(42,70,136,.5)]'>

              {/* My task div  */}
              <div className='w-full h-full  overflow-hidden' >

                <h1 className='w-full py-3 flex items-center justify-center text-white  font-bold bg-red-400'>Task Status</h1>
                <div className='absolute bottom-0 w-full text-center font-bold  z-[20] bg-[rgb(0,128,0)] text-white  py-1 mx-auto'>
                  <Link to='/workspace/form' className=''>Create Project</Link>
                </div>


                {
                  allTasks.length <= 0 ?
                    <div className='w-full h-[90%] flex items-center justify-center'>
                      <h1 className='text-[rgb(43,70,139)] font-bold text-center'>Please select any project</h1>
                    </div>
                    : (
                      isAdmin ?
                        <Table tasks={allTasks} />
                        :
                        <div className='w-full overflow-y-auto h-full' id="TaskMember">
                          {
                            allTasks.map((e) => {
                              return (
                                <div key={e._id} className='mx-auto w-[95%] p-1 bg-[rgb(43,70,139)] mt-3 rounded-md flex flex-col gap-3  text-white cursor-pointer  transition-all relative'>
                                  <p>
                                    <span className='font-bold text-red-400'>Task - </span>
                                    <span>{e.description}</span>
                                  </p>

                                  <p>
                                    <span className='font-bold text-red-400'>Assigned On - </span>
                                    <span>{formatDateOnly(e.createdAt)}</span>
                                  </p>

                                  <p>
                                    <span className='font-bold text-red-400'>Deadline - </span>
                                    <span>{formatDateOnly(e.dueDate)}</span>
                                  </p>

                                  <p>
                                    <span className='font-bold text-red-400'>Status - </span>
                                    <span>{e.status === 'Completed' ? <span>Completed <i className="fa-regular fa-circle-check text-green-400 text-[20px] pl-2"></i></span> : <span>Pending <i className="fa-solid fa-hourglass-start text-yellow-200 px-2" id="pendingTime"></i></span>}</span>
                                  </p>

                                  <div className='flex flex-col items-center border-t-2 border-white'>
                                    <span className='font-bold text-red-400'>Task completed ?</span>
                                    <div>
                                      <label className=''>
                                        <input type="radio" name="example" onChange={() => settaskcompletedOrNot(true)} />
                                        <span className="custom-radio"></span>
                                        <span className='inline-block pl-1'>Yes</span>
                                      </label >
                                      <label className='ml-3'>
                                        <input type="radio" name="example" id="no" onChange={() => settaskcompletedOrNot(false)} />
                                        <span className="custom-radio"></span>
                                        <span className='inline-block pl-1'>No</span>
                                      </label>

                                      <button className='px-2  py-1 rounded-sm bg-red-400 ml-4 uppercase text-[12px]' onClick={() => taskcompletedfunction(e._id)}>Confirm</button>
                                    </div>
                                  </div>


                                </div>
                              )
                            })
                          }
                          {/* Empty div  */}

                          <div className='w-full h-[80px]'></div>

                        </div>

                    )
                }

              </div>

            </div>

          </div>
        }
        <Outlet />
      </div >
    </>
  )
}

export default Workspace
