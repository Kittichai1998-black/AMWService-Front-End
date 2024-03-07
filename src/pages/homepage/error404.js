import React from "react";
import Err404 from "../../assets/404/pngegg.png"

const P404 = () => {
  return (
    // <div>
      <div style={{ width: "100%" }}>
        <div
          style={{
            color: "#E0E0E0",
            textAlign: "center",
            // fontWeight: "bold",
            // fontSize: "200px",
            marginTop: "5%"
          }}
        >
          <img src={Err404}/>
        </div>
      </div>
    // </div>
  );
};
export default P404;
