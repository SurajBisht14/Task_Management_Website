import React, { useEffect, useRef } from 'react';
import '../Css/alertBoxMsg.css'; 

function AlertBox({ text }) {
  const slider = useRef(null);

  useEffect(() => {
    if (slider.current) {
      slider.current.style.right = "-100%";
      setTimeout(() => {
        slider.current.style.transition = "all .8s linear"; 
        slider.current.style.right = "0"; 
      }, 100); 

      setTimeout(() => {
        slider.current.style.right = "-100%"; // Move the box out of view
      }, 3000);
    }
  }, []);

  return (
    <div 
      className='bg-white absolute top-1 py-2 px-4 flex items-center rounded-l-sm z-[100] shadow-md overflow-hidden'
      ref={slider}
    >
      {/* Conditionally render icon based on message type */}
      {text.type === 'success' ? (
        <i className="fa-solid fa-circle-check text-green-500 pr-2"></i>
      ) : (
        <i className="fa-solid fa-circle-xmark text-red-500 pr-2"></i>
      )}
      <span className='text-sm pb-1'>{text.msgValue}</span>
      <div className={`h-1 ${text.type === 'success' ? 'bg-green-500' : 'bg-red-500'} absolute bottom-0 w-full left-0`} id='alertBoxMsg'></div>
    </div>
  );
}

export default AlertBox;
