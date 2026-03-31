import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa";
import dayjs from "dayjs";
import "./Demographic.css";

import Service from "../Service/Services";
import showToast from "../../../Common/Shared/Utils/ToastNotification";

const emptyFamily = () => ({
  name: "",
  birthYear: "",
  isCaregiver: false,
  isPrimaryContact: false,
});

const emptyMedication = () => ({ name: "", dose: "", adherence: "prescribed" });
const emptyAllergy = () => ({ medication: "", reaction: "" });
const emptyUtilization = () => ({ type: "er", monthYear: "", events: 0 });
const emptySpecialist = () => ({
  specialty: "",
  doctorName: "",
  lastVisitDate: "",
});
const emptyTestResult = () => ({ testType: "", notes: "", fileUrl: "" });

export default function DemographicAddEdit() {
  const { userId, id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    userId:userId,
    preferredName: "",
    faithCulture: "",
    occupation: "",
    familyMembers: [],
    activeConditions: [],
    pastMedicalHistory: "",
    surgicalHistory: "",
    familyHistory: "",
    socialHistory: { tobacco: "", alcohol: "", drugs: "" },
    medications: [],
    allergies: [],
    recentUtilization: [],
    specialists: [],
    testResults: [],
    barriersToCare: [],
    otherBarrier: "",
    chiefConcern: "",
    consultationSummary: "",
    advocatePrimaryCare: false,
    advocateSpecialist: false,
    advocateUrgentCare: false,
    advocateHospitalization: false,
    tobaccoUse: "",
    alcoholUse: "",
    drugUse: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) fetchById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchById = async () => {
    try {
      setLoading(true);
      const res = await Service.getDemographicPatinetById(id);
      if (res?.status === 200) {
        // backend returns object under res.data (your earlier example)
        const data = res.data;
        console.log(data, "daaaa");

        // normalize null values to empty arrays/objects
        const normalized = {
          preferredName: data.preferredName || "",
          faithCulture: data.faithCulture || "",
          occupation: data.occupation || "",
          familyMembers: Array.isArray(data.familyMembers)
            ? data.familyMembers
            : [],
          activeConditions: Array.isArray(data.activeConditions)
            ? data.activeConditions
            : [],
          pastMedicalHistory: data.pastMedicalHistory || "",
          surgicalHistory: data.surgicalHistory || "",
          familyHistory: data.familyHistory || "",

          medications: Array.isArray(data.medications) ? data.medications : [],
          allergies: Array.isArray(data.allergies) ? data.allergies : [],
          recentUtilization: Array.isArray(data.recentUtilization)
            ? data.recentUtilization
            : [],
          specialists: Array.isArray(data.specialists) ? data.specialists : [],
          testResults: Array.isArray(data.testResults)
            ? data.testResults
            : [],
          barriersToCare: Array.isArray(data.barriersToCare)
            ? data.barriersToCare
            : [],
          otherBarrier: data.otherBarrier || "",
          chiefConcern: data.chiefConcern || "",
          consultationSummary: data.consultationSummary || "",
          advocatePrimaryCare: data.advocatePrimaryCare || false,
          advocateSpecialist: data.advocateSpecialist || false,
          advocateUrgentCare: data.advocateUrgentCare || false,
          advocateHospitalization: data.advocateHospitalization || false,
          tobaccoUse: data.tobaccoUse || "",
          alcoholUse: data.alcoholUse || "",
          drugUse: data.drugUse || "",
        };
        console.log(normalized, "normalized");

        setForm(normalized);
      } else {
        showToast("error", res?.message || "Failed to fetch data");
      }
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Generic top-level handler
  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  // ---- arrays helpers ----
  const updateArrayItem = (arrayName, index, field, value) => {
    const arr = Array.isArray(form[arrayName]) ? [...form[arrayName]] : [];
    arr[index] = { ...arr[index], [field]: value };
    setForm((prev) => ({ ...prev, [arrayName]: arr }));
  };

  const addArrayItem = (arrayName, template) => {
    const arr = Array.isArray(form[arrayName]) ? [...form[arrayName]] : [];
    arr.push(typeof template === "function" ? template() : template);
    setForm((prev) => ({ ...prev, [arrayName]: arr }));
  };

  const removeArrayItem = (arrayName, index) => {
    const arr = Array.isArray(form[arrayName]) ? [...form[arrayName]] : [];
    arr.splice(index, 1);
    setForm((prev) => ({ ...prev, [arrayName]: arr }));
  };

  // Active conditions - simple string array
  const updateActiveCondition = (index, value) => {
    const arr = [...form.activeConditions];
    arr[index] = value;
    setForm((prev) => ({ ...prev, activeConditions: arr }));
  };
  const addActiveCondition = () =>
    setForm((prev) => ({
      ...prev,
      activeConditions: [...prev.activeConditions, ""],
    }));
  const removeActiveCondition = (i) => {
    const arr = [...form.activeConditions];
    arr.splice(i, 1);
    setForm((prev) => ({ ...prev, activeConditions: arr }));
  };

  // Barriers - simple string array
  const updateBarrier = (index, value) => {
    const arr = [...form.barriersToCare];
    arr[index] = value;
    setForm((prev) => ({ ...prev, barriersToCare: arr }));
  };
  const addBarrier = () =>
    setForm((prev) => ({
      ...prev,
      barriersToCare: [...prev.barriersToCare, ""],
    }));
  const removeBarrier = (i) => {
    const arr = [...form.barriersToCare];
    arr.splice(i, 1);
    setForm((prev) => ({ ...prev, barriersToCare: arr }));
  };

  // Validation (basic)
  const validate = () => {
    const errs = {};
    // Example minimal validations
    // You can expand as required
    if (!form.preferredName) errs.preferredName = "Preferred name is required";
    // validate mobile-like items if needed
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast("error", "Please fix validation errors");
      return;
    }

    try {
      setLoading(true);
      let res;
      if (id) {
        res = await Service.updateDemographicPatient(id, form);
      } else {
        res = await Service.addDemographicPatient(form);
      }

      if (res?.status === 200) {
        showToast("success", res?.message || (id ? "Updated" : "Created"));
        navigate(`/demographics/${userId}`, { state: { refresh: true } });
      } else {
        showToast("error", res?.message || "Save failed");
      }
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to save demographic");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => navigate(-1);

  return (
    <div className="demographic-form main-form">
      <div className="form-header mb-4">
        <h5>{id ? "Edit Demographic" : "Add Demographic"}</h5>
        <button className="back-button" onClick={goBack}>
          <FaArrowLeft style={{ marginRight: 6 }} /> Back
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Info (two-column) */}
        <div className="df-row">
          <div className="df-col">
            <label className="df-label">Preferred Name</label>
            <input
              className="df-input"
              name="preferredName"
              value={form.preferredName}
              onChange={(e) => handleChange("preferredName", e.target.value)}
            />
            {errors.preferredName && (
              <div className="df-error">{errors.preferredName}</div>
            )}
          </div>

          <div className="df-col">
            <label className="df-label">Faith / Culture</label>
            <input
              className="df-input"
              name="faithCulture"
              value={form.faithCulture}
              onChange={(e) => handleChange("faithCulture", e.target.value)}
            />
          </div>
        </div>

        <div className="df-row">
          <div className="df-col">
            <label className="df-label">Occupation</label>
            <input
              className="df-input"
              name="occupation"
              value={form.occupation}
              onChange={(e) => handleChange("occupation", e.target.value)}
            />
          </div>

          <div className="df-col">
            <label className="df-label">Family History</label>
            <input
              className="df-input"
              name="familyHistory"
              value={form.familyHistory}
              onChange={(e) => handleChange("familyHistory", e.target.value)}
            />
          </div>
        </div>

        {/* Family Members */}
        <div className="df-section">
          <div className="df-section-header">
            <h6>Family Members</h6>
            <button
              type="button"
              className="df-add-btn"
              onClick={() => addArrayItem("familyMembers", emptyFamily)}
            >
              <FaPlus /> Add
            </button>
          </div>

          {form.familyMembers.length === 0 && (
            <div className="df-empty">No family members added</div>
          )}

          {form.familyMembers.map((m, i) => (
            <div key={i} className="df-nested-row">
              <input
                placeholder="Name"
                className="df-input small"
                value={m.name || ""}
                onChange={(e) =>
                  updateArrayItem("familyMembers", i, "name", e.target.value)
                }
              />
              <input
                placeholder="Birth Year"
                className="df-input small"
                value={m.birthYear || ""}
                onChange={(e) =>
                  updateArrayItem(
                    "familyMembers",
                    i,
                    "birthYear",
                    e.target.value
                  )
                }
              />
              <label className="df-checkbox">
                <input
                  type="checkbox"
                  checked={!!m.isCaregiver}
                  onChange={(e) =>
                    updateArrayItem(
                      "familyMembers",
                      i,
                      "isCaregiver",
                      e.target.checked
                    )
                  }
                />
                Caregiver
              </label>

              <label className="df-checkbox">
                <input
                  type="checkbox"
                  checked={!!m.isPrimaryContact}
                  onChange={(e) =>
                    updateArrayItem(
                      "familyMembers",
                      i,
                      "isPrimaryContact",
                      e.target.checked
                    )
                  }
                />
                Primary Contact
              </label>

              <button
                type="button"
                className="df-remove-btn"
                onClick={() => removeArrayItem("familyMembers", i)}
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        {/* Active Conditions */}
        <div className="df-section">
          <div className="df-section-header">
            <h6>Active Conditions</h6>
            <button
              type="button"
              className="df-add-btn"
              onClick={addActiveCondition}
            >
              <FaPlus /> Add
            </button>
          </div>

          {form.activeConditions.map((c, i) => (
            <div key={i} className="df-nested-row">
              <input
                placeholder="Condition"
                className="dff-input"
                value={c}
                onChange={(e) => updateActiveCondition(i, e.target.value)}
              />
              <button
                type="button"
                className="df-remove-btn"
                onClick={() => removeActiveCondition(i)}
              >
                <FaTrash />
              </button>
            </div>
          ))}

          {form.activeConditions.length === 0 && (
            <div className="df-empty">No active conditions</div>
          )}
        </div>

        {/* Medical History */}
        <div className="df-row">
          <div className="df-col">
            <label className="df-label">Past Medical History</label>
            <textarea
              className="df-input"
              rows={3}
              name="pastMedicalHistory"
              value={form.pastMedicalHistory}
              onChange={(e) =>
                handleChange("pastMedicalHistory", e.target.value)
              }
            />
          </div>

          <div className="df-col">
            <label className="df-label">Surgical History</label>
            <textarea
              className="df-input"
              rows={3}
              name="surgicalHistory"
              value={form.surgicalHistory}
              onChange={(e) => handleChange("surgicalHistory", e.target.value)}
            />
          </div>
        </div>

        {/* Medications */}
        <div className="df-section">
          <div className="df-section-header">
            <h6>Medications</h6>
            <button
              type="button"
              className="df-add-btn"
              onClick={() => addArrayItem("medications", emptyMedication)}
            >
              <FaPlus /> Add
            </button>
          </div>

          {form.medications.map((m, i) => (
            <div key={i} className="df-nested-row">
              <input
                placeholder="Name"
                className="df-input small"
                value={m.name || ""}
                onChange={(e) =>
                  updateArrayItem("medications", i, "name", e.target.value)
                }
              />
              <input
                placeholder="Dose"
                className="df-input small"
                value={m.dose || ""}
                onChange={(e) =>
                  updateArrayItem("medications", i, "dose", e.target.value)
                }
              />
              <select
                className="df-input small"
                value={m.adherence || "prescribed"}
                onChange={(e) =>
                  updateArrayItem("medications", i, "adherence", e.target.value)
                }
              >
                <option value="prescribed">Taking as prescribed</option>
                <option value="sometimes">Sometimes</option>
                <option value="not_currently">Not currently</option>
              </select>

              <button
                type="button"
                className="df-remove-btn"
                onClick={() => removeArrayItem("medications", i)}
              >
                <FaTrash />
              </button>
            </div>
          ))}

          {form.medications.length === 0 && (
            <div className="df-empty">No medications</div>
          )}
        </div>

        {/* Allergies */}
        <div className="df-section">
          <div className="df-section-header">
            <h6>Allergies</h6>
            <button
              type="button"
              className="df-add-btn"
              onClick={() => addArrayItem("allergies", emptyAllergy)}
            >
              <FaPlus /> Add
            </button>
          </div>

          {form.allergies.map((a, i) => (
            <div key={i} className="df-nested-row">
              <input
                placeholder="Medication"
                className="df-input small"
                value={a.medication || ""}
                onChange={(e) =>
                  updateArrayItem("allergies", i, "medication", e.target.value)
                }
              />
              <input
                placeholder="Reaction"
                className="df-input small"
                value={a.reaction || ""}
                onChange={(e) =>
                  updateArrayItem("allergies", i, "reaction", e.target.value)
                }
              />

              <button
                type="button"
                className="df-remove-btn"
                onClick={() => removeArrayItem("allergies", i)}
              >
                <FaTrash />
              </button>
            </div>
          ))}

          {form.allergies.length === 0 && (
            <div className="df-empty">No allergies</div>
          )}
        </div>

        {/* Recent Utilization */}
        <div className="df-section">
          <div className="df-section-header">
            <h6>Recent Utilization</h6>
            <button
              type="button"
              className="df-add-btn"
              onClick={() =>
                addArrayItem("recentUtilization", emptyUtilization)
              }
            >
              <FaPlus /> Add
            </button>
          </div>

          {form.recentUtilization.map((u, i) => (
            <div key={i} className="df-nested-row">
              <select
                className="df-input small"
                value={u.type || "er"}
                onChange={(e) =>
                  updateArrayItem(
                    "recentUtilization",
                    i,
                    "type",
                    e.target.value
                  )
                }
              >
                <option value="urgent_care">Urgent Care</option>
                <option value="er">ER</option>
                <option value="hospitalization">Hospitalization</option>
              </select>

              <input
                placeholder="Month-Year (YYYY-MM)"
                className="df-input small"
                value={u.monthYear || ""}
                onChange={(e) =>
                  updateArrayItem(
                    "recentUtilization",
                    i,
                    "monthYear",
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Events"
                type="number"
                className="df-input small"
                value={u.events ?? 0}
                onChange={(e) =>
                  updateArrayItem(
                    "recentUtilization",
                    i,
                    "events",
                    Number(e.target.value)
                  )
                }
              />

              <button
                type="button"
                className="df-remove-btn"
                onClick={() => removeArrayItem("recentUtilization", i)}
              >
                <FaTrash />
              </button>
            </div>
          ))}

          {form.recentUtilization.length === 0 && (
            <div className="df-empty">No utilization recorded</div>
          )}
        </div>

        {/* Specialists */}
        <div className="df-section">
          <div className="df-section-header">
            <h6>Specialists</h6>
            <button
              type="button"
              className="df-add-btn"
              onClick={() => addArrayItem("specialists", emptySpecialist)}
            >
              <FaPlus /> Add
            </button>
          </div>

          {form.specialists.map((s, i) => (
            <div key={i} className="df-nested-row">
              <input
                placeholder="Specialty"
                className="df-input small"
                value={s.specialty || ""}
                onChange={(e) =>
                  updateArrayItem("specialists", i, "specialty", e.target.value)
                }
              />
              <input
                placeholder="Doctor Name"
                className="df-input small"
                value={s.doctorName || ""}
                onChange={(e) =>
                  updateArrayItem(
                    "specialists",
                    i,
                    "doctorName",
                    e.target.value
                  )
                }
              />
              <input
                type="date"
                className="df-input small"
                value={
                  s.lastVisitDate
                    ? dayjs(s.lastVisitDate).format("YYYY-MM-DD")
                    : ""
                }
                onChange={(e) =>
                  updateArrayItem(
                    "specialists",
                    i,
                    "lastVisitDate",
                    e.target.value
                  )
                }
              />

              <button
                type="button"
                className="df-remove-btn"
                onClick={() => removeArrayItem("specialists", i)}
              >
                <FaTrash />
              </button>
            </div>
          ))}

          {form.specialists.length === 0 && (
            <div className="df-empty">No specialists</div>
          )}
        </div>

        {/* Key Test Results */}
        <div className="df-section">
          <div className="df-section-header">
            <h6>Key Test Results</h6>
            <button
              type="button"
              className="df-add-btn"
              onClick={() => addArrayItem("testResults", emptyTestResult)}
            >
              <FaPlus /> Add
            </button>
          </div>

          {form.testResults.map((t, i) => (
            <div key={i} className="df-nested-row">
              <input
                placeholder="Test Type"
                className="df-input small"
                value={t.testType || ""}
                onChange={(e) =>
                  updateArrayItem(
                    "testResults",
                    i,
                    "testType",
                    e.target.value
                  )
                }
              />
              <input
                placeholder="Notes"
                className="df-input small"
                value={t.notes || ""}
                onChange={(e) =>
                  updateArrayItem("testResults", i, "notes", e.target.value)
                }
              />
              {/* <input
                placeholder="File URL"
                className="df-input small"
                value={t.fileUrl || ""}
                onChange={(e) =>
                  updateArrayItem(
                    "testResults",
                    i,
                    "fileUrl",
                    e.target.value
                  )
                }
              /> */}

              <button
                type="button"
                className="df-remove-btn"
                onClick={() => removeArrayItem("testResults", i)}
              >
                <FaTrash />
              </button>
            </div>
          ))}

          {form.testResults.length === 0 && (
            <div className="df-empty">No test results</div>
          )}
        </div>

        {/* Barriers */}
        <div className="df-section">
          <div className="df-section-header">
            <h6>Barriers to Care</h6>
            <button type="button" className="df-add-btn" onClick={addBarrier}>
              <FaPlus /> Add
            </button>
          </div>

          {form.barriersToCare.map((b, i) => (
            <div key={i} className="df-nested-row">
              <input
                placeholder="Barrier"
                className="dff-input barrier-input"
                value={b}
                onChange={(e) => updateBarrier(i, e.target.value)}
              />

              {form.barriersToCare.length > 1 && (
                <button
                  type="button"
                  className="df-remove-btn barrier-delete-btn"
                  onClick={() => removeBarrier(i)}
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}

          {form.barriersToCare.length === 0 && (
            <div className="dff-empty">No barriers</div>
          )}
        </div>

        {/* Social History*/}
        <div className="df-section">
          <h6>Social History</h6>
          <div className="df-row">
            <div className="df-col">
              <label>Tobacco Use</label>
              <input
                className="df-input"
                value={form.tobaccoUse}
                onChange={(e) =>
                  setForm({ ...form, tobaccoUse: e.target.value })
                }
              />
            </div>

            <div className="df-col">
              <label>Alcohol Use</label>
              <input
                className="df-input"
                value={form.alcoholUse}
                onChange={(e) =>
                  setForm({ ...form, alcoholUse: e.target.value })
                }
              />
            </div>
          </div>
          <div className="df-row">
            <div className="df-col">
              <label>Drug Use</label>
              <input
                className="df-input"
                value={form.drugUse}
                onChange={(e) => setForm({ ...form, drugUse: e.target.value })}
              />
            </div>
            <div className="df-col">
              <label className="df-label">Other Barrier Text</label>
              <input
                className="df-input"
                name="otherBarrier"
                value={form.otherBarrier || ""}
                onChange={(e) => handleChange("otherBarrier", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Chief Concern + Consultation Summary */}
        <div className="df-row">
          <div className="df-col">
            <label className="df-label">Chief Concern</label>
            <input
              className="df-input"
              name="chiefConcern"
              value={form.chiefConcern}
              onChange={(e) => handleChange("chiefConcern", e.target.value)}
            />
          </div>

          <div className="df-col">
            <label className="df-label">Consultation Summary</label>
            <textarea
              className="df-input"
              rows={3}
              name="consultationSummary"
              value={form.consultationSummary}
              onChange={(e) =>
                handleChange("consultationSummary", e.target.value)
              }
            />
          </div>
        </div>

        {/* Advocate Support */}
        <div className="df-section">
          <h6>
            <b>Advocate Support</b>
          </h6>
          <div className="df-checkbox-container">
            <label className="df-checkbox">
              <input
                type="checkbox"
                checked={!!form.advocatePrimaryCare}
                onChange={(e) =>
                  handleChange("advocatePrimaryCare", e.target.checked)
                }
              />
              Primary Care Visit
            </label>

            <label className="df-checkbox">
              <input
                type="checkbox"
                checked={!!form.advocateSpecialist}
                onChange={(e) =>
                  handleChange("advocateSpecialist", e.target.checked)
                }
              />
              Specialist Appointment
            </label>

            <label className="df-checkbox">
              <input
                type="checkbox"
                checked={!!form.advocateUrgentCare}
                onChange={(e) =>
                  handleChange("advocateUrgentCare", e.target.checked)
                }
              />
              Urgent Care / ER
            </label>

            <label className="df-checkbox">
              <input
                type="checkbox"
                checked={!!form.advocateHospitalization}
                onChange={(e) =>
                  handleChange("advocateHospitalization", e.target.checked)
                }
              />
              Hospitalization
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="df-actions">
          <button type="button" className="df-cancel" onClick={goBack}>
            Cancel
          </button>
          <button type="submit" className="df-save" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
