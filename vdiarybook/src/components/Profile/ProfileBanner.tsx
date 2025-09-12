"use client";

import "react-easy-crop/react-easy-crop.css";
import { useEffect, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/utils/cropImage";
import authApi from "@/services/auth.service";
import { uploadImage } from "@/utils/uploadImage";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/authSlice";
import { RootState } from "@/store/store";
import { IProfile } from "@/types/auth.type";

export default function ProfileBanner({
  profile: propProfile,
}: {
  profile?: IProfile;
}) {
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showBgMenu, setShowBgMenu] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [showBgModal, setShowBgModal] = useState(false);
  const [bgPreview, setBgPreview] = useState<string | null>(null);
  const [bgFile, setBgFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const avatarMenuRef = useRef<HTMLDivElement | null>(null);
  const bgMenuRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const bgInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();
  const reduxProfile = useSelector((state: RootState) => state.auth.user);
  const profile = propProfile || reduxProfile;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        bgMenuRef.current &&
        !bgMenuRef.current.contains(event.target as Node)
      ) {
        setShowBgMenu(false);
      }
      if (
        avatarMenuRef.current &&
        !avatarMenuRef.current.contains(event.target as Node)
      ) {
        setShowAvatarMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };
  const handleCropConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setLoading(true);
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      const file = new File([croppedImage], "avatar.jpg", {
        type: "image/jpeg",
      });
      const uploadedUrl = await uploadImage(file);
      const res = await authApi.updateProfile({
        ...profile,
        avatar: uploadedUrl,
      });
      const updateUser = res.data.data;
      dispatch(setUser(updateUser));
      localStorage.setItem("user", JSON.stringify(updateUser));
      toast.success("Cập nhật ảnh đại diện thành công");
    } catch (error) {
      console.error("Lỗi cập nhật ảnh:", error);
      toast.error("Không thể cập nhật ảnh đại diện");
    } finally {
      setLoading(false);
      setShowCropper(false);
      setImageSrc(null);
    }
  };

  const onBgFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBgFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setBgPreview(reader.result as string);
        setShowBgModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBgConfirm = async () => {
    if (bgFile) {
      setLoading(true);
      try {
        const uploadedUrl = await uploadImage(bgFile);
        const res = await authApi.updateProfile({
          ...profile,
          background: uploadedUrl,
        });
        const updateUser = res.data.data;
        dispatch(setUser(updateUser));
        localStorage.setItem("user", JSON.stringify(updateUser));
        toast.success("Cập nhật ảnh bìa thành công");
        setShowBgModal(false);
        setBgPreview(null);
        setBgFile(null);
      } catch (error) {
        toast.error("Không thể cập nhật ảnh bìa");
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <div className="relative w-full mx-auto">
      <div className="w-full h-[300px] overflow-hidden shadow border border-gray-200 bg-white flex items-center justify-center">
        <img
          src={profile?.background || "/assets/img/bg.png"}
          alt="banner"
          className="w-full h-full object-cover"
        />
        <span
          className="absolute z-20 bottom-4 right-4 bg-white rounded-full p-1 shadow cursor-pointer border border-gray-200"
          onClick={() => setShowBgMenu(!showBgMenu)}
        >
          <FiSettings size={18} className="text-gray-500" />
        </span>

        {showBgMenu && (
          <div
            ref={bgMenuRef}
            className="absolute right-4 bottom-16 w-40 bg-white shadow-md rounded-md border border-gray-200 z-10"
          >
            <ul className="py-1">
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => {
                  setShowBgMenu(false);
                  setTimeout(() => {
                    bgInputRef.current?.click();
                  }, 0);
                }}
              >
                Cập nhật ảnh bìa
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => {
                  setShowBgMenu(false);
                  alert("Đổi ảnh nền");
                }}
              >
                Nền hồ sơ
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="absolute left-1/2 top-[220px] -translate-x-1/2 flex flex-col items-center w-full">
        <div className="relative">
          <img
            src={profile?.avatar || "/assets/img/trainers/hieu.jpg"}
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            alt="avatar"
          />
          <span
            className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow cursor-pointer border border-gray-200"
            onClick={() => setShowAvatarMenu(!showAvatarMenu)}
          >
            <FaCamera size={18} className="text-gray-500" />
          </span>

          {showAvatarMenu && (
            <div
              ref={avatarMenuRef}
              className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md border border-gray-200 z-10"
            >
              <ul className="py-1">
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    setShowAvatarMenu(false);
                    fileInputRef.current?.click();
                  }}
                >
                  Đổi ảnh đại diện
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    setShowAvatarMenu(false);
                    alert("Đổi ảnh nền");
                  }}
                >
                  Đổi ảnh nền
                </li>
              </ul>
            </div>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />

        <div className="mt-2 flex items-center justify-center">
          <span className="text-2xl font-bold text-blue-900">
            {profile?.name}
          </span>
          {profile?.verified && (
            <span className="ml-2 text-blue-500" title="Verified">
              ✔️
            </span>
          )}
        </div>
      </div>
      {/* Cropper Modal */}
      {showCropper && imageSrc && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-md shadow-lg p-4 w-[90%] max-w-xl">
            <h2 className="text-center font-semibold mb-2 text-lg">
              Điều chỉnh kích thước ảnh
            </h2>
            <div className="relative w-full h-[300px] bg-gray-200">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={true}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setShowCropper(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleCropConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="w-4 h-4 mr-1 animate-spin"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="white"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="white"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Đang cập nhật...
                  </>
                ) : (
                  "Xác nhận"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {showBgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold text-center mb-4">
              Cập nhật ảnh bìa
            </h2>
            <div className="flex flex-col items-center">
              {bgPreview && (
                <img
                  src={bgPreview}
                  alt="Preview"
                  className="max-h-48 rounded mb-4 border"
                />
              )}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => {
                  setShowBgModal(false);
                  setBgPreview(null);
                  setBgFile(null);
                }}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleBgConfirm}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="w-4 h-4 mr-1 animate-spin"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="white"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="white"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Đang cập nhật...
                  </>
                ) : (
                  "Xác nhận"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <input
        type="file"
        ref={bgInputRef}
        accept="image/*"
        className="hidden"
        onChange={onBgFileChange}
      />
    </div>
  );
}
