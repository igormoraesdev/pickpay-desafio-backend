import { Module, Global } from '@nestjs/common';
import { DrizzleProvider } from './drizzle.provider';

@Global()
@Module({
  providers: [...DrizzleProvider],
})
export class DatabaseModule {}
