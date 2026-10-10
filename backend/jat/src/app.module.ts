import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {AppController} from './app.controller.js';
import {envValidationSchema} from './config/env.validation.js';

@Module({
  imports: [
    ConfigModule.forRoot({  
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}