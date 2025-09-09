
# Deploying Your Application

This guide provides step-by-step instructions for pushing your code to a GitHub repository and deploying it to the web using Vercel.

---

## Part 1: Pushing Your Code to GitHub

First, you need to get your code into your own GitHub repository.

### Prerequisites

*   A [GitHub](https://github.com/) account.
*   The `git` command-line tool installed on your computer.

### Steps

1.  **Download Your Project:**
    *   In Firebase Studio, click the **"Download as ZIP"** button to download the entire project to your computer.
    *   Unzip the downloaded file in your desired location.

2.  **Create a New GitHub Repository:**
    *   Go to [github.com](https://github.com) and log in.
    *   Click the **`+`** icon in the top-right corner and select **"New repository"**.
    *   Give your repository a name (e.g., `ai-crypto-dashboard`).
    *   Choose whether you want it to be public or private.
    *   **Important:** Do **not** initialize the repository with a `README`, `.gitignore`, or license file. We already have those.
    *   Click **"Create repository"**.

3.  **Push Your Code to the New Repository:**
    *   Open your computer's terminal or command prompt.
    *   Navigate to the unzipped project folder you downloaded:
        ```bash
        cd path/to/your/project-folder
        ```
    *   Initialize a new Git repository locally:
        ```bash
        git init -b main
        ```
    *   Add all the files to be tracked by Git:
        ```bash
        git add .
        ```
    *   Create your first commit:
        ```bash
        git commit -m "Initial commit of AI crypto app"
        ```
    *   On your new GitHub repository page, copy the URL. It will look something like `https://github.com/your-username/your-repo-name.git`.
    *   Link your local repository to the one on GitHub:
        ```bash
        git remote add origin https://github.com/your-username/your-repo-name.git
        ```
    *   Push your code to GitHub:
        ```bash
        git push -u origin main
        ```

**Congratulations!** Your code is now safely stored on GitHub.

---

## Part 2: Deploying to Vercel

Vercel is a platform that makes it incredibly easy to deploy Next.js applications.

### Prerequisites

*   A [Vercel](https://vercel.com/) account (you can sign up for free with your GitHub account).
*   Your CoinMarketCap API Key.

### Steps

1.  **Create a New Vercel Project:**
    *   Go to your [Vercel Dashboard](https://vercel.com/dashboard).
    *   Click the **"Add New..."** button and select **"Project"**.

2.  **Import Your GitHub Repository:**
    *   In the "Import Git Repository" section, find the GitHub repository you just created and click the **"Import"** button next to it.
    *   If you don't see it, you may need to grant Vercel access to your GitHub repositories.

3.  **Configure Your Project:**
    *   Vercel will automatically detect that you're using Next.js, so you shouldn't need to change any of the **Build & Output Settings**.
    *   The most important step is to add your API key. Expand the **"Environment Variables"** section.
    *   Add a new variable:
        *   **Name:** `COINMARKETCAP_API_KEY`
        *   **Value:** Paste your API key here.
    *   Click the **"Add"** button to save the variable.

4.  **Deploy:**
    *   Click the **"Deploy"** button.
    *   Vercel will now start building and deploying your application. You can watch the progress live.

5.  **Celebrate!**
    *   Once the deployment is complete, Vercel will give you a public URL where you can see and share your live application.

That's it! Your AI-Powered Build Challenge application is now live on the web.
