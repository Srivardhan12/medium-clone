import { SignupInput } from "@srivardhan_24/medium-project"
import { ChangeEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { BACKEND_URL } from "../config"
import axios from "axios"

export const SignupAuth = () => {
    // const [passwordVisbility, setPasswordVisbility] = useState(false)
    const navigate = useNavigate()
    const [postInputs, setPostInputs] = useState<SignupInput>({
        name: "",
        username: "",
        password: ""
    })
    const sendRequest = async() => {
        try {
          const res = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, postInputs);
          const jwt = res.data;
          localStorage.setItem("token", jwt)
          navigate("/signin")
        } catch (error) {
          console.log("Error", error)
        }
    }
    return <>
        <div className="h-screen flex flex-col justify-center">
            <div className="max-w-xl m-auto">
                <h2 className="text-4xl font-bold">Create an account</h2>
                <p className="text-gray-500 text-center mt-1 mb-5">Already have an account? <Link className="underline" to={"/signin"}>Login</Link></p>
                <div>
                    <LabledInput label="Username" placeholder="Username" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            name: e.target.value
                        })
                    }}/>
                </div>
                <div>
                    <LabledInput label="email" placeholder="name@gmail.com" type="email" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            username: e.target.value
                        })
                    }}/>
                </div>
                <div>
                    <LabledInput label="Password" placeholder="Password" type="password" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            password: e.target.value
                        })
                    }}/>
                {/* <span className="mt-14 ml-3 cursor-pointer" onClick={() => {setPasswordVisbility(!passwordVisbility)}}>eye</span> */}
                </div>
                <div>
                <button onClick={sendRequest} type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 w-full mt-3">Sign up</button>
                </div>
            
            </div>
        </div>
    </>
}

interface LabledInput{
    label: string,
    placeholder: string,
    onChange: (e:ChangeEvent<HTMLInputElement>) => void,
    type?: string
}

function LabledInput({label, placeholder, onChange, type}:LabledInput){
 return  <div>
    <label className="block mt-5 mb-2 text-sm font-medium text-gray-900">{label}</label>
    <input type={type || "text"} onChange={onChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5" placeholder={placeholder} required />
</div>
}