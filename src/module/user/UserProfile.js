import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../../components/button";
import { Field } from "../../components/field";
import ImageUpload from "../../components/image/ImageUpload";
import { Input, InputPasswordToggle } from "../../components/input";
import InputNewPasswordToggle from "../../components/input/InputNewPasswordToggle ";
import { Label } from "../../components/label";
import { useAuth } from "../../contexts/auth-context";
import { db } from "../../firebase-app/firebase-config";
import useFirebaseImage from "../../hooks/useFireBaseImage";
import DashboardHeading from "../dashboard/DashboardHeading";

const UserProfile = () => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    getValues,
    setValue,
    formState: { isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
  });
  const [params] = useSearchParams();
  const userId = params.get("id");
  const imageUrl = getValues("avatar");
  const imageRegex = /%2F(\S+)\?/gm.exec(imageUrl);
  const imageName = imageRegex?.length > 0 ? imageRegex[1] : "";
  const {
    image,
    // handleResetUpload,
    progress,
    handleSelectImage,
    handleDeleteImage,
    // setProgress,
    setImage,
  } = useFirebaseImage(setValue, getValues, imageName, deleteAvatar);
  const hanldeUpdateUser = async (values) => {
    if (!isValid) return;
    try {
      const colRef = doc(db, "user", userId);
      await updateDoc(colRef, {
        ...values,
        avatar: image,
      });
      toast.success("Update user information successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Update user failed!");
    }
  };

  async function deleteAvatar() {
    const colRef = doc(db, "user", userId);
    await updateDoc(colRef, {
      avatar: "",
    });
  }
  useEffect(() => {
    setImage(imageUrl);
  }, [imageUrl, setImage]);
  useEffect(() => {
    async function FectchData() {
      if (!userId) return;
      const colRef = doc(db, "user", userId);
      const docdata = await getDoc(colRef);

      reset(docdata.data());
    }
    FectchData();
  }, [userId, reset]);

  const { userData } = useAuth();
  console.log(
    "🚀 ~ file: UserProfile.js ~ line 16 ~ UserProfile ~ userData",
    userData
  );
  return (
    <div>
      <DashboardHeading
        title="Account information"
        desc="Update your account information"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(hanldeUpdateUser)}>
        <div className="mb-10 text-center">
          <div className="w-[200px] h-[200px] mx-auto rounded-full mb-10">
            <ImageUpload
              className="!rounded-full h-full"
              onChange={handleSelectImage}
              handleDeleteImage={handleDeleteImage}
              progress={progress}
              image={image}
            ></ImageUpload>
          </div>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Fullname</Label>
            <Input
              control={control}
              name="fullname"
              placeholder="Enter your fullname"
            ></Input>
          </Field>
          <Field>
            <Label>Username</Label>
            <Input
              control={control}
              name="username"
              placeholder="Enter your username"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Date of Birth</Label>
            <Input
              control={control}
              name="birthday"
              placeholder="dd/mm/yyyy"
            ></Input>
          </Field>
          <Field>
            <Label>Location</Label>
            <Input
              control={control}
              name="location"
              placeholder="Enter your location"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Email</Label>
            <Input
              control={control}
              name="email"
              type="email"
              placeholder="Enter your email address"
            ></Input>
          </Field>
          <Field>
            <Label>Mobile Number</Label>
            <Input
              control={control}
              name="phone"
              placeholder="Enter your phone number"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>New Password</Label>
            <InputPasswordToggle
              control={control}
              name="password"
              type="password"
            ></InputPasswordToggle>
          </Field>
          <Field>
            <Label>Confirm Password</Label>
            <InputNewPasswordToggle
              control={control}
              name="password"
              type="password"
            ></InputNewPasswordToggle>
          </Field>
        </div>
        <Button
          kind="primary"
          type="submit"
          className="mx-auto w-[200px]"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Update
        </Button>
      </form>
    </div>
  );
};

export default UserProfile;
