const { test, describe, expect, beforeEach } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        name: "Dan Abramov",
        username: "abramov",
        password: "abramov2024",
      },
    });
    await page.goto("/");
  });

  test("front page can be opened", async ({ page }) => {
    const locator = await page.getByText("Blogs");
    await expect(locator).toBeVisible();
  });

  describe("login", () => {
    test("login with correct credentials", async ({ page }) => {
      await loginWith(page, "abramov", "abramov2024");

      await expect(page.getByText("Dan Abramov logged in")).toBeVisible();
    });

    test("login with wrong credentials", async ({ page }) => {
      await loginWith(page, "abramov", "wrong");

      await expect(page.getByText("Wrong username or password")).toBeVisible();
    });
  });

  describe("when logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "abramov", "abramov2024");
    });

    test("a new blog can be created", async ({ page }) => {
      await page.getByRole("button", { name: "new blog" }).click();
      await createBlog(page, "title test", "author test", "url test");

      await expect(page.getByText("title test author test")).toBeVisible();
    });

    describe("when a blog exists", () => {
      beforeEach(async ({ page }) => {
        await page.getByRole("button", { name: "new blog" }).click();
        await createBlog(page, "title test", "author test", "url test");
      });

      test("a blog can be edited", async ({ page }) => {
        await page.getByRole("button", { name: "view" }).click();
        await page.getByRole("button", { name: "likes" }).click();

        await expect(page.getByText("1")).toBeVisible();
      });

      test("a blog can be deleted by the author", async ({ page }) => {
        await page.getByRole("button", { name: "view" }).click();
        page.on("dialog", async (dialog) => await dialog.accept());
        await page.getByRole("button", { name: "remove" }).click();

        await expect(
          page.getByText("title test author test")
        ).not.toBeVisible();
      });

      test("the button remove is only visible for the author of the blog", async ({
        page,
        request,
      }) => {
        await request.post("/api/users", {
          data: {
            name: "Ada Lovelace",
            username: "lovelace",
            password: "lovelace2024",
          },
        });
        await page.getByRole("button", { name: "view" }).click();
        await expect(page.getByText("remove")).toBeVisible();

        await page.getByRole("button", { name: "logout" }).click();
        await loginWith(page, "lovelace", "lovelace2024");
        await page.getByRole("button", { name: "view" }).click();
        await expect(page.getByText("remove")).not.toBeVisible();
      });
    });

    describe("when several blogs exists", () => {
      beforeEach(async ({ page }) => {
        await page.getByRole("button", { name: "new blog" }).click();
        await createBlog(page, "test 1", "author 1", "url 1");
        await createBlog(page, "test 2", "author 2", "url 2");
        await createBlog(page, "test 3", "author 3", "url 3");
      });

      test("blog sort", async ({ page }) => {
        const locator = page.locator(".blog");
        await expect(locator).toHaveText([
          "test 1 author 1 view hideurl 1 0 likes Dan Abramov remove",
          "test 2 author 2 view hideurl 2 0 likes Dan Abramov remove",
          "test 3 author 3 view hideurl 3 0 likes Dan Abramov remove",
        ]);
        await page.getByRole("button", { name: "view" }).last().click();
        await page.getByRole("button", { name: "likes" }).click();
        await page.getByRole("button", { name: "hide" }).click();
        await expect(locator).toHaveText([
          "test 3 author 3 view hideurl 3 1 likes Dan Abramov remove",
          "test 1 author 1 view hideurl 1 0 likes Dan Abramov remove",
          "test 2 author 2 view hideurl 2 0 likes Dan Abramov remove",
        ]);
      });
    });
  });
});
