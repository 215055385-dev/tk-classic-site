type CoffeeAtmosphereProps = {
  variant?: "stream" | "crema" | "steam";
};

export function CoffeeAtmosphere({ variant = "stream" }: CoffeeAtmosphereProps) {
  return (
    <div className={`coffee-atmosphere is-${variant}`} aria-hidden="true">
      <svg viewBox="0 0 1200 260" preserveAspectRatio="none">
        <path className="coffee-atmosphere-line" pathLength="1" d="M-40 184 C180 38 330 244 548 124 S914 28 1240 146" />
        <path className="coffee-atmosphere-echo" pathLength="1" d="M-30 210 C182 88 370 262 586 158 S930 70 1230 174" />
      </svg>
      <span className="coffee-bean bean-one" />
      <span className="coffee-bean bean-two" />
      <span className="coffee-bean bean-three" />
      <span className="coffee-crema-ring" />
      <span className="coffee-fog coffee-fog-one" />
      <span className="coffee-fog coffee-fog-two" />
      <span className="coffee-particle-field">
        <i /><i /><i /><i /><i /><i /><i /><i />
      </span>
      <span className="coffee-dimensional-scene">
        <i className="coffee-dimensional-bean bean-depth-one" />
        <i className="coffee-dimensional-bean bean-depth-two" />
        <i className="coffee-dimensional-bean bean-depth-three" />
      </span>
    </div>
  );
}
