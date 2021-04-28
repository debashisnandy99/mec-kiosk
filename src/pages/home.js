import * as React from "react"
import { isLoggedIn } from "../services/logauth"
import { navigate } from "gatsby"

const IndexPage = () => {
  if (!isLoggedIn()) {
    if (typeof window !== `undefined`) {
      navigate("/", {
        replace: true,
      })
    }
  } else {
    return <div></div>
  }
  return <div></div>
}

export default IndexPage
