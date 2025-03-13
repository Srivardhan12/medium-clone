import { SignupAuth } from "../components/SignupAuth"
import { Quote } from "../components/Quote"

export const Signup = () => {
    return <div>
        <div className="grid sm:grid-cols-2 grid-cols-1">
            <div>
                <SignupAuth />
            </div>
            <div className="invisible lg:visible">
                <Quote />
            </div>
        </div>
    </div>
}