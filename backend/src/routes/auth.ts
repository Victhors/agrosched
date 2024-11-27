// backend/src/routes/auth.ts
import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

interface RegisterBody {
    email: string;
    password: string;
    name: string;
}

interface LoginBody {
    email: string;
    password: string;
}

const authRoutes = async (fastify: FastifyInstance<any,any,any,any,any,any,any,any>) => {
    fastify.post('/register', async (request: FastifyRequest<{ Body: RegisterBody },any,any,any,any,any,any,any,any>, reply: FastifyReply<any,any,any,any,any,any,any,any,any>) => {
        const { email, password, name } = request.body;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return reply.status(400).send('Email já está em uso.');
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criar o novo usuário
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });

        // Gerar o token JWT
        const token = fastify.jwt.sign({ userId: user.id, email: user.email });

        reply.send({ token });
    });

    // Rota de login de usuário
    fastify.post('/login', async (request: FastifyRequest<{ Body: LoginBody },any,any,any,any,any,any,any,any>, reply: FastifyReply<any,any,any,any,any,any,any,any,any>) => {
        const { email, password } = request.body;

        // Encontrar o usuário pelo email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return reply.status(401).send('Email ou senha inválidos.');
        }

        // Verificar a senha
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return reply.status(401).send('Email ou senha inválidos.');
        }

        // Gerar o token JWT
        const token = fastify.jwt.sign({ userId: user.id, email: user.email });

        reply.send({ token });
    });
};

export default authRoutes;