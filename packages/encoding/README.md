# Encoding

This handles the binary encoding for GraphQL RPC messages. Currently, all binary messages are encoded as version 3 protocol buffers.

## Goals

- Significantly smaller than JSON request body.
- Well-defined process for encoding / decoding.
- Able to easily implement for other languages.
- Request and Response binary formats to _not_ need to match.
  - The structure of the request and response are sufficiently different
- Encoding must be resilient to Schema changes and mismatches. Documents from old versions of a Schema should usable in a new version of the Schema and vice versa.
- Encodings do not need to be useful on their own. Unlike JSON, we don’t expect to be able to parse the binary without additional information. It’s okay to require the Schema to parse he JSON.

## Requests

For requests, we have a generic encoding that represents GraphQL queries.

The type of the query (query, mutation, or subscription) is encoded via an `ENUM` on the request. Fields that are selected are encoded as an integer using a bitmask. When a field is selected, the bit corresponding to the field number is set to `1`. Note that when setting bits for field selection, we subtract 1 from the field number, as the bitmask is index 0, whereas the field number are index 1. Nested field selections are created via a map on the selection, where the the field number is the key, and the value is a selection.

TODO:
- Variables, arguments.

### Request Encoding Examples

Given a schema like this:
```graphql
type Query {
    message: String! @field(id: 1)
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
    id: Int64! @field(id: 1)
    name: String! @field(id: 2)
}

type Query @reserved(ids: [2]) {
    message: String! @field(id: 1)
    user: User! @field(id: 3)
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

