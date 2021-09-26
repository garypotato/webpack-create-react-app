import React from "react";
import Button from "../Button/Button";

const Context = () => {
  import("lodash").then((lodash) => {
    const res = lodash.default.add(3, 4);
    console.log(res);
  });
  return (
    <div>
      <div className="context">good !!!</div>
      <Button />
    </div>
  );
};

export default Context;
