import { SET_CURRENT_USER } from "../actions/Auth.actions";
import isEmpty from "../../assets/common/is-empty";

export default function (state, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      // console.log("user", action.payload);
      // console.log("userProfile", action.userProfile);
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
        userProfile: action.userProfile,
      };
    default:
      return state;
  }
}
// user => Object {                                    //action.payload
//   "exp": 1660049729,
//   "iat": 1659963329,
//   "isAdmin": false,
//   "userId": "62f0d2885a76d61098556a40",
// }
// userProfile => Object {                             //action.userProfile
//   "email": "thiss@gmail.com",
//   "password": "12345",
// }
