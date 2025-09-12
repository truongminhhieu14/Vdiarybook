import Image from "next/image";

type Props = {
  content: string;
  avatar?: string
}
export default function MessageSentFromFriend({content, avatar}: Props) {
  return (
    <div className="flex justify-start">
      <Image
        alt="avatar"
        width={40}
        height={40}
        src={ avatar || "/assets/img/user.png"}
        className="w-10 h-10 rounded-full mr-2 object-fill"
      />
      <p className="max-w-lg px-3 py-2 mb-1 bg-slate-100 border rounded-3xl text-black text-sm ">
        {content}
      </p>
    </div>
  );
}
