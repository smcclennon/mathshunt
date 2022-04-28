# Documentation
Documentation for functions in Maths Hunt to help my peers create a maths game.

## Database search
Applab only provides an async database search with a callback to use the information found. This is great for modification, but problematic when you need a value from the database before continuing with code execution.

My database search function provides a way to search the database, using the `username` field as a primary key (instead of the intended primary key of `id`, provided by AppLab. Because of this, you must check that you would not create a primary key before adding to the database, or this function may behave unexpectedly.

### Usage
Check if username 'smcclennon' exists in the database:
- `Db_search('smcclennon');`
> Possible returns:
- `true`: The username exist.
- `false`: The username does not exist.

Get value of a column 'highscore' for user 'smcclennon':
- `Db_search('smcclennon', 'highscore');`
> Possible returns:
- `27`: The column value, '27' is just an example.
- `false`: The username does not exist.
