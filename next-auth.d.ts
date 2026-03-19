import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: any,
            employeeCode: any,
            allow_pos: any,
            allow_backoffice: any,
            selected_entity: any,
        } & DefaultSession["user"];
        token: any,
    }

    interface User {
        id: any,
        employeeCode: any,
        token: any,
        allow_pos: any,
        allow_backoffice: any,
        selected_entity: any
    }
}
