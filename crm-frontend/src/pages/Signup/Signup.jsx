import { useFormik } from "formik";
import * as Yup from "yup";
import AxiosService from "../../components/utils/ApiService";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Signupcss from "./signup.module.css";
import Spinner from "../../components/utils/Sipnners";

function Signup() {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const navigate = useNavigate();

  const handleSignup = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);

      const response = await AxiosService.post("/user/signup", values);
      console.log(response.data.message);
      toast.success(response.data.message);
      navigate("/");
    } catch (error) {
      console.error(error.response.data.message);
      toast.error(error.response.data.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: handleSignup,
  });

  return (
    <>
      <div className={Signupcss.totalbody}>
        <div className={Signupcss.circles}>
          <div className={Signupcss.circle1}></div>
          <div className={Signupcss.circle2}></div>
        </div>
        <form onSubmit={formik.handleSubmit} className={Signupcss.login_form}>
          <h1>Welcome back!</h1>
          <p>Signup to your account.</p>
          <input
            type="text"
            name="name"
            className={Signupcss.formcontrol}
            placeholder="Full Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && (
            <p className={Signupcss.error}>{formik.errors.name}</p>
          )}

          <input
            type="email"
            name="email"
            className={Signupcss.formcontrol}
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <p className={Signupcss.error}>{formik.errors.email}</p>
          )}

          <input
            type="password"
            name="password"
            className={Signupcss.formcontrol}
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password && (
            <p className={Signupcss.error}>{formik.errors.password}</p>
          )}

          <button type="submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? <Spinner /> : "Signup"}
          </button>

          <p>
            Already have an account?{" "}
            <Link to="/" className={Signupcss.signuptext}>
              Login
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default Signup;
