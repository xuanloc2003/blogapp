import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../components/button";
import { Field } from "../components/field";
import { Input } from "../components/input";
import InputPasswordToggle from "../components/input/InputPasswordToggle";
import { Label } from "../components/label";

import { yupResolver } from "@hookform/resolvers/yup";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import slugify from "slugify";
import * as yup from "yup";
import { auth, db } from "../firebase-app/firebase-config";
import { userRole, userStatus } from "../utils/constants";
import AuthenticationPage from "./AuthenticationPage";

const schema = yup.object({
  fullname: yup.string().required("Please enter your fullname"),
  email: yup
    .string()
    .email("Please enter valid email address")
    .required("Please enter email address"),
  password: yup
    .string()
    .min(8, "Your password must be 8 characters")
    .required("Please Enter Your PassWord"),
});

const SignUpPage = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const handleSignUp = async (values) => {
    if (!isValid) return;
    console.log(values);
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
    } catch (error) {
      return toast.error(error.message);
    }

    await updateProfile(auth.currentUser, {
      displayName: values.fullname,
      photoURL:
        "https://bloganh.net/wp-content/uploads/2021/03/chup-anh-dep-anh-sang-min.jpg",
    });

    await setDoc(doc(db, "user", auth.currentUser.uid), {
      fullname: values.fullname,
      email: values.email,
      password: values.password,
      userName: slugify(values.fullname, { lower: true }),
      avatar:
        "https://bloganh.net/wp-content/uploads/2021/03/chup-anh-dep-anh-sang-min.jpg",
      status: userStatus.ACTIVE,
      role: userRole.USER,
      createAt: serverTimestamp(),
    });
    toast.success("Create user successfully !");
    navigate("/");
  };

  console.log(errors);
  useEffect(() => {
    const arrErrors = Object.values(errors);
    if (arrErrors.length > 0) {
      toast.error(arrErrors[0]?.message, {
        pauseOnHover: false,
        delay: 100,
      });
    }
  }, [errors]);

  return (
    <AuthenticationPage>
      <form className="form" onSubmit={handleSubmit(handleSignUp)}>
        <Field className="field">
          <Label htmlFor="fullname" className="label">
            Fullname
          </Label>
          <Input
            type="text"
            name="fullname"
            placeholder="Enter your fullname"
            control={control}
          />
        </Field>
        <Field className="field">
          <Label htmlFor="email" className="label">
            Email
          </Label>
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            control={control}
          />
        </Field>
        <Field className="field">
          <Label htmlFor="password" className="label">
            Password
          </Label>
          <InputPasswordToggle control={control}></InputPasswordToggle>
        </Field>
        <div className="have-account">
          You already have an account? <NavLink to={"/sign-in"}>Login</NavLink>{" "}
        </div>
        <Button
          type="submit"
          kind="primary"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          style={{ width: "100%", maxWidth: 350, margin: "0 auto" }}
        >
          SignUp
        </Button>
      </form>
    </AuthenticationPage>
  );
};

export default SignUpPage;
