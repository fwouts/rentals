export function validate_AuthOptional(value: any): boolean {
  if (!(value instanceof Object)) {
    return false;
  }
  if (!validate_AuthOptional_Authorization(value.Authorization)) {
    return false;
  }
  return true;
}

export function validate_AuthOptional_Authorization(value: any): boolean {
  return (
    value === undefined || validate_AuthOptional_Authorization_present(value)
  );
}

export function validate_AuthOptional_Authorization_present(
  value: any,
): boolean {
  return typeof value === "string";
}

export function validate_AuthRequired(value: any): boolean {
  if (!(value instanceof Object)) {
    return false;
  }
  if (!validate_AuthRequired_Authorization(value.Authorization)) {
    return false;
  }
  return true;
}

export function validate_AuthRequired_Authorization(value: any): boolean {
  return typeof value === "string";
}

export function validate_RegisterUserRequest(value: any): boolean {
  if (!(value instanceof Object)) {
    return false;
  }
  if (!validate_RegisterUserRequest_email(value.email)) {
    return false;
  }
  if (!validate_RegisterUserRequest_password(value.password)) {
    return false;
  }
  if (!validate_RegisterUserRequest_name(value.name)) {
    return false;
  }
  if (!validate_RegisterUserRequest_role(value.role)) {
    return false;
  }
  return true;
}

export function validate_RegisterUserRequest_email(value: any): boolean {
  return typeof value === "string";
}

export function validate_RegisterUserRequest_password(value: any): boolean {
  return typeof value === "string";
}

export function validate_RegisterUserRequest_name(value: any): boolean {
  return typeof value === "string";
}

export function validate_RegisterUserRequest_role(value: any): boolean {
  return validate_Role(value);
}

export function validate_RegisterUserResponse(value: any): boolean {
  if (!(value instanceof Object)) {
    return false;
  }
  if (!validate_RegisterUserResponse_status(value.status)) {
    return false;
  }
  if (!validate_RegisterUserResponse_message(value.message)) {
    return false;
  }
  return true;
}

export function validate_RegisterUserResponse_status(value: any): boolean {
  if (validate_RegisterUserResponse_status_0(value)) {
    return true;
  }
  if (validate_RegisterUserResponse_status_1(value)) {
    return true;
  }
  return false;
}

export function validate_RegisterUserResponse_status_0(value: any): boolean {
  return value === "success";
}

export function validate_RegisterUserResponse_status_1(value: any): boolean {
  return value === "error";
}

export function validate_RegisterUserResponse_message(value: any): boolean {
  return typeof value === "string";
}

export function validate_LoginUserRequest(value: any): boolean {
  if (!(value instanceof Object)) {
    return false;
  }
  if (!validate_LoginUserRequest_email(value.email)) {
    return false;
  }
  if (!validate_LoginUserRequest_password(value.password)) {
    return false;
  }
  return true;
}

export function validate_LoginUserRequest_email(value: any): boolean {
  return typeof value === "string";
}

export function validate_LoginUserRequest_password(value: any): boolean {
  return typeof value === "string";
}

export function validate_LoginUserResponse(value: any): boolean {
  if (validate_LoginUserResponse_0(value)) {
    return true;
  }
  if (validate_LoginUserResponse_1(value)) {
    return true;
  }
  return false;
}

export function validate_LoginUserResponse_0(value: any): boolean {
  if (!(value instanceof Object)) {
    return false;
  }
  if (!validate_LoginUserResponse_0_status(value.status)) {
    return false;
  }
  if (!validate_LoginUserResponse_0_message(value.message)) {
    return false;
  }
  return true;
}

export function validate_LoginUserResponse_0_status(value: any): boolean {
  return value === "error";
}

export function validate_LoginUserResponse_0_message(value: any): boolean {
  return typeof value === "string";
}

