"use client";

interface ThreeDTextProps {
  text: string
  className?: string
}

const ThreeDText: React.FC<ThreeDTextProps> = ({ text, className = '' }) => {
  return (
    <h1
      className={`
          font-extrabold text-foreground
          ${className}
          [text-shadow:_3px_3px_0_rgb(239_68_68),_6px_6px_0_rgb(59_130_246)]
        `}
    >
      {text}
    </h1>
  )
}

export default ThreeDText
