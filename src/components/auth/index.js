import React, { useState } from "react"
import Click from "../../assets/click.svg"
import Login from "./login"
import Otp from "./otp"
import Password from "./password"
import axios from "../../services/api"
import firebase from "../../services/firebase"
import { storeUser } from "../../services/logauth"
import { navigate } from "gatsby"
import "firebase/auth"

if (typeof window !== "undefined") {
  firebase.auth().useDeviceLanguage()
}
const windowVar = {
  recaptchaVerifier: undefined,
  confirmationAuthResult: undefined,
}

const IndexPage = () => {
  const [pageState, setPageState] = useState(0)
  const [isOtpSend, setOtpSendStatus] = useState(false)
  const [otpStatus, SetOtpStatus] = useState(0)
  const [user, setUser] = useState()
  const [cardNumber, setCardNumber] = useState()
  const [password, setPassword] = useState()
  const [isError, setError] = useState(false)
  const [isSending, setSendingStatus] = useState(false)

  const handelSubmit = event => {
    event.preventDefault()
    if (pageState === 0) {
      setCardNumber(event.target.cardnumber.value)
      setPageState(pageState + 1)
    } else if (pageState === 1) {
      let pass = event.target.password.value
      if (pass.length === 0) {
        setError(true)
      } else {
        setSendingStatus(true)
        handelLogin().then(userVal => {
          if (user.data) {
            setUser(userVal)
          } else {
            setError(true)
          }
        })
      }
    } else {
      handelOtp(event)
    }
  }

  const handelLogin = async () => {
    try {
      let data = await axios.post(
        "/auth/login",
        {
          card: cardNumber,
          password: password,
          os: navigator.platform,
        },
        {
          headers: {
            "content-type": "application/json",
          },
        }
      )

      setError(false)
      verifyPhoneNumber()
      //return data.data.user
      return data
    } catch (error) {
      return {}
    }
  }

  const verifyPhoneNumber = () => {
    windowVar.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container"
    )
    firebase
      .auth()
      .signInWithPhoneNumber("+918583858959", windowVar.recaptchaVerifier)
      .then(confirmationResult => {
        windowVar.confirmationAuthResult = confirmationResult
        setOtpSendStatus(true)
        SetOtpStatus(0)
        setSendingStatus(false)
        if (pageState === 1)  {
          setPageState(pageState+1)
        }
      })
      .catch(error => {
        // Error; SMS not sent
        SetOtpStatus(3)
        setSendingStatus(false)
        // ...
      })
  }

  const handelOtp = event => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      event.preventDefault()
      event.stopPropagation()
      let target = event.target
      windowVar.confirmationAuthResult
        .confirm(target.otp.value)
        .then(result => {
          // User signed in successfully.
          SetOtpStatus(2)
          storeUser(user)
          if (typeof window !== `undefined`) {
            navigate("/home", {
              replace: true,
            })
          }
          // ...
        })
        .catch(error => {
          // User couldn't sign in (bad verification code?)
          SetOtpStatus(1)
          // ...
        })
    }
  }

  const OtpModel = status => {
    if (status === 0) {
      return (
        <div class="bg-white p-4 flex items-center">
          <div class="space-x-2 bg-blue-50 rounded flex items-start text-blue-600 mx-auto max-w-2xl shadow-lg">
            <div class="w-1 self-stretch bg-blue-800"></div>
            <div class="flex  space-x-2 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="fill-current w-5 pt-1"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <h3 class="text-blue-800 tracking-wider flex-1">
                OTP Successfully Send To Your Number{" "}
              </h3>
            </div>
          </div>
        </div>
      )
    } else if (status === 1) {
      return (
        <div class="bg-white p-4 flex items-center">
          <div class="space-x-2 bg-red-50 rounded flex items-start text-red-600  mx-auto max-w-2xl shadow-lg">
            <div class="w-1 self-stretch bg-red-800"></div>
            <div class="flex  space-x-2 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="fill-current w-5 pt-1"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.5 5h3l-1 10h-1l-1-10zm1.5 14.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z" />
              </svg>
              <h3 class="text-red-800 tracking-wider flex-1">
                OTP is not valid{" "}
              </h3>
            </div>
          </div>
        </div>
      )
    } else if (status === 2) {
      return (
        <div class="bg-white p-4 flex items-center">
          <div class="space-x-2 bg-green-50 rounded flex items-start text-green-600 mx-auto max-w-2xl shadow-lg">
            <div class="w-1 self-stretch bg-green-800"></div>
            <div class="flex  space-x-2 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="fill-current w-5 pt-1"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.5 5h3l-1 10h-1l-1-10zm1.5 14.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z" />
              </svg>
              <h3 class="text-green-800 tracking-wider flex-1">
                OTP Verified{" "}
              </h3>
            </div>
          </div>
        </div>
      )
    } else if (status === 3) {
      return (
        <div class="bg-white p-4 flex items-center">
          <div class="space-x-2 bg-yellow-50 rounded flex items-start text-yellow-600 mx-auto max-w-2xl shadow-lg">
            <div class="w-1 self-stretch bg-yellow-800"></div>
            <div class="flex  space-x-2 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="fill-current w-5 pt-1"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.5 5h3l-1 10h-1l-1-10zm1.5 14.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z" />
              </svg>
              <h3 class="text-yellow-800 tracking-wider flex-1">
                Something Went Wrong{" "}
              </h3>
            </div>
          </div>
        </div>
      )
    }
  }

  const errorLogin = () => {
    return (
      <div class="bg-white p-4 flex items-center">
        <div class="space-x-2 bg-red-50 rounded flex items-start text-red-600  mx-auto max-w-2xl shadow-lg">
          <div class="w-1 self-stretch bg-red-800"></div>
          <div class="flex  space-x-2 p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="fill-current w-5 pt-1"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.5 5h3l-1 10h-1l-1-10zm1.5 14.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z" />
            </svg>
            <h3 class="text-red-800 tracking-wider flex-1">Invalid Login </h3>
          </div>
        </div>
      </div>
    )
  }

  const submitButton = () => {
    return (
      <div className="flex justify-center items-center">
        <input
          type="submit"
          value="Submit"
          disabled={isSending}
          className="bg-black px-5 py-2 mt-4 text-white hover:bg-gray-800"
          style={{
            cursor: "pointer",
          }}
        />
      </div>
    )
  }

  const recaptchaContainer = () => {
    return (
      <div className="flex justify-center items-center">
        <div id="recaptcha-container"></div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      <div className="grid ">
        {isOtpSend ? (
          <div className="absolute">{OtpModel(otpStatus)}</div>
        ) : (
          <></>
        )}
        {isError ? <div className="absolute">{errorLogin()}</div> : <></>}
        <div className="w-4/5 justify-self-center self-center	">
          <p className="text-2xl text-center font-semibold w-80 mb-4 w-full">
            {pageState === 0
              ? "Enter Your MEC Card"
              : pageState === 1
              ? "Enter Password"
              : "Enter OTP"}
          </p>
          <form className="mt-8" onSubmit={handelSubmit}>
            <div className="flex flex-wrap mb-6">
              <div className="w-full px-3">
                {pageState === 0 ? (
                  <Login />
                ) : pageState === 1 ? (
                  <Password />
                ) : (
                  <Otp />
                )}
                {pageState === 0 ? (
                  <input type="submit" hidden />
                ) : (
                  submitButton()
                )}
              </div>
            </div>
          </form>
          {pageState === 1 ? <div id="recaptcha-container"></div> : <></>}
        </div>
      </div>

      <div className="bg-indigo-200 flex items-center">
        <div className="ml-5">
          <Click className="w-20" />
          <p className="text-4xl font-semibold my-4">MEC KIOSK</p>
          <p className="text-2xl w-80 mb-4">
            All Serivce Now At Your Fingertip
          </p>
        </div>
      </div>
    </div>
  )
}

export default IndexPage
