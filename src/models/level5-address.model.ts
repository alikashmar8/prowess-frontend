import { Level4Address } from './level4-address.model';

export class Level5Address {
  id: string;
  name: string;
  children?: Level4Address[];
}
