// src/types.d.ts
import { Request } from 'express';

declare module 'express' {
  export interface Request {
    user?: {
      userId: number;
      username: string;
      role: "Admin" | "User";
    };
  }
}
