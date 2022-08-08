import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Button } from "../../components/button";
import { Radio } from "../../components/checkbox";
import { Field, FieldCheckboxes } from "../../components/field";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import slugify from "slugify";
import { postStatus } from "../../utils/constants";
import { Dropdown } from "../../components/dropdow";

import ImageUpload from "../../components/image/ImageUpload";
import useFirebaseImage from "../../hooks/useFireBaseImage";
import { Toggle } from "../../components/toggle";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
import { async } from "@firebase/util";
import { useAuth } from "../../contexts/auth-context";
import { toast } from "react-toastify";
import DashboardHeading from "../dashboard/DashboardHeading";

const PostAddNewStyles = styled.div``;

const PostAddNew = () => {
  const { userData } = useAuth();
  const { control, handleSubmit, watch, setValue, getValues, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      status: 2,
      category: {},
      slug: "",
      hot: false,
      image: "",
      user: {},
    },
  });
  const watchStatus = watch("status");
  const watchHot = watch("hot");
  const {
    image,
    progress,
    handleSelectImage,
    handleDeleteImage,
    setImage,
    setProgress,
  } = useFirebaseImage(setValue, getValues);
  const [categories, setCategories] = useState([]);
  const [selectCategory, setSelectCategory] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchUserData() {
      if (!userData.email) return;
      const q = query(
        collection(db, "user"),
        where("email", "==", userData.email)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setValue("user", {
          id: doc.id,
          ...doc.data(),
        });
      });
    }
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData.email]);
  const addPostHandler = async (values) => {
    setLoading(true);

    const cloneValues = { ...values };
    cloneValues.slug = slugify(values.slug || values.title);
    const colRef = collection(db, "posts");
    console.log(
      "🚀 ~ file: PostAddNew.js ~ line 67 ~ addPostHandler ~ cloneValues",
      cloneValues
    );
    addDoc(colRef, {
      ...cloneValues,
      categoryId: cloneValues.category.id,
      userId: cloneValues.user.id,
      image,
      createdAt: serverTimestamp(),
    })
      .then(() => {
        toast.success("Create new Posts Successfully!");
        reset({
          title: "",
          status: 2,
          category: {},
          slug: "",
          hot: false,
          image: "",
          user: {},
        });
        setImage("");
        setProgress();
        setSelectCategory(null);
      })
      .catch((err) => {
        toast.error(`Lỗi: ${err}`);
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    async function getData() {
      const colRef = collection(db, "categories");
      const q = query(colRef, where("status", "==", 1));
      const querySnapshot = await getDocs(q);
      let result = [];
      querySnapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCategories(result);
    }
    getData();
  }, []);

  useEffect(() => {
    document.title = "Monkey Blogging - Add new post";
  }, []);
  const handleClickOption = async (item) => {
    const colRef = doc(db, "categories", item.id);
    const docData = await getDoc(colRef);

    setValue("category", {
      id: docData.id,
      ...docData.data(),
    });
    setSelectCategory(item);
  };
  return (
    <>
      <DashboardHeading title="Add post" desc="Add new post"></DashboardHeading>
      <form onSubmit={handleSubmit(addPostHandler)}>
        <div className="form-layout">
          <Field>
            <Label>Title</Label>
            <Input
              control={control}
              placeholder="Enter your title"
              name="title"
              required
            ></Input>
          </Field>
          <Field>
            <Label>Slug</Label>
            <Input
              control={control}
              placeholder="Enter your slug"
              name="slug"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Image</Label>
            <ImageUpload
              onChange={handleSelectImage}
              handleDeleteImage={handleDeleteImage}
              className="h-[250px]"
              progress={progress}
              image={image}
            ></ImageUpload>
          </Field>
          <Field>
            <Label>Category</Label>
            <Dropdown>
              <Dropdown.Select placeholder="Select the category"></Dropdown.Select>
              <Dropdown.List>
                {categories.length > 0 &&
                  categories.map((item) => (
                    <Dropdown.Option
                      key={item.id}
                      onClick={() => handleClickOption(item)}
                    >
                      {item.name}
                    </Dropdown.Option>
                  ))}
              </Dropdown.List>
            </Dropdown>
            {selectCategory?.name && (
              <span className="inline-block p-3 text-sm font-medium text-green-600 rounded-lg bg-green-50">
                {selectCategory?.name}
              </span>
            )}
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Feature post</Label>
            <Toggle
              on={watchHot === true}
              onClick={() => setValue("hot", !watchHot)}
            ></Toggle>
          </Field>
          <Field>
            <Label>Status</Label>
            <FieldCheckboxes>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.APPROVED}
                value={postStatus.APPROVED}
              >
                Approved
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.PENDING}
                value={postStatus.PENDING}
              >
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.REJECTED}
                value={postStatus.REJECTED}
              >
                Reject
              </Radio>
            </FieldCheckboxes>
          </Field>
        </div>
        <Button
          type="submit"
          className="mx-auto w-[250px]"
          isLoading={loading}
          disabled={loading}
        >
          Add new post
        </Button>
      </form>
    </>
  );
};

export default PostAddNew;
