# Binary Encoding

Currently, all binary messages are encoded as proto3 protocol buffers.

## Requests

For requests, we have a generic encoding that represents GraphQL queries.

The type of the query (query, mutation, or subscription) is encoded via an `ENUM` on the request. Fields that are selected are encoded as an integer using a bitmask. When a field is selected, the bit corresponding to the field number is set to `1`. Note that when setting bits for field selection, we subtract 1 from the field number, as the bitmask is index 0, whereas the field number are index 1. Nested field selections are created via a map on the selection, where the the field number is the key, and the value is a selection.

TODO:
- Variables, arguments.

### Request Encoding Examples

Given a schema like this:
```graphql
type Query {
    message: String! @field(number: 1)
}
```

And a query like this:
```graphql
query { message }
```

We will encode this into the protofbuf as follows:
- Create new `Request`, `r`.
- Create new `Selection`, `s`.
- Set `s.fields` to `1`.
- Set `r.selection` to `s`.

---

Given a schema like this:
```graphql
type User {
    id: Int64! @field(number: 1)
    name: String! @field(number: 2)
}

type Query @reserved(numbers: [2]) {
    message: String! @field(number: 1)
    user: User! @field(number: 3)
}
```

And a query like this:
```graphql
query {
    message
    user {
        id
        name
    }
}
```

We will encode this into the protofbuf as follows:
- Create new `Request`, `r`.
- Create new `Selection`, `s1`.
- Create new `Selection`, `s2`.
- Set `s2.fields` to `3`.
- Set `s1.selections[2]` to `s2`.
- Set `s1.fields` to `5`.
- Set `r.selection` to `s1`.

## Binary Responses

Currently, for binary responses, we will build a protobuf based on the schema, and encode the response with that.