export function validate_LoginUserResponse_1(value: any): boolean {
  if (!(value instanceof Object)) {
    return false;
  }
  if (!validate_LoginUserResponse_1_status(value.status)) {
    return false;
  }
  if (!validate_LoginUserResponse_1_jwtToken(value.jwtToken)) {
    return false;
  }
  if (!validate_LoginUserResponse_1_userId(value.userId)) {
    return false;
  }
  if (!validate_LoginUserResponse_1_role(value.role)) {
    return false;
  }
  return true;
}

export function validate_LoginUserResponse_1_status(value: any): boolean {
  return value === "success";
}

export function validate_LoginUserResponse_1_jwtToken(value: any): boolean {
  return typeof value === "string";
}

export function validate_LoginUserResponse_1_userId(value: any): boolean {
  return typeof value === "string";
}

export function validate_LoginUserResponse_1_role(value: any): boolean {
  return validate_Role(value);
}

export function validate_UpdateUserRequest(value: any): boolean {
  if (!(value instanceof Object)) {
    return false;
  }
  if (!validate_UpdateUserRequest_email(value.email)) {
    return false;
  }
  if (!validate_UpdateUserRequest_name(value.name)) {
    return false;
  }
  if (!validate_UpdateUserRequest_currentPassword(value.currentPassword)) {
    return false;
  }
  if (!validate_UpdateUserRequest_newPassword(value.newPassword)) {
    return false;
  }
  return true;
}

export function validate_UpdateUserRequest_email(value: any): boolean {
  return value === undefined || validate_UpdateUserRequest_email_present(value);
}

export function validate_UpdateUserRequest_email_present(value: any): boolean {
  return typeof value === "string";
}

export function validate_UpdateUserRequest_name(value: any): boolean {
  return value === undefined || validate_UpdateUserRequest_name_present(value);
}

export function validate_UpdateUserRequest_name_present(value: any): boolean {
  return typeof value === "string";
}

export function validate_UpdateUserRequest_currentPassword(
  value: any,
): boolean {
  return (
    value === undefined ||
    validate_UpdateUserRequest_currentPassword_present(value)
  );
}

export function validate_UpdateUserRequest_currentPassword_present(
  value: any,
): boolean {
  return typeof value === "string";
}

export function validate_UpdateUserRequest_newPassword(value: any): boolean {
  return (
    value === undefined || validate_UpdateUserRequest_newPassword_present(value)
  );
}

export function validate_UpdateUserRequest_newPassword_present(
  value: any,
): boolean {
  return typeof value === "string";
}

export function validate_UpdateUserResponse(value: any): boolean {
  if (!(value instanceof Object)) {
    return false;
  }
  if (!validate_UpdateUserResponse_status(value.status)) {
    return false;
  }
  if (!validate_UpdateUserResponse_message(value.message)) {
    return false;
  }
  return true;
}

export function validate_UpdateUserResponse_status(value: any): boolean {
  if (validate_UpdateUserResponse_status_0(value)) {
    return true;
  }
  if (validate_UpdateUserResponse_status_1(value)) {
    return true;
  }
  return false;
}

export function validate_UpdateUserResponse_status_0(value: any): boolean {
  return value === "success";
}

export function validate_UpdateUserResponse_status_1(value: any): boolean {
  return value === "error";
}

export function validate_UpdateUserResponse_message(value: any): boolean {
  return typeof value === "string";
}

export function validate_DeleteUserRequest(value: any): boolean {
  if (!(value instanceof Object)) {
    return false;
  }
  if (!validate_DeleteUserRequest_password(value.password)) {
    return false;
  }
  return true;
}

export function validate_DeleteUserRequest_password(value: any): boolean {
  return (
    value === undefined || validate_DeleteUserRequest_password_present(value)
  );
}

export function validate_DeleteUserRequest_password_present(
  value: any,
): boolean {
  return typeof value === "string";
}

export function validate_DeleteUserResponse(value: any): boolean {
  if (!(value instanceof Object)) {
    return false;
  }
  if (!validate_DeleteUserResponse_status(value.status)) {
    return false;
  }
  if (!validate_DeleteUserResponse_message(value.message)) {
    return false;
  }
  return true;
}

