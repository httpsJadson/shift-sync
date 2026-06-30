import { UserRole } from 'src/common/enums/auxi.enums';

export interface ActiveUserData {
  /**
   * O "subject" do token (ID do usuário)
   */
  sub: string;

  /**
   * Email do usuário
   */
  email: string;

  /**
   * Role do usuário no sistema
   */
  role: UserRole;
}
