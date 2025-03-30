# GitHub Pages Deployment

This folder contains the GitHub Actions workflow configuration for deploying the Six-Nimmt application to GitHub Pages.

## How it works

The workflow defined in `workflows/gh-pages.yml` does the following:

1. Checks out the code from the repository
2. Sets up Node.js environment
3. Installs dependencies
4. Builds the application as a static export using Next.js
5. Uploads the build artifacts
6. Deploys the application to GitHub Pages

## Important configuration

The Next.js configuration has been updated in `next.config.ts` to support static export with the following settings:

- `output: "export"` - Generates static HTML/CSS/JS files 
- `basePath: "/six-nimmt"` - Sets the base path for production environment
- `images: { unoptimized: true }` - Required for static image exports

## Manual deployment

You can manually trigger the workflow from the GitHub Actions tab by selecting the workflow and clicking "Run workflow". 