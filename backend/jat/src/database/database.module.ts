import { Global, Module } from '@nestjs/common';
import { DbContext } from './db-context.js';

@Global()
@Module({
    providers: [DbContext],
    exports: [DbContext],
})
export class DatabaseModule
{}
