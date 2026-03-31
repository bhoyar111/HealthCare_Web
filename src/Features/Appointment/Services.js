import { axiosInstance } from "../../Interceptors/axiosInterceptor";
import ApiUrlConstant from "../Common/Shared/Utils/UrlConstants";

const Service = {
  getAllAppointmentList: (data) => {
    return axiosInstance.get(ApiUrlConstant.allAppointmentList(), {
      params: data
    });
  },
  appointmentDetails: (data) => {
    return axiosInstance.get(ApiUrlConstant.appointmentDetails(), {
      params: data
    });
  },
  cancelAppointment: (data) => {
     return axiosInstance.post(ApiUrlConstant.cancelAppointment(),data );
  },
  completedAppointment: (data) => {
     return axiosInstance.post(ApiUrlConstant.completedAppointment(),data );
  },
  addDiagnosisAPI: (data) => {
    return axiosInstance.post(ApiUrlConstant.addDiagnosis(), data);
  },
  updateDiagnosisAPI: (data) => {
    return axiosInstance.put(ApiUrlConstant.updateDiagnosis(), data);
  },
  deleteDiagnosisAPI: (data) => {
    return axiosInstance.post(ApiUrlConstant.deleteDiagnosis(), data );
  },
  listDiagnosisAPI: (data) => {
    return axiosInstance.get(ApiUrlConstant.listAppointment(), {
      params: data
    });
  }
};

export default Service;
