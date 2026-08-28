export function CoffeeTerrain() {
  return (
    <div className="coffee-terrain" aria-hidden="true">
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        <circle className="coffee-terrain-sun" cx="1275" cy="190" r="230" />
        <g className="coffee-terrain-contours">
          <path pathLength="1" d="M-80 690C168 530 306 564 484 665s353 103 548-36 401-167 654-44" />
          <path pathLength="1" d="M-110 747c249-163 432-147 602-44s355 99 551-29 412-145 675-27" />
          <path pathLength="1" d="M-140 805c292-157 456-122 626-23s361 86 557-24 423-119 708 12" />
          <path pathLength="1" d="M734 352c88-118 228-159 357-113s210 21 337-71 241-78 336-11" />
          <path pathLength="1" d="M777 401c92-104 213-126 326-80s210 38 337-43 222-67 316-5" />
        </g>
        <path className="coffee-terrain-route" d="M88 702C340 570 457 650 646 577s272-305 497-308 262 95 401 16" />
      </svg>
      <span className="coffee-steam coffee-steam-one" />
      <span className="coffee-steam coffee-steam-two" />
      <span className="coffee-steam coffee-steam-three" />
    </div>
  );
}
