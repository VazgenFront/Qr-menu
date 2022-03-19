import "./Readmore.css";

const ReadMore = ({ children, width }) => {
  const text = children;
  return (
    <p className="text" style={{ width: width }}>
      {text.slice(0, 60)}...
    </p>
  );
};

export default ReadMore;
