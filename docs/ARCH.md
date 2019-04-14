# Architecture

Under the hood, we boot a regular GraphQL Server. To support binary encoding, we add a custom request parser that can parse a binary request into a GraphQL request, and also a custom serializer to write the response into a binary format.

## Transports

TODO:
- Support custom transports.

## Schema Prelude

The schema prelude is a piece of the GraphQL schema that is automatically included as part of the GraphQL schema. It includes the custom scalar types used in GraphQL RPC, as wells as the custom `field` directive.

## Formats

We will use the `Content-Type` to determine if the incoming request is a binary-encoded buffer, or a JSON-encoded request. Requests with `Content-Type` set to `application/x-graphql-rpc` will be processed as a binary request.

The `Accept` header will be used to determine how to format the response. If the header is set to `application/x-graphql-rpc`, the binary format will be used. Otherwise, it will format the response as JSON.

## Smart Clients

TODO:
- Capability Discovery.
- https://github.com/graphql/graphql-spec/issues/300

## Binary Requests

Currently, binary requests are encoded as protobufs.

The type of the query (query, mutation, subscription) is encoded via an `ENUM`. Fields that are selected are encoded as a number using a bitmask. When a field is selected, the bit corresponding to the field number is set to `1`. Note that when setting bits for field selection, we subtract 1 from the field number, as the bitmask is index 0, whereas the field number are index 1. Nested field selections are created via a map on the selection, where the the field number is the key, and the value is a selection.

TODO:
- Variables.

### Request Encoding Examples

Given a schema like this:
```graphql
type Query {
    @field(number: 1)
    message: String!
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
