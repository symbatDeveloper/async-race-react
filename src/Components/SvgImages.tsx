import React, {useEffect} from "react";

type Props = {
  color: string | undefined;
  animationTime: number;
  engineBroke: boolean;
  width: number;
  startEngine: boolean;
};

export default function SvgImage({
  color,
  animationTime,
  engineBroke,
  width,
  startEngine,
}: Props) {
  const refImage = React.createRef<HTMLDivElement>();
  let startAnimo: number = 0;
  let myreq: number;

  function move(time: number) {
    if (!startAnimo) {
      startAnimo = time;
    }
    const progress = (time - startAnimo) / animationTime;
    const translate = progress * (window.innerWidth - 140);
    if (refImage.current !== null) {
      refImage.current.style.transform = `translate(${translate}px) `;
    }
    if (progress < 1) {
      myreq = requestAnimationFrame(move);
    }
  }

  useEffect(() => {
    myreq = requestAnimationFrame(move);
    if (engineBroke) {
      cancelAnimationFrame(myreq);
    }
  }, [animationTime, engineBroke]);

  return (
    <div
      className="car"
      id="car"
      ref={refImage}
      style={{
        fill: color,
        width: `${width}px`,
        transform: animationTime === 0 ? "" : undefined,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fillRule="evenodd"
        clipRule="evenodd"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 125 70"
      >
        <path d="M 75.479 36.045 l -7.987 -1.22 l -2.35 -2.574 c -5.599 -6.132 -13.571 -9.649 -21.874 -9.649 h -6.245 c -1.357 0 -2.696 0.107 -4.016 0.296 c -0.022 0.004 -0.044 0.006 -0.066 0.01 c -7.799 1.133 -14.802 5.468 -19.285 12.106 C 5.706 37.913 0 45.358 0 52.952 c 0 3.254 2.647 5.9 5.9 5.9 h 3.451 c 0.969 4.866 5.269 8.545 10.416 8.545 s 9.447 -3.679 10.416 -8.545 h 30.139 c 0.969 4.866 5.27 8.545 10.416 8.545 s 9.446 -3.679 10.415 -8.545 H 84.1 c 3.254 0 5.9 -2.646 5.9 -5.9 C 90 44.441 83.894 37.331 75.479 36.045 z M 43.269 26.602 c 7.065 0 13.848 2.949 18.676 8.094 H 39.464 l -3.267 -8.068 c 0.275 -0.009 0.55 -0.026 0.826 -0.026 H 43.269 z M 32.08 27.118 l 3.068 7.578 H 18.972 C 22.429 30.813 27.018 28.169 32.08 27.118 z M 19.767 63.397 c -3.652 0 -6.623 -2.971 -6.623 -6.622 c 0 -3.652 2.971 -6.623 6.623 -6.623 s 6.623 2.971 6.623 6.623 C 26.39 60.427 23.419 63.397 19.767 63.397 z M 70.738 63.397 c -3.652 0 -6.623 -2.971 -6.623 -6.622 c 0 -3.652 2.971 -6.623 6.623 -6.623 c 3.651 0 6.622 2.971 6.622 6.623 C 77.36 60.427 74.39 63.397 70.738 63.397 z" />
      </svg>
    </div>
  );
}
