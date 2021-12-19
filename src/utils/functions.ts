import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AddressesEnum } from 'src/enums/addresses.enum';
import { UserRoles } from 'src/enums/user-roles.enum';
import { User } from 'src/models/user.model';
import { Address } from '../models/address.model';
export function getAccessToken() {
  return localStorage.getItem('access_token');
}

export function getHeaders(): HttpHeaders {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getAccessToken()}`,
  });
  return headers;
}

export function getAddressString(address: Address): string {
  let result: string = '';
  if (address.country) result += address.country + ', ';

  if (address.district) result += address.district + ', ';

  if (address.city) result += address.city + ', ';

  if (address.area) result += address.area + ', ';

  if (address.street) result += address.street + ', ';

  if (address.building) result += address.building;

  return result;
}

export function isEmployee(user: User): boolean {
  if (user.role == UserRoles.CUSTOMER || user.isSuperAdmin || !user.company_id)
    return false;
  return true;
}

export function handleAddresses(maxAddressToShow: AddressesEnum) {
  let result: {
    isCountryAllowed: boolean;
    isDistrictAllowed: boolean;
    isCityAllowed: boolean;
    isAreaAllowed: boolean;
    isStreetAllowed: boolean;
    isBuildingAllowed: boolean;
  } = {
    isCountryAllowed: true,
    isDistrictAllowed: true,
    isCityAllowed: true,
    isAreaAllowed: true,
    isStreetAllowed: true,
    isBuildingAllowed: true,
  };

  switch (maxAddressToShow) {
    case AddressesEnum.COUNTRY:
      result.isCountryAllowed = true;
      result.isDistrictAllowed = true;
      result.isCityAllowed = true;
      result.isAreaAllowed = true;
      result.isStreetAllowed = true;
      result.isBuildingAllowed = true;
      break;

    case AddressesEnum.DISTRICT:
      result.isCountryAllowed = false;
      result.isDistrictAllowed = true;
      result.isCityAllowed = true;
      result.isAreaAllowed = true;
      result.isStreetAllowed = true;
      result.isBuildingAllowed = true;
      break;

    case AddressesEnum.CITY:
      result.isCountryAllowed = false;
      result.isDistrictAllowed = false;
      result.isCityAllowed = true;
      result.isAreaAllowed = true;
      result.isStreetAllowed = true;
      result.isBuildingAllowed = true;
      break;

    case AddressesEnum.AREA:
      result.isCountryAllowed = false;
      result.isDistrictAllowed = false;
      result.isCityAllowed = false;
      result.isAreaAllowed = true;
      result.isStreetAllowed = true;
      result.isBuildingAllowed = true;
      break;

    case AddressesEnum.STREET:
      result.isCountryAllowed = false;
      result.isDistrictAllowed = false;
      result.isCityAllowed = false;
      result.isAreaAllowed = false;
      result.isStreetAllowed = true;
      result.isBuildingAllowed = true;
      break;

    case AddressesEnum.BUILDING:
      result.isCountryAllowed = false;
      result.isDistrictAllowed = false;
      result.isCityAllowed = false;
      result.isAreaAllowed = false;
      result.isStreetAllowed = false;
      result.isBuildingAllowed = true;
      break;

    default:
      result.isCountryAllowed = false;
      result.isDistrictAllowed = false;
      result.isCityAllowed = false;
      result.isAreaAllowed = false;
      result.isStreetAllowed = false;
      result.isBuildingAllowed = false;
      break;
  }
  return result;
}
