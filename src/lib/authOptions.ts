// pages/api/auth/[...nextauth].ts
import { login } from '@/app/api/authentication/api';
import { AuthParams } from '@/app/api/authentication/type';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                device_id: { label: 'Device ID', type: 'text' },
                device_name: { label: 'Device Name', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials) => {
                try {
                    if (!credentials) {
                        throw new Error('Missing credentials');
                    }

                    const { email, device_id, device_name, password } = credentials as AuthParams;

                    const response = await login({ email, device_id, device_name, password });

                    console.log('Authorize Response:', response);


                    if (response.status === 200 && response.data) {
                        const { user, token, employee_code, allow_pos, allow_backoffice, selected_entity } = response.data.data;

                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            employeeCode: employee_code,
                            token: token,
                            allow_pos,
                            allow_backoffice,
                            selected_entity
                        };
                    }

                    throw new Error('Invalid credentials');
                } catch (error) {
                    console.error('Authorize Error:', error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.token = user.token;
                token.employeeCode = user.employeeCode;
                token.allow_pos = user.allow_pos;
                token.allow_backoffice = user.allow_backoffice;
                token.selected_entity = user.selected_entity;
            }

            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    id: token.id,
                    name: token.name,
                    email: token.email,
                    employeeCode: token.employeeCode,
                    allow_pos: token.allow_pos,
                    allow_backoffice: token.allow_backoffice,
                    selected_entity: token.selected_entity
                };
                session.token = token.token;
            } else {
                session.user = null as any;
                session.token = null;
            }

            return session;
        },
    },
    cookies: {
        sessionToken: {
            name: 'next-auth.session-token',
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
            },
        },
    },
    events: {
        async signOut() {
            console.log('User signed out, clearing session:');
        },
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    },
};

