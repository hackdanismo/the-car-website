# The Car Website

## Run the Application
To run the application locally, use:

```shell
$ npm run dev
```

This will run the application on localhost here: `http://localhost:4321/`.

## Developer Setup

### Set the Node version
The `Node` version is set and managed using `NVM (Node Version Manager)`. A `.nvmrc` file is used to set the `Node` version to install and use for the project. This is saved in the root of the project folder.

```
24.20.0
```

To install and/or set the `Node` version:

```shell
# Install the Node version using NVM if not already installed
$ nvm install
# Set the Node version to use
$ nvm use
```

### Add the .gitignore
The `.gitignore` file lists all the files and directories to not be added to version control when commits or changes are made. These may include: `node_modules` and configuration files. The `.gitignore` file is added to the root of the project folder.

```
node_modules/
dist/
.astro/
.env
.env.*
```

### Install Astro
We are using `Astro` as the frontend framework for this project. To install and setup `Astro`, use the following terminal commands:

```shell
# Install and setup Astro
$ npm create astro@latest .
# Install dependencies and devDependency packages. Generates the node_modules folder
$ npm install
# Run the application on the local development server
$ npm run dev
```

The application will be available to view locally here: `http://localhost:4321/`.

<img width="1617" height="891" alt="The initial screen showing the Astro application once installed." src="https://github.com/user-attachments/assets/d1915aa2-ad81-4397-96d3-d4ea9f7b18dd" />

## Adding Pages
`Astro` uses file-based routing. To add a new page, create a new `.astro` file inside of `src/pages`. For example, if the page was named `about.astro`, then this page becomes available at: 

```
/about
```

Example `about.astro` page:

```astro
---
const title = "About";
---

<html lang="en">
<head>
    <title>{title}</title>
</head>
<body>
    <h1>About</h1>

    <a href="/">Back to home</a>
</body>
</html>
```

Links between pages uses a normal hyperlink:

```html
<a href="/about">About</a>
```

