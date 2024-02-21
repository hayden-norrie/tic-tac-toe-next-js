import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameplayModule } from './gameplay/gameplay.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://root:root@tic-tac-toe.rzpt74c.mongodb.net/?retryWrites=true&w=majority'),
    GameplayModule,
  ],
})
export class AppModule {}
