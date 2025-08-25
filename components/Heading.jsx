import React from "react";

const Heading = ({ title }) => {
  return (
    <section className="bg-white shadow  px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="  text-2xl font-bold tracking-tight text-black">
          {title}
        </h1>
      </div>
    </section>
  );
};

export default Heading;
