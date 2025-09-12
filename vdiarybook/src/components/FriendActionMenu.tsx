import { Menu } from "@headlessui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  FaRegCommentDots,
  FaShareAlt,
  FaUserMinus,
  FaCopy,
  FaFolderPlus,
  FaPen,
  FaLink,
  FaUserFriends,
  FaPaperPlane,
  FaExchangeAlt,
  FaUsers,
  FaUserCheck,
  FaUserPlus,
} from "react-icons/fa";
import { IFriend } from "@/types/friend.type";

interface FriendActionMenuProps {
  friend: IFriend;
  onUnFriend?: (friendId: string) => void;
  onAddFriend?: (friendId: string) => void;
  onRemoveSuggestion?: (friendId: string) => void;
  onAccept?: (id: string) => void;
  onDenied?: (id: string) => void;
  type?: "suggestion" | "friend" | "request" | "following";
}

export default function FriendActionMenu({
  friend,
  onUnFriend,
  onAddFriend,
  onRemoveSuggestion,
  onAccept,
  onDenied,
  type,
}: FriendActionMenuProps) {
  return (
    <div className="absolute top-4 right-4 z-10">
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="p-2 rounded-full hover:bg-gray-100 focus:outline-none">
          <BsThreeDotsVertical size={20} />
        </Menu.Button>
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none z-20">
          <div className="py-1">
            {type === "request" ? (
              <>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                      onClick={() => onAccept?.(friend._id)}
                    >
                      <FaUserCheck className="mr-2" /> Accept
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm text-red-600 ${
                        active ? "bg-gray-100" : ""
                      }`}
                      onClick={() => onDenied?.(friend._id)}
                    >
                      <FaUserMinus className="mr-2" /> Denied
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaShareAlt className="mr-2" /> Quick share
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaPen className="mr-2" /> Create new post
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaUserFriends className="mr-2" /> Share with friends
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaUsers className="mr-2" /> Share to page
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaUsers className="mr-2" /> Share to group
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaPaperPlane className="mr-2" /> Send via message
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaExchangeAlt className="mr-2" /> Switch to another app
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaLink className="mr-2" /> Copy link
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaFolderPlus className="mr-2" /> Add to folder
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaPen className="mr-2" /> Name it
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaUserCheck className="mr-2" /> Pairing
                    </button>
                  )}
                </Menu.Item>
              </>
            ) : type === "following" ? (
              <>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaRegCommentDots className="mr-2" /> Chat
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaShareAlt className="mr-2" /> Quick share
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaPen className="mr-2" /> Create new post
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaUserFriends className="mr-2" /> Share with friends
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaUsers className="mr-2" /> Share to page
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaUsers className="mr-2" /> Share to group
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaPaperPlane className="mr-2" /> Send via message
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaExchangeAlt className="mr-2" /> Switch to another app
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaLink className="mr-2" /> Copy link
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaFolderPlus className="mr-2" /> Add to folder
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaPen className="mr-2" /> Name it
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaUserCheck className="mr-2" /> Pairing
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm text-red-600 ${
                        active ? "bg-gray-100" : ""
                      }`}
                      onClick={() => onUnFriend?.(friend._id)}
                    >
                      <FaUserMinus className="mr-2" /> Unfollow
                    </button>
                  )}
                </Menu.Item>
              </>
            ) : type === "suggestion" ? (
              <>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                      onClick={() => onAddFriend?.(friend._id)}
                    >
                      <FaUserPlus className="mr-2" /> Add friend
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm text-red-600 ${
                        active ? "bg-gray-100" : ""
                      }`}
                      onClick={() => onRemoveSuggestion?.(friend._id)}
                    >
                      <FaUserMinus className="mr-2" /> Remove
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaShareAlt className="mr-2" /> Quick share
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaPen className="mr-2" /> Create new post
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaUserFriends className="mr-2" /> Share with friends
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaUsers className="mr-2" /> Share to page
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaUsers className="mr-2" /> Share to group
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaPaperPlane className="mr-2" /> Send via message
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaExchangeAlt className="mr-2" /> Switch to another app
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaLink className="mr-2" /> Copy link
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaFolderPlus className="mr-2" /> Add to folder
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaPen className="mr-2" /> Name it
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaUserCheck className="mr-2" /> Pairing
                    </button>
                  )}
                </Menu.Item>
              </>
            ) : (
              // Menu mặc định cho friend
              <>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaRegCommentDots className="mr-2" /> Chat
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaShareAlt className="mr-2" /> Quick share
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaPen className="mr-2" /> Create new post
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaUserFriends className="mr-2" /> Share with friends
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaUsers className="mr-2" /> Share to page
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaUsers className="mr-2" /> Share to group
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaPaperPlane className="mr-2" /> Send via message
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaExchangeAlt className="mr-2" /> Switch to another app
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaLink className="mr-2" /> Copy link
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaFolderPlus className="mr-2" /> Add to folder
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaPen className="mr-2" /> Rename
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <FaUserCheck className="mr-2" /> Pairing
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm text-red-600 ${
                        active ? "bg-gray-100" : ""
                      }`}
                      onClick={() => onUnFriend?.(friend._id)}
                    >
                      <FaUserMinus className="mr-2" /> Unfriend
                    </button>
                  )}
                </Menu.Item>
              </>
            )}
          </div>
        </Menu.Items>
      </Menu>
    </div>
  );
}
