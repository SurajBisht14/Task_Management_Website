import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Css/form.css';
import AlertBox from './alertbox';
import Loader from './Loader.jsx';

const BackendUrl = import.meta.env.VITE_BACKEND_URL;

function Form() {
    const [totalMembers, setTotalMembers] = useState(0);
    const [projectNameAndMemberCount, setProjectname] = useState({
        projectName: "",
        membersCount: "",
        members: [],
    });
    const [showLoader, setshowLoader] = useState(false);
    const [messages, setmessages] = useState({
        type: "",
        msgValue: ""
    });

    function projectFunction(e) {
        const nameOfInput = e.target.name;
        const value = e.target.value;
        setProjectname(prevState => ({
            ...prevState,
            [nameOfInput]: value,
        }));
    }

    function countMembers(e) {
        e.preventDefault();
        const nameOfInput = e.target.name;
        const value = e.target.value;
        if (value <= 10) {
            setTotalMembers(value);
            setProjectname(prevState => ({
                ...prevState,
                [nameOfInput]: value,
                members: Array.from({ length: value }, () => ({ email: '', tasks: [], taskCount: 0 })),
            }));
        } else {
            alert("Maximum 10 members are allowed");
            e.target.value = "";
            setTotalMembers(0);
            setProjectname(prevState => ({
                ...prevState,
                [nameOfInput]: "",
                members: [],
            }));
        }
    }

    function countTasks(memberIndex, e) {
        e.preventDefault();
        const value = e.target.value;
        if (value <= 10) {
            setProjectname(prevState => {
                const members = [...prevState.members];
                members[memberIndex].taskCount = value;
                members[memberIndex].tasks = Array.from({ length: value }, () => ({ description: '', deadline: '' }));
                return { ...prevState, members };
            });
        } else {
            alert("Maximum 10 tasks can be given to one member");
            e.target.value = "";
            setProjectname(prevState => {
                const members = [...prevState.members];
                members[memberIndex].taskCount = 0;
                members[memberIndex].tasks = [];
                return { ...prevState, members };
            });
        }
    }

    function handleMemberEmailChange(index, e) {
        const value = e.target.value;
        setProjectname(prevState => {
            const members = [...prevState.members];
            members[index].email = value;
            return { ...prevState, members };
        });
    }

    function handleTaskDescriptionChange(memberIndex, taskIndex, e) {
        const value = e.target.value;
        setProjectname(prevState => {
            const members = [...prevState.members];
            members[memberIndex].tasks[taskIndex] = {
                ...members[memberIndex].tasks[taskIndex],
                description: value,
            };
            return { ...prevState, members };
        });
    }

    function handleTaskDeadlineChange(memberIndex, taskIndex, e) {
        const value = e.target.value;
        setProjectname(prevState => {
            const members = [...prevState.members];
            members[memberIndex].tasks[taskIndex] = {
                ...members[memberIndex].tasks[taskIndex],
                deadline: value,
            };
            return { ...prevState, members };
        });
    }

    async function sumbitData(e) {
        e.preventDefault();

        // Validate dates
        const currentDate = new Date();
        let isInvalidDate = false;

        projectNameAndMemberCount.members.forEach(member => {
            member.tasks.forEach(task => {
                if (new Date(task.deadline) < currentDate) {
                    isInvalidDate = true;
                }
            });
        });

        if (isInvalidDate) {
            setmessages({
                type: "error",
                msgValue: "Date can't be in the past. Please correct the dates."
            });

            setTimeout(() => {
                setmessages({
                    type: "",
                    msgValue: ""
                });
            }, 4000);

            // Clear form data
            setProjectname({
                projectName: "",
                membersCount: "",
                members: [],
            });
            return;
        }

        try {
            setshowLoader(true);
            const response = await fetch(`${BackendUrl}/formData`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(projectNameAndMemberCount),
            });

            if (response.ok) {
                const data = await response.json();
                setmessages({
                    type: "success",
                    msgValue: data.msg
                });
                setProjectname({
                    projectName: "",
                    membersCount: "",
                    members: [],
                });
                setTimeout(() => {
                    setmessages({
                        type: "",
                        msgValue: ""
                    });
                }, 4000);
            } else {
                const errorData = await response.json();
                setmessages({
                    type: "error",
                    msgValue: errorData.msg || response.statusText
                });

                setTimeout(() => {
                    setmessages({
                        type: "",
                        msgValue: ""
                    });
                }, 4000);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setshowLoader(false);
        }
    }

    return (
        <div className='absolute h-full w-full top-0 bg-[rgba(0,0,0,.9)] z-[99] flex flex-col items-center justify-center'>
            {showLoader && <Loader />}
            {messages.msgValue.length > 0 && <AlertBox text={messages} />}
            <div className='block w-full sm:w-[50%]'>
                <Link to='/workspace'>
                    <i className="fa-solid fa-xmark float-right text-white px-1 sm:px-0 py-2 font-bold text-[25px]"></i>
                </Link>
            </div>
            <div id="formScroll" className="w-[99%] rounded-md sm:w-[50%] max-h-[500px] overflow-y-auto border">
                <div className='w-full h-full relative'>
                    <div className='flex items-center justify-center rounded-t-md bg-[rgb(43,70,139)] text-white text-center sm:font-bold'>
                        <h1 className='text-[22px] sm:text-[25px]'>Create Project</h1>
                    </div>

                    {/* Our form  */}
                    <div className='w-full'>
                        <form onSubmit={sumbitData}>
                            <div className='w-[95%] mx-auto py-2 px-1 flex flex-col'>
                                <label className='text-white text-lg'>Project Name</label>
                                <input
                                    type='text'
                                    placeholder='Ex- Blog website'
                                    className='rounded-sm placeholder:pl-1 outline-none px-1 py-2'
                                    name='projectName'
                                    value={projectNameAndMemberCount.projectName}
                                    onChange={projectFunction}
                                    required
                                />
                            </div>

                            <div className='w-[95%] mx-auto py-2 px-1 flex flex-col'>
                                <label className='text-white text-lg '>Total members to add</label>
                                <input
                                    type='number'
                                    placeholder='Ex- 1,2,3 etc'
                                    className='rounded-sm placeholder:pl-1 outline-none px-1 py-2'
                                    name='membersCount'
                                    required
                                    onChange={countMembers}
                                    onWheel={(e) => e.target.blur()}
                                    value={projectNameAndMemberCount.membersCount}
                                />
                            </div>
                            {totalMembers > 0 &&
                                Array.from({ length: totalMembers }).map((_, memberIndex) => (
                                    <div key={memberIndex} className='bg-[rgb(43,70,139)] rounded-md mt-6 w-[95%] mx-auto'>
                                        <h1 className='text-lg w-full text-center text-white font-bold py-1'>Member <span>{memberIndex + 1}</span></h1>

                                        {/* Email Input */}
                                        <div className='flex flex-col py-1 px-1'>
                                            <label className='text-white text-lg'>Email of Member</label>
                                            <input
                                                type='email'
                                                placeholder='Ex- abc@gmail.com'
                                                className='rounded-sm placeholder:pl-1 py-1 outline-none px-1'
                                                name={`memberEmail${memberIndex}`}
                                                value={projectNameAndMemberCount.members[memberIndex]?.email || ''}
                                                onChange={(e) => handleMemberEmailChange(memberIndex, e)}
                                                required
                                            />
                                        </div>

                                        {/* Tasks Count Input */}
                                        <div className='flex flex-col py-1 px-1'>
                                            <label className='text-white text-lg'>Total tasks to assign</label>
                                            <input
                                                type='number'
                                                placeholder='Ex- 1,2,3 etc'
                                                className='rounded-sm placeholder:pl-1 py-1 outline-none px-1'
                                                name={`totalTasks${memberIndex}`}
                                                onChange={(e) => countTasks(memberIndex, e)}
                                                onWheel={(e) => e.target.blur()}
                                                value={projectNameAndMemberCount.members[memberIndex]?.taskCount || ''}
                                                required
                                            />
                                        </div>

                                        {/* Tasks */}
                                        {projectNameAndMemberCount.members[memberIndex]?.tasks.map((task, taskIndex) => (
                                            <div key={taskIndex} className='flex flex-col py-1 px-1'>
                                                <label className='text-white text-lg'>Task {taskIndex + 1} Description</label>
                                                <input
                                                    type='text'
                                                    placeholder='Ex- Design homepage'
                                                    className='rounded-sm placeholder:pl-1 outline-none px-1 py-2'
                                                    value={task.description || ''}
                                                    onChange={(e) => handleTaskDescriptionChange(memberIndex, taskIndex, e)}
                                                    required
                                                />
                                                <label className='text-white text-lg'>Task {taskIndex + 1} Deadline</label>
                                                <input
                                                    type='date'
                                                    className='rounded-sm placeholder:pl-1 outline-none px-1 py-2'
                                                    value={task.deadline || ''}
                                                    onChange={(e) => handleTaskDeadlineChange(memberIndex, taskIndex, e)}
                                                    required
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ))
                            }

                            <div className='flex justify-center py-3'>
                                <button
                                    type='submit'
                                    className='bg-[#0062cc] text-white font-bold py-2 px-4 rounded'
                                >
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Form;
