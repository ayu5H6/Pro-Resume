import React, { useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useNavigate } from "react-router-dom";
const Home = () => {
  gsap.registerPlugin(useGSAP);
  const navigate = useNavigate();

  useGSAP(() => {
    var tl = gsap.timeline();
    tl.from(".Home", {
      x: -10,
      opacity: 0,
      duration: 0.7,
      ease: "power2.in",
    });
    tl.from(".satg > *", {
      opacity: 0,
      y: -10,
      stagger: 0.3,
      ease: "expo.inOut",
    });
  }, []);

  return (
    <>
      <div className="Home mx-auto  ">
        <div className="flex flex-col justify-center items-center satg">
          <h2 className=" mb-7 ">Craft the Perfect Resume in Minutes</h2>
          <p className=" para">
            <strong>Looking for a job?</strong>{" "}
            <strong>Want to stand out?</strong> <br /> ResumePro makes it easy
            to create a professional, ATS-friendly resume that gets noticed.
            Whether you're a fresh graduate or an experienced professional, our
            smart resume builder helps you showcase your skills the right way.
          </p>
          <p className="">
            🚀 Easy to Use – Create your resume with just a few clicks. <br />
            📄 ATS-Optimized Templates – Beat the resume scanners. <br />✨
            Professional & Polished – Showcase your skills with a sleek, modern
            design.
          </p>
          <h3 className="">Let’s Land Your Dream Job Together</h3>
          <button className="createBtn " onClick={() => navigate("/resume")}>
            Create Your Resume
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
