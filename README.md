# GraphQL RPC

An RPC framework built on GraphQL, designed for optimized server-to-server interactions.

[See architcture document.](docs/ARCH.md)

## Why?

GraphQL is great, but isn't ideal for server-to-server communication. GraphQL RPC is a framework that aims to make optimized backend services using GraphQL.

- **Supports binary request / response format** for significantly smaller payloads, so requests and responses send much faster.
- **Pluggable transport layer**, so your services can support transports other than HTTP.
- **Provides JSON capability**, so your services don't _need_ to use the binary format. This also allows you to develop and interact with your services with existing tooling.
- **Automatic request clients** using GraphQL Introspection, so you don't need to pre-build clients to get the benefits of binary encoding. As server capabilities change, you don't need to distribute new clients.
- **Smaller response payload than other RPC implementations** by using GraphQL field selection. Only the data you need is sent in the response.
