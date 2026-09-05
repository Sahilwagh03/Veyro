import * as React from "react";

export interface LogoProps extends React.SVGProps<SVGSVGElement> {
  /** Optional size shortcut for uniform width and height */
  size?: number | string;
  /** Optional theme color shortcut (e.g. "#f02508") */
  color?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size,
  width,
  height,
  color,
  fill,
  stroke,
  className,
  style,
  ...props
}) => {
  const activeColor = color || fill || "currentColor";
  const activeStroke = color || stroke || fill || "currentColor";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 134 119"
      width={size ?? width ?? 134}
      height={size ?? height ?? 119}
      fill="none"
      className={className}
      style={style}
      aria-hidden={props["aria-label"] ? undefined : true}
      role="img"
      {...props}
    >
      <path
        fill={activeColor}
        stroke={activeStroke}
        d="m67 68.218-24 23.5 24 24 23.5-24-23.5-23.5ZM.5 48.718v-47.5l41 41.5v47l-41-41Z"
      />
      <path
        fill={activeColor}
        stroke={activeStroke}
        d="M41.5 117.718v-24.5l-24.5 24.5h24.5ZM133 48.718v-47.5l-41 41.5v47l41-41Z"
      />
      <path
        fill={activeColor}
        stroke={activeStroke}
        d="M92 117.218v-24.5l24.5 24.5H92Z"
      />
    </svg>
  );
};

export const VeyroLogo = Logo;
export default Logo;