export function validate_DeleteUserResponse_status(value: any): boolean {
  if (validate_DeleteUserResponse_status_0(value)) {
    return true;
  }
  if (validate_DeleteUserResponse_status_1(value)) {
    return true;
  }
  return false;
}

export function validate_DeleteUserResponse_status_0(value: any): boolean {
  return value === "success";
}

export function validate_DeleteUserResponse_status_1(value: any): boolean {
  return value === "error";
}

export function validate_DeleteUserResponse_message(value: any): boolean {
  return typeof value === "string";
}

export function validate_ListUsersRequest(value: any): boolean {
  if (!(value instanceof Object)) {
    return false;
  }
  if (!validate_ListUsersRequest_filter(value.filter)) {
    return false;
  }
  if (!validate_ListUsersRequest_maxPerPage(value.maxPerPage)) {
    return false;
  }
  if (!validate_ListUsersRequest_page(value.page)) {
    return false;
  }
  return true;
}

export function validate_ListUsersRequest_filter(value: any): boolean {
  return value === undefined || validate_ListUsersRequest_filter_present(value);
}

export function validate_ListUsersRequest_filter_present(value: any): boolean {
  return validate_ListUsersFilter(value);
}

export function validate_ListUsersRequest_maxPerPage(value: any): boolean {
  return (
    value === undefined || validate_ListUsersRequest_maxPerPage_present(value)
  );
}

export function validate_ListUsersRequest_maxPerPage_present(
  value: any,
): boolean {
  return typeof value === "number" && Number.isInteger(value);
}

export function validate_ListUsersRequest_page(value: any): boolean {
  return value === undefined || validate_ListUsersRequest_page_present(value);
}

export function validate_ListUsersRequest_page_present(value: any): boolean {
  return typeof value === "number" && Number.isInteger(value);
}

export function validate_ListUsersFilter(value: any): boolean {
  if (!(value instanceof Object)) {
    return false;
  }
  if (!validate_ListUsersFilter_role(value.role)) {
    return false;
  }
  if (!validate_ListUsersFilter_name(value.name)) {
    return false;
  }
  return true;
}

export function validate_ListUsersFilter_role(value: any): boolean {
  return value === undefined || validate_ListUsersFilter_role_present(value);
}

export function validate_ListUsersFilter_role_present(value: any): boolean {
  return validate_Role(value);
}

export function validate_ListUsersFilter_name(value: any): boolean {
  return value === undefined || validate_ListUsersFilter_name_present(value);
}

export function validate_ListUsersFilter_name_present(value: any): boolean {
  return typeof value === "string";
}

export function validate_ListUsersResponse(value: any): boolean {
  if (!(value instanceof Object)) {
    return false;
  }
  if (!validate_ListUsersResponse_results(value.results)) {
    return false;
  }
  if (!validate_ListUsersResponse_totalResults(value.totalResults)) {
    return false;
  }
  if (!validate_ListUsersResponse_pageCount(value.pageCount)) {
    return false;
  }
  return true;
}

export function validate_ListUsersResponse_results(value: any): boolean {
  if (!(value instanceof Array)) {
    return false;
  }
  for (const item of value) {
    if (!validate_ListUsersResponse_results_item(item)) {
      return false;
    }
  }
  return true;
}

export function validate_ListUsersResponse_results_item(value: any): boolean {
  return validate_UserDetails(value);
}

export function validate_ListUsersResponse_totalResults(value: any): boolean {
  return typeof value === "number" && Number.isInteger(value);
}

export function validate_ListUsersResponse_pageCount(value: any): boolean {
  return typeof value === "number" && Number.isInteger(value);
}

export function validate_UserDetails(value: any): boolean {
  if (!(value instanceof Object)) {
    return false;
  }
  if (!validate_UserDetails_userId(value.userId)) {
    return false;
  }
  if (!validate_UserDetails_email(value.email)) {
    return false;
  }
  if (!validate_UserDetails_name(value.name)) {
    return false;
  }
  if (!validate_UserDetails_role(value.role)) {
    return false;
  }
  return true;
}

export function validate_UserDetails_userId(value: any): boolean {
  return typeof value === "string";
}

