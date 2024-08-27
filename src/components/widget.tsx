import Connect from "./features/connect";

const pages = {
  connect: <Connect />,
};

const Widget = () => {
  return (
    <div className="widget">
      <Connect />
    </div>
  );
};

export default Widget;
