const { test, expect, beforeEach, describe } = require('@playwright/test');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset');
    await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'testuser',
        name: 'Test User',
        password: 'password123',
      },
    });
    await page.goto('http://localhost:5173');
  });

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.locator('input[name="Username"]').fill('testuser');
      await page.locator('input[name="Password"]').fill('password123');
      await page.getByRole('button', { name: 'login' }).click();
      await expect(page.getByText('Test User logged in')).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await page.locator('input[name="Username"]').fill('testuser');
      await page.locator('input[name="Password"]').fill('wrong');
      await page.getByRole('button', { name: 'login' }).click();
      await expect(page.getByText('Wrong credentials')).toBeVisible();
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.locator('input[name="Username"]').fill('testuser');
      await page.locator('input[name="Password"]').fill('password123');
      await page.getByRole('button', { name: 'login' }).click();
      await expect(page.getByText('Test User logged in')).toBeVisible();
    });

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click();
      await page.locator('input[name="Title"]').fill('Test Blog');
      await page.locator('input[name="Author"]').fill('Test Author');
      await page.locator('input[name="URL"]').fill('http://test.com');
      await page.getByRole('button', { name: 'create' }).click();

      await expect(
        page.getByText('A new blog "Test Blog" by Test Author added')
      ).toBeVisible();

      await expect(page.locator('.blog')).toHaveCount(1);
    });

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'create new blog' }).click();
        await page.locator('input[name="Title"]').fill('Test Blog');
        await page.locator('input[name="Author"]').fill('Test Author');
        await page.locator('input[name="URL"]').fill('http://test.com');
        await page.getByRole('button', { name: 'create' }).click();

        await expect(page.locator('.blog')).toHaveCount(1);
      });

      test('blog can be liked', async ({ page }) => {
        const blog = page.locator('.blog').first();
        await blog.getByRole('button', { name: 'view' }).click();
        await blog.getByRole('button', { name: 'like' }).click();
        await expect(blog.getByText('likes 1')).toBeVisible();
      });

      test('blog can be deleted by creator', async ({ page }) => {
        page.once('dialog', (dialog) => {
          dialog.accept();
        });
        const blog = page.locator('.blog').first();
        await blog.getByRole('button', { name: 'view' }).click();
        await blog.getByRole('button', { name: 'remove' }).click();
        await expect(page.locator('.blog')).toHaveCount(0);
      });

      test('delete button is only visible to creator', async ({
        page,
        request,
      }) => {
        await request.post('http://localhost:3003/api/users', {
          data: {
            username: 'otheruser',
            name: 'Other User',
            password: 'password456',
          },
        });
        await page.getByRole('button', { name: 'logout' }).click();
        await page.locator('input[name="Username"]').fill('otheruser');
        await page.locator('input[name="Password"]').fill('password456');
        await page.getByRole('button', { name: 'login' }).click();
        const blog = page.locator('.blog').first();
        await blog.getByRole('button', { name: 'view' }).click();
        await expect(
          blog.getByRole('button', { name: 'remove' })
        ).not.toBeVisible();
      });

      test('blogs are ordered by likes', async ({ page }) => {
        await page.getByRole('button', { name: 'create new blog' }).click();
        await page.locator('input[name="Title"]').fill('Blog Zero');
        await page.locator('input[name="Author"]').fill('Author Zero');
        await page.locator('input[name="URL"]').fill('http://zero.com');
        await page.getByRole('button', { name: 'create' }).click();

        await page.getByRole('button', { name: 'create new blog' }).click();
        await page.locator('input[name="Title"]').fill('Blog Two');
        await page.locator('input[name="Author"]').fill('Author Two');
        await page.locator('input[name="URL"]').fill('http://two.com');
        await page.getByRole('button', { name: 'create' }).click();

        const blogs = page.locator('.blog');
        await expect(blogs).toHaveCount(3);

        const blogTwo = blogs.filter({ hasText: 'Blog Two' }).first();
        await blogTwo.getByRole('button', { name: 'view' }).click();
        await blogTwo.getByRole('button', { name: 'like' }).click();
        await blogTwo.getByRole('button', { name: 'like' }).click();
        await blogTwo.getByRole('button', { name: 'hide' }).click();

        const firstBlog = blogs.first();
        await expect(firstBlog).toContainText('Blog Two');
      });
    });
  });
});
