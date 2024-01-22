# Files Purposes

### In this file i will describe the most important files/directories and their usecases/purpose.

---

<details>
  <summary><code>/drizzle</code></summary>
  |
  <details>
    <summary>
      <code
        >/drizzle/migrations/<span style="color: #2aa4d4"
          >tables.sql</span
        ></code
      >
    </summary>
    <h2>tables.sql</h2>
    <p style="font-size: 18px">
      This file serves no purpose within the project itself and merely
      illustrates how all tables in the database appear in SQL.
    </p>
  </details>
  |
  <details>
    <summary>
      <code>/drizzle/schema/<span style="color: #2aa4d4">schema.ts</span></code>
    </summary>
    <h2>schema.ts</h2>
    <p style="font-size: 18px">
      The <code>schema.ts</code> file is what instructs both the database and
      Drizzle ORM on how data is stored and interconnected in the database. To
      configure the tables in the database to match my preferences, I write a
      schema for each table in TypeScript. With Drizzle-Kit, this schema is used
      to generate tables in the database. Instead of utilizing foreign keys to
      link data, I employ Drizzle's relational tables, enabling me to fetch a
      substantial amount of connected data simultaneously with relatively simple
      syntax. I opted for this approach because, when I initiated the project,
      my database provider, Planetscale, lacked support for foreign keys. Since
      then, support for foreign keys has been added.
    </p>
  </details>
</details>
<br />
<details>
  <summary><code>/src</code></summary>
  <br />
  <details>
    <summary><code>/src/components/</code></summary>
  </details>
  <br />
  <details>
    <summary>
      <code>/src/<span style="color: #2aa4d4">layouts</span>/</code>
    </summary>
  </details>
  <br />
  <details>
    <summary>
      <code>/src/middleware/<span style="color: #2aa4d4">index.ts</span></code>
    </summary>
    <h2>index.ts</h2>
    <p style="font-size: 18px">
      In this file i define the middlware that will be run upon every request
      sent on the website. The main and most important purpose is to make sure
      that routes such as admin pagescannot be accessed by someone who is not
      authorized. There are also some routes that should not have auth checks
      every request such as the login page, so that is also handled in the
      middleware.
    </p>
  </details>
  <br />
  <details>
    <summary><code>/src/pages/</code></summary>
    <h2>Pages Directory</h2>
    <p style="font-size: 18px">
      In this directory are the pages and routes that are actually used and
      viewable on the website.
    </p>
    |
    <details>
      <summary>
        <code>/src/pages/<span style="color: #2aa4d4">api</span>/</code>
      </summary>
      <h2>API Directory</h2>
      <p style="font-size: 18px">
        The files insidethis directory are what makes most things on the website
        actually work by letting forms and actions on the client to communicate
        with the server, while also validating and authenticating in the process
        if necessary.
      </p>
    </details>
    |
    <details>
      <summary>
        <code
          >/src/pages/post/<span style="color: #2aa4d4">[post].astro</span
          >/</code
        >
      </summary>
      <h2>[post].astro</h2>
      <p style="font-size: 18px">
        The purpose of the <code>[post].astro</code> file is to facilitate
        dynamic routing within the project. Dynamic routing allows for the
        creation of pages that can be dynamically loaded based on the URL
        structure. In this specific case, the use of square brackets
        <code>[post]</code> in the file name indicates that it's a dynamic route
        parameter. This dynamic parameter enables the generation of a unique
        page for each existing post in the system. <br /><br />
        To illustrate, consider the following scenario: If a user visits a URL
        like <code>/post/randomId</code>, where randomId is a placeholder for an
        actual post identifier, the page will dynamically load the content
        associated with the post having the ID of randomId. This mechanism
        enables the project to generate and display pages on-the-fly, providing
        a seamless and customized experience for each post in the system.
      </p>
    </details>
  </details>
  <br />
  <details>
    <summary><code>/src/server/</code></summary>
    <h2>Server Directory</h2>
    <p style="font-size: 18px">
      The server directory contains some of the most important files for this
      project, where it connects to the database and handles all the database
      queries and related functions.
    </p>
    |
    <details>
      <summary>
        <code>/src/server/<span style="color: #2aa4d4">db.ts</span></code>
      </summary>
      <h2>db.ts</h2>
      <p style="font-size: 18px">
        This file contains the necessary functions to connect to the database,
        which isrequired for the files after this to function.
      </p>
    </details>
    |
    <details>
      <summary>
        <code>/src/server/<span style="color: #2aa4d4">misc.ts</span></code>
      </summary>
      <h2>misc.ts</h2>
      <p style="font-size: 18px">
        This file contains logic not directly related to users and posts and
        other utility functions such as extracting a cookie from a request,
        searching for both posts and users, etc.
      </p>
    </details>
    |
    <details>
      <summary>
        <code>/src/server/<span style="color: #2aa4d4">posts.ts</span></code>
      </summary>
      <h2>posts.ts</h2>
      <p style="font-size: 18px">
        This file contains functions for handling posts and comments, like
        creating and deleting among other things.
      </p>
    </details>
    |
    <details>
      <summary>
        <code>/src/server/<span style="color: #2aa4d4">users.ts</span></code>
      </summary>
      <h2>users.ts</h2>
      <p style="font-size: 18px">
        This file contains the logic for encrypting and decrypting passwords,
        signing and verifying JWT tokens for authetication, create and delete
        accounts, etc.
      </p>
    </details>
  </details>
  <br />
  <details>
    <summary>
      <code>/src/utils/<span style="color: #2aa4d4">fetchJson.ts</span></code>
    </summary>
    <h2>fetchJson.ts</h2>
    <p style="font-size: 18px">
      The <code>fetchJson.ts</code> file serves a specific purpose, containing a
      single function with the same name. The primary objective of this function
      is to streamline the process of making API requests by consolidating the
      typical steps into a single function call. By leveraging the deepmerge
      library, users can provide options to the function in a manner similar to
      a standard fetch call.
      <br />
      The function, when executed, initiates a fetch request. If the HTTP status
      returned falls outside the 200 range, the function throws an error and
      returns null. This error is triggered only if the JSON response lacks a
      <code>success</code> key, which is used to signal cases where the user
      needs to be aware of the error that occured.
    </p>
  </details>
</details>


---
