import { useState } from "react";
import { useAuth } from "../AuthContext";
import { toast } from "react-toastify";
import { uploadUserPhoto } from "../services/api";

const UpdatePhoto = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newPhoto, setNewPhoto] = useState(null);

  const handleUpdatePhoto = async () => {
    if (!newPhoto) {
      toast.error("Please select a photo to upload.");
      return;
    }
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append("photo", newPhoto);
      console.log("Uploading photo for user:", user.id);

      // Send the file to the server
      const response = await uploadUserPhoto(user.id, formData);
      updateUser(response.data);
      setNewPhoto(null);
      setIsEditing(false);
      toast.success("Profile photo updated successfully!");
    } catch (error) {
      console.error("Error uploading photo:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      toast.error("Failed to update profile photo. Please try again.");
    }
  };

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
      {!isEditing ? (
        <button
          className="bg-primary text-white py-2 px-4 rounded-lg"
          onClick={() => setIsEditing(true)}
        >
          Edit Photo
        </button>
      ) : (
        <>
          <h3 className="font-semibold mb-2">Update Profile Photo</h3>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewPhoto(e.target.files[0])}
            className="w-full p-2 border rounded-md mb-4"
          />
          {newPhoto && (
            <img
              src={URL.createObjectURL(newPhoto)}
              alt="Preview"
              className="h-20 w-20 rounded-full mb-4"
            />
          )}
          <div className="flex justify-end gap-4">
            <button
              className="bg-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400"
              onClick={() => {
                setIsEditing(false);
                setNewPhoto(null);
              }}
            >
              Cancel
            </button>
            <button
              className="bg-primary text-white py-2 px-4 rounded-lg hover:opacity-80"
              onClick={handleUpdatePhoto}
            >
              Save
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UpdatePhoto;
