
# Tuber Design Document
- [Development](#development)
  - [Rumble test regex](#testing--rumble-test-regex-to-extract-the-video-id-and-the-thumbnail-url-at-the-same-time)
  - [Interactive theming](#improvement--interactive-theming)
  - [Authentication](#feature--authentication)
  - [Thumb up or thumb down on bookmarks](#feature--thumb-up-or-thumb-down-on-bookmarks)
  - [The sessions collection](#improvement--the-sessions-collection)
  - [Implement bookmark listings](#feature--implement-bookmark-listings)
  - [Advanced search queries](#feature--implement-advanced-search-queries)
  - [Security](#security)
  - [Miscellaneous](#miscellaneous)

## Synopsis
Bookmark a specific time in a video that you would like to quickly come back to.
Others can see your bookmark and potentially rate it.

There is a wealth of information hidden within videos. The problem? You'll
have to watch the entire video to find a specific piece of information. Or, if
you did find it before, you're likely to forget at what point in the video it is
located.
What if you could bookmark the location of the information within the video?
This is what this website does. It allows you to create a note—a bookmark
that you can then click on to play the video at the exact location where the
information is located.

## Versioning
- Bug fixes and improvements #1

## Emoji Legend
- :heavy_check_mark: for completed tasks.
- :clock7: for tasks that need to be completed.

For more emojis, visit [GitHub](https://gist.github.com/rxaviers/7360908).
## Git commands
### Quick Git Tutorial
When you're ready to push changes, do:  
```
git status
```
to see the changes
```
git add .
```
This will add all file changes
```
git commit -m "<message>"
```
To set your commit message. And finally:
```
git push origin main
```
To push changes to GitHub.
### How to delete a file from repository on GitHub
```
git rm --cached file1.txt
```
```
git commit -m "remove file1.txt"
```
More info on [stackoverflow](https://stackoverflow.com/a/2047477/1875859).
## Environment Variables
Run the following command to install the required packages:
```
pnpm i dotenv @types/dotenv
```
Create the `.env` file in the root directory. You can add key-value pairs, one per line, to make them available in `process.env`. For example, add the following key-value pair to the `.env` file:
```
FASTIFY_PORT=8080
```
To make the number `8080` available in `process.env.FASTIFY_PORT`.
More on [stackoverflow-1](https://stackoverflow.com/a/49579700/1875859) and [stackoverflow-2](https://stackoverflow.com/a/62288163/1875859).
## Database Design
[Model One-to-Many Relationships with Document References](https://www.mongodb.com/docs/manual/tutorial/model-referenced-one-to-many-relationships-between-documents/)
MongoDB Atlas username: `tuber_usr`
MongoDB Atlas password: `4iHk01P9MrTHKfsT`
MongoDB Atlas URI: `mongodb+srv://tuber_usr:<password>@tuber.wztd4v9.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp`
Public Key: `jzgavzqi`
Private Key: `ea7d2099-cffa-4901-b664-005772d310ea`
### Database Search
Since we are using MongoDB Atlas, we will use its search feature, which is based on [Apache Lucene](https://lucene.apache.org/).
## Authentication
[What are session, express-session, and session store?](https://youtu.be/F-sFp_AvHc8?t=3905)
- :x: [Fastify-session, store the session into MongoDB.](https://stackoverflow.com/a/66790015/1875859)
- :clock3: Disable the login (Power) button and let the server enable it back with the response.
- :clock4: To log out using a JWT token, we need to implement a token version number that will be stored in the user document and in a cache that can be quickly accessed. When the user's token is validated on a request, the version of the token within the token and the one in the cache will be compared to see if they are the same. If not, the request will be denied. When a user logs out, the token version will be incremented in the user document in the database and in the cache. [More info](https://stackoverflow.com/a/24235103/1875859).
## Setting the environment variables
- [Link 1](https://www.tutorialspoint.com/how-to-set-environment-variables-using-powershell)
## Security
:clock12: Although the example reads the key from a file on disk, it is poor practice when it comes to security. Ideally, **you should store secret keys in a key management service like Vault, KMS, or something similar** and read them at run-time.
## JSON:API Specification
- :clock1: Generate the `links` member that can be included in a JSON:API response.
- :clock2: Implement the necessary function to paginate resource collections.
- :clock3: Example response to return if the requested individual resource does not exist, is forbidden, or temporarily unavailable.
  ```json
  {
    "data": "null",
    "errors": [
      {
        "status": "403",
        "title": "Forbidden"
      }
    ]
  }
  ```
### Pagination
```json
{
  "links": {
    "self": "?page[number]=3&page[size]=1",
    "first": "?page[number]=1&page[size]=1",
    "prev": "?page[number]=2&page[size]=1",
    "next": "?page[number]=4&page[size]=1",
    "last": "?page[number]=13&page[size]=1"
  },
}
```
`page[size]` is the number of resources returned from the server in the response per pagination traversal.
- :x: The default size is 10.
- :clock1: The pagination feature and the pagination member (`links`) are optional.
- :clock2: The following `links` members are mandatory.
  ```json
  {
    "links": {
      "first": "", // the first page of data
      "last":  "", // the last page of data
      "prev": "null", // the previous page of data
      "next": "", // the next page of data
    }
  }
  ```
Unavailable members can either be omitted or have a `null`.

[ [Top](#tuber-design-document) ]

## Sources
- [Fastify Plugins (Ecosystem)](https://fastify.dev/docs/latest/Guides/Ecosystem/)
- [Fastify Hooks #lifecycle](https://fastify.dev/docs/latest/Reference/Hooks/)
- [@fastify/session](https://github.com/fastify/session)
- [@fastify/session package](https://www.npmjs.com/package/@fastify/session)
- [MongoDB findOne Example](https://www.digitalocean.com/community/tutorials/mongodb-findone-example)
- [**Code Generator**](https://codepal.ai)
- [**jsonwebtoken** Documentation](https://github.com/auth0/node-jsonwebtoken)
- [Where to store JWT in browser? How to protect against CSRF?](https://stackoverflow.com/questions/27067251/where-to-store-jwt-in-browser-how-to-protect-against-csRF)
- [Session-Based Authentication in a Nutshell](https://blog.devgenius.io/user-authentication-in-a-nutshell-ecf0d9dee2b3)
- [fastify-secure-session](https://github.com/fastify/fastify-secure-session)
- [What is .env ? How to Set up and run a .env file in Node?](https://www.codementor.io/@parthibakumarmurugesan/what-is-env-how-to-set-up-and-run-a-env-file-in-node-1pnyxw9yxj)
- [Fastify TypeScript documentation](https://fastify.dev/docs/latest/Reference/TypeScript/)
- [How to return a promise from an `async` function](https://bobbyhadz.com/blog/typescript-function-return-type-promise#declare-a-function-with-a-promise-return-type-in-typescript)
- [Fix jest not working with typescript and node.js](https://bobbyhadz.com/blog/typescript-jest-cannot-use-import-statement-outside-module#:~:text=The%20TypeScript%20jest%20error%20%22Cannot,ts%2Djest%20before%20running%20them.)
- [Mongoose pagination package](https://www.npmjs.com/package/mongoose-paginate-v2)
- [Path aliases with TypeScript in Node.js](https://dev.to/larswaechter/path-aliases-with-typescript-in-nodejs-4353)
- [Using absolute paths in TypeScript for imports](https://stackoverflow.com/a/55918656/1875859)
- [Hogan / mustache / handlebar](https://twitter.github.io/hogan.js/)
- [How to install or update Yarn 3.x](https://v3.yarnpkg.com/getting-started/install)
- [Screencast gif application](https://www.cockos.com/licecap/)
- [Material-UI breakpoints](https://mui.com/material-ui/customization/breakpoints/)
- [Using Material-UI breakpoints in your logic](https://stackoverflow.com/a/72828531/1875859)
- [Re-render view on browser resize with React](https://stackoverflow.com/a/19014495/1875859)
- [CSS color names](https://www.quackit.com/css/css_color_codes.cfm)
- [How to get Odysee video thumbnail URL](https://github.com/OdyseeTeam/odysee-api/issues/452#issuecomment-1306024654)

[ [Top](#tuber-design-document) ]

## Development

### [ **Testing** ] Rumble test regex to extract the video ID and the thumbnail URL at the same time
- :heavy_check_mark: Create the endpoint to receive the `rumble` URL and the regular expression.
- :heavy_check_mark: Use the `rumble` URL to load the HTML page into a variable.
- :heavy_check_mark: Use the regular expression to successfully extract both the `videoid` and the `thumbnail_url` of the video.
- :heavy_check_mark: Return both the `videoid` and the `thumbnail_url` as a state to the client by inserting that information into the `formsData.<form_key>` state client-side.

[ [Top](#tuber-design-document) ]

### [ **Improvement** ] Interactive theming
Use a CSS expression-like feature to create placeholder strings as JSS values. The placeholders will then be replaced with the real value client-side, when the components are rendered from the state. It would be a good idea to make it look like a CSS processor variable.
```ts
const state = {
  'icon': 'alternate_email_outline',
  'iconProps': {
    'sx': { 'color': '@iconColor' } // Used to be 'grey.500'
  }
};
```
- :x: Create a CSS value registry.
- :x: Find a solution to make the registry available to all state definitions. Creating it as a field in the AbstractState class is not a bad idea.
- :x: Create a function that can then take the values that start with `@` and replace it with the real value located in the registry.

[ [Top](#tuber-design-document) ]

### [ **Feature** ] Authentication
- :heavy_check_mark: Create an endpoint service to receive credentials and authenticate the user.
- :clock1: The callback will sanitize the username and password inputs. Do a Google search to know how to do it right.
- :heavy_check_mark: On the server, use the username and password to load user data in memory.
- :heavy_check_mark: Finish implementing the *keep-signed-in* functionality where the user will be kept signed in for 2 months if the checkbox in the authentication form is checked.

[ [Top](#tuber-design-document) ]

### [ **Feature** ] Thumb up or thumb down on bookmarks

> **⚠️ Approach changed.** The original design placed votes on `/users/:id/votes`. The implementation was redesigned — votes are now managed on the bookmarks resource instead:
> - `GET /bookmarks/:id/vote` — get current user's vote state + counts
> - `PUT /bookmarks/:id/vote` — set/update current user's vote
> - `DELETE /bookmarks/:id/vote` — remove current user's vote
> - `PUT /users/:userId/vote` — user-level vote endpoint
>
> See `src/routes/bookmarks/` for the implemented endpoints.

- :x: ~~Create an endpoint `/:id/votes` in `src/controller/users.controller.ts`.~~ (approach changed — see note above)
- :x: ~~Create file: `src/endpoint/post.users.votes.ep.ts`.~~ (approach changed)
- :x: ~~Create file: `src/endpoint/put.users.votes.ep.ts`.~~ (approach changed)

[ [Top](#tuber-design-document) ]

### [ **Improvement** ] The sessions collection

- :heavy_check_mark: The user object will be cached in memory for 15 minutes. If it expires from the cache, then it should be retrieved from the session table.
- :clock3: When a user logs out, the session document is destroyed.
- :clock4: Sessions can expire. If they do, the session document should be deleted from the collection. The goal is to keep the session collection as minimal as possible to keep the user document retrieval as fast as possible.
- :clock5: When a session document expires, the value of the `jwt_version` found in the user document in the session table should be used to update the one in the `users` collection.

[ [Top](#tuber-design-document) ]

### [ **Feature** ] Use a cron job to purge expired sessions.

The sessions collection must remain minimal to improve user document access speed.

- :clock6: Delete all expired session documents from the sessions collection periodically using a cron job. It should run once a day at a specific time of your choosing.

[ [Top](#tuber-design-document) ]

### [ **Feature** ] Bookmarks can now be published

  - :clock12: Create a publish checkbox field on all the editing versions of the bookmark form except for the `unknown` platform.

[ [Top](#tuber-design-document) ]

### [ **Feature** ] Implement bookmark listings

Users will be able to group related bookmarks together into something akin to a playlist but without the autoplay feature. These groups will be called *listings*. They will be able to share those listings with others via a unique link. e.g.
```
https://crownlessking.com/listing/:id-of-listing
```
The listing page is similar to the research page except for the functionality of the app bar search field. It is not used to search the database for bookmarks that match the search query. Instead, it is used to filter the bookmarks included in the listing.
In addition, when included in a listing, a bookmark can be formatted using HTML tags.
~~A listing can contain a maximum of 200 bookmarks. If a listing contains more than the maximum, the additional bookmarks will simply be ignored. As in, bookmark number 201 will not be loaded. This makes it possible to further customize the listing such that if a bookmark is unpublished or hidden, then a bookmark that is part of the extra can take its place.~~
`unknown` platform bookmarks are only visible to the user who created them. Even if a listing contains them, they will only be visible to the user who created them. As in, you must be signed in to see them.

- :heavy_check_mark: Create a new page. Name it *listing*.
  ```ts
    const listingPageState = {
      '_id': '',
      '_key': '',
      'content': `$webapp : tubeResearcher : listing`,
      'appBar': {
        'items': [ ],
        'inputBaseProps': {
          'id': 'filter-listing',
          'placeholder': 'Filter ...',
        },
        'searchFieldIconButton': {
          'has': {
            'icon': 'search_outline',
            'onclickHandle': 'tuberCallbacks.appBarFilterBookmarks'
          }
        }
      },
      'layout': 'layout_none_no_appbar',
      'meta': {
        'endpoint': 'listing'
      }
    } as TStatePage
  ```
- :heavy_check_mark: Give the listing page an `id` and a `_key`.
- :heavy_check_mark: Define `listingPageState` remaining properties,
  ```ts
  listingPageState.appBar.searchFieldIcon = {
    'icon': '',
    'iconProps': { 'sx': { 'color': '' } }
  }
  listingPageState.appBar.searchFieldIconButtonProps = {
    'aria-label': 'submit search query'
  }
  ```
- :heavy_check_mark: The app bar text field will contain a chip containing the name of the listing and an **X** icon to delete the chip, clearing out the listing.
  - :heavy_check_mark: The app bar text field will contain a chip with a clickable **X** icon button.
  - :heavy_check_mark: Clicking on the **X** icon button deletes the chip.
- :clock4: The `Default` chip will be applied automatically when signing in to the app.
- :heavy_check_mark: Implement the callback to delete the chip. When a chip is deleted, it will be replaced with the default globe icon which signifies that henceforth, any submitted query will be a global database search.
- :heavy_check_mark: Create the new page dark mode version.
  ```ts
    const $listingPageStateDarkThemeMode = {
      ...listingPageState,
    } as TStatePage
  ```
- :clock8: When creating a listing, it will be possible to give it a title, description, and a slug under which the listing can be found. If the listing is private, the slug will have no effect.
  - :clock12: Create a dialog and a form to enter the listing's title and description.
- :clock9: Define the endpoint that will receive the data to create a new listing.
- :clock10: Define the endpoint that will receive the data to edit an existing listing.
- :clock11: Define the endpoint that will receive the data to insert a new bookmark in a listing.
- :clock12: When the client is compiled, the title and the description of the listing will be included as content text in the HTML file to make it SEO friendly. This makes it possible to get search engine ranking on the page so it can be found using a search engine.
- :clock1: When viewing bookmarks in a listing, users should still be able to edit those bookmarks as usual if they belong to them.

[ [Top](#tuber-design-document) ]

### [ **Improvement** ] Bookmark creation requirement

When the bookmark listing feature is implemented, users must specify a listing before creating a bookmark. Each user will have a default listing that will be loaded and set up automatically when they first sign in. There is also a public listing where all bookmarks that are public will be available.

 - :clock12: It is best to have a default listing named `defaultListing` which will be automatically selected if the user did not specify a listing.
 - :clock1: Users will be able to tell which listing is active with the chip that is currently displayed in the app bar search field.
 - :clock3: The chip of the default listing does not need to be displayed for new bookmarks to be inserted in it. This happens automatically.
 - :clock4: However, if the chip of the default listing is displayed, search queries will only be applied to its content.
 - :clock5: To search the public listing, the users can simply delete the chip and any subsequent search queries will be applied to the content of the public listing.

[ [Top](#tuber-design-document) ]

### [ **Feature** ] Implement advanced search queries

The search queries need to be updated. For example, when searching for bookmarks, the app needs to take into consideration whether the bookmark is published, or it belongs to an `unknown` platform.

- :heavy_check_mark: Improve the search algorithm to take into consideration whether the bookmark is an `unknown` platform. `unknown` platform bookmarks can only be seen by the users who created them.
- :heavy_check_mark: Improve the search algorithm to take into consideration whether the bookmark is published. Only bookmarks with the `is_published` field set to `true` can be selected when searching and viewing bookmarks created by others.

[ [Top](#tuber-design-document) ]

### Security

- :clock12: When a user decides to edit a bookmark, they should only be able to modify the title, the note, and whether it is published or not. This should be the only information the server should save in the database when editing a bookmark.

[ [Top](#tuber-design-document) ]

### [ **Feature** ] Enable bookmark publishing

- :heavy_check_mark: Add a switch to all "edit bookmark" forms that will enable users to publish their bookmarks.

[ [Top](#tuber-design-document) ]

### Miscellaneous

#### [ **Feature** ]

- :heavy_check_mark: Show animated screencast gif in dialog to insert a new video URL to annotate.
- :x: When searching for bookmarks, the search terms should be highlighted on the bookmark title and note.
- :clock2: In the note section of bookmarks, the hashtag should be hyperlinked so that when clicked, it will trigger a new search using the hashtag as a search term and displaying a new list of bookmarks based on the hashtag search.
- :heavy_check_mark: Run a query to set the `is_published` field to true except for the `unknown` platform bookmarks.
- :heavy_check_mark: Add a checkbox to forms to edit bookmarks and make the `is_published` field `true` or `false`.

#### [ **Improvement** ]

- :heavy_check_mark: Disable the integrated player button from showing when the screen is too small.
- :heavy_check_mark: Implement the feature where the spinning down arrow when expanding a note does not show unless the note is long enough.

#### [ **Bug fix** ]

- :heavy_check_mark: Fix the title glitch that occurs when the bookmark title is too long and it has no notes.
- :heavy_check_mark: Set the `is_published` field to `true` of existing bookmarks before the authentication feature is implemented except for `unknown` platform bookmarks. That field should remain undefined or should be set to false.

[ [Top](#tuber-design-document) ]

