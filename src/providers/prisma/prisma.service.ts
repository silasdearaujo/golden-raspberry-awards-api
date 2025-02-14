import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * O `PrismaService` estende a funcionalidade do `PrismaClient` para gerenciar conexões ao banco de dados.
 *
 * Além disso, implementa os hooks do ciclo de vida de módulos do NestJS (`OnModuleInit` e `OnModuleDestroy`)
 * para abrir e fechar conexões adequadamente.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  /**
   * Método chamado automaticamente pelo NestJS quando o módulo é inicializado.
   * Aqui, estabelecemos a conexão com o banco de dados usando o Prisma.
   *
   * @throws Pode apresentar erros de conexão, caso não seja possível se conectar ao banco de dados.
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Método chamado automaticamente pelo NestJS quando o módulo é destruído.
   * Neste momento, a conexão com o banco de dados é finalizada.
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
