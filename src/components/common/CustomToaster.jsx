"use client";
import toast from "react-hot-toast";

const CustomToast = ({ t, type, title, message }) => {
  const config = {
    success: {
      icon: "bi-check-circle-fill",
      color: "#10b981",
      bgColor: "#ecfdf5",
      title: title || "ជោគជ័យ!",
    },
    error: {
      icon: "bi-exclamation-triangle-fill",
      color: "#f59e0b",
      bgColor: "#fffbeb",
      title: title || "មានបញ្ហាអ្វីមួយ!",
    },
    info: {
      icon: "bi-info-circle-fill",
      color: "#0ea5e9",
      bgColor: "#f0f9ff",
      title: title || "តើអ្នកដឹងទេ?",
    },
  };

  const style = config[type] || config.info;

  return (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } d-flex align-items-center bg-white border-0 shadow-sm rounded-3 p-3`}
      style={{
        minWidth: "350px",
        maxWidth: "450px",
        borderLeft: `4px solid ${style.color}`,
      }}
    >
      <div
        className="rounded-circle d-flex align-items-center justify-content-center me-3"
        style={{
          width: "40px",
          height: "40px",
          backgroundColor: style.color,
          color: "#fff",
        }}
      >
        <i className={`bi ${style.icon} fs-5`}></i>
      </div>
      <div className="flex-grow-1">
        <h6 className="mb-0 fw-bold" style={{ fontSize: "15px", color: "#1f2937" }}>
          {style.title}
        </h6>
        <p className="mb-0 text-muted" style={{ fontSize: "13px" }}>
          {message}
        </p>
      </div>
      <button
        onClick={() => toast.dismiss(t.id)}
        className="btn border-0 p-1 ms-2 text-muted"
        style={{ opacity: 0.5 }}
      >
        <i className="bi bi-x-lg small"></i>
      </button>

      <style jsx>{`
        .animate-enter {
          animation: slideIn 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
        }
        .animate-leave {
          animation: slideOut 0.4s cubic-bezier(0.06, 0.71, 0.55, 1) forwards;
        }
        @keyframes slideIn {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: scale(1); opacity: 1; }
          to { transform: scale(0.95); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export const showToast = {
  success: (message, title) =>
    toast.custom((t) => <CustomToast t={t} type="success" title={title} message={message} />),
  error: (message, title) =>
    toast.custom((t) => <CustomToast t={t} type="error" title={title} message={message} />),
  info: (message, title) =>
    toast.custom((t) => <CustomToast t={t} type="info" title={title} message={message} />),
};
