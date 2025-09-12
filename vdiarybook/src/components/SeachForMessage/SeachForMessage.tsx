import UserMessage from "../UserMessage/UserMessage";
import Modal from "../Modal/modal";
import CloseIcon from "@/Icon/closeIcon";
import { useState } from "react";
import { useQuery} from "@tanstack/react-query";
import authApi from "@/services/auth.service";
import { useCreateConversation } from "@/hook/useMessage";
import { useRouter } from "next/navigation";
type Props = {
  onClosePopover: () => void;
};

export default function SerachForMessage({ onClosePopover }: Props) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const { data: users, isLoading } = useQuery({
    queryKey: ["users", search],
    queryFn: () => authApi.getAllUsers(1, 10),
  });

  const { mutate: createConversation } = useCreateConversation();

  const handleSelectUser = (receiverId: string) => {
    createConversation(receiverId, {
      onSuccess: (newConversation) => {
        const conversationId = newConversation?._id
        onClosePopover();
        router.push(`/chat/${conversationId}`);
      },
    });
  };

  return (
    <Modal>
      <div className="bg-white w-1/3 h-2/3  border rounded-xl overflow-hidden">
        <div className="w-full border-b border-slate-300 py-2 relative">
          <p className="text-md font-semibold text-center">New Message</p>
          <button
            className=" absolute top-2 right-2 cursor-pointer text-black"
            onClick={onClosePopover}
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="w-full border-b border-slate-300 py-2 px-3 relative flex items-center">
          <p className="text-base font-semibold mr-3">To:</p>
          <input
            placeholder="Search..."
            className="outline-none text-slate-400 text-sm p-1"
          />
        </div>
        <div className="w-full h-full p-2 overflow-y-scroll">
          {isLoading && (
            <p className="text-center text-sm text-slate-400">Loading...</p>
          )}

          {users?.map((user) => (
            <div
              key={user._id}
              onClick={() => handleSelectUser(user._id)}
              className="cursor-pointer hover:bg-slate-100 p-2 rounded-md"
            >
              <UserMessage
                className="flex items-center justify-between mb-4"
                userName={user.name}
                avatar={user.avatar}
                lastMessage= ""
              />
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