export function validate_UserDetails_email(value: any): boolean {
  return typeof value === "string";
}

export function validate_UserDetails_name(value: any): boolean {
  return typeof value === "string";
}

export function validate_UserDetails_role(value: any): boolean {
  return validate_Role(value);
}

export function validate_Role(value: any): boolean {
  if (validate_Role_0(value)) {
    return true;
  }
  if (validate_Role_1(value)) {
    return true;
  }
  if (validate_Role_2(value)) {
    return true;
  }
  return false;
}

export function validate_Role_0(value: any): boolean {
  return value === "client";
}

export function validate_Role_1(value: any): boolean {
  return value === "realtor";
}

export function validate_Role_2(value: any): boolean {
  return value === "admin";
}

export function validate_CreateApartmentRequest(value: any): boolean {
  if (!(value instanceof Object)) {
    return false;
  }
  if (!validate_CreateApartmentRequest_info(value.info)) {
    return false;
  }
  if (!validate_CreateApartmentRequest_realtorId(value.realtorId)) {
    return false;
  }
  return true;
}

export function validate_CreateApartmentRequest_info(value: any): boolean {
  return validate_ApartmentInfo(value);
}

export function validate_CreateApartmentRequest_realtorId(value: any): boolean {
  return (
    value === undefined ||
    validate_CreateApartmentRequest_realtorId_present(value)
  );
}

export function validate_CreateApartmentRequest_realtorId_present(
  value: any,
): boolean {
  return typeof value === "string";
}

export function validate_CreateApartmentResponse(value: any): boolean {
  if (validate_CreateApartmentResponse_0(value)) {
    return true;
  }
  if (validate_CreateApartmentResponse_1(value)) {
    return true;
  }
  return false;
}

export function validate_CreateApartmentResponse_0(value: any): boolean {
  if (!(value instanceof Object)) {
    return false;
  }
  if (!validate_CreateApartmentResponse_0_status(value.status)) {
    return false;
  }
  if (!validate_CreateApartmentResponse_0_message(value.message)) {
    return false;
  }
  return true;
}

export function validate_CreateApartmentResponse_0_status(value: any): boolean {
  return value === "error";
}

export function validate_CreateApartmentResponse_0_message(
  value: any,
): boolean {
  return typeof value === "string";
}

export function validate_CreateApartmentResponse_1(value: any): boolean {
  if (!(value instanceof Object)) {
    return false;
  }
  if (!validate_CreateApartmentResponse_1_status(value.status)) {
    return false;
  }
  if (!validate_CreateApartmentResponse_1_message(value.message)) {
    return false;
  }
  if (!validate_CreateApartmentResponse_1_apartmentId(value.apartmentId)) {
    return false;
  }
  return true;
}

export function validate_CreateApartmentResponse_1_status(value: any): boolean {
  return value === "success";
}

export function validate_CreateApartmentResponse_1_message(
  value: any,
): boolean {
  return typeof value === "string";
}

export function validate_CreateApartmentResponse_1_apartmentId(
  value: any,
): boolean {
  return typeof value === "string";
}

export function validate_UpdateApartmentRequest(value: any): boolean {
  if (!(value instanceof Object)) {
    return false;
  }
  if (!validate_UpdateApartmentRequest_info(value.info)) {
    return false;
  }
  if (!validate_UpdateApartmentRequest_realtorId(value.realtorId)) {
    return false;
  }
  return true;
}

export function validate_UpdateApartmentRequest_info(value: any): boolean {
  return validate_ApartmentInfo(value);
}

export function validate_UpdateApartmentRequest_realtorId(value: any): boolean {
  return (
    value === undefined ||
    validate_UpdateApartmentRequest_realtorId_present(value)
  );
}

export function validate_UpdateApartmentRequest_realtorId_present(
  value: any,
): boolean {
  return typeof value === "string";
}

export function validate_UpdateApartmentResponse(value: any): boolean {
  if (!(value instanceof Object)) {
    return false;
  }
  if (!validate_UpdateApartmentResponse_status(value.status)) {
    return false;
  }
  if (!validate_UpdateApartmentResponse_message(value.message)) {
    return false;
  }
  return true;
}

