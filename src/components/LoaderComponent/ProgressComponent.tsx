import { useNProgress } from "@tanem/react-nprogress";
import React from "react";
import BarComponent from "./BarComponent";
import ContainerComponent from "./ContainerComponent";

function ProgressComponent({ isAnimating }: { isAnimating: boolean }) {
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating,
  });
  return <>
  <ContainerComponent animationDuration={animationDuration} isFinished={isFinished}>
    <BarComponent animationDuration={animationDuration} progress={progress}></BarComponent>
  </ContainerComponent>
  </>;
}

export default ProgressComponent;
