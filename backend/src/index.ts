import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import cors from 'fastify-cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'fastify-jwt';

// Importar rotas
import authRoutes from './routes/auth';
// import { registerRoutes } from './routes/register'; 
// import { protectedRoutes } from './routes/protected'; 

dotenv.config();

const server = Fastify({
    logger: true
});

// Configurar CORS
server.register(cors, {
    origin: 'http://localhost:5173', // URL do frontend usando Vite
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
});

// Registrar o plugin JWT com a chave secreta do .env
server.register(jwt, {
    secret: process.env.JWT_SECRET || 'defaultsecret', // Utilize uma variável de ambiente para segredos
});

// Registrar rotas de autenticação
server.register(authRoutes);
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

        const port = Number(process.env.PORT) || 4000;
        await server.listen(port, '0.0.0.0');
        server.log.info(`Servidor rodando na porta ${port}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();