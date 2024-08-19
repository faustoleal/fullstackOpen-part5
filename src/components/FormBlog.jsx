import { useState } from "react";

const FormBlog = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [author, setAuthor] = useState("");

  const addBlog = (e) => {
    e.preventDefault();
    createBlog({
      title: title,
      author: author,
      url: url,
    });

    setTitle("");
    setAuthor("");
    setUrl("");
  };
  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title
          <input
            id="title"
            data-testid="title"
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            id="author"
            data-testid="author"
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url
          <input
            id="url"
            data-testid="url"
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit" className="sendButton">
          create
        </button>
      </form>
    </>
  );
};

export default FormBlog;
