import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import cors from '@fastify/cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import jwt from '@fastify/jwt';

// routes
import authRoutes from './routes/auth';
// import { registerRoutes } from './routes/register'; 
// import { protectedRoutes } from './routes/protected'; 

dotenv.config();

const server = Fastify({
    logger: true
});

const prisma = new PrismaClient();

server.decorate('prisma', prisma)

// Configurar CORS
server.register(cors, {
    origin: 'http://localhost:5173', // URL do frontend usando Vite
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
});

// Middleware de autenticação
server.decorate("authenticate", async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.unauthorized();
    }
  });

// Registrar o plugin JWT com a chave secreta do .env
server.register(jwt, {
    secret: process.env.JWT_SECRET || 'defaultsecret', // Utilize uma variável de ambiente para segredos
});

// Registrar rotas de autenticação (remova o /auth do prefixo pois já está na rota)
server.register(authRoutes, { prefix: '/api' });

// Adicione uma rota de teste para verificar se o servidor está respondendo
server.get('/api/health', async () => {
    return { status: 'OK' };
});

// server.register(registerRoutes); // Opcional
// server.register(protectedRoutes); // Opcional


// Função para iniciar o servidor
const start = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            server.log.error('MONGODB_URI não está definida');
            process.exit(1);
        }

        await mongoose.connect(mongoUri);
        server.log.info('Conectado ao MongoDB');
        
        await server.prisma.$connect(); // Prisma lida com a conexão
        server.log.info('Conectado ao Prisma');
    
        const port = Number(process.env.PORT) || 8080;

        // Fixed server.listen configuration
        await server.listen({
            port: port,
            host: '0.0.0.0'
        });

        server.log.info(`Servidor rodando na porta ${port}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();