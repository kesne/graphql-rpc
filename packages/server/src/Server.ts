import fastify from 'fastify';
import { LoggerOptions } from 'pino';
import { Http2ServerRequest, Http2ServerResponse, Http2Server } from 'http2';
import { RequestEncoder } from '@graphql-rpc/encoding';
import { renderPlaygroundPage } from 'graphql-playground-html';
import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema, IResolvers } from 'graphql-tools';

export interface BaseServerOptions {
    port?: number;
    path?: string;
    logger?: boolean | LoggerOptions;
    playground?: boolean;
}

interface ServerOptionsWithResolvers extends BaseServerOptions {
    typeDefs: string;
    resolvers: IResolvers | IResolvers[];
}

interface ServerOptionsWithSchema extends BaseServerOptions {
    schema: GraphQLSchema;
}

type ServerOptions = ServerOptionsWithSchema | ServerOptionsWithResolvers;

const defaultOptions = {
    port: 8080,
    path: '/graphql',
    logger: true,
    playground: process.env.NODE_ENV !== 'production'
};

export default class Server {
    readonly options: Required<ServerOptions>;
    readonly schema: GraphQLSchema;
    readonly server: fastify.FastifyInstance<Http2Server, Http2ServerRequest, Http2ServerResponse>;

    constructor(options: ServerOptions) {
        this.options = {
            ...defaultOptions,
            ...options
        };

        this.schema =
            'schema' in this.options
                ? this.options.schema
                : makeExecutableSchema({
                      typeDefs: this.options.typeDefs,
                      resolvers: this.options.resolvers
                  });

        this.server = fastify({
            http2: true,
            logger: true
        });

        const requestEncoder = new RequestEncoder(this.schema);

        this.server.addContentTypeParser(
            'application/graphql-rpc',
            { parseAs: 'buffer' },
            async (req: Http2ServerRequest, body: Buffer) => {
                requestEncoder.decode(body);
            }
        );

        if (this.options.playground) {
            this.server.get(this.options.path, (request, reply) => {
                reply.type('text/html').send(renderPlaygroundPage({}));
            });
        }

        this.server.post(this.options.path, (request, reply) => {
            reply.code(200).send({ hello: 'world' });
        });

        this.server.listen(this.options.port);
    }
}
