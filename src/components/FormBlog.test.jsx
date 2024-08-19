import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormBlog from "../components/FormBlog";
import { vi } from "vitest";

test("form calls event handler when a new blog is created", async () => {
  const createBlog = vi.fn();

  const component = render(<FormBlog createBlog={createBlog} />);

  const inputTitle = component.container.querySelector("#title");
  const inputAuthor = component.container.querySelector("#author");
  const inputUrl = component.container.querySelector("#url");
  const sendButtom = component.container.querySelector(".sendButton");

  await userEvent.type(inputTitle, "title test");
  await userEvent.type(inputAuthor, "author test");
  await userEvent.type(inputUrl, "http://localhost:3003/api/blogs");

  await userEvent.click(sendButtom);

  console.log(createBlog.mock.calls[0][0]);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe("title test");
  expect(createBlog.mock.calls[0][0].author).toBe("author test");
  expect(createBlog.mock.calls[0][0].url).toBe(
    "http://localhost:3003/api/blogs"
  );
});
