type Props = {
  className?: string;
  userName: string;
  avatar?: string;
  lastMessage?: string;
};
export default function UserMessage({ className, userName, avatar, lastMessage }: Props) {
  return (
    <div className={className}>
      <div className="flex items-center">
        {avatar ? (
          <img src={avatar} alt={userName} className="w-12 h-12 rounded-full object-cover mr-3" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200 mr-3" />
        )}
        <div>
          <p className="font-medium">{userName}</p>
          <p className="text-sm text-gray-500 truncate w-40">{lastMessage}</p>
        </div>
      </div>
    </div>
  );
}