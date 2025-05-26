import { SignupInput } from "@srivardhan_24/medium-project"
import { ChangeEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { BACKEND_URL } from "../config"
import axios, { AxiosError } from "axios"
import { useUser } from "../context/UserContext"
import { jwtDecode } from "jwt-decode"

interface SignupResponse {
    token?: string;  // The JWT token from a successful response
    error?: string;  // The error message from an unsuccessful response
}

interface DecodedToken {
    id: string;
    email: string;
    name?: string;
}

export const SignupAuth = () => {
    // const [passwordVisbility, setPasswordVisbility] = useState(false)
    const navigate = useNavigate()
    const { setUser } = useUser();
    const [errorMsg, setErrorMsg] = useState("");
    const [hasErrors, setHasErrors] = useState(false);
    const [btndisabled, setBtndisabled] = useState(false)
    const [postInputs, setPostInputs] = useState<SignupInput>({
        name: "",
        username: "",
        password: ""
    })
    const sendRequest = async () => {
        setHasErrors(false);
        if (!postInputs.name || !postInputs.password || !postInputs.username) {
            setHasErrors(true);
            setErrorMsg("Please fill all the details!");
            return
        }
        try {
            setBtndisabled(true);
            const res = await axios.post<SignupResponse>(`${BACKEND_URL}/api/v1/user/signup`, postInputs);

            if (res.status === 200 || res.data.token) {
                const token = res.data.token;
                if (token) {
                    localStorage.setItem("token", token);
                    const decoded = jwtDecode<DecodedToken>(token);
                    setUser({
                        id: decoded.id,
                        email: postInputs.username,
                        name: postInputs.name
                    });
                    localStorage.setItem("user", JSON.stringify(decoded));
                }
                navigate("/");
            } else if (res.data.error) {
                setHasErrors(true);
                setErrorMsg(res.data.error);
            }
        } catch (error) {
            setHasErrors(true);
            const axiosError = error as AxiosError<{ error: string }>;
            setErrorMsg(axiosError.response?.data?.error || "An error occurred during signup");
            console.log("Error:", error);
        } finally {
            setBtndisabled(false);
        }
    }
    return <>
        <div className="h-screen flex flex-col justify-center">
            <div className="max-w-xl m-auto">
                <h2 className="text-4xl font-bold">Create an account</h2>
                <p className="text-gray-500 text-center mt-1 mb-5">Already have an account? <Link className="underline text-blue-500" to={"/signin"}>Login</Link></p>
                <p className="text-red-500 font-semibold">{hasErrors ? errorMsg : ""}</p>
                <div>
                    <LabledInput label="Username" placeholder="Username" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            name: e.target.value
                        })
                    }} />
                </div>
                <div>
                    <LabledInput label="email" placeholder="name@gmail.com" type="email" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            username: e.target.value
                        })
                    }} />
                </div>
                <div>
                    <LabledInput label="Password" placeholder="Password" type="password" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            password: e.target.value
                        })
                    }} />
                    {/* <span className="mt-14 ml-3 cursor-pointer" onClick={() => {setPasswordVisbility(!passwordVisbility)}}>eye</span> */}
                </div>
                <div>
                    <button onClick={sendRequest} disabled={btndisabled} type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 w-full mt-3">
                        Sign up
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
}

interface LabledInput {
    label: string,
    placeholder: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    type?: string
}

function LabledInput({ label, placeholder, onChange, type }: LabledInput) {
    return <div>
        <label className="block mt-5 mb-2 text-sm font-medium text-gray-900">{label}</label>
        <input type={type || "text"} onChange={onChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5" placeholder={placeholder} required />
    </div>
}