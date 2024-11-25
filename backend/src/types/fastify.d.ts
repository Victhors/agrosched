
// import { FastifyJWT } from 'fastify-jwt';
// import 'fastify';

// declare module 'fastify' {
//     interface FastifyInstance {
//         jwt: FastifyJWT;
//     }
// }
// src/types/fastify.d.ts

import { PrismaClient } from '@prisma/client';
import { JWT } from '@fastify/jwt';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
    jwt: JWT;
  }

  interface FastifyRequest {
    user: {
      userId: string;
      email: string;
    };
  }

  interface FastifyReply {
    unauthorized(error?: string): FastifyReply;
    badRequest(error?: string): FastifyReply;
  }
}