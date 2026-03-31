import { apiUrl } from "../../../../Config/Environment";

const ApiUrlConstant = {
  /* Auth */
  loginService: () => `${apiUrl}/auth-service/auth/login`,
  forgotPassewordService: () => `${apiUrl}/auth-service/auth/forgot-password`,
  logoutService: () => `${apiUrl}/logout`,
  optSendService: () => `${apiUrl}/auth-service/auth/sent-otp`,
  verifyOtpService: () => `${apiUrl}/auth-service/auth/vertify-otp`,
  resetPasswordService: () => `${apiUrl}/auth-service/auth/reset-password`,
  providerListService: () => `${apiUrl}/auth-service/auth/get-user-list`,
  addEditProviderService: () => `${apiUrl}/auth-service/auth/add-update-user-profile`,
  getByIdProviderService: () => `${apiUrl}/auth-service/auth/get-user`,
  deleteProviderService: () => `${apiUrl}/auth-service/auth/update-profile-status`,
  patientInvitationService: () => `${apiUrl}/auth-service/auth/invite-patient`,
  providerPatientListService: () => `${apiUrl}/appointment-service/appointment/provider-patients-listing`,
  
  /* State/Speciality */
  specialityListService: () => `${apiUrl}/auth-service/auth/get-all-specialities`,
  stateListService: () => `${apiUrl}/auth-service/auth/get-all-state`,
  userContactUsListService: () => `${apiUrl}/auth-service/auth/get-user-contactus`,
  
  /* Login-Logs */
  loginLogsService: () => `${apiUrl}/logs-service/logs/login-logs`,
  
  /* Survey Form */
  addQuestionService: () => `${apiUrl}/questionnaire-service/questionnaire/add-questions`,
  updateQuestionsService: () => `${apiUrl}/questionnaire-service/questionnaire/update-questions`,
  questionListService: () => `${apiUrl}/questionnaire-service/questionnaire/list-questions`,
  updateQuestionStatusService: () => `${apiUrl}/questionnaire-service/questionnaire/delete-activate-deactivate-questions`,
  getQuestionDetailsService: () => `${apiUrl}/questionnaire-service/questionnaire/get-questions-by-id`,
  getSurveyDetailsService: () => `${apiUrl}/questionnaire-service/questionnaire/get-patient-assessment`,
  patientSurveyListService: () => `${apiUrl}/auth-service/auth/get-survey-patient-list`,
  
  /* Video Calling */
  videocallGetSessionService: () => `${apiUrl}/videocalling-service/videocalling/get-session`,
  videocallGenerateTokenService: () => `${apiUrl}/videocalling-service/videocalling/generate-token`,
  videocallHistoryService: () => `${apiUrl}/videocalling-service/videocalling/manage-call-hitory`,
  videocallChatByCallIdService: (callId) => `${apiUrl}/videocalling-service/videocalling/send-message-by/${callId}`,
  videocallNoteHistoryService: () => `${apiUrl}/videocalling-service/videocalling/save-call-notes`,
  getAllChatHistoryService: (userId) => `${apiUrl}/videocalling-service/videocalling/get-conversation-list/${userId}`,
  threadListPerUserService: () => `${apiUrl}/videocalling-service/videocalling/get-thread-list`,
  sendMessageChatService: () => `${apiUrl}/videocalling-service/videocalling/send-message`,
  getAllChatMessageByIdService: (threadId) => `${apiUrl}/videocalling-service/videocalling/all-messages/${threadId}`,
  
  /* Provider-Availability */
  providerSlotListService: () => `${apiUrl}/auth-service/auth/get-provider-slots`,
  providerAvailability: () => `${apiUrl}/auth-service/auth/save-provider-availability`,
  getProviderMonthlySlot: () => `${apiUrl}/auth-service/auth/get-provider-monthly-slots`,
  providerMonthlyAvailability: () => `${apiUrl}/auth-service/auth/provider-monthly-availability`,

  /* Assignment-Control */
  assignExpert: () => `${apiUrl}/appointment-service/appointment/assign-expert`,
  allAssigmentsList: () => `${apiUrl}/appointment-service/appointment/all-assignment-list`,
  detailsById: () => `${apiUrl}/appointment-service/appointment/getId-by-request-details`,

  /* Appointment */
 allAppointmentList: () => `${apiUrl}/appointment-service/appointment/appointment-list-for-admin-provider`,
 appointmentDetails: () => `${apiUrl}/appointment-service/appointment/view-appointment-details`,
 cancelAppointment: () => `${apiUrl}/appointment-service/appointment/cancel-appointment`,
 completedAppointment: () => `${apiUrl}/appointment-service/appointment/completed-appointment`,

 /* Demographic Patient Details */
 allDemographicList: () => `${apiUrl}/appointment-service/appointment/patient-profile-details`,
 addDemographic: () => `${apiUrl}/appointment-service/appointment/patient-profile-add`,
 getDemographicById: (data) => `${apiUrl}/appointment-service/appointment/patient-profile-get-by/${data}`,
 updateDemographic: (id) => `${apiUrl}/appointment-service/appointment/patient-profile-update/${id}`,
 deleteDemographic: (data) => `${apiUrl}/appointment-service/appointment/patient-profile-delete/${data}`,

 /* Diagnosis */
 addDiagnosis: () => `${apiUrl}/appointment-service/appointment/add-diagnosis`,
 updateDiagnosis: () => `${apiUrl}/appointment-service/appointment/update-diagnosis`,
 deleteDiagnosis: () => `${apiUrl}/appointment-service/appointment/delete-diagnosis`,
 listAppointment: () => `${apiUrl}/appointment-service/appointment/list-appointment-diagnosis`,

 /* Feedback */
 listAllfeedback: () => `${apiUrl}/appointment-service/appointment/feedback-list`,

 // Article Management
 categoryListService: () => `${apiUrl}/common-service/common/get-all-category`,
 subCategoryListService: () => `${apiUrl}/common-service/common/get-all-subcategories`,
 addCategoryService: () => `${apiUrl}/common-service/common/add-category`,
 editCategoryService: () => `${apiUrl}/common-service/common/update-category`,
 getByIdCategoryService: (categoryId) => `${apiUrl}/common-service/common/get-category/${categoryId}`,
 deleteCategoryService: (data) => `${apiUrl}/common-service/common/delete-category/${data}`,
 addSubCategoryService: () => `${apiUrl}/common-service/common/add-subcategory`,
 editSubCategoryService: () => `${apiUrl}/common-service/common/update-subcategory`,
 getByIdSubCategoryService: (subcategoryId) => `${apiUrl}/common-service/common/get-subcategory/${subcategoryId}`,
 deleteSubCategoryService: (data) => `${apiUrl}/common-service/common/delete-subcategory/${data}`,

 // Article management end points
 subArticleListService: () => `${apiUrl}/common-service/common/get-all-article`,
 addArticleService: () => `${apiUrl}/common-service/common/add-article`,
 editArticleService: (articleId) => `${apiUrl}/common-service/common/update-article/${articleId}`,
 getByIdArticleService: (articleId) => `${apiUrl}/common-service/common/get-article/${articleId}`,
 deleteArticleService: (data) => `${apiUrl}/common-service/common/delete-article/${data}`,

 // Static Page Management (NEW) 
 staticPageListService: () => `${apiUrl}/common-service/common/static-pages`,
 addStaticPageService: () => `${apiUrl}/common-service/common/static-page`,
 getStaticPageByIdService: (id) => `${apiUrl}/common-service/common/static-page/${id}`,
 getStaticPageBySlugService: (slug) => `${apiUrl}/common-service/common/static-page/slug/${slug}`,
 updateStaticPageService: (id) => `${apiUrl}/common-service/common/static-page/${id}`,
 deleteStaticPageService: (id) => `${apiUrl}/common-service/common/static-page/${id}`,

//Traction Dashboard
userCountDetails: () => `${apiUrl}/auth-service/auth/users-counts-details`,
userAnalyticsCDetails: () => `${apiUrl}/auth-service/auth/users-analytics-details`,
userMonthlyRetentionRate: () => `${apiUrl}/auth-service/auth/users-monthly-retention-rate`,
userConsultBookRate: () => `${apiUrl}/appointment-service/appointment/users-consult-booking-rate`,

//Content Dashboard
providerCountDetails: () => `${apiUrl}/appointment-service/appointment/provider-details-count`,
mostViewArticleCount: () => `${apiUrl}/common-service/common/most-view-article-view`,
mostLikeArticle: () => `${apiUrl}/common-service/common/most-like-article`,
mostDisLikeArticle: () => `${apiUrl}/common-service/common/most-dislike-article`,
mostSavedArticle: () => `${apiUrl}/common-service/common/most-saved-article`,
mostSearchArticle: () => `${apiUrl}/common-service/common/most-search-article`,
zeroSearchArticle: () => `${apiUrl}/common-service/common/most-zero-search-article`,
mostSaveQuestions: () => `${apiUrl}/common-service/common/most-save-articles-ques`,

//Consult Dashboard
userConsultBooking: () => `${apiUrl}/appointment-service/appointment/users-consult-booking`,
adminAppointmentDetails: () => `${apiUrl}/appointment-service/appointment/appointment-details-count-for-admin`,
firstRepeatConsultDetail: () => `${apiUrl}/appointment-service/appointment/first-repeate-consult-count`,

//On Boarding Questions
addOnBoardQuestionService: () => `${apiUrl}/questionnaire-service/questionnaire/add-questions-OnBoarding`,
updateOnBoardQuestionsService: () => `${apiUrl}/questionnaire-service/questionnaire/update-OnBoarding-questions`,
OnBoardquestionListService: () => `${apiUrl}/questionnaire-service/questionnaire/list-OnBoarding-questions`,
updateOnBoardQuestionStatusService: () => `${apiUrl}/questionnaire-service/questionnaire/delete-activate-deactivate-OnBoarding-questions`,
getOnBoardQuestionDetailsService: () => `${apiUrl}/questionnaire-service/questionnaire/get-OnBoarding-questions-by-id`,

/*File-Upload-Get */
uploadFileServcie: () => `${apiUrl}/common-service/common/upload-documents`,
generateFileUrlServcie: () => `${apiUrl}/common-service/common/get-signed-url`,

/* Notification */
listAllNotification: () => `${apiUrl}/common-service/common/get-all-notification`,
markNotificationAsRead: () => `${apiUrl}/common-service/common/mark-notification-read`,
allUnreadNotiCount: () => `${apiUrl}/common-service/common/get-unread-notio-count`,
markAllNotiAsRead: () => `${apiUrl}/common-service/common//mark-all-notification-read`,

/* Subscriptions plans */
addUpdatePlanService: () => `${apiUrl}/subscription-service/subscription/add-update-plan`,
listAllPlansService: () => `${apiUrl}/subscription-service/subscription/all-plan-list`,
getIdByPlanService: () => `${apiUrl}/subscription-service/subscription/get-plan-by-id`,
managePlanService: () => `${apiUrl}/subscription-service/subscription/delete-activate-deactivate-plan`,

/* Payment History */
getAllPaymentHistory: () => `${apiUrl}/subscription-service/subscription/get-all-transaction-list`,

/* Payment-Subscription-History */
  getAllSubscriptionHistory: () => `${apiUrl}/subscription-service/subscription/get-all-user-subscription-list`,
  getPatientSubscription: () => `${apiUrl}/subscription-service/subscription/get-user-subscription-history`,
  patientAllTransaction: () => `${apiUrl}/subscription-service/subscription/patient-transaction-list`,

};

export default ApiUrlConstant;
