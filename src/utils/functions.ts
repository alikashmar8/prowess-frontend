import { Level1Address } from 'src/models/level1-address.model';
import { HttpHeaders } from '@angular/common/http';
import { AddressesLevel } from 'src/enums/addresses.enum';
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

export function getAddressString(level1Address: Level1Address): string {
  let result: string = '';
  result += level1Address.name;
  if (level1Address.parent) {
    const level2 = level1Address.parent;
    result = level2.name + ', ' + result;
    if (level2.parent) {
      const level3 = level2.parent;
      result = level3.name + ', ' + result;
      if (level3.parent) {
        const level4 = level3.parent;
        result = level4.name + ', ' + result;
        if (level4.parent) {
          const level5 = level4.parent;
          result = level5.name + ', ' + result;
          return result;
        } else {
          return result;
        }
      } else {
        return result;
      }
    } else {
      return result;
    }
  } else {
    return result;
  }
}

export function isEmployee(user: User): boolean {
  if (user.role == UserRoles.CUSTOMER || user.isSuperAdmin || !user.company_id)
    return false;
  return true;
}

export function handleAddresses(maxAddressToShow: AddressesLevel) {
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

  // switch (maxAddressToShow) {
  //   case AddressesEnum.COUNTRY:
  //     result.isCountryAllowed = true;
  //     result.isDistrictAllowed = true;
  //     result.isCityAllowed = true;
  //     result.isAreaAllowed = true;
  //     result.isStreetAllowed = true;
  //     result.isBuildingAllowed = true;
  //     break;

  //   case AddressesEnum.DISTRICT:
  //     result.isCountryAllowed = false;
  //     result.isDistrictAllowed = true;
  //     result.isCityAllowed = true;
  //     result.isAreaAllowed = true;
  //     result.isStreetAllowed = true;
  //     result.isBuildingAllowed = true;
  //     break;

  //   case AddressesEnum.CITY:
  //     result.isCountryAllowed = false;
  //     result.isDistrictAllowed = false;
  //     result.isCityAllowed = true;
  //     result.isAreaAllowed = true;
  //     result.isStreetAllowed = true;
  //     result.isBuildingAllowed = true;
  //     break;

  //   case AddressesEnum.AREA:
  //     result.isCountryAllowed = false;
  //     result.isDistrictAllowed = false;
  //     result.isCityAllowed = false;
  //     result.isAreaAllowed = true;
  //     result.isStreetAllowed = true;
  //     result.isBuildingAllowed = true;
  //     break;

  //   case AddressesEnum.STREET:
  //     result.isCountryAllowed = false;
  //     result.isDistrictAllowed = false;
  //     result.isCityAllowed = false;
  //     result.isAreaAllowed = false;
  //     result.isStreetAllowed = true;
  //     result.isBuildingAllowed = true;
  //     break;

  //   case AddressesEnum.BUILDING:
  //     result.isCountryAllowed = false;
  //     result.isDistrictAllowed = false;
  //     result.isCityAllowed = false;
  //     result.isAreaAllowed = false;
  //     result.isStreetAllowed = false;
  //     result.isBuildingAllowed = true;
  //     break;

  //   default:
  //     result.isCountryAllowed = false;
  //     result.isDistrictAllowed = false;
  //     result.isCityAllowed = false;
  //     result.isAreaAllowed = false;
  //     result.isStreetAllowed = false;
  //     result.isBuildingAllowed = false;
  //     break;
  // }
  return result;
}

export function getEnumArray(enumType: any) {
  let result = [];
  for (var enumMember in enumType) {
    result.push(enumMember);
  }
  return result;
}

export function isAddressMaxLevel(
  companyLevel: AddressesLevel,
  addressLevel: AddressesLevel
): boolean {
  switch (addressLevel) {
    case AddressesLevel.LEVEL1:
      if (companyLevel == AddressesLevel.LEVEL1) return true;
      else return false;
    case AddressesLevel.LEVEL2:
      if (
        companyLevel == AddressesLevel.LEVEL3 ||
        companyLevel == AddressesLevel.LEVEL4 ||
        companyLevel == AddressesLevel.LEVEL5
      )
        return false;
      else return true;
    case AddressesLevel.LEVEL3:
      if (
        companyLevel == AddressesLevel.LEVEL4 ||
        companyLevel == AddressesLevel.LEVEL5
      )
        return false;
      else return true;
    case AddressesLevel.LEVEL4:
      if (companyLevel == AddressesLevel.LEVEL5) return false;
      else return true;

    case AddressesLevel.LEVEL5:
      if (companyLevel == AddressesLevel.LEVEL5) return true;
      else return false;
  }
}
