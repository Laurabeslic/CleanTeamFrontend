import React, { useEffect } from "react";
import { Button, Alert, Row, Col } from "react-bootstrap";
import { Link, useLocation, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import FeatherIcons from "feather-icons-react";

// actions
import { resetAuth, loginUser } from "../../redux/actions";

// store
import { RootState, AppDispatch } from "../../redux/store";

// components
import { VerticalForm, FormInput } from "../../components/";

import AuthLayout from "./AuthLayout";

// images
import logoDark from "../../assets/images/logo-dark.png";
import logoLight from "../../assets/images/logo-light.png";

interface UserData {
  email: string;
  password: string;
}

/* bottom links */
// const BottomLink = () => {
//   const { t } = useTranslation();

//   return (
//     <Row className="mt-3">
//       <Col xs={12} className="text-center">
//         <p className="text-muted">
//           {t("Don't have an account?")}{" "}
//           <Link to={"/auth/register"} className="text-primary fw-bold ms-1">
//             {t("Sign Up")}
//           </Link>
//         </p>
//       </Col>
//     </Row>
//   );
// };

const Login = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const { user, userLoggedIn, loading, error } = useSelector(
    (state: RootState) => ({
      user: state.Auth.user,
      loading: state.Auth.loading,
      error: state.Auth.error,
      userLoggedIn: state.Auth.userLoggedIn,
    })
  );

  useEffect(() => {
    dispatch(resetAuth());
  }, [dispatch]);

  /*
    form validation schema
    */
  const schemaResolver = yupResolver(
    yup.object().shape({
      email: yup.string().required(t("Bitte E-Mail eingeben!")),
      password: yup.string().required(t("Bitte Passwort eingeben!")),
      checkbox: yup.bool().oneOf([true]),
    })
  );

  /*
    handle form submission
    */
  const onSubmit = (formData: UserData) => {
    dispatch(loginUser(formData["email"], formData["password"]));
  };

  const location = useLocation();
  const redirectUrl = location?.search?.slice(6) || "/";

  return (
    <>
      {userLoggedIn || user ? <Navigate to={redirectUrl}></Navigate> : null}

      <AuthLayout>
        <div className="auth-logo mx-auto">
          <Link to="/" className="logo logo-dark text-center">
            <span className="logo-lg">
              <img src={logoDark} alt="" height="24" />
            </span>
          </Link>

          <Link to="/" className="logo logo-light text-center">
            <span className="logo-lg">
              <img src={logoLight} alt="" height="24" />
            </span>
          </Link>
        </div>

        <h6 className="h5 mb-0 mt-3">{t("Willkommen zurück!")}</h6>
        <p className="text-muted mt-1 mb-4">
          {t("Geben Sie Ihre E-Mail Adresse und Ihr Passwort ein, um auf das Panel zuzugreifen.")}
        </p>

        <div className="form-container" style={{ minHeight: "50px" }}>
        <Alert variant="danger" className={error ? "my-2" : "mb-4 my-2 d-none"}>
        {error}
      </Alert>
  </div>
        <VerticalForm<UserData>
          onSubmit={onSubmit}
          resolver={schemaResolver}
          
          formClass="authentication-form"
        >
          <FormInput
            type="email"
            name="email"
            label={t("E-Mail Adresse")}
            startIcon={<FeatherIcons icon={"mail"} className="icon-dual" />}
            placeholder={t("Geben Sie Ihre E-Mail ein")}
            containerClass={"mb-3"}
          />
          <FormInput
            type="password"
            name="password"
            label={t("Passwort")}
            startIcon={<FeatherIcons icon={"lock"} className="icon-dual" />}
            // action={
            //   <Link
            //     to="/auth/forget-password"
            //     className="float-end text-muted text-unline-dashed ms-1"
            //   >
            //     {t("Passwort vergessen?")}
            //   </Link>
            // }
            placeholder={t("Geben Sie Ihr Passwort ein")}
            containerClass={"mb-3"}
          ></FormInput>

          {/* <FormInput
            type="checkbox"
            name="checkbox"
            label={t("Eingeloggt bleiben")}
            containerClass={"mb-3"}
            defaultChecked
          /> */}

          <div className="mb-5 text-center d-grid">
            <Button type="submit" disabled={loading}>
              {t("Login")}
            </Button>
          </div>
        </VerticalForm>

        <div className="py-3 text-center">
          {/* <span className="fs-16 fw-bold">{t("OR")}</span> */}
        </div>
        <Row>
          <Col xs={12} className="text-center">
            {/* <Link to="#" className="btn btn-white mb-2 mb-sm-0 me-1">
              <i className="uil uil-google icon-google me-2"></i>
              {t("With Google")}
            </Link> 
             <Link to="#" className="btn btn-white mb-2 mb-sm-0">
              <i className="uil uil-facebook me-2 icon-fb"></i>
              {t("With Facebook")}
            </Link> */}
          </Col>
        </Row>
      </AuthLayout>
    </>
  );
};

export default Login;
