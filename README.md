# Sveltekit - Taro Stack

## ❗ Important

If you forked this repository before May 27th, you'll want to view commit `653e2c2`. There was an issue with the Hono context not correctly parsing routes.

## ❔ What

A scalable, testable, extensible, template for Sveltekit.

Sveltekit is awesome, but sometimes you need a bit more capability in the backend than what frameworks like
NextJS & Sveltekit can deliver.

To remedy this, I've attatched a fully fletched backend to run on the Sveltekit process and forward all API requests to it and paired it with some architectural patterns.

`/api/[...slugs]`

```ts
import app from '$lib/api';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ request }) => app.fetch(request);
export const PUT: RequestHandler = ({ request }) => app.fetch(request);
export const DELETE: RequestHandler = ({ request }) => app.fetch(request);
export const POST: RequestHandler = ({ request }) => app.fetch(request);
```

## Local Setup

1. Make sure Docker is running
2. Copy the `.env.example` file and rename to `.env`
3. `pnpm install`
4. `pnpm initialize`(this will start the docker-compose and run the initial database migration.)
5. `pnpm dev`

No additional setup is required, zero api keys, zero services to signup for, zero cost.

## How to Use

This is **not** supposed to serve as an all batteries included ["production boilerplate"](https://github.com/ixartz/Next-js-Boilerplate) with 200 useless sponsored features that get in your way. Templates that do this are ANYTHING but "production" and "quick start".

This is stack is designed to be library agnostic. The philosophy here is to boostrap the concrete, repetitive, and time consuming tasks that every application will need reguardless of what you're building.

**So - fork this repo, add your favorite libraries, and build out your own "more opinionated" personal template tailored to you**!

## Features

- 🟢 Full E2E typesafety
- 🟢 RPC Client for API Requests
- 🟢 Custom Fetch Wrapper
- 🟢 Deployment Template
- 🟠 Authentication
  - 🟢 Email/Passkey
  - 🔴 OAuth
  - 🟢 Email Update/Verifiaction
  - 🟢 Rate limiter

## Technologies

I'm mostly unopinionated or what technology or libaries someone uses. Wanna [uwu'ify](https://www.npmjs.com/package/owoifyx) your entire fucking app? Go for it.

That being said, there are some libaries that embody my philosophies of building software more than others,

- [Lucia](https://lucia-auth.com): Hits the right level of abstraction for me. Hand me the tools to build a secure authentication system and let me implement it to suite my needs
- [Drizzle](https://orm.drizzle.team/) - Drizzle advertises itself as an ORM but I think its deceptive. Its a query builder with a migration client. Everytime I've used an ORM, I find myself fighting it for sometimes the simplist of use cases. Drizzle just gives you type-safety while querying SQL in a native fashion. Learn SQL, not ORMs.
- [Hono](https://hono.dev/): Fast, lightweight, and built on **web standards**; meaning it can run anywhere you're Sveltekit app can. It's essentially a better, newer, and ironically more stable Express.JS. This provides us an extreemely good foundation to cleanly build ontop of without having to teardown first. It has a zod adapter for validating DTO's which can be shared with the frontend too.
- [Sveltekit](https://kit.svelte.dev/): After trying Vue, React, Next, and pretty much every frotnend framework in the JS ecosystem, its safe to say I vastly prefer Svelte and its priority of building on **web standards**.

## Architecture

There are a few popular architectures for structuring backends. Technical, Onion, DDD, VSA, and the list goes on. I almost always choose
to start with Technical and let the project naturally evolve into one of the others as complexity grows.

### Backend Folder Structure

- **controllers** - Responsible for routing requests

- **services** - Responsible for handling business logic.

- **repositories** - Responsible for retrieving and
  storing data.

- **infrastructure** - Handles the implementation of external services or backend operations.

- **middleware** - Middlware our request router is responsible for handling.

- **providers** - Injectable services

- **dtos** - Data Transfer Objects (DTOs) are used to define the shape of data that is passed.

- **common** - Anything commonly shared throughout the backend

### File Naming

You might notice how each file in the backend is postfixed with its architectural type(e.g. `iam.service.ts`). This allows
us to easily reorganize the folder structure to suite a different architecture pattern if the domain becomes more complex.

For example, if you want to group folders by domain(DDD), you simply drag and drop all related files to that folder.

```
└── events/
    ├── events.controller.ts
    ├── events.service.ts
    └── events.repository.ts
```

## Testing

Testing probably isn't first and foremost when creating an app. Thats fine. You should not be spending time writing tests if your app is mutable.

BUT, a good stack should be **testable** when the time to solidify a codebase arrives. I created this stack with that pinciple in mind. I've provided a examples of how to write these tests under `authentication.service.test.ts` or `users.service.test.ts`
