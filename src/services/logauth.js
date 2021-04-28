import { navigate } from "gatsby"

export const isBrowser = () => typeof window !== "undefined"

export const getUser = () =>
  isBrowser() && window.localStorage.getItem("bearerlog")
    ? JSON.parse(window.localStorage.getItem("bearerlog"))
    : {}

const setUser = user =>
  window.localStorage.setItem("bearerlog", JSON.stringify(user))

export const storeUser = (data) => {
  
    setUser({
      token: data.data.token,
      uid: data.data.userId,
    })
  
}

export const isLoggedIn = () => {
  const user = getUser()

  return !!user.uid
}

export const logout = () => {
  setUser({})
  navigate("/", {
    replace: true,
  })
}
