import { Module } from '@nestjs/common';
import { GameplayController } from './gameplay.controller';
import { GameplayService } from './gameplay.service';
import { GameplaySchema } from './gameplay-schema.state';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'GameState', schema: GameplaySchema }]),
  ],
  controllers: [GameplayController],
  providers: [GameplayService],
})
export class GameplayModule {}
