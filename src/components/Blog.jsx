import { useState } from "react";

const Blog = ({ blog, addLike, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle} className="blog">
      {blog.title} {blog.author}{" "}
      <button style={hideWhenVisible} onClick={toggleVisibility}>
        view
      </button>{" "}
      <button style={showWhenVisible} onClick={toggleVisibility}>
        hide
      </button>
      <div style={showWhenVisible} className="togglableContent">
        {blog.url} <br />
        {blog.likes}{" "}
        <button onClick={addLike} className="likeButton">
          likes
        </button>{" "}
        <br />
        {blog.user.name} <br />
        {user.username === blog.user.username ? (
          <button onClick={deleteBlog}>remove</button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Blog;
