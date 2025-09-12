type Props = {
  content: string;
};
export default function MessageSentFromMe({content}: Props) {
  return (
    <div className="flex justify-end">
      <p className="max-w-lg py-2 px-3 mb-1 bg-sky-500 border rounded-3xl text-white text-sm ">
        {content}
      </p>
    </div>
  );
}