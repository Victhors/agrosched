import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import jwt from '@fastify/jwt';
import authRoutes from './routes/auth';


dotenv.config();

const server = Fastify({
    logger: true
});

const prisma = new PrismaClient();

server.decorate('prisma', prisma)

// configurar CORS
server.register(cors, {
    origin: 'http://localhost:5173', // URL do frontend usando Vite
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
});

// middleware de autenticação
server.decorate("authenticate", async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.unauthorized();
    }
  });

// registrar o plugin JWT com a chave secreta do .env
server.register(jwt, {
    secret: process.env.JWT_SECRET || 'defaultsecret',
});

server.register(authRoutes);

// Adicione uma rota de teste para verificar se o servidor está respondendo
server.get('/api/', async (request: FastifyRequest<any,any,any,any,any,any,any,any,any>, reply: FastifyReply<any,any,any,any,any,any,any,any,any>) => {
    reply.send({ message: 'API está funcionando corretamente.' });
});

// server.register(registerRoutes); // Opcional (vejo depois)
// server.register(protectedRoutes); // Opcional (vejo depois)


// Iniciar o servidor
const start = async () => {
    try {
        await prisma.$connect();
        await server.listen({ port: parseInt(process.env.PORT || '8080'), host: '0.0.0.0' });
        server.log.info(`Servidor rodando na porta ${process.env.PORT || '8080'}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();