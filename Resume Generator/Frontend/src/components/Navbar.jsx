import React, { useState, useEffect } from "react";
import { RiArticleLine, RiMoonFill, RiSunLine } from "@remixicon/react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";



const Navbar = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };
  gsap.registerPlugin(useGSAP);
  useGSAP(()=>{
    gsap.from(".navbar",{
        y:-80,
        duration:1,
        opacity:0
    })
  })

  return (
    <>
      <div className="flex items-center justify-between gap-2 navbar  ">
        <h1
          className="  text-center mb-6 flex items-center ml-4  cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span>
            <RiArticleLine
              className="my-icon article" // add custom class name
            />
          </span>
          Pro Resume
        </h1>
        <button className=" mr-5 " onClick={toggleDarkMode}>
          {" "}
          {darkMode ? (
            <RiSunLine size={50} className="my-icon dark-light" />
          ) : (
            <RiMoonFill
              size={50} // set custom `width` and `height`
              className="my-icon dark-light  " // add custom class name
            />
          )}
        </button>
      </div>
    </>
  );
};

export default Navbar;
