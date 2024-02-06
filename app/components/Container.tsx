import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export default function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={`flex flex-col px-1.5 py-1 bg-black bg-opacity-30 gap-1 ${className}`}
    >
      {children}
    </div>
  );
}
