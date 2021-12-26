import { Level1Address } from './level1-address.model';
import { Level3Address } from './level3-address.model';

export class Level2Address {
  id: string;
  name: string;
  parent?: Level3Address;
  children?: Level1Address[];
}
