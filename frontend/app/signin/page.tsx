import { SigninForm } from "./form"

export default function Signin() {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="shadow-xl p4 bg-white rounded-xl">
        <SigninForm></SigninForm>
      </div>
    </div>
  );
}
