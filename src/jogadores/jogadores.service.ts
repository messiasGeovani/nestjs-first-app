import { Injectable } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {
  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  private async criar(criarJogadorDto): Promise<void> {
    const jogador = new this.jogadorModel(criarJogadorDto);
    await jogador.save();
  }

  private async atualizar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    return await this.jogadorModel
      .findOneAndUpdate(
        { email: criarJogadorDto.email },
        { $set: criarJogadorDto },
      )
      .exec();
  }

  async criarAtualizarJogador(criaJogadorDto: CriarJogadorDto): Promise<void> {
    const { email } = criaJogadorDto;

    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

    if (jogadorEncontrado) {
      await this.atualizar(criaJogadorDto);
    } else {
      await this.criar(criaJogadorDto);
    }
  }

  async listar(): Promise<Jogador[] | []> {
    return await this.jogadorModel.find().exec();
  }

  async deletar(email: string): Promise<void> {
    await this.jogadorModel.remove({ email }).exec();
  }
}
