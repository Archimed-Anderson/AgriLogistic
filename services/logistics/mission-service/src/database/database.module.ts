import { Module, Global, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { AgriDB } from '@agrologistic/database';

@Global()
@Module({
  providers: [
    {
      provide: 'AGRI_DB',
      useFactory: () => {
        return AgriDB.create();
      },
    },
  ],
  exports: ['AGRI_DB'],
})
export class DatabaseModule implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly db: any) {} // Inject later if needed

  async onModuleInit() {
    // Initial connection handled by factory or on-demand
  }

  async onModuleDestroy() {
    // Cleanup
  }
}
