import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

// The tables available inside a transaction (same shape as DbContext's table sets).
export interface DbTransaction
{
    users: PrismaClient['user'];
    applications: PrismaClient['application'];
}

// Like EF Core's DbContext: one injectable entry point to the database,
// with one property per table (like DbSet<T>) and a unit-of-work transaction.
// The raw Prisma client stays private, so repositories only see the table sets.
@Injectable()
export class DbContext implements DbTransaction, OnModuleInit, OnModuleDestroy
{
    private readonly client: PrismaClient;

    readonly users: PrismaClient['user'];
    readonly applications: PrismaClient['application'];

    constructor(config: ConfigService)
    {
        this.client = new PrismaClient({
            adapter: new PrismaPg({ connectionString: config.getOrThrow<string>('DATABASE_URL') }),
        });
        this.users = this.client.user;
        this.applications = this.client.application;
    }

    // Runs `work` in a single database transaction: all changes commit together or none do.
    //   await db.transaction(async (tx) => { await tx.users.create(...); await tx.applications.create(...); });
    transaction<T>(work: (tx: DbTransaction) => Promise<T>): Promise<T>
    {
        return this.client.$transaction((tx) => work({ users: tx.user, applications: tx.application }));
    }

    async onModuleInit(): Promise<void>
    {
        await this.client.$connect();
    }

    async onModuleDestroy(): Promise<void>
    {
        await this.client.$disconnect();
    }
}
