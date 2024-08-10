import React from 'react'

function Table({ tasks }) {

    function formatDateOnly(datetimeString) {
        const date = new Date(datetimeString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }


    return (
        <div className="w-full overflow-y-auto">
            <div>
                <table className="min-w-full">
                    <thead className='w-full   text-white lg:text-[rgba(43,70,139,1)] shadow-md'>
                        <tr className='w-full'>
                            <th className="text-center py-3 px-5 uppercase font-bold text-xs">Task</th>
                            <th className="text-center py-3 px-5 uppercase font-bold text-xs">Assigned To</th>
                            <th className="text-center py-3 px-5 uppercase font-bold text-xs">Status</th>
                            <th className="text-center py-3 px-5 uppercase font-bold text-xs">Deadline</th>
                        </tr>
                    </thead>

                    <tbody className="text-white lg:text-[rgba(43,70,139,1)] text-xs">
                        {tasks.map((task, index) => (
                            <tr key={index} className='border-b border-b-gray-400 text-xs'>
                                <td className=" text-center py-3 ">{task.description}</td>
                                <td className=" text-center py-3 ">{task.assignedToEmail}</td>
                                <td className=" text-center py-3 ">{task.status}</td>
                                <td className="text-center py-3 ">{formatDateOnly(task.dueDate)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Table;
