# Routes Folder

Routes define the pathways within your application.
Fastify's structure supports the modular monolith approach, where your
application is organized into distinct, self-contained modules.
This facilitates easier scaling and future transition to a microservice architecture.
In the future you might want
to independently deploy some of those.

In this folder you should define all the routes that define the endpoints
of your web application.
Each service is a [Fastify
plugin](https://fastify.dev/docs/latest/Reference/Plugins/), it is
encapsulated (it can have its own independent plugins) and it is
typically stored in a file; be careful to group your routes logically,
e.g. all `/users` routes in a `users.js` file. We have added
a `root.js` file for you with a '/' root added.

If a single file becomes too large, create a folder and add a `index.js` file there:
this file must be a Fastify plugin, and it will be loaded automatically
by the application. You can now add as many files as you want inside that folder.
In this way you can create complex routes within a single monolith,
and eventually extract them.

If you need to share functionality between routes, place that
functionality into the `plugins` folder, and share it via
[decorators](https://fastify.dev/docs/latest/Reference/Decorators/).

If you're a bit confused about using `async/await` to write routes, you would
better take a look at [Promise resolution](https://fastify.dev/docs/latest/Reference/Routes/#promise-resolution) for more details.

## Re-enabling profile editing on the account page

Profile editing is temporarily disabled by design.
When you want to restore it, use this checklist:

1. **Re-enable the route handler**
   - Open `src/routes/account.ts`.
   - Change `ACCOUNT_PROFILE_EDITING_ENABLED` from `false` to `true`.
   - This restores `POST /account` updates for authenticated users.

2. **Unlock the profile fields in the form state**
   - Open `src/state/form/edit.user.form.state.ts`.
   - Remove the `inputProps.readOnly` flags from the editable profile fields:
     - `name`
     - `firstname`
     - `lastname`
     - `email`
     - `phone`
   - Keep the `role` field read-only unless role editing is intentionally being added.

3. **Restore the save button**
   - In the same form state file, change the submit button title back to `Save Changes` if needed.
   - Remove the disabled flag from the submit button props.

4. **Verify before shipping**
   - Run the account tests:
     - `pnpm exec node --test -r ts-node/register test/routes/account.test.ts`
   - Run the TypeScript build:
     - `pnpm run build:ts`

5. **Optional cleanup**
   - Update any helper text on the account page so it no longer says the form is view-only.
   - Keep the visible role field in place so users can still see their current clearance level.
