import React, { useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Form } from "@unform/web";
import { FormHandles } from "@unform/core";
import { Helmet } from "react-helmet";
import { FiLogIn, FiLock, FiMail } from "react-icons/fi";
import { ValidationError } from "yup";

import { useAuthDispatch, useAuthState } from "../../contexts/auth/AuthContext";
import { AnimationContainer } from "./styles";
import AuthLayout from "../../layouts/Auth";
import Input from "../../components/Input";
import Button from "../../components/Button";
import getValidationErrors from "../../utils/getValidationErrors";
import logo from "../../assets/images/logo.svg";
import signInBackground from "../../assets/images/sign-in-background.png";
import schema from "./schema";
import { FORGOT_PASSWORD_PATH, SIGN_UP_PAGE_PATH } from "../../constants/routesPaths";

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [t] = useTranslation();

  const { signIn } = useAuthDispatch();

  const { loading } = useAuthState();

  const handleSubmit = useCallback(
    async (data): Promise<void> => {
      try {
        formRef.current?.setErrors({});

        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn(data);
      } catch (error) {
        if (error instanceof ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
        }
      }
    },
    [signIn],
  );

  return (
    <AuthLayout backgroundImage={signInBackground}>
      <AnimationContainer>
        <Helmet>
          <title>
            GoBarber |
            {" "}
            {t("signin.welcome_to_the_platform")}
          </title>
        </Helmet>

        <img
          src={logo}
          aria-label="GoBarber"
          alt="GoBarber"
        />

        <Form
          ref={formRef}
          onSubmit={handleSubmit}
        >

          <h1>{t("signin.welcome_to_the_platform")}</h1>

          <Input
            name="email"
            type="email"
            autoCapitalize="none"
            placeholder={t("account_form.email")}
            icon={FiMail}
          />
          <Input
            name="password"
            type="password"
            placeholder={t("account_form.password")}
            icon={FiLock}
          />

          <Button
            type="submit"
            loading={loading}
            disabled={loading}
          >
            {t("buttons.confirm")}
          </Button>

          <Link to={FORGOT_PASSWORD_PATH}>
            {t("signin.forgot_my_password")}
          </Link>
        </Form>

        <Link to={SIGN_UP_PAGE_PATH}>
          <FiLogIn />
          {t("signin.create_an_account")}
        </Link>
      </AnimationContainer>
    </AuthLayout>
  );
};

export default SignIn;