export function validate_UpdateApartmentResponse_status(value: any): boolean {
  if (validate_UpdateApartmentResponse_status_0(value)) {
    return true;
  }
  if (validate_UpdateApartmentResponse_status_1(value)) {
    return true;
  }
  return false;
}

export function validate_UpdateApartmentResponse_status_0(value: any): boolean {
  return value === "success";
}

export function validate_UpdateApartmentResponse_status_1(value: any): boolean {
  return value === "error";
}

export function validate_UpdateApartmentResponse_message(value: any): boolean {
  return typeof value === "string";
}

export function validate_DeleteApartmentResponse(value: any): boolean {
  if (!(value instanceof Object)) {
    return false;
  }
  if (!validate_DeleteApartmentResponse_status(value.status)) {
    return false;
  }
  if (!validate_DeleteApartmentResponse_message(value.message)) {
    return false;
  }
  return true;
}

export function validate_DeleteApartmentResponse_status(value: any): boolean {
  if (validate_DeleteApartmentResponse_status_0(value)) {
    return true;
  }
  if (validate_DeleteApartmentResponse_status_1(value)) {
    return true;
  }
  return false;
}

export function validate_DeleteApartmentResponse_status_0(value: any): boolean {
  return value === "success";
}

export function validate_DeleteApartmentResponse_status_1(value: any): boolean {
  return value === "error";
}

export function validate_DeleteApartmentResponse_message(value: any): boolean {
  return typeof value === "string";
}

export function validate_ListApartmentsRequest(value: any): boolean {
  if (!(value instanceof Object)) {
    return false;
  }
  if (!validate_ListApartmentsRequest_filter(value.filter)) {
    return false;
  }
  if (!validate_ListApartmentsRequest_maxPerPage(value.maxPerPage)) {
    return false;
  }
  if (!validate_ListApartmentsRequest_page(value.page)) {
    return false;
  }
  return true;
}

export function validate_ListApartmentsRequest_filter(value: any): boolean {
  return (
    value === undefined || validate_ListApartmentsRequest_filter_present(value)
  );
}

export function validate_ListApartmentsRequest_filter_present(
  value: any,
): boolean {
  return validate_ListApartmentsFilter(value);
}

export function validate_ListApartmentsRequest_maxPerPage(value: any): boolean {
  return (
    value === undefined ||
    validate_ListApartmentsRequest_maxPerPage_present(value)
  );
}

export function validate_ListApartmentsRequest_maxPerPage_present(
  value: any,
): boolean {
  return typeof value === "number" && Number.isInteger(value);
}

export function validate_ListApartmentsRequest_page(value: any): boolean {
  return (
    value === undefined || validate_ListApartmentsRequest_page_present(value)
  );
}

export function validate_ListApartmentsRequest_page_present(
  value: any,
): boolean {
  return typeof value === "number" && Number.isInteger(value);
}

export function validate_ListApartmentsFilter(value: any): boolean {
  if (!(value instanceof Object)) {
    return false;
  }
  if (!validate_ListApartmentsFilter_realtorId(value.realtorId)) {
    return false;
  }
  if (!validate_ListApartmentsFilter_rented(value.rented)) {
    return false;
  }
  if (!validate_ListApartmentsFilter_sizeRange(value.sizeRange)) {
    return false;
  }
  if (!validate_ListApartmentsFilter_priceRange(value.priceRange)) {
    return false;
  }
  if (!validate_ListApartmentsFilter_numberOfRooms(value.numberOfRooms)) {
    return false;
  }
  if (!validate_ListApartmentsFilter_viewport(value.viewport)) {
    return false;
  }
  return true;
}

export function validate_ListApartmentsFilter_realtorId(value: any): boolean {
  return (
    value === undefined ||
    validate_ListApartmentsFilter_realtorId_present(value)
  );
}

export function validate_ListApartmentsFilter_realtorId_present(
  value: any,
): boolean {
  return typeof value === "string";
}

