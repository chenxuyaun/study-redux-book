import { fetchProductsFailure, fetchProductsRequest, fetchProductsSuccess } from "./action";




export const fetchProducts = () => {
    return async (dispatch) => {
      dispatch(fetchProductsRequest());
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        dispatch(fetchProductsSuccess(data));
      } catch (error) {
        dispatch(fetchProductsFailure(error.message));
      }
    };
  };