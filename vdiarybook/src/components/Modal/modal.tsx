type Props = {
  children: React.ReactNode;
};

export default function Modal({ children }: Props) {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen py-8 bg-black bg-opacity-55 flex justify-center items-center z-30">
      {children}
    </div>
  );
} 