import React from "react";

const Heading = ({ title }) => {
  return (
    <section className="  px-2 ">
      <div className="max-w-7xl mx-auto">
        <h1 className="  text-2xl font-bold tracking-normal text-black">
          {title}
        </h1>
      </div>
    </section>
  );
};

export default Heading;
