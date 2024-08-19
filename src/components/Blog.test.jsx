import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import Blog from "./Blog";

describe("Blog test", () => {
  let blog, userData, component;

  beforeEach(() => {
    blog = {
      title: "title test",
      author: "author test",
      likes: 3,
      url: "http://localhost:3003/api/blogs",
      user: "6695c232eeb8fd4c9625042e",
    };

    userData = {
      name: "Dan Abramov",
      username: "abramov",
    };

    component = render(<Blog blog={blog} user={userData} />);
  });

  test("renders content", () => {
    const element = component.getByText("title test author test");
    expect(element).toBeDefined();

    const div = component.container.querySelector(".togglableContent");
    expect(div).toHaveStyle("display:none");
  });

  test("show togglableContent", async () => {
    const user = userEvent.setup();
    const button = component.getByText("view");
    await user.click(button);

    const div = component.container.querySelector(".togglableContent");
    expect(div).not.toHaveStyle("display:none");

    const element = component.getByText("http://localhost:3003/api/blogs 3");
    expect(element).toBeDefined();
  });

  test("dbclick", async () => {
    const mockHandler = vi.fn();

    const component = render(
      <Blog blog={blog} user={userData} addLike={mockHandler} />
    );
    const button = component.container.querySelector(".likeButton");
    const user = userEvent.setup();
    await user.click(button);
    await user.click(button);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
