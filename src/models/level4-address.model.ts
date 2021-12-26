import { Level3Address } from './level3-address.model';
import { Level5Address } from './level5-address.model';

export class Level4Address {
  id: string;
  name: string;
  parent?: Level5Address;
  children?: Level3Address[];
}
