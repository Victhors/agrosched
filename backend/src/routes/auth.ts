// src/routes/auth.ts

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcrypt';

// Schemas de validação
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2)
});

// Interfaces para os corpos das requisições
interface LoginBody {
  email: string;
  password: string;
}

interface RegisterBody {
  email: string;
  password: string;
  name: string;
}

export default async function authRoutes(server: FastifyInstance) {
  // Rota de registro
  server.post<{ Body: RegisterBody }>('/register', async (request: FastifyRequest<{ Body: RegisterBody }>, reply: FastifyReply) => {
    try {
      const { email, password, name } = registerSchema.parse(request.body);

      // Verifica se o usuário já existe
      const existingUser = await server.prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return reply.badRequest('Email já está registrado.');
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Cria o usuário
      const user = await server.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name
        }
      });

      // Gera o token JWT
      const token = server.jwt.sign({ userId: user.id, email: user.email });

      return reply.code(201).send({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.badRequest(error.errors);
      }
      server.log.error(error);
      return reply.code(500).send({ error: 'Erro interno do servidor.' });
    }
  });

  // Rota de login
  server.post<{ Body: LoginBody }>('/login', async (request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
    try {
      const { email, password } = loginSchema.parse(request.body);

      // Busca o usuário no banco de dados
      const user = await server.prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return reply.badRequest('Credenciais inválidas.');
      }

      // Verifica a senha
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return reply.badRequest('Credenciais inválidas.');
      }

      // Gera o token JWT
      const token = server.jwt.sign({ userId: user.id, email: user.email });

      return reply.send({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.badRequest(error.errors);
      }
      server.log.error(error);
      return reply.code(500).send({ error: 'Erro interno do servidor.' });
    }
  });

  // Rota protegida de exemplo
  server.get('/me', { onRequest: [server.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await server.prisma.user.findUnique({
        where: { id: request.user.userId }
      });

      if (!user) {
        return reply.code(404).send({ error: 'Usuário não encontrado.' });
      }

      return reply.send({
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      server.log.error(error);
      return reply.code(500).send({ error: 'Erro interno do servidor.' });
    }
  });
}