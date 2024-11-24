import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

// Validation schemas
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2)
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

// Route types
interface User {
    id: string;
    email: string;
    password: string;
    name: string;
}

async function authRoutes(app: FastifyInstance<any, any, any, any, any, any, any, any>) {
    // Register route
    app.post('/register', async (request: FastifyRequest<any, any, any, any, any, any, any, any, any>, reply: FastifyReply<any, any, any, any, any, any, any, any, any>) => {
        try {
            const { email, password, name } = registerSchema.parse(request.body);

            // Check if user exists
            const existingUser = await app.prisma.user.findUnique({
                where: { email }
            });

            if (existingUser) {
                return reply.code(400).send({ error: 'Email already registered' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const user = await app.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name
                }
            });

            return reply.code(201).send({
                success: true,
                user: { id: user.id, email: user.email, name: user.name }
            });

        } catch (error) {
            if (error instanceof z.ZodError) {
                return reply.code(400).send({ error: error.issues });
            }
            return reply.code(500).send({ error: 'Internal server error' });
        }
    });

    // Login route
    app.post('/login', async (request: FastifyRequest<any, any, any, any, any, any, any, any, any>, reply: FastifyReply<any, any, any, any, any, any, any, any, any>) => {
        try {
            const { email, password } = loginSchema.parse(request.body);

            // Find user
            const user = await app.prisma.user.findUnique({
                where: { email }
            });

            if (!user) {
                return reply.code(400).send({ error: 'Invalid credentials' });
            }

            // Verify password
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return reply.code(400).send({ error: 'Invalid credentials' });
            }

            // Generate JWT
            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET as string,
                { expiresIn: '1d' }
            );

            return reply.send({
                token,
                user: { id: user.id, email: user.email, name: user.name }
            });

        } catch (error) {
            if (error instanceof z.ZodError) {
                return reply.code(400).send({ error: error.issues });
            }
            return reply.code(500).send({ error: 'Internal server error' });
        }
    });
}

export default authRoutes;