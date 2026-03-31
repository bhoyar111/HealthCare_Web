import { axiosInstance } from "../../../Interceptors/axiosInterceptor";
import ApiUrlConstant from "../../Common/Shared/Utils/UrlConstants";

const Service = {
  getListProviders: (data) => {
    return axiosInstance.get(ApiUrlConstant.providerListService(), {
      params: data,
    });
  },
  addEditProvider: (data) => {
    return axiosInstance.post(ApiUrlConstant.addEditProviderService(), data);
  },
  getByIdProvider: (data) => {
    return axiosInstance.get(ApiUrlConstant.getByIdProviderService(), {
      params: data,
    });
  },
  deleteProvider: (data) => {
    return axiosInstance.put(ApiUrlConstant.deleteProviderService(), data);
  },
  patientInvitation: (data) => {
    return axiosInstance.post(ApiUrlConstant.patientInvitationService(), data);
  },
  getListSpeciality: (data) => {
    return axiosInstance.get(ApiUrlConstant.specialityListService(), {
      params: data,
    });
  },
  getListState: (data) => {
    return axiosInstance.get(ApiUrlConstant.stateListService(), {
      params: data,
    });
  },
  getProviderPatinetsList: (data) => {
  return axiosInstance.get(ApiUrlConstant.providerPatientListService(), {
    params: data,
  });
  },

  // For Video calling apis
  getVideoSession: (data) => {
    return axiosInstance.post(
      ApiUrlConstant.videocallGetSessionService(),
      data
    );
  },
  getUserToken: (data) => {
    return axiosInstance.post(
      ApiUrlConstant.videocallGenerateTokenService(),
      data
    );
  },
  manageVideoCallHistory: (data) => {
    return axiosInstance.post(ApiUrlConstant.videocallHistoryService(), data);
  },
  chatVideoCallHistory: (data) => {
    return axiosInstance.post(
      ApiUrlConstant.videocallChatMessageService(),
      data
    );
  },
  getByCallId: (callId) => {
    return axiosInstance.get(
      ApiUrlConstant.videocallChatByCallIdService(callId)
    );
  },
  videoCallNoteHistory: (data) => {
    return axiosInstance.post(
      ApiUrlConstant.videocallNoteHistoryService(),
      data
    );
  },
  fetchAllChatHistory: (userId) => {
    return axiosInstance.get(ApiUrlConstant.getAllChatHistoryService(userId));
  },
  fetchThreadsList: (data) => {
    return axiosInstance.get(ApiUrlConstant.threadListPerUserService(), {
      params: data,
    });
  },
  sendMessageChat: (data) => {
    return axiosInstance.post(ApiUrlConstant.sendMessageChatService(), data);
  },
  fetchChatHistoryById: (threadId) => {
    return axiosInstance.get(ApiUrlConstant.getAllChatMessageByIdService(threadId));
  },
  // For provider availability
  getProviderSlots: (data) => {
    return axiosInstance.get(ApiUrlConstant.providerSlotListService(), {
      params: data,
    });
  },
  saveProviderAvailability: (data) => {
    return axiosInstance.post(ApiUrlConstant.providerAvailability(), data);
  },
  getProviderMonthlySlots: (data) => {
    return axiosInstance.get(ApiUrlConstant.getProviderMonthlySlot(), {
      params: data,
    });
  },
  saveProviderMonthlyAvailability: (data) => {
    return axiosInstance.post(
      ApiUrlConstant.providerMonthlyAvailability(),
      data
    );
  },
};

export default Service;
