import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Service from "../Service/Services";
import "./Demographic.css";

export default function DemographicView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  const goBack = () => navigate(-1);

  useEffect(() => {
    if (id) fetchDetails(id);
  }, [id]);

  const fetchDetails = async (id) => {
    try {
      const res = await Service.getDemographicPatinetById(id);
      if (res?.status === 200) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!data) return <div className="dv-loader">Loading...</div>;

  const user = data.userId || {};

  return (
    <div className="dv-container">
      {/* Header */}
      <div className="dv-header">
        <h2>Patient Demographic Details</h2>
        <button onClick={goBack} className="back-button">
          <FaArrowLeft style={{ marginRight: "5px", fontSize: "16px" }} />
          Back
        </button>
      </div>

      {/* BASIC INFORMATION */}
      <div className="dv-card">
        <h3>Basic Information</h3>
        <div className="dv-grid">
          <p>
            <strong>Name:</strong> {user.firstName} {user.lastName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Mobile:</strong> {user.mobile || "N/A"}
          </p>
          <p>
            <strong>Preferred Name:</strong> {data.preferredName}
          </p>
          <p>
            <strong>Gender:</strong> {user.gender || "N/A"}
          </p>
          <p>
            <strong>Address:</strong> {user.address || "N/A"}
          </p>
          <p>
            <strong>Occupation:</strong> {data.occupation || "N/A"}
          </p>
        </div>
      </div>

      {/* FAMILY MEMBERS */}
      <div className="dv-card">
        <h3>Family Members</h3>
        {data.familyMembers?.length === 0 && <p>No family added</p>}
        {data.familyMembers?.map((m) => (
          <div key={m._id} className="dv-box">
            <p>
              <strong>Name:</strong> {m.name}
            </p>
            <p>
              <strong>Birth Year:</strong> {m.birthYear}
            </p>
            <p>
              <strong>Caregiver:</strong> {m.isCaregiver ? "Yes" : "No"}
            </p>
            <p>
              <strong>Primary Contact:</strong>{" "}
              {m.isPrimaryContact ? "Yes" : "No"}
            </p>
          </div>
        ))}
      </div>

      {/* CONDITIONS */}
      <div className="dv-card">
        <h3>Active Conditions</h3>
        {data.activeConditions?.length ? (
          <ul>
            {data.activeConditions.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        ) : (
          <p>No active conditions</p>
        )}
      </div>

      {/* MEDICAL HISTORY */}
      <div className="dv-card">
        <h3>Medical History</h3>
        <p>
          <strong>Past Medical History:</strong> {data.pastMedicalHistory}
        </p>
        <p>
          <strong>Surgical History:</strong> {data.surgicalHistory}
        </p>
        <p>
          <strong>Family History:</strong> {data.familyHistory}
        </p>
      </div>

      {/* LIFESTYLE */}
      <div className="dv-card">
        <h3>Lifestyle</h3>
        <p>
          <strong>Tobacco Use:</strong> {data.tobaccoUse}
        </p>
        <p>
          <strong>Alcohol Use:</strong> {data.alcoholUse}
        </p>
        <p>
          <strong>Drug Use:</strong> {data.drugUse}
        </p>
      </div>

      {/* MEDICATIONS */}
      <div className="dv-card">
        <h3>Medications</h3>
        {data.medications?.map((m) => (
          <div key={m._id} className="dv-box">
            <p>
              <strong>Name:</strong> {m.name}
            </p>
            <p>
              <strong>Dose:</strong> {m.dose}
            </p>
            <p>
              <strong>Adherence:</strong> {m.adherence}
            </p>
          </div>
        ))}
      </div>

      {/* ALLERGIES */}
      <div className="dv-card">
        <h3>Allergies</h3>
        {data.allergies?.map((a) => (
          <div key={a._id} className="dv-box">
            <p>
              <strong>Medication:</strong> {a.medication}
            </p>
            <p>
              <strong>Reaction:</strong> {a.reaction}
            </p>
          </div>
        ))}
      </div>

      {/* SPECIALISTS */}
      <div className="dv-card">
        <h3>Specialists</h3>
        {data.specialists?.map((s) => (
          <div key={s._id} className="dv-box">
            <p>
              <strong>Specialty:</strong> {s.specialty}
            </p>
            <p>
              <strong>Doctor Name:</strong> {s.doctorName}
            </p>
            <p>
              <strong>Last Visit:</strong> {s.lastVisitDate?.split("T")[0]}
            </p>
          </div>
        ))}
      </div>

      {/* TEST RESULTS */}
      <div className="dv-card">
        <h3>Test Results</h3>
        {data.testResults?.map((t) => (
          <div key={t._id} className="dv-box">
            <p>
              <strong>Type:</strong> {t.testType}
            </p>
            <p>
              <strong>Notes:</strong> {t.notes}
            </p>
            <p>
              <a href={t.fileUrl} target="_blank" rel="noreferrer">
                View File
              </a>
            </p>
          </div>
        ))}
      </div>

      {/* BARRIERS TO CARE */}
      <div className="dv-card">
        <h3>Barriers to Care</h3>
        <ul>
          {data.barriersToCare?.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
        <p>
          <strong>Other Barrier:</strong> {data.otherBarrier}
        </p>
      </div>

      {/* CONSULTATION */}
      <div className="dv-card">
        <h3>Consultation Summary</h3>
        <p>
          <strong>Chief Concern:</strong> {data.chiefConcern}
        </p>
        <p>
          <strong>Summary:</strong> {data.consultationSummary}
        </p>
      </div>

      {/* ICC */}
      <div className="dv-card">
        <h3>ICC Info</h3>
        <p>
          <strong>Last ICC Date:</strong> {data.lastICCDate?.split("T")[0]}
        </p>
        <p>
          <strong>Confidence Level:</strong>{" "}
          {data.lastICCResponses?.confidenceLevel}
        </p>
      </div>

      {/* CSAT */}
      <div className="dv-card">
        <h3>CSAT Info</h3>
        <p>
          <strong>Last CSAT Date:</strong> {data.lastCSATDate?.split("T")[0]}
        </p>
        <p>
          <strong>Satisfaction:</strong> {data.lastCSATResponses?.satisfaction}
        </p>
      </div>
    </div>
  );
}
