import { SigninInput } from "@srivardhan_24/medium-project";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";

// export const SigninAuth = () => {
//   // const [passwordVisbility, setPasswordVisbility] = useState(false)
//   const navigate = useNavigate()
//   const [errorMsg, setErrorMsg] = useState("")
//   const [hasErrors, setHasErrors] = useState(false)
//   const [btndisabled, setBtndisabled] = useState(false)
//   const [postInputs, setPostInputs] = useState<SigninInput>({
//     username: "",
//     password: "",
//   });
//   const sendRequest = async () => {
//     setHasErrors(false)
//     if (!postInputs.username || !postInputs.password) {
//       setHasErrors(true)
//       setErrorMsg("Please fill all the details!")
//       return
//     }
//     try {
//       setBtndisabled(true)
//       const res = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, postInputs);
//       if (res.status == 401 && res.data.error) {
//         const message = res.data.error;
//         console.log(message)
//         setHasErrors(true)
//         setErrorMsg(message)
//       } else if (res.status == 200 && res.data) {
//         const jwt = res.data;
//         localStorage.setItem("token", jwt)
//         navigate("/blogs")
//       }
//       setBtndisabled(false)
//     } catch (error) {
//       console.log("Error", error)
//     }
//   }
interface SigninResponse {
  token?: string;  // The JWT token from a successful response
  error?: string;  // The error message from an unsuccessful response
}

export const SigninAuth = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [hasErrors, setHasErrors] = useState(false);
  const [btndisabled, setBtndisabled] = useState(false);
  const [postInputs, setPostInputs] = useState<SigninInput>({
    username: "",
    password: "",
  });

  const sendRequest = async () => {
    setHasErrors(false);
    if (!postInputs.username || !postInputs.password) {
      setHasErrors(true);
      setErrorMsg("Please fill all the details!");
      return;
    }

    try {
      setBtndisabled(true);
      const res = await axios.post<SigninResponse>(`${BACKEND_URL}/api/v1/user/signin`, postInputs);

      if (res.status === 200 && res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/blogs");
      } else if (res.data.error) {
        setHasErrors(true);
        setErrorMsg(res.data.error);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setHasErrors(true);
      setErrorMsg(error.response?.data?.error || "Please check your Credentials");
      console.log("Error:", error);
    } finally {
      setBtndisabled(false);
    }
  };
  return (
    <>
      <div className="h-screen flex flex-col justify-center">
        <div className="max-w-xl m-auto">
          <h2 className="text-4xl font-bold">Login into account</h2>
          <p className="text-gray-500 text-center mt-1 mb-5">
            New user?{" "}
            <Link className="underline" to={"/signup"}>
              create an account
            </Link>
          </p>
          <div>
            <p className="text-red-500 font-semibold">{hasErrors ? errorMsg : ""}</p>
            <LabledInput
              type="email"
              label="email"
              placeholder="name@gmail.com"
              onChange={(e) => {
                setBtndisabled(false)
                setPostInputs({
                  ...postInputs,
                  username: e.target.value,
                });
              }}
            />
          </div>
          <div>
            <LabledInput
              type="password"
              label="Password"
              placeholder="Password"
              onChange={(e) => {
                setBtndisabled(false)
                setPostInputs({
                  ...postInputs,
                  password: e.target.value,
                });
              }}
            />
            {/* <span className="mt-14 ml-3 cursor-pointer" onClick={() => {setPasswordVisbility(!passwordVisbility)}}>eye</span> */}
          </div>
          <div>
            <button
              type="button"
              onClick={sendRequest}
              className="text-white bg-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 w-full mt-3"
              disabled={btndisabled}
            >
              Login
              {
                btndisabled ? <svg aria-hidden="false" role="status" className="inline w-4 h-4 ms-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                </svg> : ""
              }
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

interface LabledInput {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function LabledInput({ label, placeholder, onChange, type }: LabledInput) {
  return (
    <div>
      <label className="block mt-5 mb-2 text-sm font-medium text-gray-900">
        {label}
      </label>
      <input
        type={type || "text"}
        onChange={onChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
        placeholder={placeholder}
        required
      />
    </div>
  );
}
