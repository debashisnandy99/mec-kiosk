import * as React from "react"
import LoginPage from "../components/auth/index"
import { isLoggedIn } from "../services/logauth"
import { navigate } from "gatsby"

const IndexPage = () => {
  if (isLoggedIn()) {
    if (typeof window !== `undefined`) {
      navigate("/home", {
        replace: true,
      })
    }
  } else {
    return <LoginPage />
  }
  return <div></div>
}

export default IndexPage