export function validate_ListApartmentsFilter_rented(value: any): boolean {
  return (
    value === undefined || validate_ListApartmentsFilter_rented_present(value)
  );
}

export function validate_ListApartmentsFilter_rented_present(
  value: any,
): boolean {
  return typeof value === "boolean";
}

export function validate_ListApartmentsFilter_sizeRange(value: any): boolean {
  return (
    value === undefined ||
    validate_ListApartmentsFilter_sizeRange_present(value)
  );
}

export function validate_ListApartmentsFilter_sizeRange_present(
  value: any,
): boolean {
  if (!(value instanceof Object)) {
    return false;
  }
  if (!validate_ListApartmentsFilter_sizeRange_present_min(value.min)) {
    return false;
  }
  if (!validate_ListApartmentsFilter_sizeRange_present_max(value.max)) {
    return false;
  }
  return true;
}

export function validate_ListApartmentsFilter_sizeRange_present_min(
  value: any,
): boolean {
  return typeof value === "number" && Number.isInteger(value);
}

export function validate_ListApartmentsFilter_sizeRange_present_max(
  value: any,
): boolean {
  return typeof value === "number" && Number.isInteger(value);
}

export function validate_ListApartmentsFilter_priceRange(value: any): boolean {
  return (
    value === undefined ||
    validate_ListApartmentsFilter_priceRange_present(value)
  );
}

export function validate_ListApartmentsFilter_priceRange_present(
  value: any,
): boolean {
  if (!(value instanceof Object)) {
    return false;
  }
  if (!validate_ListApartmentsFilter_priceRange_present_min(value.min)) {
    return false;
  }
  if (!validate_ListApartmentsFilter_priceRange_present_max(value.max)) {
    return false;
  }
  return true;
}

export function validate_ListApartmentsFilter_priceRange_present_min(
  value: any,
): boolean {
  return typeof value === "number" && Number.isInteger(value);
}

export function validate_ListApartmentsFilter_priceRange_present_max(
  value: any,
): boolean {
  return typeof value === "number" && Number.isInteger(value);
}

export function validate_ListApartmentsFilter_numberOfRooms(
  value: any,
): boolean {
  return (
    value === undefined ||
    validate_ListApartmentsFilter_numberOfRooms_present(value)
  );
}

export function validate_ListApartmentsFilter_numberOfRooms_present(
  value: any,
): boolean {
  if (!(value instanceof Object)) {
    return false;
  }
  if (!validate_ListApartmentsFilter_numberOfRooms_present_min(value.min)) {
    return false;
  }
  if (!validate_ListApartmentsFilter_numberOfRooms_present_max(value.max)) {
    return false;
  }
  return true;
}

export function validate_ListApartmentsFilter_numberOfRooms_present_min(
  value: any,
): boolean {
  return typeof value === "number" && Number.isInteger(value);
}

export function validate_ListApartmentsFilter_numberOfRooms_present_max(
  value: any,
): boolean {
  return typeof value === "number" && Number.isInteger(value);
}

export function validate_ListApartmentsFilter_viewport(value: any): boolean {
  return (
    value === undefined || validate_ListApartmentsFilter_viewport_present(value)
  );
}

export function validate_ListApartmentsFilter_viewport_present(
  value: any,
): boolean {
  return validate_Viewport(value);
}

export function validate_ListApartmentsResponse(value: any): boolean {
  if (!(value instanceof Object)) {
    return false;
  }
  if (!validate_ListApartmentsResponse_results(value.results)) {
    return false;
  }
  if (!validate_ListApartmentsResponse_totalResults(value.totalResults)) {
    return false;
  }
  if (!validate_ListApartmentsResponse_pageCount(value.pageCount)) {
    return false;
  }
  return true;
}

export function validate_ListApartmentsResponse_results(value: any): boolean {
  if (!(value instanceof Array)) {
    return false;
  }
  for (const item of value) {
    if (!validate_ListApartmentsResponse_results_item(item)) {
      return false;
    }
  }
  return true;
}

export function validate_ListApartmentsResponse_results_item(
  value: any,
): boolean {
  return validate_ApartmentDetails(value);
}

