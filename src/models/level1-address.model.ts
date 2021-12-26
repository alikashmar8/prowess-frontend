import { Level2Address } from './level2-address.model';
import { User } from './user.model';

export class Level1Address {
  id: string;
  name: string;
  parent?: Level2Address;
  users?: User[];
}
