import { axiosInstance } from "../../../../Interceptors/axiosInterceptor";
import ApiUrlConstant from "../../../Common/Shared/Utils/UrlConstants";

const Service = {
  getAllDemographicList: (data) => {
    return axiosInstance.get(ApiUrlConstant.allDemographicList(), {
      params: data,
    });
  },
  addDemographicPatient: (data) => {
    return axiosInstance.post(ApiUrlConstant.addDemographic(), data);
  },
  getDemographicPatinetById: (data) => {
    return axiosInstance.get(ApiUrlConstant.getDemographicById(data));
  },
  updateDemographicPatient: (id, data) => {
    return axiosInstance.put(ApiUrlConstant.updateDemographic(id), data);
  },
  deleteDemographicPatient: (data) => {
    return axiosInstance.delete(ApiUrlConstant.deleteDemographic(data));
  },
};

export default Service;
