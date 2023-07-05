import React, { memo, useState, useCallback } from "react";
import styles from "./form.module.css";
import Earth from "components/form/icons/earth";
import { useFormik } from "formik";
import * as Yup from "yup";
import Email from "components/form/icons/email";
import Eye from "components/form/icons/eye";
import { axiosClient } from "helper";
import Eyeslash from "./icons/eyeslash";

function Form(props) {
  const [isHaveReponsive, setIsHaveReponsive] = useState(true);

  const [isVisiblePwd, setIsVisiblePwd] = useState(false);

  const toggleVisiblePwd = useCallback(() => {
    setIsVisiblePwd((visible) => !visible);
  }, []);

  const validation = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email format").required("Required!"),
      password: Yup.string()
        .min(6, "Minimum 6 characters")
        .max(16, "Maximum 16 characters")
        .required("Required!"),
    }),

    onSubmit: (values) => {
      const { email, password } = values;

      const data = {
        email,
        password,
      };

      onSubmitAsync(data);
      setIsHaveReponsive(false);
    },
  });

  const onClickButton = useCallback(
    (e) => {
      e.preventDefault();

      validation.handleSubmit();
    },
    [validation]
  );

  const isErrorInfo = (fieldName) => {
    if (validation.errors[fieldName] && validation.touched[fieldName]) {
      return true;
    }
    return false;
  };

  const onSubmitAsync = async (data) => {
    const url = "/employees/login";

    try {
      // Promise
      const response = await axiosClient.post(url, data);
      console.log(response.data);
      setIsHaveReponsive(true);
      alert("Đăng nhập thành công, Email: " + data.email);
    } catch (err) {
      console.error(err);
      console.log("Login thất bại");
      setIsHaveReponsive(true);
      alert("Đăng nhập thất bại!");
    }
  };

  return (
    <div className={`container ${styles.cover}`}>
      {!isHaveReponsive && (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingIcon}></div>
        </div>
      )}

      <div className={styles.coverForm}>
        <div className="row">
          <form className={`col-sm-12 col-md-6 ${styles.form}`}>
            <div className={`row ${styles.navbar}`}>
              <div className={`col-7 ${styles.logo}`}>
                <a className={styles.logoLink} href="http://">
                  <Earth /> Anywhere App
                </a>
              </div>

              <div className={`col-2 ${styles.menu}`}>
                <a className={styles.menuLink} href="http://">
                  Home
                </a>
              </div>

              <div className={`col-3 ${styles.menu}`}>
                <a className={styles.menuLink} href="http://">
                  Join
                </a>
              </div>
            </div>

            <div className={styles.start}>START FOR FREE</div>

            <div className={styles.login}>Log in</div>

            <div className={styles.member}>
              Not A Member?{" "}
              <a className={styles.create} href="http://">
                Sign up
              </a>
            </div>

            <div className={styles.coverInputGroup}>
              <div className={`mb-3 mt-3 form-floating ${styles.coverInput}`}>
                <input
                  type="text"
                  className={`form-control ${styles.Input} ${
                    isErrorInfo("email") && `is-invalid ${styles.invalid}`
                  }`}
                  id="email"
                  placeholder="Email:"
                  name="email"
                  autoComplete="off"
                  value={validation.values.email}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                />

                <label htmlFor="email">Email:</label>

                <span
                  className={`input-group-text ${styles.iconInput} ${
                    isErrorInfo("email") && styles.invalidIcon
                  }`}
                >
                  <Email />
                </span>
              </div>

              {isErrorInfo("email") && (
                <div className={styles.errors}>{validation.errors.email}</div>
              )}

              <div className={`mb-3 mt-3 form-floating ${styles.coverInput}`}>
                <input
                  type={isVisiblePwd ? "text" : "password"}
                  className={`form-control ${
                    isErrorInfo("password") && `is-invalid ${styles.invalid}`
                  } ${styles.Input}`}
                  id="password"
                  placeholder="Password:"
                  name="password"
                  value={validation.values.password}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                />

                <label htmlFor="password">Password:</label>

                <span
                  className={`input-group-text ${styles.isVisiblePwd} ${
                    isErrorInfo("password") && styles.invalidIcon
                  } ${styles.iconInput}`}
                  onClick={toggleVisiblePwd}
                >
                  {isVisiblePwd ? <Eyeslash /> : <Eye />}
                </span>
              </div>

              {isErrorInfo("password") && (
                <div className={styles.errors}>
                  {validation.errors.password}
                </div>
              )}
            </div>

            <div className={styles.coverButton}>
              <button
                type="submit"
                className={`btn btn-primary ${styles.button}`}
                onClick={onClickButton}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default memo(Form);
