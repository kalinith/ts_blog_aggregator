# Gator

Gator is a small feed aggregation CLI that stores feeds, follows, and posts in a PostgreSQL database.

## Requirements

- Node.js and npm
- A PostgreSQL database

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create the configuration file in your home directory.
   The application reads its config from a file named `.gatorconfig.json` in your home folder.

   On Linux/macOS:
   ```bash
   nano ~/.gatorconfig.json
   ```

   Example contents:
   ```json
   {
     "db_url": "postgresql://username:password@localhost:5432/gator",
     "current_user_name": ""
   }
   ```

   - `db_url` is required and must contain your PostgreSQL connection string.
   - `current_user_name` is optional and is updated automatically after login or registration.

3. Apply the database migrations:
   ```bash
   npm run migrate
   ```

## Usage

Run the CLI with:

```bash
npm run start <command> [arguments]
```

### Authentication commands

- `register <username>`
  Create a new user and log them in.

- `login <username>`
  Switch the active user to an existing username.

- `users`
  List all known users and mark the currently active user.

### Feed commands

- `addfeed <url> <name>`
  Add a new feed and follow it for the currently logged-in user.

- `feeds`
  List all feeds known to the system.

- `follow <feed-url>`
  Follow an existing feed for the currently logged-in user.

- `following`
  List the feeds followed by the currently logged-in user.

- `unfollow <feed-url>`
  Stop following a feed for the currently logged-in user.

### Aggregation and browsing

- `agg <duration>`
  Start the feed aggregation loop. The duration can be written like `1h`, `30m`, `15s`, or `3500ms`.

- `browse [limit]`
  Show the latest posts for the currently logged-in user. If no limit is provided, the default is `2`.

### Maintenance

- `reset`
  Clear the user table.

## Example workflow

```bash
npm install
npm run migrate
npm run start register alice
npm run start addfeed https://example.com/feed.xml "Example Feed"
npm run start browse
npm run start agg 1m
```

If you need to change the database schema later, generate a new migration with:

```bash
npm run generate
```
