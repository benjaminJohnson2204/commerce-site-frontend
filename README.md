# Commerce Website Front end

This is the front end of a website I created where users can view and "buy" rugs (no money is actually spent; this is not a real commerce site) and administrators can post new rugs. I made this project for fun and to improve at programming and web development.

The website is hosted on Vercel at http://commerce-site-frontend.vercel.app/.

The back end is in a separate repository on a separate domain, which the front end can call. The back end repository can be found at https://github.com/benjaminJohnson2204/commerce-site-backend and its documentation can be found at https://commerce-site-backend.vercel.app/api/docs/.

## Tech Stack

I developed the front end of this project using React, TypeScript, React Router, Redux, Bootstrap, and Formik.

## Scripts

This project is a React project and uses the standard React project scripts. The following commands can all be run from the root directory:

- Install dependencies: `npm install`

- Run the project: `npm start`

- Build the project: `npm build`

## Code Structure

The source code for the front end can be found in the `src` directory. Within `src`, the `components` directory contains reusable components, the `pages` directory contains the code for each page on the site, and the `store` directory contains code for the Redux store.

## Pages and Flows

The home page displays all available rugs, with options to search for rugs, add filters, and change the ordering. The navigation header contains links to register an account and login, or, for users who are already logged in, to their cart and profile options.

When a user clicks on a rug, they are taken to `/rug/<id>`, a page showing information about that rug. From this page or the home page, users can add rugs to their cart or remove them from their cart, as long as they are logged in.

Users can see all the rugs in their cart at `/cart`. From there, they can remove an individual rug from their cart, or clear all rugs from their cart. Users can also checkout at the `/checkout` page.

Before checking out, users must verify their password and confirm their order (all the rugs in it and its total price). On a real-world commerce site, users would also enter their payment information, but for this project, they just click a confirmation button and then the order is placed.

Users can see all their past orders at `/orders`, which is accessible from the navigation header. This page shows a paginated table of their past orders, with options to change the ordering and filter by status. Users can click on any row in this table to be taken to a page, `/order/<id>`, with information about that order.

Finally, users can change their email preferences at `/email-preferences`, which is accessible from the navigation header.

## Tech Usage

I used the following frameworks/libraries for these purposes:

- **React**: React is the project's overarching framework.
- **TypeScript**: I wrote all my project code in TypeScript. ypeScript is JavaScript with an additional typing system to help catch errors earlier on.
- **React Router**: I used React Router for routing different URLs to different pages, as well as parsing search and query parameters and navigating to different pages.
- **Redux**: I used Redux for state management with users' authentication tokens. I used React's hooks for all my other state management, but with the authentication token, it needs to be persisted across pages and components, which is easier with a Redux store.
- **Bootstrap**: Bootstrap is a styling library, and React Bootstrap is a library of React Components built upon React. For styling the front end, I used mainly React Bootstrap, with some Bootstrap classes, and a little of my own CSS.
- **Formik**: Formik is a library for forms in React and TypeScript. I used it for the login and registration forms.
