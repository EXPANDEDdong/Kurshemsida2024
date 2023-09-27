import React, { useState } from "react";

export default function PostForm() {
  const [Title, setTitle] = useState("");
  const [Content, setContent] = useState("");

  const handleInputTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleContentTitle = (e) => {
    setContent(e.target.value);
  };
  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    if (Title != "" && Content != "") {
      const body = {
        title: Title,
        content: Content,
      };
      try {
        const response = await fetch("./api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        const result = await response.json();
        console.log(result);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
      setTitle("");
      setContent("");
    } else {
      alert("Both fields must be filled");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <p>please: {Title}</p>
        <input
          type="text"
          value={Title}
          onInput={handleInputTitle}
          className="border border-black"
          required
        />
        <p>please: {Content}</p>
        <input
          type="text"
          value={Content}
          onInput={handleContentTitle}
          className="border border-black"
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
