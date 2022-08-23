import { ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART } from "../constants";

const cartItems = (state = [], action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const duplicateState = [...state, action.payload];
      const uniqueState = [
        ...duplicateState
          .reduce((map, obj) => map.set(obj.audiobook.id, obj), new Map())
          .values(),
      ];
      // console.log("duplicateState??==>", uniqueState);
      return uniqueState;

    case REMOVE_FROM_CART:
      return state.filter((cartItem) => {
        cartItem.audiobook._id !== action.payload.audiobook._id;
      });

    case CLEAR_CART:
      return (state = []);
  }
  return state;
};

export default cartItems;

//current===>action.payload
