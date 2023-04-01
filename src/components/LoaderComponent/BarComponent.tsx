import React from "react";

function BarComponent({
  animationDuration,
  progress,
}: {
  animationDuration: number;
  progress: number;
}) {
  return (
    <div
      className="navigation-loader"
      style={{

        marginLeft: `${(-1 + progress) * 100}%`,
        transition: `margin-left ${animationDuration}ms linear`,
      }}
    ></div>
  );
}

export default BarComponent;
