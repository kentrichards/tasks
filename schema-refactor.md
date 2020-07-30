# Schema Refactor

## Resources

- [One-to-many relationship example using references and populate](https://medium.com/@brandon.lau86/one-to-many-relationships-with-mongodb-and-mongoose-in-node-express-d5c9d23d93c2)
- [Nested calls to populate (for one-to-many-to-many relationships)](https://stackoverflow.com/a/34444982)

## Plan

### Refactor

- Modify Task to use a Mongoose `ref`, so populate can be used on it, instead of regular database lookups
- Change `Task.listId` to `Task.list`, because when populate is used list will contain more than just the parent list's id
- Update List to keep track of the tasks it has by adding a new array field, `List.tasks`, which contains a `ref` to Task (so now both List and Task will link to each other)
- Modify controllers to use populate when possible, instead of doing a separate database lookup
- Add tests to ensure using the populate method on a List returns it's child Task objects
- Add tests to ensure using the populate method on a Task returns it's parent List object

### New feature

- Create the User schema, with fields for username, email, passwordHash, and lists (don't worry too much about validation and require fields for now)
- Create CRUD routes/controllers for the User API
- Add basic tests for User API
- Token validation, etc ...
