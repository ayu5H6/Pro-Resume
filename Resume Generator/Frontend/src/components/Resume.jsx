import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";

import { jsPDF } from "jspdf";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
const Resume = () => {
  const [isPreview, setIsPreview] = useState(false);

  // Store details in arrays for multiple entries
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    linkedIn: "",
    github: "",
    address: "",
    desc: "",
    education: [],
    experience: [],
    projects: [],
    category: "",
    skills: [],
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [sectionEditing, setSectionEditing] = useState(null);
  const resumeRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [isPreview]);

  const handleChange = (e, index = null, section = null) => {
    const { name, value } = e.target;

    if (section) {
      // If section is provided, update within an array (e.g., education, experience)
      const updatedSection = [...formData[section]];
      updatedSection[index][name] = value;
      setFormData({ ...formData, [section]: updatedSection });
    } else {
      // Directly update fields like summary, personal details
      setFormData({ ...formData, [name]: value });
    }
  };

  // Add new entry to a section
  const handleAdd = (section) => {
    setFormData({
      ...formData,
      [section]: [
        ...formData[section],
        { school: "", degree: "", start: "", end: "" },
      ],
    });
  };

  // Delete an entry
  const handleDelete = (section, index) => {
    const updatedSection = [...formData[section]];
    updatedSection.splice(index, 1);
    setFormData({ ...formData, [section]: updatedSection });
  };

  // Toggle edit mode
  const toggleEdit = (index, section) => {
    setEditingIndex(index);
    setSectionEditing(section);
  };

  // Save changes
  const handleSave = () => {
    setEditingIndex(null);
    setSectionEditing(null);
  };

  const handleDeletePersonal = () => {
    setFormData((prevData) => ({
      ...prevData,
      name: "",
      phone: "",
      email: "",
      address: "",
    }));
    setEditingIndex(null);
    setSectionEditing(null);
  };

  const handleDeleteSummary = () => {
    setFormData((prevData) => ({
      ...prevData,
      desc: "",
    }));
    setEditingIndex(null);
    setSectionEditing(null);
  };

  const handleDownloadPDF = async () => {
    const element = resumeRef.current;
    if (!element) {
      console.error("Resume ref is not attached");
      return;
    }

    try {
      const originalStyle = element.style.cssText; // Save original styles

      // Force desktop view
      element.style.width = "1300px";
      element.style.maxWidth = "1300px";
      element.style.position = "absolute";
      element.style.left = "50%";
      element.style.transform = "translateX(-50%)";

      await new Promise((resolve) => setTimeout(resolve, 300));

      const canvas = await html2canvas(element, {
        scale: 2, // High quality
        useCORS: true,
        scrollY: 0,
      });

      element.style.cssText = originalStyle;

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const contentWidth = 210; // A4 width in mm
      const contentHeight = (canvas.height / canvas.width) * contentWidth;

      if (contentHeight <= pageHeight) {
        pdf.addImage(imgData, "PNG", 0, 0, contentWidth, contentHeight);
      } else {
        let yPos = 0;
        while (yPos < canvas.height) {
          const sectionCanvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            scrollY: -yPos,
            width: 1300,
            height: 1700, // A4 height in pixels
          });

          const sectionImgData = sectionCanvas.toDataURL("image/png", 1.0);
          pdf.addImage(sectionImgData, "PNG", 0, 0, contentWidth, pageHeight);

          yPos += 1700;
          if (yPos < canvas.height) pdf.addPage();
        }
      }

      pdf.save("resume.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  gsap.registerPlugin(useGSAP);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from(".box", {
      x: -100,
      opacity: 0,
      stagger: 0.4,
      duration: 0.6,
      ease: "power1.in",
    });
  });

  return (
    <>
      <div className="flex justify-center ">
        {!isPreview ? (
          <button
            className="previewResume"
            onClick={() => {
              setIsPreview(true);
            }}
          >
            Preview Resume
          </button>
        ) : (
          <button
            className=" editPreview "
            onClick={() => {
              setIsPreview(false);
            }}
          >
            Edit Details
          </button>
        )}
        {isPreview && (
          <button className="downloadbtn ml-2" onClick={handleDownloadPDF}>
            Download PDF
          </button>
        )}
      </div>

      <section className="flex min-h-screen w-full border- justify-between p-4 ">
        {!isPreview ? (
          <div className="left  min-h-full text-black p-4">
            {/* Personal Details */}
            <div className="box">
              <h1 className="text-3xl mb-3">Personal Details</h1>
              {editingIndex === "personal" ? (
                <form className="flex flex-col">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <input
                    type="number"
                    name="phone"
                    placeholder="Number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="linkedIn"
                    placeholder="LinkedIn"
                    value={formData.linkedIn}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="github"
                    placeholder="Github"
                    value={formData.github}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                  <button onClick={handleSave} className="save">
                    Save
                  </button>
                </form>
              ) : (
                <>
                  <p>
                    <strong>Name:</strong> {formData.name || "Your Name"}
                  </p>
                  <p>
                    <strong>Phone:</strong> {formData.phone || "Your Number"}
                  </p>
                  <p>
                    <strong>Email:</strong> {formData.email || "Your Email"}
                  </p>
                  <p>
                    <strong>LinkedIn:</strong>{" "}
                    {formData.linkedIn || "Your LinkedIn"}
                  </p>
                  <p>
                    <strong>Github:</strong> {formData.github || "Your Github"}
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {formData.address || "Your Address"}
                  </p>
                  <button
                    onClick={() => toggleEdit("personal")}
                    className="edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePersonal("personal")}
                    className=" delete"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>

            {/* SUMMARY */}
            <div className="box">
              <h1 className="text-3xl mb-5">Summary</h1>
              {editingIndex === "summary" ? (
                <form className="flex flex-col">
                  <textarea
                    name="desc"
                    value={formData.desc}
                    onChange={handleChange}
                    rows={5}
                    cols={50}
                  ></textarea>
                  <button onClick={handleSave} className="save">
                    Save
                  </button>
                </form>
              ) : (
                <>
                  <p className="mb-3">
                    {formData.desc || "Your summary goes here..."}
                  </p>
                  <button
                    onClick={() => toggleEdit("summary")}
                    className="edit "
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSummary("summary")}
                    className="delete "
                  >
                    Delete
                  </button>
                </>
              )}
            </div>

            {/* Education Section */}
            <div className="box">
              <h1 className="text-3xl mb-5">Education</h1>
              {formData.education.map((edu, index) => (
                <div key={index}>
                  {editingIndex === index && sectionEditing === "education" ? (
                    <form className="flex flex-col">
                      <input
                        type="text"
                        name="school"
                        value={edu.school}
                        onChange={(e) => handleChange(e, index, "education")}
                        placeholder="School"
                      />
                      <input
                        type="text"
                        name="degree"
                        value={edu.degree}
                        onChange={(e) => handleChange(e, index, "education")}
                        placeholder="Degree"
                      />
                      <input
                        type="text"
                        name="start"
                        value={edu.start}
                        onChange={(e) => handleChange(e, index, "education")}
                        placeholder="Start Date"
                      />
                      <input
                        type="text"
                        name="end"
                        value={edu.end}
                        onChange={(e) => handleChange(e, index, "education")}
                        placeholder="End Date"
                      />
                      <input
                        type="text"
                        name="cgpa"
                        value={edu.cgpa}
                        onChange={(e) => handleChange(e, index, "education")}
                        placeholder="CGPA"
                      />
                      <input
                        type="text"
                        name="location"
                        value={edu.location}
                        onChange={(e) => handleChange(e, index, "education")}
                        placeholder="Location"
                      />
                      <button onClick={handleSave} className="save ">
                        Save
                      </button>
                    </form>
                  ) : (
                    <>
                      <p>
                        <strong>School:</strong> {edu.school}
                      </p>
                      <p>
                        <strong>Degree:</strong> {edu.degree}
                      </p>
                      <p>
                        <strong>Location:</strong> {edu.location}
                      </p>
                      <p>
                        <strong>Cgpa:</strong> {edu.cgpa}
                      </p>
                      <p>
                        <strong>Duration:</strong> {edu.start} - {edu.end}
                      </p>
                      <button
                        onClick={() => toggleEdit(index, "education")}
                        className=" edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete("education", index)}
                        className=" delete"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              ))}
              {editingIndex === null && sectionEditing === null && (
                <button onClick={() => handleAdd("education")} className=" add">
                  Add Education
                </button>
              )}
            </div>

            {/* Experience Section */}
            <div className="box">
              <h1 className="text-3xl mb-5">Experience</h1>
              {formData.experience.map((exp, index) => (
                <div key={index}>
                  {editingIndex === index && sectionEditing === "experience" ? (
                    <form className="flex flex-col">
                      <input
                        type="text"
                        name="company"
                        value={exp.company}
                        onChange={(e) => handleChange(e, index, "experience")}
                        placeholder="Company"
                      />
                      <input
                        type="text"
                        name="position"
                        value={exp.position}
                        onChange={(e) => handleChange(e, index, "experience")}
                        placeholder="Position"
                      />
                      <input
                        type="text"
                        name="location"
                        value={exp.location}
                        onChange={(e) => handleChange(e, index, "experience")}
                        placeholder="Location"
                      />
                      <input
                        type="text"
                        name="start"
                        value={exp.start}
                        onChange={(e) => handleChange(e, index, "experience")}
                        placeholder="Start Date"
                      />
                      <input
                        type="text"
                        name="end"
                        value={exp.end}
                        onChange={(e) => handleChange(e, index, "experience")}
                        placeholder="End Date"
                      />
                      {/* Textarea for job description */}
                      <textarea
                        name="jobDescription"
                        value={formData.experience[index]?.jobDescription || ""}
                        onChange={(e) => handleChange(e, index, "experience")}
                        placeholder="Job Description.....Output will be in bullet points so enter for new line."
                        rows="4"
                      ></textarea>
                      <button onClick={handleSave} className="save ">
                        Save
                      </button>
                    </form>
                  ) : (
                    <>
                      <p>
                        <strong>Company:</strong> {exp.company}
                      </p>
                      <p>
                        <strong>Position:</strong> {exp.position}
                      </p>
                      <p>
                        <strong>Job Description:</strong> {exp.jobDescription}
                      </p>
                      <p>
                        <strong>Job Location:</strong> {exp.location}
                      </p>
                      <p>
                        <strong>Start:</strong> {exp.start}
                      </p>

                      <p>
                        <strong>End:</strong> {exp.end}
                      </p>

                      <button
                        onClick={() => toggleEdit(index, "experience")}
                        className="edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete("experience", index)}
                        className=" delete"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              ))}
              {editingIndex === null && sectionEditing === null && (
                <button
                  onClick={() => handleAdd("experience")}
                  className=" add"
                >
                  Add Experience
                </button>
              )}
            </div>

            {/* Projects Section */}
            <div className="box">
              <h1 className="text-3xl mb-5">Projects</h1>
              {formData.projects.map((project, index) => (
                <div key={index}>
                  {editingIndex === index && sectionEditing === "projects" ? (
                    <form className="flex flex-col">
                      <input
                        type="text"
                        name="proName"
                        value={project.proName} // Correct reference to project
                        onChange={(e) => handleChange(e, index, "projects")}
                        placeholder="Project Name"
                      />
                      <input
                        type="text"
                        name="tools"
                        value={project.tools} // Correct reference for tools used in project
                        onChange={(e) => handleChange(e, index, "projects")}
                        placeholder="Tools Used like: react,tailwind etc etc"
                      />
                      <textarea
                        name="proText"
                        rows={5}
                        cols={50}
                        value={formData.projects[index]?.proText || ""}
                        onChange={(e) => handleChange(e, index, "projects")}
                        placeholder="Project Description.....Output will be in bullet points so enter for new line."
                      />
                      <input
                        type="text"
                        name="start"
                        value={project.start} // Correct reference to project start
                        onChange={(e) => handleChange(e, index, "projects")}
                        placeholder="Start Date"
                      />
                      <input
                        type="text"
                        name="end"
                        value={project.end} // Correct reference to project end
                        onChange={(e) => handleChange(e, index, "projects")}
                        placeholder="End Date"
                      />
                      <button onClick={handleSave} className="save">
                        Save
                      </button>
                    </form>
                  ) : (
                    <>
                      <p>
                        <strong>Project:</strong> {project.proName}
                      </p>
                      <p>
                        <strong>Tools:</strong> {project.tools}
                      </p>
                      <p>
                        <strong>Description:</strong> {project.proText}
                      </p>
                      <p>
                        <strong>Start:</strong> {project.start}
                      </p>
                      <p>
                        <strong>End:</strong> {project.end}
                      </p>
                      <button
                        onClick={() => toggleEdit(index, "projects")}
                        className=" edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete("projects", index)}
                        className=" delete"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              ))}
              {editingIndex === null && sectionEditing === null && (
                <button onClick={() => handleAdd("projects")} className=" add">
                  Add Projects
                </button>
              )}
            </div>

            <div className="box">
              <h1 className="text-3xl mb-5">Skills</h1>

              {formData.skills.map((skill, index) => (
                <div key={index} className="mb-2">
                  {editingIndex === index && sectionEditing === "skills" ? (
                    <form className="flex flex-col">
                      <input
                        type="text"
                        name="category"
                        value={skill.category}
                        onChange={(e) => handleChange(e, index, "skills")}
                        placeholder="Category (e.g., Programming)"
                        className="border p-1"
                      />
                      <input
                        type="text"
                        name="skill"
                        value={skill.skill}
                        onChange={(e) => handleChange(e, index, "skills")}
                        placeholder="Skill (e.g., JavaScript, React)"
                        className="border p-1"
                      />
                      <button onClick={handleSave} className="save ">
                        Save
                      </button>
                    </form>
                  ) : (
                    <>
                      <p className="font-bold">
                        {skill.category || "Category"}: {skill.skill || "Skill"}
                      </p>
                      <button
                        onClick={() => toggleEdit(index, "skills")}
                        className="edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete("skills", index)}
                        className=" delete"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              ))}

              {editingIndex === null && sectionEditing === null && (
                <button onClick={() => handleAdd("skills")} className=" add">
                  Add Skill
                </button>
              )}
            </div>
          </div>
        ) : (
          <div
            className="right p-6 h-full   bg-white shadow-lg"
            ref={resumeRef}
          >
            {/* Personal Details */}
            <h2 className="text-center font-bold">
              {formData.name || "Your Name"}
            </h2>
            <p className="text-center ">
              {formData.email || "your.email@example.com"} |{" "}
              {formData.phone || "123-456-7890"} |{" "}
              {formData.address || "Your Address"}
            </p>
            <p className="text-center mb-6">
              {formData.linkedIn || "www.linkedin.com/in/john-doe"} |{" "}
              {formData.github || "github.com/john-doe"}{" "}
            </p>

            {/* Summary Section */}
            <h3 className=" font-bold leftside">Summary</h3>
            <div className="line "></div>
            <p className="mb-6 ">
              {formData.desc || "A short summary about yourself."}
            </p>

            {/* Education Section */}
            <h3 className="font-bold">Education</h3>
            <div className="line"></div>
            {formData.education.length > 0 ? (
              formData.education.map((edu, index) => (
                <div key={index} className="">
                  <div className="flex justify-between">
                    <div className="leftside font-semibold">
                      <span className="text-lg">
                        {" "}
                        {edu.school || "School Name"}
                      </span>
                    </div>
                    <div className="rightside">
                      {edu.start || "Start"} - {edu.end || "End"}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="leftside italic">
                      {edu.degree || "Degree"}
                    </div>
                    <div className="rightside">
                      {edu.location || "Location"}
                    </div>
                  </div>
                  <span className="leftside">
                    {`CGPA: ${edu.cgpa}` || "CGPA"}
                  </span>
                </div>
              ))
            ) : (
              <p>No education details added.</p>
            )}

            {/* Experience Section */}
            <h3 className=" font-bold">Experience</h3>
            <div className="line "></div>

            {formData.experience.length > 0 ? (
              formData.experience.map((exp, index) => (
                <div key={index} className="">
                  <div className="flex justify-between">
                    <div className="leftside font-semibold ">
                      <span className="text-lg">
                        {exp.company ? exp.company : "Company Name"}
                      </span>
                    </div>
                    <div className="rightside">
                      {exp.start ? exp.start : "Start Date"} -{" "}
                      {exp.end ? exp.end : "End Date"}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="leftside font-serif italic">
                      {exp.position ? exp.position : "Job Title"}
                    </div>
                    <div className="rightside">
                      {exp.location ? exp.location : "Location"}
                    </div>
                  </div>

                  <ul className=" ml-5 mb-4">
                    {exp.jobDescription &&
                    exp.jobDescription.trim().length > 0 ? (
                      exp.jobDescription
                        .split("\n")
                        .map((point, i) => <li key={i}>{point}</li>)
                    ) : (
                      <li>Job description goes here.</li>
                    )}
                  </ul>
                </div>
              ))
            ) : (
              <p>No experience added.</p>
            )}

            {/* Projects Section */}
            <h3 className="font-bold">Projects</h3>
            <div className="line"></div>
            {formData.projects.length > 0 ? (
              formData.projects.map((project, index) => (
                <div key={index} className="mb-2">
                  <div className="flex justify-between">
                    <div className="leftside ">
                      <span className="font-semibold text-lg">
                        {" "}
                        {project.proName
                          ? project.proName
                          : "Project Name"} |{" "}
                      </span>

                      <span className="italic">
                        {project.tools ? project.tools : "Tools Used"}
                      </span>
                    </div>
                    <div className="rightside">
                      {project.start ? project.start : "Start Date"} -{" "}
                      {project.end ? project.end : "End Date"}
                    </div>
                  </div>
                  <ul className=" ml-5 mb-4">
                    {project.proText && project.proText.trim().length > 0 ? (
                      project.proText
                        .split("\n")
                        .map((point, i) => <li key={i}>{point}</li>)
                    ) : (
                      <li>Project description goes here.</li>
                    )}
                  </ul>
                </div>
              ))
            ) : (
              <p>No projects added.</p>
            )}

            {/* Skills Section */}
            <h3 className="text-xl font-semibold mt-4">Skills</h3>
            <div className="line"></div>

            {formData.skills.length > 0 ? (
              formData.skills.map((skill, index) => (
                <p key={index} className="t">
                  <strong>
                    {skill.category ? skill.category : "Skill Category"}:
                  </strong>{" "}
                  {skill.skill ? skill.skill : "Your Skills"}
                </p>
              ))
            ) : (
              <p className="">No skills added.</p>
            )}
          </div>
        )}
      </section>
    </>
  );
};

export default Resume;
