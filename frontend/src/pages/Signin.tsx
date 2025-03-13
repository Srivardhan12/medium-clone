import { SigninAuth } from "../components/SigninAuth"
import { Quote } from "../components/Quote"

export const Signin = () => {
    return <div>
        <div className="grid sm:grid-cols-2 grid-cols-1">
            <div>
                <SigninAuth />
            </div>
            <div className="invisible lg:visible">
                <Quote />
            </div>
        </div>
    </div>
}