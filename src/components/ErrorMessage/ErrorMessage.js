import "./ErrorMessage.css";

const ErrorMessage = ({ error, color, background }) => {
  return (
    <div
      className="ErrorMessage"
      style={{
        color,
        background,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <p className="error__message"> {error}</p>
    </div>
  );
};

export default ErrorMessage;
