import { IconAttribute } from "@/types/IconAttribute";

export default function RightArrow({
  width,
  height,
  className = "",
}: IconAttribute) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      className={className}
    >
      <path
        fill="currentColor"
        d="m14 18l-1.4-1.45L16.15 13H4v-2h12.15L12.6 7.45L14 6l6 6z"
      />
    </svg>
  );
}
