const Spinner = ({ size = 40, message = '' }) => (
  <div className="spinner-wrapper">
    <div
      className="spinner"
      style={{ width: size, height: size }}
    />
    {message && <p className="spinner-msg">{message}</p>}
  </div>
);

export default Spinner;
