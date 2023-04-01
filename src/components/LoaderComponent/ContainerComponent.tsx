import React from "react";

function ContainerComponent({
  animationDuration,
  children,
  isFinished,
}: {
  animationDuration: number;
  children: any;
  isFinished: boolean;
}) {
  return (
    <div
      className="pointer-events-none"
      style={{
        opacity: isFinished ? 0 : 1,
        transition: `opacity ${animationDuration}ms linear`,
      }}
    >
      {children}
    </div>
  );
}

export default ContainerComponent;
