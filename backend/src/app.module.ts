import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameplayModule } from './gameplay/gameplay.module';

@Module({
  imports: [MongooseModule.forRoot('INSERT MONGO LINK HERE'), GameplayModule],
})
export class AppModule {}