export function validate_ListApartmentsResponse_totalResults(
  value: any,
): boolean {
  return typeof value === "number" && Number.isInteger(value);
}

export function validate_ListApartmentsResponse_pageCount(value: any): boolean {
  return typeof value === "number" && Number.isInteger(value);
}

export function validate_ApartmentDetails(value: any): boolean {
  if (!(value instanceof Object)) {
    return false;
  }
  if (!validate_ApartmentDetails_apartmentId(value.apartmentId)) {
    return false;
  }
  if (!validate_ApartmentDetails_info(value.info)) {
    return false;
  }
  if (!validate_ApartmentDetails_realtor(value.realtor)) {
    return false;
  }
  if (!validate_ApartmentDetails_dateAdded(value.dateAdded)) {
    return false;
  }
  return true;
}

export function validate_ApartmentDetails_apartmentId(value: any): boolean {
  return typeof value === "string";
}

export function validate_ApartmentDetails_info(value: any): boolean {
  return validate_ApartmentInfo(value);
}

export function validate_ApartmentDetails_realtor(value: any): boolean {
  return validate_Realtor(value);
}

export function validate_ApartmentDetails_dateAdded(value: any): boolean {
  return validate_Date(value);
}

export function validate_ApartmentInfo(value: any): boolean {
  if (!(value instanceof Object)) {
    return false;
  }
  if (!validate_ApartmentInfo_floorArea(value.floorArea)) {
    return false;
  }
  if (!validate_ApartmentInfo_pricePerMonth(value.pricePerMonth)) {
    return false;
  }
  if (!validate_ApartmentInfo_numberOfRooms(value.numberOfRooms)) {
    return false;
  }
  if (!validate_ApartmentInfo_coordinates(value.coordinates)) {
    return false;
  }
  if (!validate_ApartmentInfo_rented(value.rented)) {
    return false;
  }
  return true;
}

export function validate_ApartmentInfo_floorArea(value: any): boolean {
  return typeof value === "number";
}

export function validate_ApartmentInfo_pricePerMonth(value: any): boolean {
  return typeof value === "number" && Number.isInteger(value);
}

export function validate_ApartmentInfo_numberOfRooms(value: any): boolean {
  return typeof value === "number" && Number.isInteger(value);
}

export function validate_ApartmentInfo_coordinates(value: any): boolean {
  return validate_Coordinates(value);
}

export function validate_ApartmentInfo_rented(value: any): boolean {
  return typeof value === "boolean";
}

export function validate_Viewport(value: any): boolean {
  if (!(value instanceof Object)) {
    return false;
  }
  if (!validate_Viewport_southWest(value.southWest)) {
    return false;
  }
  if (!validate_Viewport_northEast(value.northEast)) {
    return false;
  }
  return true;
}

export function validate_Viewport_southWest(value: any): boolean {
  return validate_Coordinates(value);
}

export function validate_Viewport_northEast(value: any): boolean {
  return validate_Coordinates(value);
}

export function validate_Coordinates(value: any): boolean {
  if (!(value instanceof Object)) {
    return false;
  }
  if (!validate_Coordinates_latitude(value.latitude)) {
    return false;
  }
  if (!validate_Coordinates_longitude(value.longitude)) {
    return false;
  }
  return true;
}

export function validate_Coordinates_latitude(value: any): boolean {
  return typeof value === "number";
}

export function validate_Coordinates_longitude(value: any): boolean {
  return typeof value === "number";
}

export function validate_Date(value: any): boolean {
  return typeof value === "number" && Number.isInteger(value);
}

export function validate_Realtor(value: any): boolean {
  if (!(value instanceof Object)) {
    return false;
  }
  if (!validate_Realtor_realtorId(value.realtorId)) {
    return false;
  }
  if (!validate_Realtor_name(value.name)) {
    return false;
  }
  return true;
}

export function validate_Realtor_realtorId(value: any): boolean {
  return typeof value === "string";
}

export function validate_Realtor_name(value: any): boolean {
  return typeof value === "string";
}
