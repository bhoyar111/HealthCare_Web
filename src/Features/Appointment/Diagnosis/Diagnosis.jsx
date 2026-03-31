import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Service from "../Services";
import showToast from "../../Common/Shared/Utils/ToastNotification";
import TruncateText from "../../Common/Shared/Components/TruncateText";
import ConfirmModal from "../../Common/Shared/Components/CustomePopup/ConfirmModal";

const Diagnosis = ({ appointmentId, appointmentStatus }) => {
  const userInfo = useSelector((state) => state?.auth?.user?.userData);
  const [diagnosisRecords, setDiagnosisRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingAction, setPendingAction] = useState({ actionName: "", actionValue: null });

  const [formData, setFormData] = useState({
    subject: "",
    object: "",
    assessment: "",
    plan: ""
  });
  const [editId, setEditId] = useState(null);
  const [viewMode, setViewMode] = useState(false); // 🔹 new state
  useEffect(() => {
    if (appointmentId) {
      fetchDiagnosisData(appointmentId);
    }
  }, [appointmentId]);

  const fetchDiagnosisData = async (id) => {
    let reqData = {
      limit: 10,
      page: 1,
      appointmentId: id
    };
    try {
      const response = await Service.listDiagnosisAPI(reqData);
      if (response?.status === 200 && response?.data) {
        setDiagnosisRecords(response?.data?.result);
      }
    } catch (err) {
      showToast("error", err?.response?.message );
    }
  };

  const handleAddDiagnosis = () => {
    setFormData({ subject: "", object: "", assessment: "", plan: "" });
    setEditId(null);
    setViewMode(false);
    setShowModal(true);
  };

  const handleEditDiagnosis = (record) => {
    setFormData({
      subject: record.subject || "",
      object: record.object || "",
      assessment: record.assessment || "",
      plan: record.plan || ""
    });
    setEditId(record._id);
    setViewMode(false);
    setShowModal(true);
  };

  const handleViewDiagnosis = (record) => {
    setFormData({
      subject: record.subject || "",
      object: record.object || "",
      assessment: record.assessment || "",
      plan: record.plan || ""
    });
    setEditId(null);
    setViewMode(true); // 🔹 enable view-only mode
    setShowModal(true);
  };

  const handleChange = (e) => {
    if (viewMode) return; // 🔹 disable editing in view mode
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (viewMode) return; // just in case

    let reqData = {
      appointmentId,
      ...formData
    };

    try {
      let response;
      if (editId) {
        reqData.id = editId;
        response = await Service.updateDiagnosisAPI(reqData);
      } else {
        response = await Service.addDiagnosisAPI(reqData);
      }

      if (response?.status === 200) {
        showToast("success", response?.message || "Saved successfully");
        setShowModal(false);
        fetchDiagnosisData(appointmentId);
      }
    } catch (err) {
      showToast("error", err?.response?.message || "Something went wrong");
    }
  };
  const handleDeleteDiagnosis = (record) => {
    setPendingAction({ actionName: "delete", actionValue: record });
    setShowDeleteModal(true);
  };
  const handleConfirmAction = async (actionName, record) => {
    if (actionName === "delete" && record?._id) {
      try {
        let reqData={
          diagnosisId : record?._id
        };
        const response = await Service.deleteDiagnosisAPI(reqData);
        if (response?.status === 200) {
          showToast("success", "Diagnosis deleted successfully");
          fetchDiagnosisData(appointmentId); // refresh list
        }
      } catch (error) {
        showToast("error", "Failed to delete diagnosis");
      } finally {
        setShowDeleteModal(false);
        setPendingAction({ actionName: "", actionValue: null });
      }
    }
  };

  return (
    <>
    <div className="card diagnosis-records-card">
      <div className="card-body">
        {userInfo?.role !== "Admin" && appointmentStatus !=='CANCELLED' && (
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="section-title mb-0">Diagnosis Records</h5>
            <button
              className="btn btn-success add-diagnosis-btn"
              onClick={handleAddDiagnosis}
            >
              <i className="fas fa-plus me-2"></i>
              Add Diagnosis
            </button>
          </div>
        )}
        <div className="table-responsive">
          <table className="table diagnosis-table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>SUBJECT</th>
                <th>OBJECTIVE</th>
                <th>ASSESSMENT</th>
                <th>PLAN</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {diagnosisRecords.length > 0 ? (
                diagnosisRecords.map((record, index) => (
                  <tr key={index}>
                    <td className="diagnosis-date">
                      {new Date(record?.createdAt).toLocaleDateString()}
                    </td>
                    <td className="diagnosis-name">
                      <TruncateText text={record?.subject} limit={20} />
                    </td>
                    <td className="diagnosis-prescription">
                      <TruncateText text={record?.object} limit={20} />
                    </td>
                    <td className="diagnosis-notes">
                      <TruncateText text={record?.assessment} limit={20} />
                    </td>
                    <td className="diagnosis-notes">
                      <TruncateText text={record?.plan} limit={20} />
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-outline-primary action-icon-btn"
                          title="View"
                          onClick={() => handleViewDiagnosis(record)}
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        {userInfo?.role !== "Admin" && appointmentStatus !=='CANCELLED' && (
                            <>
                              <button
                                className="btn btn-sm btn-outline-warning action-icon-btn mx-1"
                                title="Edit"
                                onClick={() => handleEditDiagnosis(record)}
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger action-icon-btn"
                                title="Delete"
                                onClick={() => handleDeleteDiagnosis(record)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </>
                          )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No diagnosis records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {viewMode
                    ? "View Diagnosis"
                    : editId
                    ? "Edit Diagnosis"
                    : "Add Diagnosis"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Subjective</label>
                  <textarea
                    className="form-control"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    readOnly={viewMode} // 🔹 disable editing
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Objective</label>
                  <textarea
                    className="form-control"
                    name="object"
                    value={formData.object}
                    onChange={handleChange}
                    readOnly={viewMode}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Assessment</label>
                  <textarea
                    className="form-control"
                    name="assessment"
                    value={formData.assessment}
                    onChange={handleChange}
                    readOnly={viewMode}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Plan</label>
                  <textarea
                    className="form-control"
                    name="plan"
                    value={formData.plan}
                    onChange={handleChange}
                    readOnly={viewMode}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  {viewMode ? "Close" : "Cancel"}
                </button>
                {!viewMode && ( // 🔹 hide submit in view mode
                  <button className="btn btn-primary" onClick={handleSubmit}>
                    {editId ? "Update" : "Submit"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    <ConfirmModal
      show={showDeleteModal}
      message={`Are you sure you want to delete this Diagnosis?`}
      onClose={() => {
        setShowDeleteModal(false);
        setPendingAction({ actionName: "", actionValue: null });
      }}
      onConfirm={() => handleConfirmAction(pendingAction.actionName, pendingAction.actionValue)}
    />
    </>
  );
};

export default Diagnosis;
