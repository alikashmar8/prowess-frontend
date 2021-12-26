import { Level2Address } from './level2-address.model';
import { Level4Address } from './level4-address.model';

export class Level3Address {
  id: string;
  name: string;
  parent?: Level4Address;
  children?: Level2Address[];
}
