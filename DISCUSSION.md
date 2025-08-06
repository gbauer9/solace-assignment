## Future TODO List
Here's a list of features I would've added had I had the time
- Testing framework with unit/integrations tests for both backend and frontend. Focus on testing proper component generation on the frontend and filtering logic on the backend.
- Split specialties column out to separate table w/many-to-many relationship. Allow for querying on specialties.
- Add indexes on search columns in the DB. Given this is a read-heavy table w/probably not many writes, we can afford to heavily index.
- Proper error handling on the backend. Return well-formatted error messages with accompanying HTTP status codes.
- Authentication middleware to make sure users have access to API
- Tweak the frontend so results are displayed a little nicer. Right now specialties make each column very tall. Either truncate them and allow to click to expand or switch to card-based results rather than table. Chose table for simplicity.
- Add more Solace branding and colore palette to frontend
- Fix npm vulnerabilities. Those were giving me trouble so I stopped trying to fix in the name of time but that wouldn't fly in a production app.
- Add pre-commit hooks for automatic linting/formatting/testing

## Thought Process
I wanted to make sure I got the core functionality of a search page in. To me, that means pagination, sorting, and querying on a select number of columns.
The initial repo filtering everything on the frontend is not scaleable at all, so I knew I wanted to move that to the backend. The frontend was messy and had unecessary elements like the "Search term" span. I chose to rewrite pretty much all of it and add a component library to make it look cleaner and improve dev experience. I added a dummy navbar to the layout so there would be consistency across pages. Defining schemas is important to me for automatic data validation so I added zod. In a production app I would make sure to have schemas for both requests and responses for each endpoint. 