export const fetchProductsRequest = () => {
    return {
      type: 'FETCH_PRODUCTS_REQUEST',
    };
  };

export const fetchProductsSuccess = (data: any) => {
    return {
      type: 'FETCH_PRODUCTS_SUCCESS',
      payload: data
    };
  };
export const fetchProductsFailure = (message: string) => {
    return {
      type: 'FETCH_PRODUCTS_FAILURE',
      payload: message
    };
  };