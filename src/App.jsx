import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import Message from "./components/Message";
import blogService from "./services/blogs";
import loginService from "./services/login";
import FormLogin from "./components/FormLogin";
import FormBlog from "./components/FormBlog";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const loggerUserJSON = window.localStorage.getItem("loggedBlogUser");
    if (loggerUserJSON) {
      const user = JSON.parse(loggerUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const addBlog = (blogObject) => {
    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog));
      setMessage(`a new blog ${returnedBlog.title} by ${user.name} added`);
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    });
  };

  const addLike = (id) => {
    const blogToUpdate = blogs.find((b) => b.id === id);
    const updateObject = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };
    blogService.update(id, updateObject).then((returnedBlog) => {
      setBlogs(blogs.map((b) => (b.id !== updateObject.id ? b : returnedBlog)));
    });
  };

  const deleteBlog = (id) => {
    const blogToDelete = blogs.find((b) => b.id === id);
    if (window.confirm(`Delete ${blogToDelete.title} ?`)) {
      blogService.remove(id).then((returnBlog) => {
        setBlogs(blogs.filter((b) => b.id !== id));
        setMessage(`Delete ${returnBlog.title}`);
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      });
    } else {
      setMessage("Operation canceled");
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("loggedBlogUser", JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setPassword("");
      setUsername("");
      setMessage(`${user.name} logged in`);
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      setErrorMessage("Wrong username or password");
      setTimeout(() => {
        setErrorMessage(null);
        setUsername("");
        setPassword("");
      }, 3000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogUser");
    setUser(null);
    blogService.setToken(null);
  };

  const sortBlogs = blogs.sort((a, b) => b.likes - a.likes);

  return (
    <div>
      <h1>Blogs</h1>
      <Message message={message} />
      <Notification message={errorMessage} />

      {user === null ? (
        <FormLogin
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      ) : (
        <>
          <p>
            {`${user.name} is logged in`}{" "}
            <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel="new blog">
            <FormBlog createBlog={addBlog} />
          </Togglable>
          <br />
          {sortBlogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              user={user}
              addLike={() => addLike(blog.id)}
              deleteBlog={() => deleteBlog(blog.id)}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default App;
