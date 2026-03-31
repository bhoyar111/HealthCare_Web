import { axiosInstance } from "../../../Interceptors/axiosInterceptor";
import ApiUrlConstant from "../../Common/Shared/Utils/UrlConstants";

const Service = {
  allTransactionsList: (data) => {
    return axiosInstance.get(ApiUrlConstant.getAllPaymentHistory(), {
      params: data
    });
  },
  patientSubcriptionHistory: (data) => {
    return axiosInstance.get(ApiUrlConstant.getAllSubscriptionHistory(), {
      params: data
    });
  },
  patientSubcriptionList: (data) => {
    return axiosInstance.get(ApiUrlConstant.getPatientSubscription(), {
      params: data
    });
  },
  patientAllTransaction: (data) => {
    return axiosInstance.get(ApiUrlConstant.patientAllTransaction(), {
      params: data
    });
  }
};

export default Service;