## Content Management
We are using [Sanity](https://www.sanity.io/) as the `Content Management` platform to manage content across the application. 

The usual setup is: `Astro` handles the frontend, `Sanity` is the CMS, and Astro `pages/` components fetch content from Sanity using Sanity's JavaScript client.

Begin by creating an account, if this has not already been done. Once logged in, a project needs to be created. This can be done on this page: [https://www.sanity.io/manage](https://www.sanity.io/manage).

<img width="1574" height="824" alt="The dashboard in Sanity to create a new project." src="https://github.com/user-attachments/assets/beb05881-e552-4300-8063-8a1747523887" />

The `Sanity` project will be called: `the-car-website`.

<img width="1617" height="819" alt="Creating a new project in Sanity." src="https://github.com/user-attachments/assets/f2d1d6c0-46f1-4d96-8f98-98bc64c427a4" />

Install the `@sanity/client` `npm` package:

```shell
$ npm install @sanity/client
```

Within the `Astro` framework, add a file here: `src/lib/sanity.ts` with the following code:

```typescript
import { createClient } from "@sanity/client";

export const sanity = createClient({
    projectId: "YOUR_PROJECT_ID",
    dataset: "production",
    apiVersion: "2026-09-04",
    useCdn: true,
});
```

Replace `YOUR_PROJECT_ID` with the ID of the Sanity project.

### Sanity Studio
`Sanity Studio` is the the user interface dashboard for the `Sanity CMS`. Think of it as the admin area where we can create and manage content. The `Astro` app is the public-facing website; `Sanity Studio` is where the content gets entered and edited.

Since we already have both the `Astro` app and the `Sanity` project, the cleanest setup is to embed `Sanity Studio` at a route such as `/studio` inside of the project folder containing `Astro`. Sanity's official Astro integration supports this directly.

`@astrojs/react` is needed when embedding `Studio` in `Astro`.

From the root of the `Astro` project, install the integration:

```shell
$ npx astro add @sanity/astro @astrojs/react
```

Once installed, the `astro.config.mjs` file should look like this:

```mjs
// @ts-check
import { defineConfig } from 'astro/config';
import sanity from '@sanity/astro';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    integrations: [
        sanity({
            projectId: "YOUR_PROJECT_ID",
            dataset: "production",
            useCdn: false,
            studioBasePath: "/studio",
        }), 
        react()
    ],
});
```
Replace `YOUR_PROJECT_ID` with the `Sanity project ID`.

Then create a `sanity.config.ts` file in the project root:

```typescript
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

export default defineConfig({
    name: "default",
    title: "The Car Website",
    projectId: "YOUR_PROJECT_ID",
    dataset: "production",
    plugins: [structureTool()],
    schema: {
        types: [],
    },
});
```

Replace `YOUR_PROJECT_ID` with the `Sanity project ID`.

The important part for the `Studio` is:

```typescript
studioBasePath: "/studio"
```

This tells `Astro` to serve `Sanity Studio` from: `http://localhost:4321/studio`.

We should also add the `Sanity` module types to a `src/env.d.ts` file as `Sanity` specifically documents this because the `Astro` integration exposes its client through a virtual module:

```typescript
/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />
```

Now, run:

```shell
$ npm run dev
```

And visit: `http://localhost:4321/studio` to open the `Studio`.

### Setting CORS
Because `Studio` is now running inside of the `Astro` project, the `Astro` origin needs to be added to the project's `CORS Origins` in `Sanity`.

Go to: `Sanity` -> `the-car-website` -> `Settings` -> `API settings` -> `CORS Origins`

During development, add:

```
http://localhost:4321
```

And enable `Allow credentials`. `Sanity` requires this for authenticated `Studio` requests.

Once this is done, we can now login to `Studio` with our `Gmail`, `GitHub` or `Email` credentials.

<img width="1615" height="868" alt="Login to the Sanity Studio using login credentials." src="https://github.com/user-attachments/assets/bbde3dce-3284-49b8-91ac-ef96cd822f76" />

## Create the Schema
The `schema` is the structure for the data in the `CMS`. Within the project, create a `schemaTypes/` folder in the root of the project. Each schema will have the file type of `TypeScript` so will be `.ts` file e.g. `article.ts`.

```typescript
import { defineField, defineType } from "sanity";

export const articleType = defineType({
    name: "article",
    title: "Article",
    type: "document",

    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "title",
            },
        }),
    ],
});
```

We also need a `schemaTypes/index.ts` file to list each schema:

```typescript
import { articleType } from "./article";

export const schemaTypes = [
    articleType,
];
```

Then, update the `sanity.config.ts` file to include the `schemaTypes`:

```typescript
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";

export default defineConfig({
    name: "default",
    title: "The Car Website",
    projectId: "YOUR_PROJECT_ID",
    dataset: "production",
    plugins: [structureTool()],
    schema: {
        types: schemaTypes,
    },
});
```

After that, restart:

```shell
$ npm run dev
```

And open: `http://localhost:4321/studio`

We should then see `Article` appear as a document type in `Sanity Studio`.

One distinction worth keeping clear: the existing `src/lib/sanity.ts` is typically for the `Astro` frontend to query `Sanity`, whereas `schemaTypes/` is for defining what editors can create inside `Sanity Studio`.

<img width="1617" height="875" alt="The article schema showing as a document type in Sanity Studio." src="https://github.com/user-attachments/assets/a6beb70e-47fc-400f-a2b4-32569069af9c" />

Adding a new `article` to the `CMS`:

<img width="1617" height="878" alt="Fields showing when the article document type is being used." src="https://github.com/user-attachments/assets/0ce2a417-0f72-4484-be33-17c4d6c06290" />

Click the `Publish` button to publish the article and add this to the website.

## Add Environment Variables
In the root of the project, add the `.env` file containing the environment variables:

```
# Astro
PUBLIC_SANITY_PROJECT_ID=xxxxxxx
PUBLIC_SANITY_DATASET=production

# Sanity Studio
SANITY_STUDIO_PROJECT_ID=xxxxxxx
SANITY_STUDIO_DATASET=production
```

Update the `sanity.config.ts` file:

```typescript
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";

export default defineConfig({
    name: "default",
    title: "The Car Website",
    projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
    dataset: process.env.SANITY_STUDIO_DATASET!,
    plugins: [structureTool()],
    schema: {
        types: schemaTypes,
    },
});
```

Update the `astro.config.mjs` file:

```mjs
// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from "vite";
import sanity from '@sanity/astro';
import react from '@astrojs/react';

const {
    PUBLIC_SANITY_PROJECT_ID,
    PUBLIC_SANITY_DATASET,
} = loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "");

// https://astro.build/config
export default defineConfig({
    integrations: [
        sanity({
            projectId: PUBLIC_SANITY_PROJECT_ID,
            dataset: PUBLIC_SANITY_DATASET,
            useCdn: false,
            studioBasePath: "/studio",
        }), 
        react()
    ],
});
```

## Create the Articles page
Create an `articles` page that will display all articles that have been added to the `Sanity CMS`. Begin by creating a `.astro` file here: `src/pages/articles/index.astro`. Then use:

```astro
---
import { sanityClient } from "sanity:client";

const articles = await sanityClient.fetch(`
    // Get every Sanity document whos type is "article" and show the newest article first
    *[_type == "article"] | order(_createdAt desc) {
        _id,
        title,
        "slug": slug.current
    }
`);
---

<html lang="en">
    <head>
        <title>Articles</title>
    </head>
    <body>
        <main>
            <h1>Articles</h1>

            {
                articles.length > 0 ? (
                    <ul>
                        {articles.map((article) => (
                            <li>
                                <a href={`/articles/${article.slug}`}>
                                    {article.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No articles have been added yet.</p>
                )
            }
        </main>
    </body>
</html>
```

To have each article have its own page, we create the `src/pages/articles/[slug].astro`. So clicking an article opens its own page.

The code for this page would look like this:

```typescript
---
import { sanityClient } from "sanity:client";

export async function getStaticPaths() {
    const articles = await sanityClient.fetch(`
        *[_type == "article" && defined(slug.current)] {
            title,
            "slug": slug.current
        }
    `);

    return articles.map((article) => ({
        params: {
            slug: article.slug,
        },
        props: {
            article,
        },
    }));
}

const { article } = Astro.props;
---

<html lang="en">
    <head>
        <title>{article.title}</title>
    </head>
    <body>
        <main>
            <a href="/articles">Back to articles</a>

            <article>
                <h1>{article.title}</h1>

                <p>Article content here</p>
            </article>
        </main>
    </body>
</html>
```

We will adjust the `schemaTypes/article.ts` code to ensure that all articles should have a `slug` and `title` required.

```typescript
import { defineField, defineType } from "sanity";

export const articleType = defineType({
    name: "article",
    title: "Article",
    type: "document",

    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "title",
            },
            validation: (Rule) => Rule.required(),
        }),
    ],
});
```

## Layout
In order to create a layout for the pages, so we can add shared components such as a Header and a Footer, begin by adding a file named `BaseLayout.astro` into the `layouts/` directory. We currently already have the initial `layout/Layout.astro` file from when the `Astro` application was created.

The `layout/BaseLayout.astro` file looks like this:

```astro
---
import Footer from "./../components/Footer.astro";

const { title = "The Car Website" } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width">

        <title>{title}</title>
    </head>
    <body>
        <main>
            <slot />
        </main>

        <Footer />
    </body>
</html>
```

The `<slot />` component is where the content is rendered. You will also notice that we have a `Footer` component in `components/Footer.astro` that we are importing. This is the basic shared page footer.

```astro
<footer>
    <p>&copy; 2026 The Car Website</p>
</footer>
```

Within a page, we need to import the layout into the page:

```astro
import BaseLayout from "./../../layouts/BaseLayout.astro";
```

We then wrap the layout element around the page content to apply the page layout structure. For example, this is the `pages/index.astro` homepage:

```astro
---
import { sanityClient } from "sanity:client";

import BaseLayout from "./../../layouts/BaseLayout.astro";

const articles = await sanityClient.fetch(`
    *[_type == "article"] | order(_createdAt desc) {
        _id,
        title,
        "slug": slug.current
    }
`);
---

<BaseLayout title="Articles">
    <h1>Articles</h1>

    {
        articles.length > 0 ? (
            <ul>
                {articles.map((article) => (
                    <li>
                        <a href={`/articles/${article.slug}`}>
                            {article.title}
                        </a>
                    </li>
                ))}
            </ul>
        ) : (
            <p>No articles have been added yet.</p>
        )
    }
</BaseLayout>
```

Notice that the `<BaseLayout />` component passes the page title into the page layout to render in the title:

```astro
<BaseLayout title="Articles"> ... </BaseLayout>
```

## Components
All components should be placed inside of the `components/` folder and each component file should have the file extension of: `.astro`.

## Styling
We will be using `Tailwind CSS` for adding styling to our pages. From the `Astro` project root, run:

```shell
$ npx astro add tailwind
```

`Astro` will install and configure the `Tailwind Vite` plugin. This is the recommended setup. Our `astro.config.mjs` file will look like this:

```mjs
// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from "vite";
import sanity from '@sanity/astro';
import react from '@astrojs/react';

import tailwindcss from "@tailwindcss/vite";

const {
    PUBLIC_SANITY_PROJECT_ID,
    PUBLIC_SANITY_DATASET,
} = loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "");

// https://astro.build/config
export default defineConfig({
  integrations: [
      sanity({
          projectId: PUBLIC_SANITY_PROJECT_ID,
          dataset: PUBLIC_SANITY_DATASET,
          useCdn: false,
          studioBasePath: "/studio",
      }), 
      react()
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
```

A `global.css` stylesheet will now be generated within a `src/styles` directory.

```
src/
  styles/
    global.css
```

The `global.css` stylesheet can then be imported into the layout file of `src/layouts/BaseLayout.astro` so Tailwind CSS is available across the whole site.

```astro
---
import "../styles/global.css";

import Header from "./../components/Header.astro";
import Footer from "./../components/Footer.astro";

// Set the title prop when passed into the layout from the page
const { title } = Astro.props;

// Render the page title and use ternary to add title to the default if passed as prop value
const pageTitle = title
    ? `The Car Website - ${title}`
    : "The Car Website";
---
```

`Tailwind CSS` includes a built-in CSS reset called `Preflight`.

```css
@import "tailwindcss";
```

### Adding a Custom CSS Stylesheet
Custom CSS code can either be added to the `global.css` stylesheet or can be added to separate CSS stylesheets and imported in. For example, creating a stylesheet named `src/styles/layout.css` and importing it into `src/styles/global.css` would look like this:

```css
@import "tailwindcss";
@import "./layout.css";
```